import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import logoSvg from '../assets/solarnexa-logo.svg'

const links = [
  { to: '/app',               label: 'Dashboard',     end: true  },
  { to: '/app/installations', label: 'Installations', end: false },
  { to: '/app/analytics',     label: 'Analytics',     end: false },
]

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', fontFamily: 'var(--ui)', color: 'var(--ink)' }}>

      {/* ── Navbar — matches landing architectural grid-line style ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: 'rgba(248,245,238,0.94)',
        borderBottom: '1px solid var(--ink-10)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'stretch',
        height: 64,
      }}>
        {/* Brand */}
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
          padding: '0 40px 0 48px',
          borderRight: '1px solid var(--ink-10)', flexShrink: 0,
        }}>
          <img src={logoSvg} width="26" height="26" alt="SolarNexa" />
          <span style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 16, color: 'var(--ink)', letterSpacing: '-.015em', whiteSpace: 'nowrap' }}>
            Solar<span style={{ color: 'var(--plasma)' }}>Nexa</span>
          </span>
          <span style={{
            fontFamily: 'var(--ui)', fontSize: 9, fontWeight: 500,
            color: 'var(--ink-30)', letterSpacing: '.12em', textTransform: 'uppercase',
            background: 'var(--paper-deep)', border: '1px solid var(--ink-10)',
            borderRadius: 3, padding: '2px 6px', lineHeight: 1, flexShrink: 0,
          }}>Dashboard</span>
        </Link>

        {/* Desktop links — grid-line separated */}
        <ul style={{
          display: 'flex', listStyle: 'none', margin: 0, padding: 0,
          flex: 1,
          borderRight: '1px solid var(--ink-10)',
        }} className="app-nav-links">
          {links.map(({ to, label, end }) => (
            <li key={to} style={{ borderRight: '1px solid var(--ink-10)', display: 'flex' }}>
              <NavLink to={to} end={end} style={({ isActive }) => ({
                display: 'flex', alignItems: 'center',
                fontFamily: 'var(--ui)', fontSize: 11, fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--ink)' : 'var(--ink-60)',
                textDecoration: 'none',
                letterSpacing: '.07em', textTransform: 'uppercase',
                padding: '0 22px',
                borderBottom: isActive ? '2px solid var(--plasma)' : '2px solid transparent',
                background: isActive ? 'rgba(28,24,20,0.02)' : 'transparent',
                transition: 'color .15s, background .15s',
                whiteSpace: 'nowrap',
              })}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right: back to site */}
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0 28px',
          fontFamily: 'var(--ui)', fontSize: 11, fontWeight: 500,
          color: 'var(--ink-60)', textDecoration: 'none',
          letterSpacing: '.06em', textTransform: 'uppercase',
          transition: 'color .15s',
          flexShrink: 0,
        }} className="app-nav-back"
          onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-60)'}
        >
          ← Site
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="app-nav-hamburger"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '0 20px', borderLeft: '1px solid var(--ink-10)',
          }}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" fill="none" stroke="var(--ink)" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/>
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"/>}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--paper-warm)', borderBottom: '1px solid var(--ink-10)',
          display: 'flex', flexDirection: 'column',
        }}>
          {links.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                fontFamily: 'var(--ui)', fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--plasma)' : 'var(--ink)', textDecoration: 'none',
                letterSpacing: '.06em', textTransform: 'uppercase',
                padding: '16px 24px',
                borderBottom: '1px solid var(--ink-10)',
                borderLeft: isActive ? '3px solid var(--plasma)' : '3px solid transparent',
              })}>
              {label}
            </NavLink>
          ))}
        </div>
      )}

      {/* ── Showcase banner ──────────────────────────── */}
      <div style={{
        background: 'var(--ink)',
        borderBottom: '1px solid var(--ink-10)',
        padding: '10px 48px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--ui)', fontSize: 10, fontWeight: 600,
          color: 'var(--plasma)', letterSpacing: '.14em', textTransform: 'uppercase',
          background: 'rgba(217,59,43,0.12)', border: '1px solid rgba(217,59,43,0.25)',
          borderRadius: 4, padding: '3px 8px', flexShrink: 0,
        }}>
          ◆ Preview
        </span>
        <span style={{
          fontFamily: 'var(--ui)', fontSize: 12, color: 'rgba(248,245,238,0.5)',
          letterSpacing: '.02em',
        }}>
          This is a showcase of how the live dashboard will look once SolarNexa installations go live.
        </span>
      </div>

      {/* ── Page content ─────────────────────────────── */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 56px' }} className="app-main">
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 768px) {
          .app-nav-links    { display: none !important; }
          .app-nav-back     { display: none !important; }
          .app-main         { padding: 32px 24px !important; }
        }
        @media (min-width: 769px) {
          .app-nav-hamburger { display: none !important; }
        }
      `}</style>
    </div>
  )
}
