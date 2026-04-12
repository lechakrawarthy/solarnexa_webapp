import { Routes, Route } from 'react-router-dom'
import Landing       from './pages/Landing.jsx'
import AppShell      from './components/AppShell.jsx'
import Dashboard     from './pages/Dashboard.jsx'
import Installations from './pages/Installations.jsx'
import Analytics     from './pages/Analytics.jsx'
import About         from './pages/About.jsx'

export default function App() {
  return (
    <Routes>
      {/* Public landing */}
      <Route path="/" element={<Landing />} />

      {/* Dashboard shell */}
      <Route path="/app" element={<AppShell />}>
        <Route index          element={<Dashboard />} />
        <Route path="installations" element={<Installations />} />
        <Route path="analytics"     element={<Analytics />} />
        <Route path="about"         element={<About />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={
        <div style={{ textAlign: 'center', padding: '10rem 1rem', fontFamily: 'system-ui' }}>
          <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</p>
          <p style={{ color: '#666' }}>Page not found.</p>
          <a href="/" style={{ marginTop: '1rem', display: 'inline-block', color: '#1e40af' }}>← Back to home</a>
        </div>
      } />
    </Routes>
  )
}
