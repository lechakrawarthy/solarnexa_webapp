import { Link } from 'react-router-dom'
import logoSvg from '../assets/solarnexa-logo.svg'

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function AboutPublic() {
  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'var(--ui)', minHeight: '100vh' }}>

      {/* Simple sticky nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: 'rgba(248,245,238,0.94)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--ink-10)',
        display: 'flex', alignItems: 'center', height: 66, padding: '0 48px', gap: 32,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src={logoSvg} width="28" height="28" alt="SolarNexa" />
          <span style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 17, color: 'var(--ink)', letterSpacing: '-.015em' }}>
            Solar<span style={{ color: 'var(--plasma)' }}>Nexa</span>
          </span>
        </Link>
        <Link to="/" style={{ marginLeft: 'auto', fontFamily: 'var(--ui)', fontSize: 11, fontWeight: 500, color: 'var(--ink-60)', textDecoration: 'none', letterSpacing: '.06em', textTransform: 'uppercase' }}>
          ← Home
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ background: 'var(--ink)', padding: '100px 56px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 80% 50%, rgba(217,59,43,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700 }}>
          <div style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--plasma)', fontWeight: 500, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 20, height: 1.5, background: 'var(--plasma)', display: 'inline-block' }} />
            About SolarNexa
          </div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(40px,5.5vw,72px)', fontWeight: 300, lineHeight: .98, letterSpacing: '-.03em', color: 'rgba(248,245,238,0.92)', margin: 0 }}>
            Charging <em style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--plasma)' }}>Dreams,</em><br />Not Carbon.
          </h1>
          <p style={{ marginTop: 28, fontSize: 16, color: 'rgba(248,245,238,0.5)', lineHeight: 1.8, maxWidth: 560, fontWeight: 400 }}>
            SolarNexa is a Bengaluru-based CleanTech startup transforming urban energy infrastructure with SolarTrees — solar charging stations designed for cities, not fields.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 56px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 80 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--plasma)', fontWeight: 500, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 20, height: 1.5, background: 'var(--plasma)', display: 'inline-block' }} />
              The problem
            </div>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: 20, color: 'var(--ink)' }}>
              Cities have no room<br /><em style={{ fontStyle: 'italic', fontWeight: 600 }}>for flat solar.</em>
            </h2>
            <p style={{ fontSize: 14, color: 'var(--ink-60)', lineHeight: 1.85 }}>
              Urban India is running out of rooftop and open-field space for solar installations. EV adoption is accelerating fast — but charging infrastructure hasn't kept up, especially off the main highways.
            </p>
            <p style={{ fontSize: 14, color: 'var(--ink-60)', lineHeight: 1.85, marginTop: 12 }}>
              The result: cities that want to be clean, but have no clean place to generate or deliver energy.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--plasma)', fontWeight: 500, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 20, height: 1.5, background: 'var(--plasma)', display: 'inline-block' }} />
              Our answer
            </div>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-.02em', marginBottom: 20, color: 'var(--ink)' }}>
              The vertical dimension<br /><em style={{ fontStyle: 'italic', fontWeight: 600 }}>belongs to trees.</em>
            </h2>
            <p style={{ fontSize: 14, color: 'var(--ink-60)', lineHeight: 1.85 }}>
              SolarTree uses tree-form architecture with N-Type solar panels on articulated branches. It occupies a parking bay, not a field. It deploys in plazas and campuses. It's solar infrastructure that cities actually want.
            </p>
            <p style={{ fontSize: 14, color: 'var(--ink-60)', lineHeight: 1.85, marginTop: 12 }}>
              With integrated L2 EV charging, modular off-grid BESS, and a live IoT dashboard — one tree does a lot.
            </p>
          </div>
        </div>

        {/* Values */}
        <div style={{ borderTop: '1px solid var(--ink-10)', paddingTop: 64, marginBottom: 80 }}>
          <div style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--plasma)', fontWeight: 500, marginBottom: 40, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 20, height: 1.5, background: 'var(--plasma)', display: 'inline-block' }} />
            What we believe
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, border: '1px solid var(--ink-10)', borderRadius: 20, overflow: 'hidden' }}>
            {[
              { n: '01', title: 'Beauty is infrastructure', body: 'Solar doesn\'t have to be ugly. If it belongs in the city, it should look like it belongs.' },
              { n: '02', title: 'Off-grid by default', body: 'Clean energy should work when the grid doesn\'t. Every SolarTree runs independently.' },
              { n: '03', title: 'One tree, many roles', body: 'Shade, sculpture, charger, sensor, revenue — infrastructure that earns its footprint.' },
            ].map(v => (
              <div key={v.n} style={{ background: 'var(--cream)', padding: '36px 28px', borderRight: '1px solid var(--ink-10)' }}>
                <div style={{ fontFamily: 'var(--display)', fontSize: 56, fontWeight: 700, color: 'var(--ink-05)', letterSpacing: '-.04em', lineHeight: 1, marginBottom: 16 }}>{v.n}</div>
                <div style={{ fontFamily: 'var(--display)', fontSize: 17, fontWeight: 600, marginBottom: 10, letterSpacing: '-.01em' }}>{v.title}</div>
                <p style={{ fontSize: 13.5, color: 'var(--ink-60)', lineHeight: 1.75, margin: 0 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ fontFamily: 'var(--display)', fontSize: 'clamp(22px,2.8vw,36px)', fontWeight: 300, letterSpacing: '-.02em', color: 'var(--ink)', marginBottom: 32 }}>
            Ready to plant your first <em style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--plasma)' }}>solar tree?</em>
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--ink)', color: 'var(--paper)', borderRadius: 6, padding: '13px 28px', fontFamily: 'var(--ui)', fontSize: 14, fontWeight: 500, textDecoration: 'none', letterSpacing: '.02em' }}>
              Get in touch →
            </Link>
            <Link to="/app" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'var(--ink)', border: '1.5px solid var(--ink-30)', borderRadius: 6, padding: '13px 28px', fontFamily: 'var(--ui)', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
              View Dashboard ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
