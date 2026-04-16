import { useEffect, useRef } from 'react'

export default function SNCursor() {
  const cursorRef = useRef(null)
  const dotRef    = useRef(null)
  const ringRef   = useRef(null)
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 })
  const rafRef = useRef(null)

  useEffect(() => {
    // Disable on touch-only / no-pointer devices — saves paint cycles, avoids ghost cursor
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return

    const cursor = cursorRef.current
    const dot    = dotRef.current
    const ring   = ringRef.current
    if (!cursor || !dot || !ring) return

    const onMove = e => {
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
      dot.style.left = e.clientX + 'px'
      dot.style.top  = e.clientY + 'px'
    }
    document.addEventListener('mousemove', onMove, { passive: true })

    const animRing = () => {
      const { mx, my } = pos.current
      pos.current.rx += (mx - pos.current.rx) * 0.1
      pos.current.ry += (my - pos.current.ry) * 0.1
      ring.style.left = pos.current.rx + 'px'
      ring.style.top  = pos.current.ry + 'px'
      rafRef.current = requestAnimationFrame(animRing)
    }
    rafRef.current = requestAnimationFrame(animRing)

    const hoverSels = 'a,button,.sn-metric,.sn-tag,.sn-cc,.sn-fcard,.sn-tcard,.sn-road__phase,.sn-process__step,.sn-usecase'
    const textSels  = 'p,h1,h2,h3,.sn-fcard__body,.sn-process__desc'

    const addHover = () => cursor.classList.add('sn-cursor--hover')
    const rmHover  = () => cursor.classList.remove('sn-cursor--hover')
    const addText  = () => cursor.classList.add('sn-cursor--text')
    const rmText   = () => cursor.classList.remove('sn-cursor--text')

    document.querySelectorAll(hoverSels).forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', rmHover)
    })
    document.querySelectorAll(textSels).forEach(el => {
      el.addEventListener('mouseenter', addText)
      el.addEventListener('mouseleave', rmText)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="sn-cursor" ref={cursorRef} aria-hidden="true">
      <div className="sn-cursor__dot"  ref={dotRef} />
      <div className="sn-cursor__ring" ref={ringRef} />
    </div>
  )
}
