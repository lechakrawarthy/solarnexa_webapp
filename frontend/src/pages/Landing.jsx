import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import SNCursor from '../components/SNCursor.jsx'
import SNParticles from '../components/SNParticles.jsx'
import SNTreeCanvas from '../components/SNTreeCanvas.jsx'
import SNMapModal from '../components/SNMapModal.jsx'
import useReveal from '../hooks/useReveal.js'
import logoSvg from '../assets/solarnexa-logo.svg'
import lcPhoto from '../assets/team/lcPhoto.png'
import cvPhoto from '../assets/team/cvPhoto.webp'
import spPhoto from '../assets/team/spPhoto.webp'
import sgPhoto from '../assets/team/sgPhoto.webp'
import hnPhoto from '../assets/team/hnPhoto.webp'
import skPhoto from '../assets/team/skPhoto.webp'

/* ── tiny helpers ─────────────────────────────────── */
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

/* ── SNNav ────────────────────────────────────────── */
const NAV_LINKS = [
  ['product',  'Product'],
  ['process',  'How it works'],
  ['mission',  'Mission'],
  ['team',     'Team'],
  ['contact',  'Contact'],
]

function SNNav() {
  const [stuck, setStuck]   = useState(false)
  const [active, setActive] = useState(null)
  const [mopen, setMopen]   = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setStuck(window.scrollY > 40)
      const sections = NAV_LINKS.map(([id]) => document.getElementById(id)).filter(Boolean)
      const inView = sections.filter(s => s.getBoundingClientRect().top < window.innerHeight * 0.55)
      setActive(inView.length ? inView[inView.length - 1].id : null)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`sn-nav${stuck ? ' sn-nav--stuck' : ''}`}>
      <a className="sn-nav__logo" href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
        <img src={logoSvg} width="30" height="30" alt="SolarNexa mark" className="sn-nav__logo-img" loading="eager" />
        <span className="sn-nav__logo-word">Solar<em>Nexa</em></span>
        <span className="sn-nav__logo-tag">CleanTech</span>
      </a>

      <ul className="sn-nav__links">
        {NAV_LINKS.map(([id, label]) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={active === id ? 'sn-nav__link--active' : ''}
              onClick={e => { e.preventDefault(); scrollTo(id) }}
            >
              {label}
              {active === id && <span className="sn-nav__link-dot" />}
            </a>
          </li>
        ))}
      </ul>

      <div className="sn-nav__right">
        <div className="sn-nav__status">
          <span className="sn-nav__status-dot" />
          <span>Phase 1 Live</span>
        </div>
        <Link to="/app" className="sn-nav__cta" style={{ cursor: 'none', textDecoration: 'none' }}>
          Dashboard <span className="sn-nav__cta-arrow">↗</span>
        </Link>
      </div>

      <button className="sn-nav__burger" onClick={() => setMopen(v => !v)} aria-label="Menu">
        <span /><span /><span />
      </button>

      {mopen && (
        <div className="sn-nav__drawer">
          {NAV_LINKS.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); setMopen(false) }}>{label}</a>
          ))}
          <Link to="/app" onClick={() => setMopen(false)} style={{ textDecoration: 'none' }}>Open Dashboard →</Link>
        </div>
      )}
    </nav>
  )
}

/* ── SNTicker ─────────────────────────────────────── */
const TICKER = [
  ['27%','Market CAGR'],['~1%','Ground footprint'],['+30%','Energy yield'],
  ['L2','EV Charging'],['N-Type','Solar panels'],['Off-grid','BESS-ready'],
]

