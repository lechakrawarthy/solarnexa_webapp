import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const T = {
  ink:     '#1C1814',
  ink60:   'rgba(28,24,20,0.72)',
  ink30:   'rgba(28,24,20,0.3)',
  ink10:   'rgba(28,24,20,0.08)',
  ink05:   'rgba(28,24,20,0.04)',
  paper:   '#F8F5EE',
  warm:    '#F2EDE3',
  cream:   '#FAF8F3',
  plasma:  '#D93B2B',
  p15:     'rgba(217,59,43,0.15)',
  p06:     'rgba(217,59,43,0.06)',
  display: "'Fraunces', Georgia, serif",
  ui:      "'Inter Tight', system-ui, sans-serif",
}

const PIE_COLORS = [T.plasma, T.ink30]

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

function StatCard({ label, value, sub }) {
  return (
    <div style={{ background: T.paper, border: `1px solid ${T.ink10}`, borderRadius: 20, padding: '24px 24px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: T.plasma, opacity: 0.5 }} />
      <div style={{ fontFamily: T.ui, fontSize: 11, color: T.ink60, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: T.display, fontSize: 'clamp(24px,3vw,36px)', fontWeight: 600, color: T.ink, letterSpacing: '-.025em', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: T.ui, fontSize: 12, color: T.ink60, marginTop: 8 }}>{sub}</div>}
    </div>
  )
}

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: T.ink, color: T.paper, borderRadius: 10, padding: '10px 16px', fontSize: 12, fontFamily: T.ui }}>
      <div style={{ fontFamily: T.display, fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {payload.map(p => <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>{p.name}: <strong>{p.value}</strong></div>)}
    </div>
  )
}

function Card({ label, title, children, loading }) {
  return (
    <div style={{ background: T.paper, border: `1px solid ${T.ink10}`, borderRadius: 20, padding: '28px 28px 24px' }}>
      <SLabel>{label}</SLabel>
      <div style={{ fontFamily: T.display, fontSize: 20, fontWeight: 600, letterSpacing: '-.02em', color: T.ink, marginBottom: 24 }}>
        {title}
      </div>
      {loading
        ? <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.ink10, fontFamily: T.ui }}>Loading chart…</div>
        : children
      }
    </div>
  )
}

export default function Analytics() {
  const [weekly,  setWeekly]  = useState([])
  const [monthly, setMonthly] = useState([])
  const [byType,  setByType]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    Promise.all([
      axios.get('/api/analytics/weekly'),
      axios.get('/api/analytics/monthly'),
      axios.get('/api/analytics/by-type'),
    ])
      .then(([w, m, t]) => {
        setWeekly(w.data.data ?? [])
        setMonthly(m.data.data ?? [])
        setByType(t.data.data ?? [])
      })
      .catch(() => setError('Could not load analytics.'))
      .finally(() => setLoading(false))
  }, [])

  if (error) return <div style={{ padding: 40, color: T.plasma, fontFamily: T.ui }}>{error}</div>

  const totalMonth = monthly.reduce((s, m) => s + m.energy, 0)
  const totalCO2   = monthly.reduce((s, m) => s + m.co2, 0)
  const bestDay    = weekly.length ? weekly.reduce((a, b) => a.energy > b.energy ? a : b) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>

      {/* Header */}
      <div>
        <SLabel>Analytics</SLabel>
        <h1 style={{ fontFamily: T.display, fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300,
          letterSpacing: '-.03em', lineHeight: .98, color: T.ink, margin: 0,
        }}>
          Energy & impact,<br/><em style={{ fontStyle: 'italic', fontWeight: 600, color: T.plasma }}>by the numbers.</em>
        </h1>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <StatCard label="6-Month Energy"     value={loading ? '—' : `${(totalMonth/1000).toFixed(1)} MWh`} sub="Nov 2024 – Apr 2025" />
        <StatCard label="Total CO₂ Offset"   value={loading ? '—' : `${(totalCO2/1000).toFixed(2)} t`}    sub="6-month period" />
        <StatCard label="Best Day This Week"  value={loading || !bestDay ? '—' : `${bestDay.energy} kWh`}  sub={bestDay?.day} />
      </div>

      {/* Weekly area chart */}
      <Card label="This week" title="Energy vs Target (kWh)" loading={loading}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={weekly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={T.plasma} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={T.plasma} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.ink10}/>
            <XAxis dataKey="day" tick={{ fontSize: 11, fontFamily: T.ui, fill: T.ink60 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize: 11, fontFamily: T.ui, fill: T.ink60 }} axisLine={false} tickLine={false}/>
            <Tooltip content={<ChartTooltip/>}/>
            <Legend wrapperStyle={{ fontFamily: T.ui, fontSize: 12, color: T.ink60 }}/>
            <Area type="monotone" dataKey="energy" name="Energy (kWh)" stroke={T.plasma} fill="url(#wGrad)" strokeWidth={2} dot={false}/>
            <Area type="monotone" dataKey="target" name="Target (kWh)" stroke={T.ink30} fill="none" strokeDasharray="5 5" strokeWidth={1.5} dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Monthly bar + Pie side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card label="6 months" title="Energy & CO₂ per Month" loading={loading}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.ink10}/>
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: T.ui, fill: T.ink60 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11, fontFamily: T.ui, fill: T.ink60 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTooltip/>}/>
              <Legend wrapperStyle={{ fontFamily: T.ui, fontSize: 12, color: T.ink60 }}/>
              <Bar dataKey="energy" name="Energy (kWh)" fill={T.plasma} radius={[4,4,0,0]}/>
              <Bar dataKey="co2"    name="CO₂ (kg)"     fill={T.ink30}  radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card label="Mix" title="Energy by Installation Type" loading={loading}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byType} dataKey="value" nameKey="type"
                cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                paddingAngle={4}
                label={({ type, value }) => `${type}: ${value}%`}
                labelLine={false}>
                {byType.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
              </Pie>
              <Tooltip formatter={v => `${v}%`} contentStyle={{ fontFamily: T.ui, fontSize: 12, background: T.ink, color: T.paper, border: 'none', borderRadius: 10 }}/>
              <Legend wrapperStyle={{ fontFamily: T.ui, fontSize: 12, color: T.ink60 }}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <style>{`@media (max-width: 768px) { div[style*="1fr 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
