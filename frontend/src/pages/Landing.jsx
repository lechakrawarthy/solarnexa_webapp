import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SNCursor from '../components/SNCursor.jsx'
import SNParticles from '../components/SNParticles.jsx'
import SNTreeCanvas from '../components/SNTreeCanvas.jsx'
import useReveal from '../hooks/useReveal.js'

/* ── tiny helpers ─────────────────────────────────── */
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

/* ── SNNav ────────────────────────────────────────── */
function SNNav() {
  const [stuck, setStuck] = useState(false)
  useEffect(() => {
    const fn = () => setStuck(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`sn-nav${stuck ? ' sn-nav--stuck' : ''}`}>
      <a className="sn-nav__logo" href="#">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M14 26V17" stroke="var(--plasma)" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M14 17C14 17 8.5 13 8.5 8C8.5 5.5 10.5 4 12.5 4.6C10.5 6.5 10.8 10 14 11C17.2 10 17.5 6.5 15.5 4.6C17.5 4 19.5 5.5 19.5 8C19.5 13 14 17 14 17Z" fill="var(--plasma-15)" stroke="var(--plasma)" strokeWidth=".6"/>
          <circle cx="14" cy="3.2" r="2.4" fill="var(--plasma)" opacity=".9"/>
        </svg>
        SolarNexa
      </a>
      <ul className="sn-nav__links">
        {[['product','Product'],['process','How it works'],['market','Market'],['roadmap','Roadmap'],['team','Team']].map(([id,label]) => (
          <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>{label}</a></li>
        ))}
      </ul>
      <Link to="/app" className="sn-nav__cta" style={{ cursor: 'none', textDecoration: 'none' }}>
        Open Dashboard →
      </Link>
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

/* ── SNMarket ─────────────────────────────────────── */
const METRICS = [
  { val: '₹539 Cr',  label: 'Total market (TAM)',        note: 'India solar tree + EV charging, today' },
  { val: '₹14.5 Cr', label: 'Serviceable segment (SAM)', note: 'Urban solar-tree category' },
  { val: '₹14.5 L',  label: 'Initial target (SOM)',      note: 'Bengaluru urban deployments' },
  { val: '27%',       label: 'CAGR over 5 years',         note: 'EV adoption + sustainability mandates' },
]

function SNMarket() {
  return (
    <section className="sn-market" id="market">
      <div className="sn-label reveal">The opportunity</div>
      <h2 className="sn-section-title reveal d1">A market growing<br/><em>faster than the grid.</em></h2>
      <div className="sn-market__layout">
        <div className="reveal">
          <div className="sn-market__quote">"Charging <em>Dreams</em>, not Carbon."</div>
          <p className="sn-market__body">
            India's urban solar and EV charging market is expanding at 27% CAGR. SolarNexa enters at the intersection —
            aesthetic infrastructure that municipalities want, developers need, and commuters use. The beachhead is Bengaluru.
            The vision is every city in India.
          </p>
        </div>
        <div className="sn-metric-stack reveal d1">
          {METRICS.map(m => (
            <div key={m.label} className="sn-metric">
              <div className="sn-metric__val">{m.val}</div>
              <div className="sn-metric__info">
                <span className="sn-metric__label">{m.label}</span>
                <span className="sn-metric__note">{m.note}</span>
              </div>
              <span className="sn-metric__arrow">→</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── SNUsers ──────────────────────────────────────── */
const TAGS = [
  'Commercial developers','Urban planners','EV fleet managers','Municipal authorities',
  'Sustainability officers','Gated communities','Corporate campuses','Parking operators',
  'Landscape architects','Real estate developers','Transit authorities','Solar enthusiasts',
]

function SNUsers() {
  return (
    <section className="sn-users">
      <div className="sn-label reveal">Who we serve</div>
      <h2 className="sn-section-title reveal d1">Everyone building<br/><em>tomorrow's cities.</em></h2>
      <div className="sn-tag-cloud reveal d2">
        {TAGS.map(tag => (
          <div key={tag} className="sn-tag">
            <span className="sn-tag__dot" />
            {tag}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── SNCompare ────────────────────────────────────── */
const COMPARE = [
  { vs: 'vs. SunStream Engineering', title: 'Beauty isn\'t a feature — it\'s the product', body: 'SunStream wraps panels in branding. SolarNexa builds architecture first. The tree form exists because the city deserves it.', badge: 'Design-first' },
  { vs: 'vs. Imagine Powertree', title: 'Space-efficiency and resilience together', body: 'Powertree delivers specs. SolarNexa adds off-grid BESS resilience, L2 EV charging, and an IoT layer — without losing the space advantage.', badge: 'Full-stack resilience' },
  { vs: 'vs. Traditional solar', title: 'No roof, no land, no compromise', body: 'Flat solar demands space. SolarTree uses the vertical dimension. It works in parking lots, plazas, and pathways — exactly where people are.', badge: 'Zero land trade-off' },
]

function SNCompare() {
  return (
    <section className="sn-compare">
      <div className="sn-label reveal">Why SolarNexa</div>
      <h2 className="sn-section-title reveal d1"><em>Better</em> because<br/>it starts different.</h2>
      <div className="sn-compare__grid reveal d2">
        {COMPARE.map(c => (
          <div key={c.vs} className="sn-cc">
            <div className="sn-cc__vs">{c.vs}</div>
            <div className="sn-cc__title">{c.title}</div>
            <p className="sn-cc__body">{c.body}</p>
            <span className="sn-cc__badge">{c.badge}</span>
            <div className="sn-cc__accent" />
          </div>
        ))}
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
// Row 1: 5 members  |  Row 2: 3 members + "growing" teaser
const TEAM_R1 = [
  { n: '01', av: 'LC', name: 'L E Chakrawarthy Sreenivas', role: 'Founder' },
  { n: '02', av: 'CV', name: 'Chakireddy Varshitha',        role: 'Core Team' },
  { n: '03', av: 'SP', name: 'Siddharth P J',               role: 'Core Team' },
  { n: '04', av: 'SG', name: 'Subrat Gupta',                role: 'Core Team' },
  { n: '05', av: 'HN', name: 'HemaSri Nemali',              role: 'Core Team' },
]
const TEAM_R2 = [
  { n: '06', av: 'SK', name: 'Santosh Krishna Bandla', role: 'Core Team' },
]

function SNTeam() {
  return (
    <section className="sn-team" id="team">
      <div className="sn-label reveal">The team</div>
      <h2 className="sn-section-title reveal d1">The people<br/><em>behind the tree.</em></h2>

      <div className="sn-team__bento reveal d2">
        {/* Row 1 */}
        {TEAM_R1.map(m => (
          <div key={m.name} className="sn-tcell">
            <span className="sn-tcell__num">{m.n}</span>
            <div className="sn-tcell__av">{m.av}</div>
            <div className="sn-tcell__name">{m.name}</div>
            <div className="sn-tcell__role">{m.role}</div>
          </div>
        ))}

        {/* Row 2 — member + empty placeholders + growing teaser */}
        {TEAM_R2.map(m => (
          <div key={m.name} className="sn-tcell sn-tcell--r2">
            <span className="sn-tcell__num">{m.n}</span>
            <div className="sn-tcell__av">{m.av}</div>
            <div className="sn-tcell__name">{m.name}</div>
            <div className="sn-tcell__role">{m.role}</div>
          </div>
        ))}

        {/* Empty filler cells */}
        {[7, 8, 9].map(n => (
          <div key={n} className="sn-tcell sn-tcell--r2" style={{ opacity: 0.35 }}>
            <span className="sn-tcell__num">{String(n).padStart(2,'0')}</span>
            <div className="sn-tcell__av" style={{ borderStyle: 'dashed' }} />
          </div>
        ))}

        {/* "We're growing" teaser — last cell */}
        <div className="sn-tcell sn-tcell--r2 sn-tcell--grow">
          <div className="sn-tcell__grow-title">We're<br/>growing.</div>
          <div className="sn-tcell__grow-body">Open roles in tech &amp; ops</div>
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
      <div className="sn-cta__eyebrow reveal">Startup India Recognised · Bengaluru · 2023</div>
      <h2 className="sn-cta__title reveal d1">Plant your first<br/><em>solar tree.</em></h2>
      <p className="sn-cta__sub reveal d2">We're building the infrastructure layer for India's clean urban future. Let's place one tree at a time.</p>
      <div className="sn-cta__actions reveal d3">
        <Link to="/app" className="sn-btn sn-btn--light" style={{ cursor: 'none' }}>
          Open Dashboard <span className="sn-btn__arrow">→</span>
        </Link>
        <button className="sn-btn sn-btn--ghost-light">Download deck</button>
      </div>
      <p className="sn-cta__note reveal d4">CleanTech · EV Infrastructure · Urban Energy</p>
    </section>
  )
}

/* ── SNFooter ─────────────────────────────────────── */
function SNFooter() {
  return (
    <footer className="sn-footer">
      <div className="sn-footer__brand">Solar<span>Nexa</span></div>
      <div className="sn-footer__copy">Charging Dreams, Not Carbon · 2023</div>
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
            <button className="sn-btn sn-btn--outline" onClick={() => scrollTo('market')}>
              View market
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
      <SNMarket />
      <SNUsers />
      <SNCompare />
      <SNRoadmap />
      <SNTeam />
      <SNCTA />
      <SNFooter />
    </div>
  )
}
