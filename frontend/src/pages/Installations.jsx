import { useState, useEffect } from 'react'
import axios from 'axios'

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

const STATUS = {
  online:      { bg: 'rgba(22,163,74,0.08)',  color: '#16a34a', dot: '#22c55e' },
  offline:     { bg: 'rgba(220,38,38,0.08)',  color: '#dc2626', dot: '#ef4444' },
  maintenance: { bg: 'rgba(217,119,6,0.1)',   color: '#d97706', dot: '#f59e0b' },
}

const TYPE_ICON = { 'Solar Tree': '🌳', 'Solar EV Station': '⚡' }

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

function Modal({ site, onClose }) {
  if (!site) return null
  const fields = [
    ['Capacity', `${site.capacity_kw} kW`],
    ['Energy Today', `${site.energy_today_kwh} kWh`],
    ['Energy This Month', `${site.energy_month_kwh.toLocaleString('en-IN')} kWh`],
    ['CO₂ Offset Today', `${site.co2_offset_kg} kg`],
    ['Client', site.client],
    ['Revenue Today', `₹${Math.round(site.energy_today_kwh * 8).toLocaleString('en-IN')}`],
    ['Installed', new Date(site.installed_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
    ['Last Service', new Date(site.last_service).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })],
  ]
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(28,24,20,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      backdropFilter: 'blur(4px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: T.paper, borderRadius: 24, width: '100%', maxWidth: 520,
        padding: '36px 36px 32px', position: 'relative',
        boxShadow: '0 32px 80px rgba(28,24,20,0.18)',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20,
          background: 'none', border: `1px solid ${T.ink10}`, borderRadius: 8,
          width: 32, height: 32, cursor: 'pointer', color: T.ink60, fontSize: 16,
        }}>✕</button>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 28 }}>
          <span style={{ fontSize: 32 }}>{TYPE_ICON[site.type] || '☀️'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 600, color: T.ink, marginBottom: 4 }}>{site.name}</div>
            <div style={{ fontFamily: T.ui, fontSize: 13, color: T.ink60 }}>{site.location} · {site.type}</div>
          </div>
          <StatusPill status={site.status} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
          {fields.map(([label, value]) => (
            <div key={label} style={{ background: T.cream, border: `1px solid ${T.ink10}`, borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontFamily: T.ui, fontSize: 10.5, color: T.ink60, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: T.display, fontSize: 15, fontWeight: 600, color: T.ink }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: T.cream, border: `1px solid ${T.ink10}`, borderRadius: 12, padding: '10px 14px',
          fontFamily: T.ui, fontSize: 12, color: T.ink60 }}>
          📍 Lat {site.lat}, Lng {site.lng}
        </div>
      </div>
    </div>
  )
}

