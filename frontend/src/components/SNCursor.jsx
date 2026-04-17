import { useEffect, useRef } from 'react'

export default function SNCursor() {
  const orbRef  = useRef(null)
  const pos     = useRef({ mx: 0, my: 0, cx: 0, cy: 0 })
  const rafRef  = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return

    const orb = orbRef.current
    if (!orb) return

    let started = false

    const onMove = e => {
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
      if (!started) {
        pos.current.cx = e.clientX
        pos.current.cy = e.clientY
        started = true
      }
    }
    document.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      pos.current.cx += (pos.current.mx - pos.current.cx) * 0.12
      pos.current.cy += (pos.current.my - pos.current.cy) * 0.12
      orb.style.transform = `translate(${pos.current.cx}px, ${pos.current.cy}px)`
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    // Track which background type the cursor is over
    // so we can swap visibility modes
    const darkSels  = '.sn-mission, .sn-cta, .sn-footer, .sn-darkroom, .sn-fcard--hero'
    const hoverSels = 'a, button, .sn-fcard, .sn-process__step, .sn-usecase, .sn-tcell, .sn-road__phase, .sn-contact__input, .sn-contact__submit'

    const setDark  = () => orb.classList.add('on-dark')
    const setLight = () => orb.classList.remove('on-dark')
    const addHover = () => orb.classList.add('is-hovered')
    const rmHover  = () => orb.classList.remove('is-hovered')

    // Dark Room — massively expand glow when cursor is in the section
    const darkroom = document.getElementById('darkroom')
    const setDarkroom    = () => orb.classList.add('in-darkroom')
    const clearDarkroom  = () => orb.classList.remove('in-darkroom')
    if (darkroom) {
      darkroom.addEventListener('mouseenter', setDarkroom)
      darkroom.addEventListener('mouseleave', clearDarkroom)
    }

    document.querySelectorAll(darkSels).forEach(el => {
      el.addEventListener('mouseenter', setDark)
      el.addEventListener('mouseleave', setLight)
    })
    document.querySelectorAll(hoverSels).forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', rmHover)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
      if (darkroom) {
        darkroom.removeEventListener('mouseenter', setDarkroom)
        darkroom.removeEventListener('mouseleave', clearDarkroom)
      }
    }
  }, [])

  return (
    <div
      ref={orbRef}
      className="sn-cursor-orb"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9998,
        willChange: 'transform',
      }}
    />
  )
}
