import { Link } from 'react-router-dom'
import logoSvg from '../assets/solarnexa-logo.svg'

function LegalPage({ title, children }) {
  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', fontFamily: 'var(--ui)', minHeight: '100vh' }}>
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
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 56px' }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--plasma)', fontWeight: 500, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 20, height: 1.5, background: 'var(--plasma)', display: 'inline-block' }} />
          Legal
        </div>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, letterSpacing: '-.03em', color: 'var(--ink)', marginBottom: 12 }}>{title}</h1>
        <p style={{ fontSize: 12, color: 'var(--ink-30)', marginBottom: 56 }}>Last updated: April 2025</p>
        <div style={{ fontSize: 15, lineHeight: 1.85, color: 'var(--ink-60)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p>SolarNexa (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard information when you visit our website at solarnexa.in.</p>

      <h2 style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginTop: 40, marginBottom: 12, letterSpacing: '-.01em' }}>Information we collect</h2>
      <p>When you submit a contact form on our website, we collect your name, organisation name, email address, and message. We do not collect any other personal data automatically except standard server logs (IP address, browser type, pages visited) which are used only for security and analytics.</p>

      <h2 style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginTop: 40, marginBottom: 12, letterSpacing: '-.01em' }}>How we use your information</h2>
      <p>We use contact form submissions solely to respond to your enquiry. We do not sell, trade, or share your personal information with third parties except as required by law.</p>

      <h2 style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginTop: 40, marginBottom: 12, letterSpacing: '-.01em' }}>Cookies</h2>
      <p>Our website does not use tracking cookies. We may use essential session cookies to ensure the site functions correctly.</p>

      <h2 style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginTop: 40, marginBottom: 12, letterSpacing: '-.01em' }}>Contact</h2>
      <p>For any privacy-related questions, please email us at <a href="mailto:contact@solarnexa.in" style={{ color: 'var(--plasma)' }}>contact@solarnexa.in</a>.</p>
    </LegalPage>
  )
}

export function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <p>By accessing and using the SolarNexa website (solarnexa.in), you accept and agree to be bound by the following terms and conditions.</p>

      <h2 style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginTop: 40, marginBottom: 12, letterSpacing: '-.01em' }}>Use of website</h2>
      <p>This website is provided for informational purposes about SolarNexa's products and services. You may not use this site for any unlawful purpose or in a way that could damage, disable, or impair the website.</p>

      <h2 style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginTop: 40, marginBottom: 12, letterSpacing: '-.01em' }}>Intellectual property</h2>
      <p>All content on this website, including text, graphics, logos, and software, is the property of SolarNexa and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.</p>

      <h2 style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginTop: 40, marginBottom: 12, letterSpacing: '-.01em' }}>Dashboard preview</h2>
      <p>The dashboard available at solarnexa.in/app is a demonstration of SolarNexa's fleet management software. All data shown is simulated and does not represent live installations. It is provided for illustrative purposes only.</p>

      <h2 style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginTop: 40, marginBottom: 12, letterSpacing: '-.01em' }}>Limitation of liability</h2>
      <p>SolarNexa shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website. The website is provided &ldquo;as is&rdquo; without warranties of any kind.</p>

      <h2 style={{ fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginTop: 40, marginBottom: 12, letterSpacing: '-.01em' }}>Contact</h2>
      <p>For any questions about these terms, please contact us at <a href="mailto:contact@solarnexa.in" style={{ color: 'var(--plasma)' }}>contact@solarnexa.in</a>.</p>
    </LegalPage>
  )
}
