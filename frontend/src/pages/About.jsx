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

function Card({ children, style }) {
  return (
    <div style={{ background: T.paper, border: `1px solid ${T.ink10}`, borderRadius: 20,
      padding: '28px 28px 24px', ...style }}>
      {children}
    </div>
  )
}

const MVP = [
  { priority: 'Must Have', color: T.plasma, items: [
    { name: 'Charging Stations',        desc: 'USB & wireless charging ports for mobile devices in public spaces.' },
    { name: 'Off-grid Operation',        desc: 'Stores solar energy during the day — works without grid access.' },
    { name: 'Durable Structure',         desc: 'Weather-resistant: heavy rain, strong winds, extreme heat.' },
  ]},
  { priority: 'Nice to Have', color: '#d97706', items: [
    { name: 'Smart Monitoring',          desc: 'Real-time energy generation & consumption via app or display.' },
    { name: 'EV Fast Charging',          desc: 'Fast-charge ports for electric scooters & small EVs.' },
    { name: 'Integrated LED Lighting',   desc: 'Solar-powered street/park lighting built into the tree.' },
  ]},
]

const COMPETITORS = [
  { name: 'SunStream Engineering', dim1: 'Customization & corporate branding (ambient lighting, Wi-Fi)', dim2: 'Integrated digital UX', price: 'Premium — bespoke engineering' },
  { name: 'Imagine Powertree',     dim1: '≈98% ground-space savings; 1–20 kW range',                    dim2: 'Structural durability; 140 km/h winds; warranties', price: 'Mid-to-high premium' },
  { name: 'SolarNexa',             dim1: 'Superior aesthetic design; ~1% footprint vs. fixed panels',   dim2: 'N-Type + tracking/tilt +30% yield; BESS off-grid', price: 'Premium — aesthetic value + efficiency', highlight: true },
]

const TEAM = [
  { av: 'LC', name: 'L E Chakrawarthy Sreenivas', role: 'Founder' },
  { av: 'CV', name: 'Chakireddy Varshitha',        role: 'Core Team' },
  { av: 'SP', name: 'Siddharth P J',               role: 'Core Team' },
  { av: 'SG', name: 'Subrat Gupta',                role: 'Core Team' },
  { av: 'HN', name: 'HemaSri Nemali',              role: 'Core Team' },
  { av: 'SK', name: 'Santosh Krishna Bandla',      role: 'Core Team' },
]

