import { Suspense, lazy } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Landing       from './pages/Landing.jsx'
import AboutPublic   from './pages/AboutPublic.jsx'
import { Privacy, Terms } from './pages/Privacy.jsx'
import logoSvg from './assets/solarnexa-logo.svg'

// Lazy-load the dashboard shell and all its pages so Recharts doesn't block
// the landing page's initial JS parse
const AppShell      = lazy(() => import('./components/AppShell.jsx'))
const Dashboard     = lazy(() => import('./pages/Dashboard.jsx'))
const Installations = lazy(() => import('./pages/Installations.jsx'))
const Analytics     = lazy(() => import('./pages/Analytics.jsx'))
const About         = lazy(() => import('./pages/About.jsx'))

function DashboardLoader() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ui)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid var(--plasma)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'sn-spin .7s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontSize: 12, color: 'var(--ink-30)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Loading…</p>
      </div>
      <style>{`@keyframes sn-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--paper)', fontFamily: 'var(--ui)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', textAlign: 'center',
    }}>
      <img src={logoSvg} width="48" height="48" alt="SolarNexa" style={{ marginBottom: 32, opacity: 0.4 }} />
      <p style={{ fontFamily: 'var(--display)', fontSize: 'clamp(80px,12vw,140px)', fontWeight: 700, color: 'var(--ink-10)', letterSpacing: '-.05em', lineHeight: 1, margin: 0 }}>404</p>
      <p style={{ fontFamily: 'var(--display)', fontSize: 'clamp(18px,2.5vw,28px)', color: 'var(--ink)', fontWeight: 300, letterSpacing: '-.01em', margin: '16px 0 8px' }}>Page not found.</p>
      <p style={{ fontSize: 14, color: 'var(--ink-60)', marginBottom: 36 }}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'var(--ink)', color: 'var(--paper)',
        borderRadius: 6, padding: '12px 24px',
        fontFamily: 'var(--ui)', fontSize: 14, fontWeight: 500,
        textDecoration: 'none', letterSpacing: '.02em',
      }}>
        ← Back to home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/"        element={<Landing />} />
      <Route path="/about"   element={<AboutPublic />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms"   element={<Terms />} />

      {/* Dashboard shell — lazy loaded, Recharts only downloads when user navigates here */}
      <Route path="/app" element={<Suspense fallback={<DashboardLoader />}><AppShell /></Suspense>}>
        <Route index              element={<Suspense fallback={<DashboardLoader />}><Dashboard /></Suspense>} />
        <Route path="installations" element={<Suspense fallback={<DashboardLoader />}><Installations /></Suspense>} />
        <Route path="analytics"     element={<Suspense fallback={<DashboardLoader />}><Analytics /></Suspense>} />
        <Route path="about"         element={<Suspense fallback={<DashboardLoader />}><About /></Suspense>} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
