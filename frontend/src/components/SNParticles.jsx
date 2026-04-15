import { useEffect, useRef } from 'react'

export default function SNParticles() {
  const cvRef = useRef(null)

  useEffect(() => {
    // Don't run on touch-only devices — no pointer to follow, just burns battery
    if (window.matchMedia('(hover: none)').matches) return
    // Respect user's motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cv  = cvRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    let W, H, pts = [], rafId

    const resize = () => {
      W = cv.width  = window.innerWidth
      H = cv.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const Pt = () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 0.9 + 0.2,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      a:  Math.random() * 0.3 + 0.05,
    })
    for (let i = 0; i < 45; i++) pts.push(Pt())

    const draw = () => {
      // Pause when tab is not visible — big performance win
      if (document.hidden) { rafId = requestAnimationFrame(draw); return }

      ctx.clearRect(0, 0, W, H)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(217,59,43,${p.a})`; ctx.fill()
      })
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(217,59,43,${0.04 * (1 - d / 100)})`
            ctx.lineWidth = 0.4; ctx.stroke()
          }
        }
      rafId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <canvas
      ref={cvRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.35 }}
      aria-hidden="true"
    />
  )
}