export default function About() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48, fontFamily: T.ui, color: T.ink }}>

      {/* Header */}
      <div>
        <SLabel>About</SLabel>
        <h1 style={{ fontFamily: T.display, fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300,
          letterSpacing: '-.03em', lineHeight: .98, color: T.ink, margin: 0,
        }}>
          Charging Dreams,<br/><em style={{ fontStyle: 'italic', fontWeight: 600, color: T.plasma }}>Not Carbon.</em>
        </h1>
      </div>

      {/* Mission banner */}
      <div style={{ background: T.ink, borderRadius: 24, padding: '44px 44px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 100% 100%, rgba(217,59,43,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ fontFamily: T.ui, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: T.plasma, marginBottom: 16 }}>Our Mission</div>
        <p style={{ fontFamily: T.display, fontSize: 'clamp(20px,2.2vw,28px)', fontWeight: 300, color: 'rgba(248,245,238,0.9)', lineHeight: 1.35, maxWidth: 640, letterSpacing: '-.02em', marginBottom: 32 }}>
          Urban India is running out of flat land for solar. EV adoption is accelerating with nowhere clean to charge. SolarNexa builds at that intersection — infrastructure that municipalities want, developers need, and commuters use every day.
        </p>
        <p style={{ fontFamily: T.display, fontSize: 'clamp(20px,2.2vw,28px)', fontWeight: 300, color: 'rgba(248,245,238,0.9)', lineHeight: 1.35, maxWidth: 640, letterSpacing: '-.02em', marginBottom: 32 }}>
          The SolarTree uses the vertical dimension. It occupies a parking bay, not a field. It belongs in a plaza. It charges a car, a phone, and the grid — from a single tree.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[['27%','Market CAGR'],['~1%','Ground Footprint'],['+ 30%','Yield via Tracking'],['Bengaluru','HQ']].map(([val, lbl]) => (
            <div key={lbl} style={{ background: 'rgba(248,245,238,0.07)', border: '1px solid rgba(248,245,238,0.1)', borderRadius: 14, padding: '14px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: T.display, fontSize: 24, fontWeight: 700, color: T.plasma, letterSpacing: '-.02em' }}>{val}</div>
              <div style={{ fontFamily: T.ui, fontSize: 11, color: 'rgba(248,245,238,0.45)', marginTop: 4, letterSpacing: '.06em', textTransform: 'uppercase' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem / Solution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <SLabel>The Problem</SLabel>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'Limited clean energy options in dense urban environments.',
              'Traditional solar panels require large rooftop or ground space.',
              'Aesthetic concerns block adoption in commercial & civic spaces.',
              'EV charging infrastructure is sparse, slowing EV adoption.',
            ].map(item => (
              <li key={item} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: T.ink60, lineHeight: 1.6 }}>
                <span style={{ color: T.plasma, flexShrink: 0, marginTop: 2 }}>●</span>{item}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <SLabel>Our Solution</SLabel>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'Nature-inspired Solar Tree design — blends into urban landscapes.',
              'Maximises energy generation while minimising ground space.',
              'Integrated L2 EV charging with IoT monitoring.',
              'Modular BESS for off-grid resilience and round-the-clock power.',
            ].map(item => (
              <li key={item} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: T.ink60, lineHeight: 1.6 }}>
                <span style={{ color: '#16a34a', flexShrink: 0, marginTop: 2 }}>●</span>{item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* MVP Features */}
      <Card>
        <SLabel>Product MVP</SLabel>
        <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 600, letterSpacing: '-.02em', color: T.ink, marginBottom: 28 }}>Solar Tree specifications</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {MVP.map(({ priority, color, items }) => (
            <div key={priority}>
              <span style={{ display: 'inline-block', background: `${color}15`, color, border: `1px solid ${color}30`,
                borderRadius: 4, padding: '3px 10px', fontSize: 11, letterSpacing: '.08em',
                textTransform: 'uppercase', fontWeight: 500, marginBottom: 12 }}>
                {priority}
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 10 }}>
                {items.map(({ name, desc }) => (
                  <div key={name} style={{ background: T.cream, border: `1px solid ${T.ink10}`, borderRadius: 14, padding: '16px 18px' }}>
                    <div style={{ fontFamily: T.display, fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 6 }}>{name}</div>
                    <div style={{ fontSize: 12.5, color: T.ink60, lineHeight: 1.65 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Competitive analysis */}
      <Card>
        <SLabel>Competition</SLabel>
        <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 600, letterSpacing: '-.02em', color: T.ink, marginBottom: 24 }}>Competitive positioning</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.ui }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.ink10}` }}>
                <th style={{ textAlign: 'left', padding: '8px 16px', fontSize: 11, color: T.ink60, fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase' }}>Dimension</th>
                {COMPETITORS.map(c => (
                  <th key={c.name} style={{ textAlign: 'left', padding: '8px 16px', fontSize: 13,
                    fontFamily: T.display, fontWeight: 600,
                    color: c.highlight ? T.plasma : T.ink }}>
                    {c.name}{c.highlight ? ' ★' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Differentiator 1', key: 'dim1' },
                { label: 'Differentiator 2', key: 'dim2' },
                { label: 'Pricing',           key: 'price' },
              ].map(row => (
                <tr key={row.label} style={{ borderBottom: `1px solid ${T.ink05}` }}>
                  <td style={{ padding: '12px 16px', fontSize: 11, color: T.ink30, textTransform: 'uppercase', letterSpacing: '.06em', verticalAlign: 'top' }}>{row.label}</td>
                  {COMPETITORS.map(c => (
                    <td key={c.name} style={{ padding: '12px 16px', fontSize: 13, color: T.ink60, verticalAlign: 'top',
                      background: c.highlight ? T.p06 : 'transparent', lineHeight: 1.6 }}>
                      {c[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Market sizing */}
      <Card>
        <SLabel>Market</SLabel>
        <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 600, letterSpacing: '-.02em', color: T.ink, marginBottom: 24 }}>TAM / SAM / SOM</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {[
            { label: 'TAM', sub: 'Total Available Market',      value: '₹53.9 Cr', note: 'Current annual spend' },
            { label: 'SAM', sub: 'Serviceable Available Market', value: '₹1.45 Cr', note: '10% of 27% growth rate' },
            { label: 'SOM', sub: 'Serviceable Obtainable Market', value: '₹14.55 L', note: '10% of SAM — initial niche' },
          ].map(m => (
            <div key={m.label} style={{ flex: '1 1 160px', background: T.cream, border: `1px solid ${T.ink10}`, borderRadius: 16, padding: '20px 20px 16px' }}>
              <div style={{ fontFamily: T.ui, fontSize: 10, color: T.ink30, textTransform: 'uppercase', letterSpacing: '.1em' }}>{m.label}</div>
              <div style={{ fontFamily: T.ui, fontSize: 11, color: T.ink60, marginBottom: 12 }}>{m.sub}</div>
              <div style={{ fontFamily: T.display, fontSize: 28, fontWeight: 700, color: T.ink, letterSpacing: '-.025em' }}>{m.value}</div>
              <div style={{ fontFamily: T.ui, fontSize: 11.5, color: T.ink60, marginTop: 6 }}>{m.note}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Team */}
      <Card>
        <SLabel>Team</SLabel>
        <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 600, letterSpacing: '-.02em', color: T.ink, marginBottom: 24 }}>The people behind the tree</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {TEAM.map(m => (
            <div key={m.name} style={{ background: T.cream, border: `1px solid ${T.ink10}`, borderRadius: 16,
              padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: T.p06, border: `1px solid ${T.p15}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: T.display, fontSize: 13, fontWeight: 600, color: T.plasma, flexShrink: 0 }}>
                {m.av}
              </div>
              <div>
                <div style={{ fontFamily: T.display, fontSize: 13, fontWeight: 600, color: T.ink, lineHeight: 1.2, marginBottom: 3 }}>{m.name}</div>
                <div style={{ fontFamily: T.ui, fontSize: 11, color: T.ink60 }}>{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <style>{`@media (max-width: 768px) { div[style*="1fr 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}
