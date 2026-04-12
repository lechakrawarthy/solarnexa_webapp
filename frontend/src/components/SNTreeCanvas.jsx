import { useEffect, useRef } from 'react'

export default function SNTreeCanvas() {
  const cvRef = useRef(null)

  useEffect(() => {
    const cv = cvRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const W = cv.width, H = cv.height
    const CX = W / 2, BASE = H - 50

    const PLASMA = '#D93B2B'
    const PANEL  = '#2A2520'
    const PANELB = 'rgba(217,59,43,0.35)'
    const WIRE   = 'rgba(217,59,43,0.2)'

    const panels = [
      { cx: CX,      cy: BASE - 180, w: 60, h: 36, a: 0   },
      { cx: CX - 88,  cy: BASE - 150, w: 52, h: 32, a: -8  },
      { cx: CX + 88,  cy: BASE - 150, w: 52, h: 32, a:  8  },
      { cx: CX - 148, cy: BASE - 118, w: 44, h: 26, a: -16 },
      { cx: CX + 148, cy: BASE - 118, w: 44, h: 26, a:  16 },
      { cx: CX - 64,  cy: BASE - 130, w: 40, h: 24, a: -5  },
      { cx: CX + 64,  cy: BASE - 130, w: 40, h: 24, a:  5  },
    ]
    const branchDefs = [
      [CX, BASE,       CX,       BASE - 160, 10],
      [CX, BASE - 120, CX - 88,  BASE - 138, 7 ],
      [CX, BASE - 120, CX + 88,  BASE - 138, 7 ],
      [CX - 88,  BASE - 138, CX - 148, BASE - 108, 5],
      [CX + 88,  BASE - 138, CX + 148, BASE - 108, 5],
      [CX, BASE - 100, CX - 64,  BASE - 120, 4 ],
      [CX, BASE - 100, CX + 64,  BASE - 120, 4 ],
    ]
    const EV = { x: CX - 36, y: BASE + 14, w: 72, h: 26 }
    const SUN = { x: W - 80, y: 68, r: 28 }

    let t = 0, branchProgress = 0, panelOpacity = 0, rafId
    // Energy particles flow from panels down to EV
    let energyPts = []
    for (let i = 0; i < 5; i++) {
      energyPts.push({ progress: i / 5, delay: 0, lane: (i % 3) - 1 })
    }
    // EV charge level 0-1
    let evCharge = 0

    function roundRect(c, x, y, w, h, r) {
      c.moveTo(x + r, y)
      c.lineTo(x + w - r, y); c.arcTo(x + w, y, x + w, y + r, r)
      c.lineTo(x + w, y + h - r); c.arcTo(x + w, y + h, x + w - r, y + h, r)
      c.lineTo(x + r, y + h); c.arcTo(x, y + h, x, y + h - r, r)
      c.lineTo(x, y + r); c.arcTo(x, y, x + r, y, r)
      c.closePath()
    }
    function lerp(a, b, t) { return a + (b - a) * t }
    function easeOut(t) { return 1 - Math.pow(1 - t, 3) }

    function drawPanel(p, opacity) {
      ctx.save()
      ctx.translate(p.cx, p.cy)
      ctx.rotate(p.a * Math.PI / 180)
      ctx.globalAlpha = opacity

      // panel glow when fully charged
      if (panelOpacity > 0.85) {
        const glow = (panelOpacity - 0.85) / 0.15
        const pulseGlow = glow * (0.6 + Math.sin(t * 0.05 + p.a) * 0.3)
        ctx.shadowColor = PLASMA
        ctx.shadowBlur = 6 * pulseGlow
      }

      ctx.fillStyle = PANEL
      ctx.beginPath(); roundRect(ctx, -p.w / 2, -p.h / 2, p.w, p.h, 5); ctx.fill()
      ctx.shadowBlur = 0
      ctx.strokeStyle = PANELB; ctx.lineWidth = 0.8; ctx.stroke()
      ctx.strokeStyle = 'rgba(217,59,43,0.25)'; ctx.lineWidth = 0.4
      ctx.beginPath(); ctx.moveTo(0, -p.h / 2); ctx.lineTo(0, p.h / 2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(-p.w / 2, 0); ctx.lineTo(p.w / 2, 0); ctx.stroke()
      // light shimmer sweep
      const shimmerX = ((t * 0.8) % (p.w * 2)) - p.w
      const sg = ctx.createLinearGradient(shimmerX - 8, 0, shimmerX + 8, 0)
      sg.addColorStop(0, 'rgba(255,200,80,0)'); sg.addColorStop(0.5, 'rgba(255,200,80,0.06)'); sg.addColorStop(1, 'rgba(255,200,80,0)')
      ctx.fillStyle = sg
      ctx.beginPath(); roundRect(ctx, -p.w / 2, -p.h / 2, p.w, p.h, 5); ctx.fill()
      ctx.restore()
    }

    function draw() {
      ctx.clearRect(0, 0, W, H)
      t++
      if (branchProgress < 1) branchProgress += 0.016
      if (branchProgress > 0.4 && panelOpacity < 1) panelOpacity += 0.022
      if (panelOpacity > 0.7 && evCharge < 1) evCharge += 0.003

      // ── Sun ────────────────────────────────────────
      const sunPulse = 1 + Math.sin(t * 0.04) * 0.04
      ctx.save()
      ctx.globalAlpha = 0.07 + Math.sin(t * 0.03) * 0.02
      ctx.beginPath(); ctx.arc(SUN.x, SUN.y, SUN.r * 2.4, 0, Math.PI * 2)
      ctx.fillStyle = PLASMA; ctx.fill()
      ctx.globalAlpha = 0.9 * sunPulse
      ctx.beginPath(); ctx.arc(SUN.x, SUN.y, SUN.r, 0, Math.PI * 2)
      ctx.fillStyle = '#FF9000'; ctx.fill()
      ctx.globalAlpha = 0.3
      ctx.beginPath(); ctx.arc(SUN.x - 6, SUN.y - 6, SUN.r * 0.45, 0, Math.PI * 2)
      ctx.fillStyle = '#FFD080'; ctx.fill()
      ctx.globalAlpha = 0.35
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + t * 0.008
        ctx.strokeStyle = '#FF9000'; ctx.lineWidth = 1.2; ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(SUN.x + Math.cos(a) * (SUN.r + 8), SUN.y + Math.sin(a) * (SUN.r + 8))
        ctx.lineTo(SUN.x + Math.cos(a) * (SUN.r + 18), SUN.y + Math.sin(a) * (SUN.r + 18))
        ctx.stroke()
      }
      ctx.restore()

      // ── Branches ───────────────────────────────────
      const bp = Math.min(branchProgress, 1)
      branchDefs.forEach((b, i) => {
        const delay  = i * 0.12
        const localT = Math.max(0, Math.min(1, (bp - delay) / (1 - delay * 0.8)))
        if (localT <= 0) return
        const tx = lerp(b[0], b[2], localT)
        const ty = lerp(b[1], b[3], localT)
        ctx.save()
        ctx.globalAlpha = localT
        ctx.strokeStyle = '#2E2820'; ctx.lineWidth = b[4]; ctx.lineCap = 'round'
        ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(tx, ty); ctx.stroke()
        ctx.strokeStyle = 'rgba(217,59,43,0.06)'; ctx.lineWidth = b[4] * 0.3
        ctx.beginPath(); ctx.moveTo(b[0] + b[4] * 0.15, b[1]); ctx.lineTo(tx + b[4] * 0.15, ty); ctx.stroke()
        ctx.restore()
      })

      // ── Wire dashes ────────────────────────────────
      if (panelOpacity > 0.1) {
        panels.forEach(p => {
          ctx.save(); ctx.globalAlpha = panelOpacity * 0.35
          ctx.strokeStyle = WIRE; ctx.lineWidth = 0.7; ctx.setLineDash([3, 4])
          ctx.beginPath(); ctx.moveTo(CX, BASE - 165); ctx.lineTo(p.cx, p.cy); ctx.stroke()
          ctx.setLineDash([]); ctx.restore()
        })
      }

      panels.forEach(p => drawPanel(p, panelOpacity))

      // ── Ground shadow ──────────────────────────────
      ctx.save()
      ctx.globalAlpha = panelOpacity * 0.45
      const grd = ctx.createRadialGradient(CX, BASE + 20, 0, CX, BASE + 20, 110)
      grd.addColorStop(0, 'rgba(28,24,20,0.12)'); grd.addColorStop(1, 'transparent')
      ctx.fillStyle = grd; ctx.beginPath(); ctx.ellipse(CX, BASE + 20, 110, 11, 0, 0, Math.PI * 2); ctx.fill()
      ctx.restore()

      // ── EV station ─────────────────────────────────
      if (panelOpacity > 0.4) {
        const op = (panelOpacity - 0.4) / 0.6
        ctx.save(); ctx.globalAlpha = op

        // Station body
        ctx.fillStyle = '#EBE5D8'; ctx.strokeStyle = 'rgba(28,24,20,0.12)'; ctx.lineWidth = 1
        ctx.beginPath(); roundRect(ctx, EV.x, EV.y, EV.w, EV.h, 8); ctx.fill(); ctx.stroke()

        // Charge bar background
        const barX = EV.x + 10, barY = EV.y + 9, barW = EV.w - 20, barH = 8
        ctx.fillStyle = 'rgba(28,24,20,0.08)'; ctx.beginPath(); roundRect(ctx, barX, barY, barW, barH, 3); ctx.fill()
        // Charge bar fill — animated
        const fillW = barW * evCharge
        if (fillW > 0) {
          const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0)
          barGrad.addColorStop(0, '#D93B2B')
          barGrad.addColorStop(1, '#FF9000')
          ctx.fillStyle = barGrad
          ctx.beginPath(); roundRect(ctx, barX, barY, fillW, barH, 3); ctx.fill()
        }

        // Port dots
        ;[EV.x + 14, EV.x + EV.w - 14].forEach(px => {
          ctx.beginPath(); ctx.arc(px, EV.y + EV.h - 8, 3.5, 0, Math.PI * 2)
          ctx.fillStyle = evCharge > 0.1 ? 'rgba(217,59,43,0.15)' : 'rgba(28,24,20,0.06)'
          ctx.strokeStyle = evCharge > 0.1 ? 'rgba(217,59,43,0.5)' : 'rgba(28,24,20,0.15)'
          ctx.lineWidth = 0.7; ctx.fill(); ctx.stroke()
        })

        ctx.restore()

        // Charge % label
        if (evCharge > 0.05) {
          ctx.save(); ctx.globalAlpha = op * Math.min(1, evCharge * 4)
          ctx.font = '600 9px Inter Tight, sans-serif'
          ctx.fillStyle = 'rgba(217,59,43,0.7)'; ctx.textAlign = 'center'
          ctx.fillText(`${Math.round(evCharge * 100)}%`, CX, EV.y + EV.h + 12)
          ctx.restore()
        }
      }

      // ── Energy particles (panels → trunk → EV) ────
      if (panelOpacity > 0.6) {
        energyPts.forEach((p, i) => {
          p.progress += 0.007
          if (p.progress >= 1) { p.progress = 0; p.lane = Math.floor(Math.random() * 3) - 1 }
          // path: panel (top) → trunk base → EV
          const py = (BASE - 170) + p.progress * (BASE + 26 - (BASE - 170))
          const pAlpha = Math.sin(p.progress * Math.PI) * Math.min(1, (panelOpacity - 0.6) / 0.4) * 0.85
          ctx.save(); ctx.globalAlpha = pAlpha
          // colour shifts orange → red as it travels down
          const r = Math.round(255 * (1 - p.progress) + 217 * p.progress)
          const g = Math.round(144 * (1 - p.progress) + 59 * p.progress)
          ctx.beginPath(); ctx.arc(CX + p.lane * 2.5, py, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgb(${r},${g},43)`; ctx.fill()
          ctx.restore()
        })
      }

      // ── IoT data pulses from panels ────────────────
      if (panelOpacity > 0.7) {
        const pulseAlpha = (panelOpacity - 0.7) / 0.3
        const pulseT = (t % 120) / 120
        panels.slice(0, 3).forEach((p, i) => {
          const delay  = i * 0.33
          const localPT = (pulseT + delay) % 1
          if (localPT < 0.5) {
            const r = localPT * 2 * 24
            const a = (0.5 - localPT) * 2 * pulseAlpha * 0.22
            ctx.save(); ctx.globalAlpha = a
            ctx.strokeStyle = PLASMA; ctx.lineWidth = 0.7
            ctx.beginPath(); ctx.arc(p.cx, p.cy, r, 0, Math.PI * 2); ctx.stroke()
            ctx.restore()
          }
        })
      }

      // ── Final state: glowing ring around tree ──────
      if (panelOpacity > 0.95) {
        const gOp = (panelOpacity - 0.95) / 0.05 * 0.12
        const ringR = 190 + Math.sin(t * 0.02) * 4
        ctx.save(); ctx.globalAlpha = gOp
        ctx.strokeStyle = PLASMA; ctx.lineWidth = 1
        ctx.beginPath(); ctx.arc(CX, BASE - 80, ringR, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke()
        ctx.restore()
      }

      rafId = requestAnimationFrame(draw)
    }
    draw()

    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <canvas
      ref={cvRef}
      width={480}
      height={520}
      style={{ maxWidth: '100%', opacity: 0, animation: 'sn-fadein 1s 0.7s ease forwards' }}
    />
  )
}
