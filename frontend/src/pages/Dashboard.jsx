import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

/* ── design tokens (inline so no Tailwind dependency) ── */
const T = {
  ink:     '#1C1814',
  ink60:   'rgba(28,24,20,0.72)',
  ink30:   'rgba(28,24,20,0.3)',
  ink10:   'rgba(28,24,20,0.08)',
  ink05:   'rgba(28,24,20,0.04)',
  paper:   '#F8F5EE',
  warm:    '#F2EDE3',
  deep:    '#EBE5D8',
  cream:   '#FAF8F3',
  plasma:  '#D93B2B',
  p15:     'rgba(217,59,43,0.15)',
  p06:     'rgba(217,59,43,0.06)',
  display: "'Fraunces', Georgia, serif",
  ui:      "'Inter Tight', system-ui, sans-serif",
}

const ALERT_STYLE = {
  critical:   { bg: '#fff5f5', border: '#fecaca', dot: '#ef4444', text: '#b91c1c' },
  warning:    { bg: '#fffbeb', border: '#fde68a', dot: '#f59e0b', text: '#92400e' },
  info:       { bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6', text: '#1d40af' },
}

function SLabel({ children }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11,
      letterSpacing: '.18em', textTransform: 'uppercase', color: T.plasma,
      fontWeight: 500, marginBottom: 12, fontFamily: T.ui,
    }}>
      <span style={{ width: 20, height: 1.5, background: T.plasma, display: 'inline-block' }} />
      {children}
    </div>
  )
}

function STitle({ children }) {
  return (
    <h2 style={{ fontFamily: T.display, fontSize: 'clamp(22px,2.5vw,34px)', fontWeight: 300,
      lineHeight: 1.04, letterSpacing: '-.025em', color: T.ink, marginBottom: 32,
    }}>
      {children}
    </h2>
  )
}

