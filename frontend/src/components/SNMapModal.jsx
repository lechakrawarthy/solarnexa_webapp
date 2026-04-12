import { useState, useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────────
   Full-screen Bengaluru deployment map modal
   Opens when the map cell (team cell 09) is clicked.
───────────────────────────────────────────────────────── */

const SITES = [
  { id: 1, name: 'Koramangala SolarTree',   area: 'Koramangala',  x: 52, y: 57, status: 'live',    kw: 5,   kwh: 28.4, type: 'Solar Tree' },
  { id: 2, name: 'Indiranagar EV Hub',       area: 'Indiranagar',  x: 67, y: 41, status: 'live',    kw: 8,   kwh: 41.2, type: 'Solar EV Station' },
  { id: 3, name: 'Jayanagar Solar Point',    area: 'Jayanagar',    x: 36, y: 67, status: 'planned', kw: 5,   kwh: 0,    type: 'Solar Tree' },
  { id: 4, name: 'Whitefield Tech Park',     area: 'Whitefield',   x: 78, y: 60, status: 'planned', kw: 10,  kwh: 0,    type: 'Solar EV Station' },
  { id: 5, name: 'Hebbal Flyover Station',   area: 'Hebbal',       x: 50, y: 34, status: 'planned', kw: 5,   kwh: 0,    type: 'Solar Tree' },
  { id: 6, name: 'MG Road Plaza',            area: 'MG Road',      x: 54, y: 50, status: 'planned', kw: 8,   kwh: 0,    type: 'Solar EV Station' },
  { id: 7, name: 'Electronic City Campus',   area: 'E-City',       x: 58, y: 78, status: 'planned', kw: 15,  kwh: 0,    type: 'Solar Tree' },
]

const GRID_LINES = [15,30,45,60,75,90]

export default function SNMapModal({ onClose }) {
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered]   = useState(null)
  const [tick, setTick]         = useState(0)

  // animate live kWh ticking
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2800)
    return () => clearInterval(id)
  }, [])

  // close on Escape
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const liveKwh = s => (s.kwh + tick * (s.kw * 0.0008)).toFixed(1)

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(28,24,20,0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        animation: 'sn-fadein .3s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 960, height: '80vh',
          background: '#F8F5EE',
          borderRadius: 24,
          display: 'grid', gridTemplateColumns: '1fr 300px',
          overflow: 'hidden',
          boxShadow: '0 48px 120px rgba(28,24,20,0.28)',
        }}
      >
        {/* ── Map area ─────────────────────────────── */}
        <div style={{ position: 'relative', background: '#F2EDE3', overflow: 'hidden' }}>
          {/* Grid lines */}
          {GRID_LINES.map(v => (
            <div key={`h${v}`} style={{ position: 'absolute', top: `${v}%`, left: 0, right: 0, height: 1, background: 'rgba(28,24,20,0.05)' }} />
          ))}
          {GRID_LINES.map(v => (
            <div key={`v${v}`} style={{ position: 'absolute', left: `${v}%`, top: 0, bottom: 0, width: 1, background: 'rgba(28,24,20,0.05)' }} />
          ))}

          {/* City label */}
          <div style={{
            position: 'absolute', top: 20, left: 24,
            fontFamily: "'Fraunces', Georgia, serif", fontSize: 11, fontWeight: 600,
            color: 'rgba(28,24,20,0.3)', letterSpacing: '.14em', textTransform: 'uppercase',
          }}>Bengaluru</div>

          {/* Compass */}
          <div style={{
            position: 'absolute', bottom: 20, right: 20,
            fontFamily: "'Inter Tight', sans-serif", fontSize: 10, color: 'rgba(28,24,20,0.25)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <span style={{ fontWeight: 600, letterSpacing: '.1em' }}>N</span>
            <div style={{ width: 1, height: 16, background: 'rgba(28,24,20,0.2)' }} />
          </div>

          {/* Scale bar */}
          <div style={{ position: 'absolute', bottom: 20, left: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 40, height: 2, background: 'rgba(28,24,20,0.2)', borderRadius: 1 }} />
            <span style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 9, color: 'rgba(28,24,20,0.3)', letterSpacing: '.08em' }}>5 km</span>
          </div>

          {/* Site pins */}
          {SITES.map(site => {
            const isLive    = site.status === 'live'
            const isSel     = selected?.id === site.id
            const isHov     = hovered === site.id
            return (
              <div key={site.id}
                style={{
                  position: 'absolute',
                  left: `${site.x}%`, top: `${site.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: isSel ? 10 : 5,
                }}
                onClick={() => setSelected(isSel ? null : site)}
                onMouseEnter={() => setHovered(site.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Ripple for live sites */}
                {isLive && (
                  <>
                    <div style={{
                      position: 'absolute', inset: -12, borderRadius: '50%',
                      border: '1.5px solid #D93B2B', opacity: 0.3,
                      animation: 'pin-ripple 2.5s ease-out infinite',
                    }} />
                    <div style={{
                      position: 'absolute', inset: -6, borderRadius: '50%',
                      border: '1px solid #D93B2B', opacity: 0.2,
                      animation: 'pin-ripple 2.5s ease-out .8s infinite',
                    }} />
                  </>
                )}
                {/* Pin dot */}
                <div style={{
                  width: isSel || isHov ? 16 : isLive ? 12 : 9,
                  height: isSel || isHov ? 16 : isLive ? 12 : 9,
                  borderRadius: '50%',
                  background: isLive ? '#D93B2B' : 'rgba(28,24,20,0.25)',
                  border: `2px solid ${isLive ? '#D93B2B' : 'rgba(28,24,20,0.15)'}`,
                  boxShadow: isLive ? '0 0 0 3px rgba(217,59,43,0.2)' : 'none',
                  transition: 'all .2s',
                  position: 'relative', zIndex: 2,
                }} />
                {/* Hover label */}
                {isHov && !isSel && (
                  <div style={{
                    position: 'absolute', bottom: '100%', left: '50%',
                    transform: 'translateX(-50%)',
                    marginBottom: 8,
                    background: '#1C1814', color: '#F8F5EE',
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 11, fontWeight: 500, letterSpacing: '.04em',
                    padding: '5px 10px', borderRadius: 6, whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                  }}>
                    {site.name}
                  </div>
                )}
              </div>
            )
          })}

          {/* Connection lines between live sites */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <defs>
              <linearGradient id="wire-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D93B2B" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#D93B2B" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            {SITES.filter(s => s.status === 'live').map((s, i, arr) => {
              if (i === 0) return null
              const prev = arr[i - 1]
              return (
                <line key={s.id}
                  x1={`${prev.x}%`} y1={`${prev.y}%`}
                  x2={`${s.x}%`} y2={`${s.y}%`}
                  stroke="url(#wire-grad)" strokeWidth="1.2" strokeDasharray="4 6"
                />
              )
            })}
          </svg>
        </div>

        {/* ── Side panel ───────────────────────────── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          borderLeft: '1px solid rgba(28,24,20,0.08)',
          background: '#F8F5EE', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid rgba(28,24,20,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 10, fontWeight: 600, color: '#D93B2B', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 6 }}>Fleet Map</div>
                <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, fontWeight: 600, color: '#1C1814', letterSpacing: '-.01em', lineHeight: 1.15 }}>Bengaluru<br/>Deployments</div>
              </div>
              <button onClick={onClose} style={{
                background: 'none', border: '1px solid rgba(28,24,20,0.1)',
                borderRadius: 8, width: 32, height: 32, cursor: 'pointer',
                color: 'rgba(28,24,20,0.4)', fontSize: 16, lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>✕</button>
            </div>
            {/* Summary pills */}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {[
                { v: SITES.filter(s => s.status === 'live').length,    l: 'Live',    c: '#22c55e' },
                { v: SITES.filter(s => s.status === 'planned').length, l: 'Planned', c: '#d97706' },
                { v: SITES.reduce((s, x) => s + x.kw, 0) + ' kW',     l: 'Capacity', c: '#D93B2B' },
              ].map(({ v, l, c }) => (
                <div key={l} style={{
                  flex: 1, background: 'rgba(28,24,20,0.04)', borderRadius: 10,
                  padding: '8px 10px', textAlign: 'center',
                }}>
                  <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, fontWeight: 700, color: c, letterSpacing: '-.02em' }}>{v}</div>
                  <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 9, color: 'rgba(28,24,20,0.45)', textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Site list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {SITES.map(site => {
              const isLive = site.status === 'live'
              const isSel  = selected?.id === site.id
              return (
                <div key={site.id}
                  onClick={() => setSelected(isSel ? null : site)}
                  style={{
                    padding: '12px 24px', cursor: 'pointer',
                    background: isSel ? 'rgba(217,59,43,0.05)' : 'transparent',
                    borderLeft: `3px solid ${isSel ? '#D93B2B' : 'transparent'}`,
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'rgba(28,24,20,0.03)' }}
                  onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 13, fontWeight: 600, color: '#1C1814', marginBottom: 3 }}>{site.name}</div>
                      <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 11, color: 'rgba(28,24,20,0.4)' }}>{site.type} · {site.kw} kW</div>
                    </div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontFamily: "'Inter Tight', sans-serif", fontSize: 10, fontWeight: 500,
                      color: isLive ? '#16a34a' : '#d97706',
                      background: isLive ? 'rgba(22,163,74,0.08)' : 'rgba(217,119,6,0.08)',
                      borderRadius: 20, padding: '3px 8px', letterSpacing: '.04em',
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: isLive ? '#22c55e' : '#f59e0b' }} />
                      {isLive ? 'Live' : 'Planned'}
                    </span>
                  </div>
                  {/* Live energy reading */}
                  {isLive && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
                      <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 16, fontWeight: 700, color: '#D93B2B', letterSpacing: '-.02em' }}>
                        {liveKwh(site)} kWh
                      </div>
                      <div style={{ fontFamily: "'Inter Tight', sans-serif", fontSize: 10, color: 'rgba(28,24,20,0.4)', alignSelf: 'flex-end', marginBottom: 2 }}>today</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Footer note */}
          <div style={{
            padding: '14px 24px',
            borderTop: '1px solid rgba(28,24,20,0.06)',
            fontFamily: "'Inter Tight', sans-serif", fontSize: 10,
            color: 'rgba(28,24,20,0.3)', letterSpacing: '.04em',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
            Live data updates every few seconds
          </div>
        </div>
      </div>
    </div>
  )
}
