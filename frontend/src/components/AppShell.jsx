import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import logoSvg from '../assets/solarnexa-logo.svg'

const links = [
  { to: '/app',               label: 'Dashboard',     end: true  },
  { to: '/app/installations', label: 'Installations', end: false },
  { to: '/app/analytics',     label: 'Analytics',     end: false },
  { to: '/app/about',         label: 'About',         end: false },
]

export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', fontFamily: 'var(--ui)', color: 'var(--ink)' }}>

      {/* ── Navbar ───────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: 'rgba(248,245,238,0.94)',
        borderBottom: '1px solid var(--ink-10)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 56px', height: '64px',
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src={logoSvg} width="28" height="28" alt="SolarNexa" />
          <span style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 17, color: 'var(--ink)', letterSpacing: '-.01em' }}>
            Solar<span style={{ color: 'var(--plasma)' }}>Nexa</span>
          </span>
          <span style={{
            fontFamily: 'var(--ui)', fontSize: 9, fontWeight: 500,
            color: 'var(--ink-30)', letterSpacing: '.12em', textTransform: 'uppercase',
            background: 'var(--paper-deep)', border: '1px solid var(--ink-10)',
            borderRadius: 3, padding: '2px 6px', lineHeight: 1,
          }}>Dashboard</span>
        </Link>

        {/* Desktop links */}
        <ul style={{ display: 'flex', gap: 32, listStyle: 'none', margin: 0, padding: 0 }}
            className="app-nav-links">
          {links.map(({ to, label, end }) => (
            <li key={to} style={{ position: 'relative' }}>
              <NavLink to={to} end={end} style={({ isActive }) => ({
                fontFamily: 'var(--ui)', fontSize: 11.5, fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--ink)' : 'var(--ink-60)',
                textDecoration: 'none',
                letterSpacing: '.06em', textTransform: 'uppercase',
                transition: 'color .2s', display: 'flex', alignItems: 'center', gap: 6,
                padding: '0 4px', height: 64,
                borderBottom: isActive ? '2px solid var(--plasma)' : '2px solid transparent',
              })}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="app-nav-hamburger"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" fill="none" stroke="var(--ink)" viewBox="0 0 24 24">
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
          padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {links.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                fontFamily: 'var(--ui)', fontSize: 14, fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--plasma)' : 'var(--ink-60)', textDecoration: 'none',
                letterSpacing: '.04em', textTransform: 'uppercase',
              })}>
              {label}
            </NavLink>
          ))}
        </div>
      )}

      {/* ── Page content ─────────────────────────────── */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 56px' }} className="app-main">
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 768px) {
          .app-nav-links    { display: none !important; }
          .app-main         { padding: 32px 24px !important; }
        }
        @media (min-width: 769px) {
          .app-nav-hamburger { display: none !important; }
        }
      `}</style>
    </div>
  )
}