function SNTicker() {
  const items = [...TICKER, ...TICKER]
  return (
    <div className="sn-ticker">
      <div className="sn-ticker__track">
        {items.map(([val, label], i) => (
          <div key={i} className="sn-ticker__item">
            <span className="sn-ticker__val">{val}</span>
            <span className="sn-ticker__label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── SNFeatures ───────────────────────────────────── */
function FCard({ num, icon, label, title, body, wide, half, third, hero }) {
  const cls = ['sn-fcard', wide&&'sn-fcard--wide', half&&'sn-fcard--half', third&&'sn-fcard--third', hero&&'sn-fcard--hero', 'reveal'].filter(Boolean).join(' ')
  return (
    <div className={cls}>
      <div className="sn-fcard__num">{num}</div>
      <div className="sn-fcard__icon"><svg viewBox="0 0 20 20" dangerouslySetInnerHTML={{ __html: icon }} /></div>
      <span className="sn-fcard__label">{label}</span>
      <div className="sn-fcard__title">{title}</div>
      <p className="sn-fcard__body">{body}</p>
    </div>
  )
}

function SNFeatures() {
  return (
    <section className="sn-features" id="product">
      <div className="sn-features__header">
        <div className="sn-label reveal">The product</div>
        <h2 className="sn-section-title reveal d1">A new kind of<br/><em>solar infrastructure.</em></h2>
      </div>
      <div className="sn-feature-grid">
        <FCard wide num="01"
          icon='<path d="M10 18V12M10 12C10 12 5 8.5 5 4.5C5 2.5 7 1.2 9 1.7C7.2 3.4 7.5 6.5 10 7.5C12.5 6.5 12.8 3.4 11 1.7C13 1.2 15 2.5 15 4.5C15 8.5 10 12 10 12Z"/><circle cx="10" cy=".8" r="1.2" fill="var(--plasma)" stroke="none"/>'
          label="Core hardware" title="SolarTree — Solar as sculpture"
          body="Tree-form architecture with N-Type panels on articulated branches. Designed for plazas, campuses, and courtyards. Under 1% the footprint of equivalent flat-panel output."
        />
        <FCard hero num="02"
          icon='<rect x="1" y="11" width="18" height="7" rx="2"/><path d="M6 11V8.5L9 6H14V11"/><path d="M10 2.5L8.5 5.5H11.5L10 8.5" stroke="rgba(248,245,238,0.9)" strokeWidth="1.6"/>'
          label="Charging infra" title="EV + device charging, off-grid capable"
          body="L2 ports for electric vehicles. USB and wireless for devices. Fully off-grid via modular BESS — no grid connection required."
        />
        <FCard third num="03"
          icon='<rect x="2" y="5" width="16" height="11" rx="2"/><circle cx="10" cy="10.5" r="2.5"/><path d="M8.2 10.5L9.5 11.8L11.8 9.5"/>'
          label="Software" title="Live IoT monitoring"
          body="Real-time energy and savings dashboards. Remote diagnostics, maintenance alerts."
        />
        <FCard third num="04"
          icon='<path d="M10 1L2 6V14L10 19L18 14V6Z"/><path d="M10 10L2 6M10 10L18 6M10 10V19"/>'
          label="Service" title="SLA-backed maintenance"
          body="Proactive packages. Rated for monsoon and 140 km/h wind loads."
        />
        <FCard third num="05"
          icon='<path d="M3 10L8 15L17 6"/>'
          label="Key advantage" title="Zero land required"
          body="Deploys in any paved footprint. No rooftop. No open land. No compromise."
        />
      </div>
    </section>
  )
}

/* ── SNProcess ────────────────────────────────────── */
const STEPS = [
  { n: '01', title: 'Capture', desc: 'N-Type panels on articulated branches track sunlight through the day for maximum yield.' },
  { n: '02', title: 'Store',   desc: 'Modular BESS stores surplus. Charge controllers regulate flow for off-grid overnight supply.' },
  { n: '03', title: 'Charge',  desc: 'L2 EV ports and USB points deliver clean power — to vehicles and devices, anywhere.' },
  { n: '04', title: 'Optimise',desc: 'IoT streams live data to the app. Savings, performance, and maintenance — all visible.' },
]

function SNProcess() {
  return (
    <section className="sn-process" id="process">
      <div className="sn-label reveal">How it works</div>
      <h2 className="sn-section-title reveal d1">Sunlight in.<br/><em>Clean energy out.</em></h2>
      <div className="sn-process__grid">
        {STEPS.map((s, i) => (
          <div key={s.n} className={`sn-process__step reveal${i ? ` d${i}` : ''}`}>
            <div className="sn-process__num">{s.n}</div>
            <div className="sn-process__title">{s.title}</div>
            <p className="sn-process__desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── SNMission (replaces SNMarket — customer-facing narrative) ── */
function SNMission() {
  return (
    <section className="sn-mission" id="mission">
      <div className="sn-mission__inner">
        <div className="sn-mission__left reveal">
          <div className="sn-label sn-label--light">The mission</div>
          <h2 className="sn-mission__title">
            India's cities need a<br/>
            <em>different kind of energy.</em>
          </h2>
          <p className="sn-mission__body">
            Urban India is running out of flat land for solar. EV adoption is accelerating with nowhere
            clean to charge. SolarNexa builds at that intersection — infrastructure that municipalities
            want, developers need, and commuters use every day.
          </p>
          <p className="sn-mission__body">
            The SolarTree uses the vertical dimension. It occupies a parking bay, not a field.
            It belongs in a plaza. It charges a car, a phone, and the grid — from a single tree.
          </p>
          <div className="sn-mission__stat">
            <span className="sn-mission__stat-val">27%</span>
            <span className="sn-mission__stat-desc">CAGR — India's urban solar &amp; EV charging market</span>
          </div>
        </div>
        <div className="sn-mission__right reveal d2">
          <div className="sn-mission__quote">
            "Charging <em>Dreams,</em><br/>not Carbon."
          </div>
          <div className="sn-mission__usecases">
            <div className="sn-usecase reveal d1">
              <div className="sn-usecase__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M9 21V7l3-4 3 4v14M9 12h6"/>
                </svg>
              </div>
              <div>
                <div className="sn-usecase__title">Urban Plazas &amp; Campuses</div>
                <p className="sn-usecase__desc">SolarTrees become landmarks — charging EVs and devices while defining public space.</p>
              </div>
            </div>
            <div className="sn-usecase reveal d2">
              <div className="sn-usecase__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="13" width="22" height="8" rx="2"/>
                  <path d="M5 13V10a2 2 0 012-2h4v5M16 6l-2 4h3l-2 4"/>
                </svg>
              </div>
              <div>
                <div className="sn-usecase__title">EV Fleet Operators</div>
                <p className="sn-usecase__desc">Off-grid L2 charging for fleets — no new grid connection, no civil works, no waiting.</p>
              </div>
            </div>
            <div className="sn-usecase reveal d3">
              <div className="sn-usecase__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <div className="sn-usecase__title">Developers &amp; Municipalities</div>
                <p className="sn-usecase__desc">Green infrastructure that earns — energy revenue, sustainability mandates met, zero land trade-off.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── SNRoadmap ────────────────────────────────────── */
function SNRoadmap() {
  return (
    <section className="sn-roadmap" id="roadmap">
      <div className="sn-label reveal">Roadmap</div>
      <h2 className="sn-section-title reveal d1">Three phases.<br/><em>One mission.</em></h2>
      <div className="sn-road__grid">
        <div className="sn-road__phase reveal">
          <div className="sn-road__dot sn-road__dot--now">
            <svg viewBox="0 0 14 14"><path d="M2 7L5.5 10.5L12 4"/></svg>
          </div>
          <div className="sn-road__tag">Now · Phase 1</div>
          <div className="sn-road__title">Urban pilots</div>
          <p className="sn-road__desc">First SolarTree deployments in Bengaluru. Proving the unit economics, the aesthetics, and the installation workflow.</p>
        </div>
        <div className="sn-road__phase reveal d1">
          <div className="sn-road__dot">
            <svg viewBox="0 0 14 14" stroke="var(--ink-30)"><circle cx="7" cy="7" r="3"/></svg>
          </div>
          <div className="sn-road__tag">Next · Phase 2</div>
          <div className="sn-road__title">Smart grid + storage</div>
          <p className="sn-road__desc">Expanding the product — grid integration, advanced BESS, unified IoT dashboard across all deployments.</p>
        </div>
        <div className="sn-road__phase reveal d2">
          <div className="sn-road__dot">
            <svg viewBox="0 0 14 14" stroke="var(--ink-10)"><circle cx="7" cy="7" r="3"/></svg>
          </div>
          <div className="sn-road__tag">Future · Phase 3</div>
          <div className="sn-road__title">National scale</div>
          <p className="sn-road__desc">Pan-India. Bundled offerings for municipalities, developers, and EV fleets. The city's energy infrastructure, redesigned.</p>
        </div>
      </div>
    </section>
  )
}

/* ── SNTeam ───────────────────────────────────────── */
const TEAM_R1 = [
  { n: '01', av: 'SK', name: 'Santosh Krishna Bandla', role: 'Core Team',   bio: 'Operations & delivery',         photo: skPhoto },
  { n: '02', av: 'CV', name: 'Chakireddy Varshitha',   role: 'Core Team',   bio: 'Product & user experience',    photo: cvPhoto },
  { n: '03', av: 'SP', name: 'Siddharth P J',          role: 'Core Team',   bio: 'Engineering & prototyping',    photo: spPhoto },
  { n: '04', av: 'SG', name: 'Subrat Gupta',           role: 'Core Team',   bio: 'Research & sustainability',    photo: sgPhoto },
  { n: '05', av: 'HN', name: 'HemaSri Nemali',         role: 'Core Team',   bio: 'Strategy & partnerships',      photo: hnPhoto },
]
const TEAM_R2 = [
  { n: '06', av: 'LC', name: 'L E Chakrawarthy Sreenivas', role: 'Founder', bio: 'Building the infrastructure layer for India\'s clean urban future.', photo: lcPhoto },
]

/* Live energy ticker cell */
function TeamCellEnergy() {
  const [kwh, setKwh] = useState(142.6)
  const [co2, setCo2] = useState(58.3)
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    const id = setInterval(() => {
      setKwh(v => +(v + (Math.random() * 0.4 - 0.05)).toFixed(1))
      setCo2(v => +(v + (Math.random() * 0.15 - 0.02)).toFixed(1))
      setPulse(true)
      setTimeout(() => setPulse(false), 400)
    }, 2200)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="sn-tcell sn-tcell--r2 sn-tcell--special sn-tcell--energy">
      <span className="sn-tcell__num">07</span>
      <div className="sn-tcell__special-label">Live output</div>
      <div className={`sn-tcell__big-val${pulse ? ' sn-tcell__big-val--pulse' : ''}`}>{kwh}</div>
      <div className="sn-tcell__big-unit">kWh today</div>
      <div className="sn-tcell__sub-row">
        <span>{co2} kg</span><span className="sn-tcell__sub-sep">·</span><span>CO₂ offset</span>
      </div>
      <div className="sn-tcell__energy-bar">
        <div className="sn-tcell__energy-fill" style={{ width: `${Math.min(100, (kwh / 200) * 100)}%` }} />
      </div>
    </div>
  )
}

/* Animated solar arc / yield meter cell */
function TeamCellYield() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let frame, t = 0
    const draw = () => {
      if (document.hidden) { frame = requestAnimationFrame(draw); return }
      ctx.clearRect(0, 0, 120, 120)
      const cx = 60, cy = 68, r = 46
      ctx.beginPath()
      ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25)
      ctx.strokeStyle = 'rgba(28,24,20,0.08)'
      ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.stroke()
      const pct = 0.72 + Math.sin(t * 0.018) * 0.08
      ctx.beginPath()
      ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * (0.75 + 1.5 * pct))
      ctx.strokeStyle = '#D93B2B'
      ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.stroke()
      const angle = Math.PI * (0.75 + 1.5 * pct)
      const sx = cx + r * Math.cos(angle), sy = cy + r * Math.sin(angle)
      ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#FF9000'; ctx.fill()
      ctx.fillStyle = '#1C1814'
      ctx.font = '700 22px Fraunces, Georgia, serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(`${Math.round(pct * 100)}%`, cx, cy - 4)
      ctx.font = '400 10px Inter Tight, sans-serif'
      ctx.fillStyle = 'rgba(28,24,20,0.5)'
      ctx.fillText('yield', cx, cy + 14)
      t++; frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [])
  return (
    <div className="sn-tcell sn-tcell--r2 sn-tcell--special sn-tcell--yield">
      <span className="sn-tcell__num">08</span>
      <div className="sn-tcell__special-label">Efficiency</div>
      <canvas ref={canvasRef} width={120} height={120} className="sn-tcell__arc" aria-label="Yield meter" />
      <div className="sn-tcell__yield-note">N-Type tracking</div>
    </div>
  )
}

/* City deployment ping-map cell — click to open full map */
function TeamCellMap({ onOpenMap }) {
  const PINS = [
    { x: 52, y: 57, active: true },
    { x: 67, y: 41, active: true },
    { x: 36, y: 67, active: false },
    { x: 78, y: 60, active: false },
    { x: 50, y: 34, active: false },
  ]
  return (
    <div className="sn-tcell sn-tcell--r2 sn-tcell--special sn-tcell--map" onClick={onOpenMap} title="Click to open full map" role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onOpenMap()}>
      <span className="sn-tcell__num">09</span>
      <div className="sn-tcell__special-label">Bengaluru rollout</div>
      <div className="sn-tcell__map-stage">
        {[20,35,50,65,80].map(y => <div key={y} className="sn-tcell__map-gridline" style={{ top: `${y}%` }} />)}
        {[20,35,50,65,80].map(x => <div key={x} className="sn-tcell__map-gridline sn-tcell__map-gridline--v" style={{ left: `${x}%` }} />)}
        {PINS.map((p, i) => (
          <div key={i} className={`sn-tcell__pin${p.active ? ' sn-tcell__pin--on' : ''}`} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <div className="sn-tcell__pin-dot" />
            {p.active && <div className="sn-tcell__pin-ring" />}
          </div>
        ))}
      </div>
      <div className="sn-tcell__map-footer">
        <div className="sn-tcell__map-legend">
          <span className="sn-tcell__map-dot sn-tcell__map-dot--on" />Live
          <span className="sn-tcell__map-dot" style={{ marginLeft: 10 }} />Planned
        </div>
        <div className="sn-tcell__map-expand">Expand ↗</div>
      </div>
    </div>
  )
}

function SNTeam() {
  const [mapOpen, setMapOpen] = useState(false)
  return (
    <section className="sn-team" id="team">
      <div className="sn-label reveal">The team</div>
      <h2 className="sn-section-title reveal d1">The people<br/><em>behind the tree.</em></h2>

      <div className="sn-team__bento reveal d2">
        {/* Row 1 */}
        {TEAM_R1.map(m => (
          <div key={m.name} className="sn-tcell" style={m.photo ? { backgroundImage: `url(${m.photo})`, backgroundSize: 'cover', backgroundPosition: 'center top' } : undefined}>
            {m.photo && <div className="sn-tcell__photo-overlay" />}
            <span className="sn-tcell__num">{m.n}</span>
            <div className="sn-tcell__av">{m.av}</div>
            <div className="sn-tcell__name">{m.name}</div>
            <div className="sn-tcell__role">{m.role}</div>
            {m.bio && <div className="sn-tcell__bio">{m.bio}</div>}
          </div>
        ))}

        {/* Row 2 — founder */}
        {TEAM_R2.map(m => (
          <div key={m.name} className="sn-tcell sn-tcell--r2 sn-tcell--founder" style={m.photo ? { backgroundImage: `url(${m.photo})`, backgroundSize: 'cover', backgroundPosition: 'center top' } : undefined}>
            {m.photo && <div className="sn-tcell__photo-overlay" />}
            <span className="sn-tcell__num">{m.n}</span>
            <div className="sn-tcell__av">{m.av}</div>
            <div className="sn-tcell__name">{m.name}</div>
            <div className="sn-tcell__role sn-tcell__role--founder">{m.role}</div>
            {m.bio && <div className="sn-tcell__bio sn-tcell__bio--founder">{m.bio}</div>}
          </div>
        ))}

        {/* Interactive special cells */}
        <TeamCellEnergy />
        <TeamCellYield />
        <TeamCellMap onOpenMap={() => setMapOpen(true)} />

        {/* "We're growing" teaser — last cell */}
        <div className="sn-tcell sn-tcell--r2 sn-tcell--grow">
          <div className="sn-tcell__grow-title">We're<br/>growing.</div>
          <div className="sn-tcell__grow-body">Open roles in tech &amp; ops</div>
        </div>
      </div>

      {mapOpen && <SNMapModal onClose={() => setMapOpen(false)} />}
    </section>
  )
}

/* ── SNContact ────────────────────────────────────── */
function SNContact() {
  const [form, setForm] = useState({ name: '', email: '', org: '', usecase: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [err, setErr] = useState(null)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSending(true)
    setErr(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Something went wrong')
      }
      setSent(true)
    } catch (e) {
      setErr(e.message || 'Failed to send. Please email contact@solarnexa.in directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="sn-contact" id="contact">
      <div className="sn-contact__inner">
        <div className="sn-contact__left reveal">
          <div className="sn-label">Get in touch</div>
          <h2 className="sn-section-title">Plant your first<br/><em>solar tree.</em></h2>
          <p className="sn-contact__desc">
            Whether you're a developer, a municipality, or an EV fleet operator — we'd love to talk.
            Tell us about your project and we'll get back within 48 hours.
          </p>
          <div className="sn-contact__info">
            <a href="mailto:contact@solarnexa.in" className="sn-contact__link">contact@solarnexa.in</a>
            <span className="sn-contact__loc">Bengaluru, India</span>
          </div>
        </div>

        <div className="sn-contact__right reveal d2">
          {sent ? (
            <div className="sn-contact__thanks">
              <div className="sn-contact__thanks-icon">✓</div>
              <div className="sn-contact__thanks-title">Message sent.</div>
              <p className="sn-contact__thanks-body">We'll be in touch within 48 hours. Thanks for reaching out.</p>
            </div>
          ) : (
            <form className="sn-contact__form" onSubmit={handleSubmit} noValidate>
              <div className="sn-contact__row">
                <div className="sn-contact__field">
                  <label className="sn-contact__label">Your name *</label>
                  <input className="sn-contact__input" name="name" value={form.name} onChange={handleChange} placeholder="Priya Sharma" required autoComplete="name" />
                </div>
                <div className="sn-contact__field">
                  <label className="sn-contact__label">Email address</label>
                  <input className="sn-contact__input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="priya@company.in" autoComplete="email" />
                </div>
              </div>
              <div className="sn-contact__row">
                <div className="sn-contact__field">
                  <label className="sn-contact__label">Organisation</label>
                  <input className="sn-contact__input" name="org" value={form.org} onChange={handleChange} placeholder="Sunrise Developers" autoComplete="organization" />
                </div>
                <div className="sn-contact__field">
                  <label className="sn-contact__label">Use case</label>
                  <select className="sn-contact__input sn-contact__select" name="usecase" value={form.usecase} onChange={handleChange}>
                    <option value="">Select one…</option>
                    <option value="Urban plaza / public space">Urban plaza / public space</option>
                    <option value="Corporate campus">Corporate campus</option>
                    <option value="EV fleet charging">EV fleet charging</option>
                    <option value="Gated community / residential">Gated community / residential</option>
                    <option value="Municipality / government">Municipality / government</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="sn-contact__field">
                <label className="sn-contact__label">Message *</label>
                <textarea className="sn-contact__input sn-contact__textarea" name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your project, location, and timeline…" rows={4} required />
              </div>
              {err && <p style={{ fontSize: 13, color: 'var(--plasma)', margin: 0 }}>{err}</p>}
              <button type="submit" className="sn-btn sn-btn--primary sn-contact__submit" disabled={sending} style={{ cursor: 'none' }}>
                {sending ? 'Sending…' : 'Send message'} <span className="sn-btn__arrow">→</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── SNCTA ────────────────────────────────────────── */
function SNCTA() {
  return (
    <section className="sn-cta">
      <div className="sn-cta__glow" />
      <div className="sn-cta__eyebrow reveal">CleanTech · Bengaluru · 2023</div>
      <h2 className="sn-cta__title reveal d1">Charging <em>Dreams,</em><br/>Not Carbon.</h2>
      <p className="sn-cta__sub reveal d2">We're building the infrastructure layer for India's clean urban future. One tree at a time.</p>
      <div className="sn-cta__actions reveal d3">
        <Link to="/app" className="sn-btn sn-btn--light" style={{ cursor: 'none' }}>
          Open Dashboard <span className="sn-btn__arrow">→</span>
        </Link>
        <button className="sn-btn sn-btn--ghost-light" onClick={() => scrollTo('contact')} style={{ cursor: 'none' }}>
          Get in touch
        </button>
      </div>
      <p className="sn-cta__note reveal d4">CleanTech · EV Infrastructure · Urban Energy</p>
    </section>
  )
}

/* ── SNFooter ─────────────────────────────────────── */
function SNFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="sn-footer">
      <div className="sn-footer__glow" />

      <div className="sn-footer__top">
        <div className="sn-footer__brand-block">
          <div className="sn-footer__logo">
            <img src={logoSvg} width="44" height="44" alt="SolarNexa" loading="lazy" />
            <div>
              <div className="sn-footer__wordmark">Solar<em>Nexa</em></div>
              <div className="sn-footer__location">Bengaluru, India</div>
            </div>
          </div>
          <p className="sn-footer__tagline">
            <span style={{ color: '#ffffff', display: 'block' }}>Charging Dreams,</span>
            <em>Not Carbon.</em>
          </p>
          <div className="sn-footer__badges">
            <span className="sn-footer__badge">CleanTech</span>
            <span className="sn-footer__badge">EV Infrastructure</span>
            <span className="sn-footer__badge">Urban Energy</span>
          </div>
        </div>

        <div className="sn-footer__nav">
          <div className="sn-footer__col">
            <div className="sn-footer__col-head">Product</div>
            <ul className="sn-footer__col-list">
              <li><a href="#product" onClick={e => { e.preventDefault(); scrollTo('product') }}>SolarTree</a></li>
              <li><a href="#product" onClick={e => { e.preventDefault(); scrollTo('product') }}>EV Charging</a></li>
              <li><a href="#product" onClick={e => { e.preventDefault(); scrollTo('product') }}>BESS Storage</a></li>
              <li><a href="#process" onClick={e => { e.preventDefault(); scrollTo('process') }}>IoT Dashboard</a></li>
            </ul>
          </div>
          <div className="sn-footer__col">
            <div className="sn-footer__col-head">Company</div>
            <ul className="sn-footer__col-list">
              <li><a href="#mission" onClick={e => { e.preventDefault(); scrollTo('mission') }}>About</a></li>
              <li><a href="#team" onClick={e => { e.preventDefault(); scrollTo('team') }}>Team</a></li>
              <li><a href="#roadmap" onClick={e => { e.preventDefault(); scrollTo('roadmap') }}>Roadmap</a></li>
              <li><a href="#contact" onClick={e => { e.preventDefault(); scrollTo('contact') }}>Careers</a></li>
            </ul>
          </div>
          <div className="sn-footer__col">
            <div className="sn-footer__col-head">Connect</div>
            <ul className="sn-footer__col-list">
              <li><a href="mailto:contact@solarnexa.in">contact@solarnexa.in</a></li>
              <li><a href="#contact" onClick={e => { e.preventDefault(); scrollTo('contact') }}>Bengaluru, India</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="sn-footer__stats-band">
        {[
          { val: '27%',  lbl: 'Market CAGR',       note: 'Solar EV infra India' },
          { val: '~1%',  lbl: 'Ground footprint',   note: 'vs. flat panel equivalent' },
          { val: '+30%', lbl: 'Energy yield',        note: 'N-Type + tracking' },
          { val: 'L2',   lbl: 'EV charging',         note: 'Fast charge, off-grid ready' },
        ].map(({ val, lbl, note }) => (
          <div key={lbl} className="sn-footer__stat">
            <div className="sn-footer__stat-val">{val}</div>
            <div className="sn-footer__stat-lbl">{lbl}</div>
            <div className="sn-footer__stat-note">{note}</div>
          </div>
        ))}
      </div>

      <div className="sn-footer__bar">
        <span>© {year} SolarNexa. All rights reserved.</span>
        <span className="sn-footer__bar-sep" />
        <span>Made in Bengaluru</span>
        <span className="sn-footer__bar-sep" />
        <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</Link>
        <span className="sn-footer__bar-sep" />
        <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</Link>
      </div>
    </footer>
  )
}

/* ══════════════════════════════════════════════════
   Landing — root export
══════════════════════════════════════════════════ */
export default function Landing() {
  useReveal()

  return (
    <div className="sn-body">
      <SNParticles />
      <SNCursor />
      <SNNav />

      {/* Hero */}
      <section className="sn-hero">
        <div className="sn-hero__bg-rule" />
        <div className="sn-hero__left">
          <div className="sn-hero__kicker">
            <span className="sn-hero__kicker-dot" />
            CleanTech · Bengaluru · 2023
          </div>
          <h1 className="sn-hero__title">
            Urban energy,<br/>
            <em>reimagined</em><br/>
            <span className="sn-hero__title-sub">as living structure.</span>
          </h1>
          <p className="sn-hero__desc">
            Solar architecture that charges the city — without taking a single square metre away from it.
          </p>
          <div className="sn-hero__actions">
            <button className="sn-btn sn-btn--primary" onClick={() => scrollTo('product')}>
              Discover SolarTree <span className="sn-btn__arrow">→</span>
            </button>
            <button className="sn-btn sn-btn--outline" onClick={() => scrollTo('contact')}>
              Get in touch
            </button>
          </div>
        </div>
        <div className="sn-hero__right">
          <SNTreeCanvas />
        </div>
      </section>

      <SNTicker />
      <SNFeatures />
      <SNProcess />
      <SNMission />
      <SNRoadmap />
      <SNTeam />
      <SNContact />
      <SNCTA />
      <SNFooter />
    </div>
  )
}
