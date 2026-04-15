import { useEffect, useRef } from 'react'

/*
  SNTreeCanvas — production-quality solar tree animation
  ───────────────────────────────────────────────────────
  Phase 1 (t 0→180):  trunk + branches grow in
  Phase 2 (t 120→300): panels fade in one by one
  Phase 3 (steady):   sun pulses, particles flow panel→trunk→EV,
                      EV charge bar cycles (fills, pauses, drains, refills),
                      IoT pulses emanate from each panel,
                      panel shimmer sweeps continuously
*/

export default function SNTreeCanvas() {
  const cvRef = useRef(null)

  useEffect(() => {
    const cv  = cvRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const W   = cv.width        // 480
    const H   = cv.height       // 520
    const CX  = W / 2           // 240
    const GND = H - 60          // ground level

    // ── Design tokens ──────────────────────────────────
    const C = {
      plasma:   '#D93B2B',
      orange:   '#FF9000',
      amber:    '#FFD080',
      trunk:    '#2E2820',
      panel:    '#2A2520',
      panelBdr: 'rgba(217,59,43,0.35)',
      wire:     'rgba(217,59,43,0.18)',
      ground:   'rgba(28,24,20,0.1)',
    }

    // ── Layout ─────────────────────────────────────────
    const TRUNK_TOP    = GND - 185
    const TRUNK_BOTTOM = GND - 4

    // Branch: [x0, y0, x1, y1, thickness]
    const BRANCHES = [
      // main trunk (drawn separately but keep for reference)
      [CX, GND - 120, CX - 90,  GND - 145, 6.5],   // L1
      [CX, GND - 120, CX + 90,  GND - 145, 6.5],   // R1
      [CX - 90, GND - 145, CX - 152, GND - 115, 4.5], // L2
      [CX + 90, GND - 145, CX + 152, GND - 115, 4.5], // R2
      [CX, GND - 100, CX - 66,  GND - 126, 3.5],   // L twig
      [CX, GND - 100, CX + 66,  GND - 126, 3.5],   // R twig
    ]

    // Panel: cx, cy, w, h, angle(deg), ioPhase
    const PANELS = [
      { cx: CX,        cy: GND - 188, w: 64, h: 36, a:  0,   io: 0.0  },
      { cx: CX - 90,   cy: GND - 155, w: 54, h: 30, a: -8,   io: 0.22 },
      { cx: CX + 90,   cy: GND - 155, w: 54, h: 30, a:  8,   io: 0.44 },
      { cx: CX - 152,  cy: GND - 118, w: 44, h: 24, a: -15,  io: 0.11 },
      { cx: CX + 152,  cy: GND - 118, w: 44, h: 24, a:  15,  io: 0.33 },
      { cx: CX - 66,   cy: GND - 132, w: 40, h: 22, a: -5,   io: 0.55 },
      { cx: CX + 66,   cy: GND - 132, w: 40, h: 22, a:  5,   io: 0.77 },
    ]

    // EV station — attached to trunk, centred below ground
    const EV = {
      x: CX - 30, y: GND + 8,
      w: 60,       h: 28,
      barX: () => EV.x + 8,
      barY: () => EV.y + 7,
      barW: () => EV.w - 16,
      barH: 8,
    }

    // Sun — top-right
    const SUN = { x: W - 72, y: 60, r: 26 }

    // ── State ──────────────────────────────────────────
    let raf
    let t = 0                // frame counter
    const INTRO = 220        // frames until steady state

    // Per-panel opacity (each fades in with a delay)
    const panelAlpha = PANELS.map(() => 0)

    // Energy particles — flow from panel surface down trunk to EV
    // Each has: progress 0→1, speed, lane (-1,0,1), sourcePanel index
    const PARTICLE_COUNT = 8
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      progress: i / PARTICLE_COUNT,
      speed:    0.0045 + Math.random() * 0.003,
      lane:     (i % 3) - 1,
      src:      i % PANELS.length,
    }))

    // EV charge cycle — fills then drains in a loop
    // States: 'charging' | 'full' | 'discharging'
    let evCharge    = 0
    let evState     = 'charging'
    let evPause     = 0          // frames to wait when full

    // ── Helpers ────────────────────────────────────────
    function lerp(a, b, t) { return a + (b - a) * t }

    function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

    function rrPath(x, y, w, h, r) {
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r)
      ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
      ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r)
      ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r)
      ctx.closePath()
    }

    // ── Draw functions ────────────────────────────────

    function drawSun() {
      const pulse = 1 + Math.sin(t * 0.035) * 0.045
      // outer haze
      ctx.save()
      const haze = ctx.createRadialGradient(SUN.x, SUN.y, SUN.r * 0.5, SUN.x, SUN.y, SUN.r * 2.8)
      haze.addColorStop(0, 'rgba(255,144,0,0.1)')
      haze.addColorStop(1, 'rgba(217,59,43,0)')
      ctx.fillStyle = haze
      ctx.beginPath(); ctx.arc(SUN.x, SUN.y, SUN.r * 2.8, 0, Math.PI * 2); ctx.fill()
      // core
      ctx.globalAlpha = 0.92 * pulse
      ctx.fillStyle = C.orange
      ctx.beginPath(); ctx.arc(SUN.x, SUN.y, SUN.r, 0, Math.PI * 2); ctx.fill()
      // highlight
      ctx.globalAlpha = 0.28
      ctx.fillStyle = C.amber
      ctx.beginPath(); ctx.arc(SUN.x - 7, SUN.y - 7, SUN.r * 0.4, 0, Math.PI * 2); ctx.fill()
      // rays — 8, slowly rotating
      ctx.globalAlpha = 0.32
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + t * 0.007
        const r0 = SUN.r + 7, r1 = SUN.r + 18
        ctx.strokeStyle = C.orange; ctx.lineWidth = 1.4; ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(SUN.x + Math.cos(angle) * r0, SUN.y + Math.sin(angle) * r0)
        ctx.lineTo(SUN.x + Math.cos(angle) * r1, SUN.y + Math.sin(angle) * r1)
        ctx.stroke()
      }
      ctx.restore()
    }

    function drawSunBeams() {
      // Subtle crepuscular shafts from sun toward the canopy.
      // Drawn as very thin gradient triangles — opacity breathes with a slow sine.
      // Only visible once panels start fading in (feels earned).
      const maxAlpha = Math.max(...panelAlpha)
      if (maxAlpha < 0.05) return

      const breathe   = 0.7 + Math.sin(t * 0.018) * 0.3   // 0.4 → 1.0, slow pulse
      const baseOp    = maxAlpha * 0.38 * breathe           // was 0.055 — much more visible
      if (baseOp < 0.01) return

      const canopyX   = CX,       canopyY   = GND - 185
      const dx        = canopyX - SUN.x
      const dy        = canopyY - SUN.y
      const baseAngle = Math.atan2(dy, dx)
      const beamLength = Math.sqrt(dx * dx + dy * dy) * 1.5

      // 5 beams — each sweeps independently like a slow spotlight.
      // centre:  rest position of the beam (radians offset from baseAngle)
      // swing:   how far it sweeps left/right (radians)
      // speed:   sweep frequency (keep all different so they cross each other)
      // phase:   starting offset so they don't all move together
      const BEAMS = [
        { centre: -0.28, swing: 0.18, speed: 0.009, phase: 0.0,  width: 0.13, bright: 0.7  },
        { centre: -0.08, swing: 0.14, speed: 0.013, phase: 1.2,  width: 0.10, bright: 0.9  },
        { centre:  0.02, swing: 0.20, speed: 0.007, phase: 2.5,  width: 0.16, bright: 1.0  },
        { centre:  0.14, swing: 0.13, speed: 0.011, phase: 0.8,  width: 0.09, bright: 0.8  },
        { centre:  0.30, swing: 0.16, speed: 0.015, phase: 1.9,  width: 0.11, bright: 0.65 },
      ]

      ctx.save()
      BEAMS.forEach(b => {
        // each beam oscillates around its centre at its own speed + phase
        const sweep = Math.sin(t * b.speed + b.phase) * b.swing
        const angle = baseAngle + b.centre + sweep
        const farX     = SUN.x + Math.cos(angle) * beamLength
        const farY     = SUN.y + Math.sin(angle) * beamLength
        const perpA    = angle + Math.PI / 2
        const edgeDist = beamLength * b.width
        const lx = farX + Math.cos(perpA) * edgeDist
        const ly = farY + Math.sin(perpA) * edgeDist
        const rx = farX - Math.cos(perpA) * edgeDist
        const ry = farY - Math.sin(perpA) * edgeDist

        const op0 = (baseOp * b.bright).toFixed(3)
        const op1 = (baseOp * b.bright * 0.45).toFixed(3)

        const grad = ctx.createLinearGradient(SUN.x, SUN.y, farX, farY)
        grad.addColorStop(0.0,  `rgba(255,210,80,${op0})`)
        grad.addColorStop(0.4,  `rgba(255,175,50,${op1})`)
        grad.addColorStop(1.0,  'rgba(255,150,30,0)')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.moveTo(SUN.x, SUN.y)
        ctx.lineTo(lx, ly)
        ctx.lineTo(rx, ry)
        ctx.closePath()
        ctx.fill()
      })
      ctx.restore()
    }

    function drawTrunk(progress) {
      // Main trunk drawn as a tapered polygon
      const topY  = lerp(GND, TRUNK_TOP, progress)
      const taper = 5  // half-width at top; 8 at base
      const baseHalf = 8, topHalf = 3.5

      ctx.save()
      ctx.globalAlpha = Math.min(1, progress * 2)
      // trunk fill
      const tGrad = ctx.createLinearGradient(CX - baseHalf, GND, CX + topHalf, topY)
      tGrad.addColorStop(0, '#1C1814')
      tGrad.addColorStop(1, '#2E2820')
      ctx.fillStyle = tGrad
      ctx.beginPath()
      ctx.moveTo(CX - baseHalf, TRUNK_BOTTOM)
      ctx.lineTo(CX - topHalf,  topY)
      ctx.lineTo(CX + topHalf,  topY)
      ctx.lineTo(CX + baseHalf, TRUNK_BOTTOM)
      ctx.closePath(); ctx.fill()
      // subtle highlight streak
      ctx.globalAlpha = Math.min(1, progress * 2) * 0.12
      ctx.strokeStyle = C.plasma; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(CX - 1.5, TRUNK_BOTTOM); ctx.lineTo(CX - 1.5, topY); ctx.stroke()
      ctx.restore()
    }

    function drawBranches(progress) {
      BRANCHES.forEach((b, i) => {
        const delay  = 0.35 + i * 0.1
        const localP = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)))
        if (localP <= 0) return
        const tx = lerp(b[0], b[2], easeInOut(localP))
        const ty = lerp(b[1], b[3], easeInOut(localP))
        ctx.save()
        ctx.globalAlpha = localP * 0.95
        ctx.strokeStyle = C.trunk; ctx.lineWidth = b[4]; ctx.lineCap = 'round'
        ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(tx, ty); ctx.stroke()
        // thin highlight
        ctx.globalAlpha = localP * 0.04
        ctx.strokeStyle = C.plasma; ctx.lineWidth = b[4] * 0.35
        ctx.beginPath(); ctx.moveTo(b[0] + 1, b[1]); ctx.lineTo(tx + 1, ty); ctx.stroke()
        ctx.restore()
      })
    }

    function drawWires() {
      // dashed lines from trunk hub to each panel
      const hubY = GND - 172
      PANELS.forEach((p, i) => {
        const alpha = panelAlpha[i] * 0.3
        if (alpha < 0.01) return
        ctx.save(); ctx.globalAlpha = alpha
        ctx.strokeStyle = C.wire; ctx.lineWidth = 0.6; ctx.setLineDash([3, 5])
        ctx.beginPath(); ctx.moveTo(CX, hubY); ctx.lineTo(p.cx, p.cy); ctx.stroke()
        ctx.setLineDash([]); ctx.restore()
      })
    }

    function drawPanel(p, alpha) {
      if (alpha < 0.01) return
      ctx.save()
      ctx.translate(p.cx, p.cy)
      ctx.rotate(p.a * Math.PI / 180)
      ctx.globalAlpha = alpha

      // panel body
      ctx.fillStyle = C.panel
      ctx.beginPath(); rrPath(-p.w / 2, -p.h / 2, p.w, p.h, 4); ctx.fill()
      ctx.strokeStyle = C.panelBdr; ctx.lineWidth = 0.7; ctx.stroke()

      // cell grid lines
      ctx.strokeStyle = 'rgba(217,59,43,0.22)'; ctx.lineWidth = 0.35
      ctx.beginPath(); ctx.moveTo(0, -p.h / 2); ctx.lineTo(0, p.h / 2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(-p.w / 2, 0); ctx.lineTo(p.w / 2, 0); ctx.stroke()
      // 2x2 sub-cells on larger panels
      if (p.w >= 54) {
        ctx.beginPath(); ctx.moveTo(-p.w / 4, -p.h / 2); ctx.lineTo(-p.w / 4, p.h / 2); ctx.stroke()
        ctx.beginPath(); ctx.moveTo( p.w / 4, -p.h / 2); ctx.lineTo( p.w / 4, p.h / 2); ctx.stroke()
      }

      // sunlight shimmer sweep — continuous
      const shimX = ((t * 0.7 + p.a * 3) % (p.w * 2.5)) - p.w * 1.25
      const sg = ctx.createLinearGradient(shimX - 10, -p.h / 2, shimX + 10, p.h / 2)
      sg.addColorStop(0,   'rgba(255,210,80,0)')
      sg.addColorStop(0.5, 'rgba(255,210,80,0.07)')
      sg.addColorStop(1,   'rgba(255,210,80,0)')
      ctx.fillStyle = sg
      ctx.beginPath(); rrPath(-p.w / 2, -p.h / 2, p.w, p.h, 4); ctx.fill()

      ctx.restore()
    }

    function drawIoTPulses() {
      // Each panel emits an IoT pulse ring that fades out
      const cycle = 180  // frames per full pulse cycle
      PANELS.forEach((p, i) => {
        const alpha = panelAlpha[i]
        if (alpha < 0.5) return
        const phase = ((t / cycle) + p.io) % 1
        // only pulse during first half of cycle
        if (phase > 0.5) return
        const radius = phase * 2 * 32          // 0 → 32px
        const ringAlpha = (0.5 - phase) * 2 * alpha * 0.18
        ctx.save(); ctx.globalAlpha = ringAlpha
        ctx.strokeStyle = C.plasma; ctx.lineWidth = 0.8
        ctx.beginPath(); ctx.arc(p.cx, p.cy, radius, 0, Math.PI * 2); ctx.stroke()
        ctx.restore()
      })
    }

    function drawParticles() {
      // Particles visible only after panels are up
      const maxAlpha = Math.max(...panelAlpha)
      if (maxAlpha < 0.3) return

      particles.forEach(p => {
        // advance
        p.progress += p.speed
        if (p.progress >= 1) {
          p.progress = 0
          p.speed  = 0.0045 + Math.random() * 0.003
          p.lane   = (Math.floor(Math.random() * 3)) - 1
          p.src    = Math.floor(Math.random() * PANELS.length)
        }

        const panel = PANELS[p.src]
        // path: start near panel cx,cy → down to trunk hub → down trunk → into EV centre
        const startX = panel.cx, startY = panel.cy
        const midX   = CX,       midY   = GND - 172
        const endX   = CX,       endY   = EV.y + EV.h / 2

        let px, py
        if (p.progress < 0.35) {
          // panel to trunk hub
          const s = p.progress / 0.35
          px = lerp(startX, midX, easeInOut(s)) + p.lane * 1.5
          py = lerp(startY, midY, easeInOut(s))
        } else {
          // trunk hub to EV
          const s = (p.progress - 0.35) / 0.65
          px = CX + p.lane * 1.5
          py = lerp(midY, endY, easeInOut(s))
        }

        const fade  = Math.sin(p.progress * Math.PI)
        const gAlpha = fade * maxAlpha * 0.75

        ctx.save(); ctx.globalAlpha = gAlpha
        // colour: orange near panel, plasma near EV
        const blend = easeInOut(p.progress)
        const r  = Math.round(lerp(255, 217, blend))
        const g  = Math.round(lerp(144, 59,  blend))
        const sz = lerp(2.2, 1.4, blend)
        ctx.beginPath(); ctx.arc(px, py, sz, 0, Math.PI * 2)
        ctx.fillStyle = `rgb(${r},${g},43)`; ctx.fill()
        ctx.restore()
      })
    }

    function drawGroundAndEV() {
      const maxAlpha = Math.max(...panelAlpha)

      // Ground shadow ellipse
      ctx.save(); ctx.globalAlpha = maxAlpha * 0.4
      const gs = ctx.createRadialGradient(CX, GND + 6, 0, CX, GND + 6, 100)
      gs.addColorStop(0, 'rgba(28,24,20,0.14)'); gs.addColorStop(1, 'transparent')
      ctx.fillStyle = gs
      ctx.beginPath(); ctx.ellipse(CX, GND + 6, 100, 10, 0, 0, Math.PI * 2); ctx.fill()
      ctx.restore()

      if (maxAlpha < 0.3) return
      const evFade = Math.min(1, (maxAlpha - 0.3) / 0.4)

      ctx.save(); ctx.globalAlpha = evFade

      // ── EV station box ────────────────────────────────
      // Connection line from trunk bottom to station top
      ctx.strokeStyle = C.plasma; ctx.lineWidth = 1.5; ctx.lineCap = 'round'
      ctx.globalAlpha = evFade * 0.55
      ctx.beginPath()
      ctx.moveTo(CX, TRUNK_BOTTOM - 2)   // trunk base
      ctx.lineTo(CX, EV.y)               // station top-centre
      ctx.stroke()
      ctx.globalAlpha = evFade

      // Station body
      ctx.fillStyle = '#EAE4D7'
      ctx.strokeStyle = 'rgba(28,24,20,0.14)'; ctx.lineWidth = 1
      ctx.beginPath(); rrPath(EV.x, EV.y, EV.w, EV.h, 7); ctx.fill(); ctx.stroke()

      // Station top accent stripe
      ctx.fillStyle = 'rgba(28,24,20,0.06)'
      ctx.beginPath(); rrPath(EV.x, EV.y, EV.w, 7, 7); ctx.fill()

      // Charge bar track
      const bx = EV.barX(), by = EV.barY(), bw = EV.barW(), bh = EV.barH
      ctx.fillStyle = 'rgba(28,24,20,0.09)'; ctx.lineWidth = 0
      ctx.beginPath(); rrPath(bx, by, bw, bh, 3); ctx.fill()

      // Charge bar fill with gradient
      if (evCharge > 0) {
        const fw = Math.max(0, Math.min(bw, bw * evCharge))
        if (fw > 3) {
          const barGrad = ctx.createLinearGradient(bx, 0, bx + bw, 0)
          if (evState === 'discharging') {
            barGrad.addColorStop(0, '#FF9000')
            barGrad.addColorStop(1, '#D93B2B')
          } else {
            barGrad.addColorStop(0, '#D93B2B')
            barGrad.addColorStop(1, '#FF9000')
          }
          ctx.fillStyle = barGrad
          ctx.beginPath(); rrPath(bx, by, fw, bh, 3); ctx.fill()
        }
      }

      // Percentage label inside bar
      if (evCharge > 0.08) {
        ctx.font = '600 7.5px Inter Tight, sans-serif'
        ctx.fillStyle = evCharge > 0.35 ? 'rgba(255,255,255,0.9)' : 'rgba(217,59,43,0.85)'
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
        ctx.fillText(`${Math.round(evCharge * 100)}%`, bx + 4, by + bh / 2)
        ctx.textAlign = 'start'
      }

      // Two charging port circles at bottom of station
      const portY = EV.y + EV.h - 7
      ;[EV.x + 12, EV.x + EV.w - 12].forEach(px => {
        const portActive = evCharge > 0.05
        ctx.beginPath(); ctx.arc(px, portY, 4, 0, Math.PI * 2)
        ctx.fillStyle   = portActive ? 'rgba(217,59,43,0.12)' : 'rgba(28,24,20,0.05)'
        ctx.strokeStyle = portActive ? 'rgba(217,59,43,0.55)' : 'rgba(28,24,20,0.12)'
        ctx.lineWidth   = 0.8; ctx.fill(); ctx.stroke()
        // tiny bolt in port when active
        if (portActive) {
          ctx.fillStyle = 'rgba(217,59,43,0.7)'; ctx.font = '600 6px sans-serif'
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
          ctx.fillText('⚡', px, portY)
          ctx.textAlign = 'start'
        }
      })

      // "EV Charging" label below station
      ctx.font = '500 8px Inter Tight, sans-serif'
      ctx.fillStyle = 'rgba(28,24,20,0.3)'
      ctx.textAlign = 'center'; ctx.textBaseline = 'top'
      ctx.fillText('EV · Charging', CX, EV.y + EV.h + 5)
      ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic'

      ctx.restore()
    }

    function updateEVCharge() {
      // EV charge cycles: charges up → holds at 100% briefly → discharges → repeats
      const chargeRate    = 0.0028
      const dischargeRate = 0.0018
      const pauseFrames   = 80

      if (evState === 'charging') {
        evCharge += chargeRate
        if (evCharge >= 1) { evCharge = 1; evState = 'full'; evPause = pauseFrames }
      } else if (evState === 'full') {
        evPause--
        if (evPause <= 0) evState = 'discharging'
      } else if (evState === 'discharging') {
        evCharge -= dischargeRate
        if (evCharge <= 0.08) { evCharge = 0.08; evState = 'charging' }
      }
    }

    // ── Main loop ──────────────────────────────────────
    function draw() {
      // Skip heavy drawing when tab is not visible — saves CPU/GPU
      if (document.hidden) { raf = requestAnimationFrame(draw); return }

      ctx.clearRect(0, 0, W, H)
      t++

      // Phase progress: 0→1 over INTRO frames
      const phase = Math.min(1, t / INTRO)

      // Trunk grows in first half of intro
      const trunkP = Math.min(1, phase * 2)

      // Panels fade in sequentially after trunk is 40% done
      PANELS.forEach((_, i) => {
        const start = 0.3 + i * 0.08
        const local = Math.max(0, Math.min(1, (phase - start) / 0.2))
        panelAlpha[i] = easeInOut(local)
      })

      // EV charge only starts once panels are mostly up
      if (Math.min(...panelAlpha) > 0.5) {
        updateEVCharge()
      }

      // ── Draw order (back to front) ──────────────────
      drawSun()
      drawSunBeams()   // behind the tree, in front of the background
      drawWires()
      drawTrunk(trunkP)
      drawBranches(phase)
      PANELS.forEach((p, i) => drawPanel(p, panelAlpha[i]))
      drawIoTPulses()
      drawParticles()
      drawGroundAndEV()

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={cvRef}
      width={480}
      height={520}
      style={{ maxWidth: '100%', opacity: 0, animation: 'sn-fadein 1s 0.6s ease forwards' }}
      aria-label="SolarTree animation — solar tree charging station with EV and IoT monitoring"
      role="img"
    />
  )
}