export default function Installations() {
  const [installations, setInstallations] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatus] = useState('all')
  const [typeFilter, setType]     = useState('all')
  const [selected, setSelected]   = useState(null)

  useEffect(() => {
    axios.get('/api/installations')
      .then(({ data }) => setInstallations(data.data ?? []))
      .catch(() => setError('Could not load installations.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = installations.filter(i => {
    const ms = i.name.toLowerCase().includes(search.toLowerCase()) || i.location.toLowerCase().includes(search.toLowerCase())
    const mst = statusFilter === 'all' || i.status === statusFilter
    const mt  = typeFilter   === 'all' || i.type   === typeFilter
    return ms && mst && mt
  })

  const totalEnergy = installations.reduce((s, i) => s + i.energy_today_kwh, 0)
  const onlineCount = installations.filter(i => i.status === 'online').length

  if (error) return <div style={{ padding: 40, color: T.plasma, fontFamily: T.ui }}>{error}</div>

  const inputStyle = {
    background: T.paper, border: `1px solid ${T.ink10}`, borderRadius: 10,
    padding: '9px 14px', fontSize: 13, fontFamily: T.ui, color: T.ink,
    outline: 'none', transition: 'border-color .2s',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* Header */}
      <div>
        <SLabel>Installations</SLabel>
        <h1 style={{ fontFamily: T.display, fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300,
          letterSpacing: '-.03em', lineHeight: .98, color: T.ink, margin: 0,
        }}>
          Your fleet,<br/><em style={{ fontStyle: 'italic', fontWeight: 600, color: T.plasma }}>at a glance.</em>
        </h1>
      </div>

      {/* Summary bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        {[
          { label: 'Total Sites',     value: loading ? '—' : installations.length },
          { label: 'Online',          value: loading ? '—' : onlineCount,            accent: '#22c55e' },
          { label: 'Energy Today',    value: loading ? '—' : `${totalEnergy.toFixed(1)} kWh` },
          { label: 'Revenue Today',   value: loading ? '—' : `₹${Math.round(totalEnergy * 8).toLocaleString('en-IN')}`, accent: '#f59e0b' },
        ].map(({ label, value, accent }) => (
          <div key={label} style={{ background: T.paper, border: `1px solid ${T.ink10}`, borderRadius: 16, padding: '20px 20px 16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2.5, background: accent || T.plasma, opacity: 0.55 }} />
            <div style={{ fontFamily: T.ui, fontSize: 11, color: T.ink60, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>{label}</div>
            <div style={{ fontFamily: T.display, fontSize: 28, fontWeight: 600, color: T.ink, letterSpacing: '-.025em' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          style={{ ...inputStyle, flex: 1, minWidth: 180 }}
          type="search" placeholder="Search by name or location…"
          value={search} onChange={e => setSearch(e.target.value)}
          onFocus={e => e.target.style.borderColor = T.plasma}
          onBlur={e => e.target.style.borderColor = T.ink10}
        />
        <select style={inputStyle} value={statusFilter} onChange={e => setStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <select style={inputStyle} value={typeFilter} onChange={e => setType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="Solar Tree">Solar Tree</option>
          <option value="Solar EV Station">Solar EV Station</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ background: T.paper, border: `1px solid ${T.ink10}`, borderRadius: 20, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: T.ink10, fontFamily: T.ui }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: T.ink60, fontFamily: T.ui, fontSize: 14 }}>No installations match your filters.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.ui }}>
              <thead>
                <tr style={{ background: T.cream }}>
                  {['Site', 'Location', 'Type', 'Capacity', 'Energy Today', 'CO₂ Today', 'Status', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '11px 20px', fontSize: 10.5,
                      fontWeight: 500, color: T.ink60, letterSpacing: '.1em', textTransform: 'uppercase',
                      borderBottom: `1px solid ${T.ink10}`, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((inst, idx) => (
                  <tr key={inst.id}
                    style={{ background: idx % 2 === 0 ? T.paper : T.cream, cursor: 'default', transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = T.warm}
                    onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? T.paper : T.cream}
                  >
                    <td style={{ padding: '14px 20px', fontSize: 13.5, fontWeight: 500, color: T.ink, whiteSpace: 'nowrap' }}>{inst.name}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: T.ink60, whiteSpace: 'nowrap' }}>{inst.location}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: T.ink60, whiteSpace: 'nowrap' }}>
                      {TYPE_ICON[inst.type] || '☀️'} {inst.type}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: T.ink60, whiteSpace: 'nowrap' }}>{inst.capacity_kw} kW</td>
                    <td style={{ padding: '14px 20px', fontSize: 13.5, fontWeight: 500, color: T.ink, whiteSpace: 'nowrap' }}>{inst.energy_today_kwh} kWh</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: T.ink60, whiteSpace: 'nowrap' }}>{inst.co2_offset_kg} kg</td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}><StatusPill status={inst.status} /></td>
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                      <button onClick={() => setSelected(inst)} style={{
                        background: 'none', border: `1px solid ${T.ink10}`, borderRadius: 8,
                        padding: '5px 12px', fontSize: 12, color: T.ink60, cursor: 'pointer',
                        fontFamily: T.ui, transition: 'border-color .2s, color .2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = T.plasma; e.currentTarget.style.color = T.plasma }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = T.ink10;  e.currentTarget.style.color = T.ink60 }}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && (
        <div style={{ fontFamily: T.ui, fontSize: 12, color: T.ink30, textAlign: 'right' }}>
          Showing {filtered.length} of {installations.length} installations
        </div>
      )}

      <Modal site={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
