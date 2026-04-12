import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'

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
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <path d="M14 26V17" stroke="var(--plasma)" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M14 17C14 17 8.5 13 8.5 8C8.5 5.5 10.5 4 12.5 4.6C10.5 6.5 10.8 10 14 11C17.2 10 17.5 6.5 15.5 4.6C17.5 4 19.5 5.5 19.5 8C19.5 13 14 17 14 17Z"
              fill="var(--plasma-15)" stroke="var(--plasma)" strokeWidth=".6"/>
            <circle cx="14" cy="3.2" r="2.4" fill="var(--plasma)" opacity=".9"/>
          </svg>
          <span style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: 17, color: 'var(--ink)', letterSpacing: '-.01em' }}>
            SolarNexa
          </span>
        </Link>

        {/* Desktop links */}
        <ul style={{ display: 'flex', gap: 32, listStyle: 'none', margin: 0, padding: 0 }}
            className="app-nav-links">
          {links.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} style={({ isActive }) => ({
                fontFamily: 'var(--ui)', fontSize: 13, fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--plasma)' : 'var(--ink-60)',
                textDecoration: isActive ? 'underline' : 'none',
                textUnderlineOffset: 4, letterSpacing: '.04em', textTransform: 'uppercase',
                transition: 'color .2s',
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