function StatCard({ icon, label, value, sub, loading, accent }) {
  return (
    <div style={{
      background: T.paper, border: `1px solid ${T.ink10}`, borderRadius: 20,
      padding: '28px 28px 24px', position: 'relative', overflow: 'hidden',
      transition: 'border-color .3s, transform .3s, box-shadow .3s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.ink30; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(28,24,20,0.06)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.ink10; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
    >
      {/* top accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent || T.plasma, opacity: 0.6 }} />
      <div style={{ fontSize: 28, marginBottom: 16 }}>{icon}</div>
      <div style={{ fontFamily: T.ui, fontSize: 12, color: T.ink60, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: T.display, fontSize: 'clamp(28px,3vw,40px)', fontWeight: 600, color: T.ink, letterSpacing: '-.025em', lineHeight: 1 }}>
        {loading ? <span style={{ color: T.ink10, animation: 'pulse 1.5s ease-in-out infinite' }}>—</span> : value}
      </div>
      {!loading && <div style={{ fontFamily: T.ui, fontSize: 12, color: T.ink60, marginTop: 8 }}>{sub}</div>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: T.ink, color: T.paper, borderRadius: 10, padding: '10px 16px', fontSize: 13, fontFamily: T.ui }}>
      <div style={{ fontFamily: T.display, fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>{p.name}: <strong>{p.value}</strong></div>
      ))}
    </div>
  )
}

const STATUS = {
  online:      { bg: 'rgba(22,163,74,0.08)', color: '#16a34a', dot: '#22c55e' },
  offline:     { bg: 'rgba(220,38,38,0.08)', color: '#dc2626', dot: '#ef4444' },
  maintenance: { bg: 'rgba(217,119,6,0.1)',  color: '#d97706', dot: '#f59e0b' },
}

function StatusPill({ status }) {
  const s = STATUS[status] || STATUS.offline
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
      background: s.bg, color: s.color, borderRadius: 40, padding: '3px 10px',
      fontSize: 11, fontWeight: 500, letterSpacing: '.04em', textTransform: 'uppercase',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot }} />
      {status}
    </span>
  )
}

export default function Dashboard() {
  const [installations, setInstallations] = useState([])
  const [weekly, setWeekly]               = useState([])
  const [alerts, setAlerts]               = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [tick, setTick]                   = useState(0)   // drives live number drift

  useEffect(() => {
    Promise.all([
      axios.get('/api/installations'),
      axios.get('/api/analytics/weekly'),
      axios.get('/api/alerts'),
    ])
      .then(([inst, wk, al]) => {
        setInstallations(inst.data.data ?? [])
        setWeekly(wk.data.data ?? [])
        setAlerts(al.data.data ?? [])
      })
      .catch(() => setError('Could not load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  // Simulate live data — subtle drift every 30s so the dashboard feels alive
  useEffect(() => {
    const id = setInterval(() => {
      setInstallations(prev => prev.map(inst => {
        if (inst.status !== 'online') return inst
        const delta = +(Math.random() * 0.6 - 0.1).toFixed(1)
        return { ...inst, energy_today_kwh: Math.max(0, +(inst.energy_today_kwh + delta).toFixed(1)) }
      }))
      setTick(t => t + 1)
    }, 30000)
    return () => clearInterval(id)
  }, [])

  const totalEnergy = installations.reduce((s, i) => s + i.energy_today_kwh, 0)
  const activeCount = installations.filter(i => i.status === 'online').length
  const totalCap    = installations.reduce((s, i) => s + i.capacity_kw, 0)

  if (error) return (
    <div style={{ padding: 40, color: T.plasma, fontFamily: T.ui }}>{error}</div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

      {/* ── Header ─────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <SLabel>Overview</SLabel>
          <h1 style={{ fontFamily: T.display, fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300,
            letterSpacing: '-.03em', lineHeight: .98, color: T.ink, margin: 0,
          }}>
            Good morning,<br/><em style={{ fontStyle: 'italic', fontWeight: 600, color: T.plasma }}>SolarNexa.</em>
          </h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span style={{ fontFamily: T.ui, fontSize: 12, color: T.ink60, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#16a34a', fontWeight: 500 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s ease-in-out infinite' }} />
            Live · updates every 30s
          </span>
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <StatCard loading={loading} icon="⚡" label="Energy Today"     value={`${totalEnergy.toFixed(1)} kWh`}                              sub="All installations combined" />
        <StatCard loading={loading} icon="🌳" label="Online Sites"     value={`${activeCount} / ${installations.length}`}                   sub="Active right now"           accent="#22c55e" />
        <StatCard loading={loading} icon="🍃" label="CO₂ Offset"       value={`${(totalEnergy * 0.72).toFixed(1)} kg`}                      sub="0.72 kg per kWh"            accent="#16a34a" />
        <StatCard loading={loading} icon="₹"  label="Revenue Today"    value={`₹${Math.round(totalEnergy * 8).toLocaleString('en-IN')}`}    sub="At ₹8 / kWh average"       accent="#f59e0b" />
      </div>

      {/* ── Chart + Alerts ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>

        {/* Chart */}
        <div style={{ background: T.paper, border: `1px solid ${T.ink10}`, borderRadius: 20, padding: '28px 28px 20px' }}>
          <SLabel>Energy output</SLabel>
          <STitle>This week's <em style={{ fontStyle: 'italic', fontWeight: 600 }}>performance.</em></STitle>
          {loading
            ? <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink10, fontFamily: T.ui }}>Loading…</div>
            : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weekly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="eGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={T.plasma} stopOpacity={0.18} />
                      <stop offset="95%" stopColor={T.plasma} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.ink10} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fontFamily: T.ui, fill: T.ink60 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fontFamily: T.ui, fill: T.ink60 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="energy" name="Energy (kWh)" stroke={T.plasma} fill="url(#eGrad)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="target" name="Target (kWh)" stroke={T.ink30} fill="none" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )
          }
        </div>

        {/* Alerts */}
        <div style={{ background: T.paper, border: `1px solid ${T.ink10}`, borderRadius: 20, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <SLabel>Alerts</SLabel>
          <STitle>Live <em style={{ fontStyle: 'italic', fontWeight: 600 }}>feed.</em></STitle>
          {loading
            ? <div style={{ color: T.ink10, fontFamily: T.ui, fontSize: 13 }}>Loading…</div>
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
                {alerts.map(a => {
                  const s = ALERT_STYLE[a.severity] || ALERT_STYLE.info
                  return (
                    <div key={a.id} style={{
                      background: s.bg, border: `1px solid ${s.border}`,
                      borderRadius: 12, padding: '12px 14px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                        <span style={{ fontFamily: T.display, fontSize: 13, fontWeight: 600, color: s.text }}>{a.installation}</span>
                      </div>
                      <p style={{ fontFamily: T.ui, fontSize: 12, color: T.ink60, lineHeight: 1.5, margin: 0 }}>{a.message}</p>
                      <p style={{ fontFamily: T.ui, fontSize: 11, color: T.ink30, marginTop: 5 }}>
                        {new Date(a.ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  )
                })}
              </div>
            )
          }
        </div>
      </div>

      {/* ── Installations table ─────────────────────── */}
      <div style={{ background: T.paper, border: `1px solid ${T.ink10}`, borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '24px 28px 20px', borderBottom: `1px solid ${T.ink10}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <SLabel>Fleet</SLabel>
            <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 600, letterSpacing: '-.02em', color: T.ink }}>
              Installations overview
            </div>
          </div>
          <a href="/app/installations" style={{ fontFamily: T.ui, fontSize: 12, color: T.plasma, textDecoration: 'none',
            letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 500 }}>
            View all →
          </a>
        </div>
        {loading
          ? <div style={{ padding: 40, textAlign: 'center', color: T.ink10, fontFamily: T.ui }}>Loading…</div>
          : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.ui }}>
                <thead>
                  <tr style={{ background: T.cream }}>
                    {['Site', 'Location', 'Type', 'Capacity', 'Energy Today', 'Status'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 20px', fontSize: 10.5,
                        fontWeight: 500, color: T.ink60, letterSpacing: '.1em', textTransform: 'uppercase',
                        borderBottom: `1px solid ${T.ink10}` }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {installations.slice(0, 5).map((inst, idx) => (
                    <tr key={inst.id}
                      style={{ background: idx % 2 === 0 ? T.paper : T.cream, transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = T.warm}
                      onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? T.paper : T.cream}
                    >
                      <td style={{ padding: '14px 20px', fontSize: 13.5, fontWeight: 500, color: T.ink }}>{inst.name}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: T.ink60 }}>{inst.location}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: T.ink60 }}>{inst.type}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: T.ink60 }}>{inst.capacity_kw} kW</td>
                      <td style={{ padding: '14px 20px', fontSize: 13.5, fontWeight: 500, color: T.ink }}>{inst.energy_today_kwh} kWh</td>
                      <td style={{ padding: '14px 20px' }}><StatusPill status={inst.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>

      {/* ── Fleet capacity bars ─────────────────────── */}
      {!loading && (
        <div style={{ background: T.paper, border: `1px solid ${T.ink10}`, borderRadius: 20, padding: '28px 28px 32px' }}>
          <SLabel>Capacity</SLabel>
          <STitle>Fleet <em style={{ fontStyle: 'italic', fontWeight: 600 }}>utilisation.</em></STitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {installations.map(inst => {
              const pct = totalCap > 0 ? Math.round((inst.capacity_kw / totalCap) * 100) : 0
              const barColor = inst.status === 'online' ? T.plasma : inst.status === 'maintenance' ? '#f59e0b' : T.ink30
              return (
                <div key={inst.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: T.ui,
                    fontSize: 12, color: T.ink60, marginBottom: 6 }}>
                    <span style={{ fontWeight: 500, color: T.ink }}>{inst.name}</span>
                    <span>{inst.capacity_kw} kW — {pct}%</span>
                  </div>
                  <div style={{ height: 5, background: T.ink05, borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: barColor,
                      borderRadius: 99, transition: 'width .6s cubic-bezier(.23,1,.32,1)' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        @media (max-width: 768px) {
          /* stack chart + alerts */
          div[style*="2fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
