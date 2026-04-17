import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const MESSAGES = ['SOLARNEXA', 'SYSTEM INITIALISING', 'BENGALURU · PHASE I']

export default function SNPreloader({ onDone }) {
  const rootRef  = useRef(null)
  const lineRef  = useRef(null)
  const textRef  = useRef(null)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const root = rootRef.current
    const line = lineRef.current
    if (!root || !line) return

    let destroyed = false

    // 1. Draw the plasma line left → right
    gsap.fromTo(
      line,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: 'power2.inOut', transformOrigin: 'left center' }
    )

    // 2. Typewriter over the messages
    const typeMsg = (str) =>
      new Promise((res) => {
        if (destroyed) return res()
        let i = 0
        setMsg('')
        const tick = () => {
          if (destroyed) return res()
          i++
          setMsg(str.slice(0, i))
          if (i < str.length) setTimeout(tick, 22)
          else setTimeout(res, 200)
        }
        tick()
      })

    const run = async () => {
      for (const m of MESSAGES) {
        await typeMsg(m)
        if (destroyed) return
      }
      // 3. Fade out
      gsap.to(root, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          if (!destroyed) onDone?.()
        },
      })
    }

    run()

    // Hard fallback — never block the page more than 3s
    const fallback = setTimeout(() => {
      if (!destroyed) {
        destroyed = true
        gsap.to(root, { opacity: 0, duration: 0.3, onComplete: () => onDone?.() })
      }
    }, 3000)

    return () => {
      destroyed = true
      clearTimeout(fallback)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={rootRef} style={styles.root} aria-hidden="true">
      <div style={styles.lineWrap}>
        <div style={styles.lineTrack} />
        <div ref={lineRef} style={styles.lineFill} />
      </div>
      <div ref={textRef} style={styles.text}>{msg}</div>
    </div>
  )
}

const styles = {
  root: {
    position: 'fixed',
    inset: 0,
    zIndex: 10000,
    background: 'var(--paper)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    pointerEvents: 'all',
  },
  lineWrap: {
    position: 'relative',
    width: 'min(460px, 60vw)',
    height: 1,
  },
  lineTrack: {
    position: 'absolute',
    inset: 0,
    background: 'var(--ink-10)',
  },
  lineFill: {
    position: 'absolute',
    inset: 0,
    background: 'var(--plasma)',
    transformOrigin: 'left center',
  },
  text: {
    fontFamily: "'Fraunces', Georgia, serif",
    fontSize: '0.68rem',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: 'var(--ink-60)',
    minHeight: '1.2em',
    whiteSpace: 'pre',
  },
}
