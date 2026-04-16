import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { Resend } from 'resend'

const app = express()
const PORT = process.env.PORT || 5000
const resend = new Resend(process.env.RESEND_API_KEY)
const DEFAULT_FROM = 'SolarNexa Contact <onboarding@resend.dev>'
const DEFAULT_TEST_TO = 'chakravarthi1597@gmail.com'

app.use(cors())
app.use(express.json())

// ─── Mock Data ────────────────────────────────────────────────────────────────

const installations = [
  {
    id: 1,
    name: 'Greenfield Rooftop',
    location: 'Chennai',
    type: 'Solar Tree',
    capacity_kw: 10.5,
    status: 'online',
    energy_today_kwh: 42.3,
    energy_month_kwh: 1020.5,
    co2_offset_kg: 30.5,
    installed_date: '2023-06-10',
    last_service: '2024-11-20',
    client: 'GreenBuild Properties',
    lat: 13.0827,
    lng: 80.2707,
  },
  {
    id: 2,
    name: 'Sunridge Villa',
    location: 'Bengaluru',
    type: 'Solar EV Station',
    capacity_kw: 6.0,
    status: 'online',
    energy_today_kwh: 23.1,
    energy_month_kwh: 540.8,
    co2_offset_kg: 16.6,
    installed_date: '2023-09-15',
    last_service: '2025-01-05',
    client: 'Sunridge Estates',
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: 3,
    name: 'TechPark Block C',
    location: 'Hyderabad',
    type: 'Solar Tree',
    capacity_kw: 50.0,
    status: 'online',
    energy_today_kwh: 187.6,
    energy_month_kwh: 4500.0,
    co2_offset_kg: 135.1,
    installed_date: '2022-12-01',
    last_service: '2025-02-14',
    client: 'Cyberabad Dev Auth.',
    lat: 17.385,
    lng: 78.4867,
  },
  {
    id: 4,
    name: 'Coastal Farm Array',
    location: 'Vizag',
    type: 'Solar Tree',
    capacity_kw: 25.0,
    status: 'offline',
    energy_today_kwh: 0,
    energy_month_kwh: 280.0,
    co2_offset_kg: 0,
    installed_date: '2023-03-20',
    last_service: '2024-08-30',
    client: 'AgriSol Farms',
    lat: 17.6868,
    lng: 83.2185,
  },
  {
    id: 5,
    name: 'Heritage Bungalow',
    location: 'Mysuru',
    type: 'Solar EV Station',
    capacity_kw: 4.2,
    status: 'online',
    energy_today_kwh: 15.4,
    energy_month_kwh: 370.2,
    co2_offset_kg: 11.1,
    installed_date: '2024-01-18',
    last_service: '2025-03-01',
    client: 'Heritage Stays Ltd.',
    lat: 12.2958,
    lng: 76.6394,
  },
  {
    id: 6,
    name: 'EcoMall Parking',
    location: 'Pune',
    type: 'Solar EV Station',
    capacity_kw: 30.0,
    status: 'maintenance',
    energy_today_kwh: 11.2,
    energy_month_kwh: 620.0,
    co2_offset_kg: 8.1,
    installed_date: '2024-04-05',
    last_service: '2025-04-01',
    client: 'EcoMall Pvt. Ltd.',
    lat: 18.5204,
    lng: 73.8567,
  },
]

// Weekly energy data (kWh per day for the last 7 days)
const weeklyEnergy = [
  { day: 'Mon', energy: 198.4, target: 220 },
  { day: 'Tue', energy: 215.2, target: 220 },
  { day: 'Wed', energy: 187.9, target: 220 },
  { day: 'Thu', energy: 234.1, target: 220 },
  { day: 'Fri', energy: 221.6, target: 220 },
  { day: 'Sat', energy: 209.3, target: 220 },
  { day: 'Sun', energy: 279.6, target: 220 },
]

// Monthly energy data (kWh per month for last 6 months)
const monthlyEnergy = [
  { month: 'Nov', energy: 5820, co2: 4190 },
  { month: 'Dec', energy: 5120, co2: 3686 },
  { month: 'Jan', energy: 6340, co2: 4565 },
  { month: 'Feb', energy: 5980, co2: 4306 },
  { month: 'Mar', energy: 6870, co2: 4946 },
  { month: 'Apr', energy: 4200, co2: 3024 },
]

// Energy by installation type
const energyByType = [
  { type: 'Solar Tree', value: 72 },
  { type: 'Solar EV Station', value: 28 },
]

const alerts = [
  { id: 1, installation_id: 4, installation: 'Coastal Farm Array', type: 'offline', message: 'Installation went offline. Last ping: 2h ago.', severity: 'critical', ts: '2025-04-12T07:14:00Z' },
  { id: 2, installation_id: 6, installation: 'EcoMall Parking', type: 'maintenance', message: 'Scheduled maintenance in progress.', severity: 'warning', ts: '2025-04-12T06:00:00Z' },
  { id: 3, installation_id: 3, installation: 'TechPark Block C', type: 'performance', message: 'Energy output 12% above monthly average.', severity: 'info', ts: '2025-04-11T18:30:00Z' },
  { id: 4, installation_id: 1, installation: 'Greenfield Rooftop', type: 'performance', message: 'Battery storage at 94% capacity.', severity: 'info', ts: '2025-04-11T15:00:00Z' },
]

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'solarnexa-api', ts: new Date().toISOString() })
})

app.get('/api/installations', (_req, res) => {
  res.json({ data: installations, total: installations.length })
})

app.get('/api/installations/:id', (req, res) => {
  const site = installations.find(i => i.id === Number(req.params.id))
  if (!site) return res.status(404).json({ error: 'Not found' })
  res.json({ data: site })
})

app.get('/api/analytics/weekly', (_req, res) => {
  res.json({ data: weeklyEnergy })
})

app.get('/api/analytics/monthly', (_req, res) => {
  res.json({ data: monthlyEnergy })
})

app.get('/api/analytics/by-type', (_req, res) => {
  res.json({ data: energyByType })
})

app.get('/api/alerts', (_req, res) => {
  res.json({ data: alerts, total: alerts.length })
})

// ─── Contact form ─────────────────────────────────────────────────────────────
// POST /api/contact  { name, org, usecase, message, email }
app.post('/api/contact', async (req, res) => {
  const { name, org, usecase, message, email } = req.body ?? {}

  if (!name || !message) {
    return res.status(400).json({ error: 'name and message are required' })
  }

  // If no API key set yet (e.g. local dev), just log and return success
  if (!process.env.RESEND_API_KEY) {
    console.log('[contact] No RESEND_API_KEY — logging submission:', { name, org, usecase, message, email })
    return res.json({ ok: true, note: 'logged (no API key)' })
  }

  const configuredFrom = (process.env.CONTACT_FROM_EMAIL || '').trim()
  const normalizedFrom = configuredFrom.toLowerCase()
  const from = !configuredFrom || normalizedFrom.includes('@gmail.com')
    ? DEFAULT_FROM
    : configuredFrom
  const primaryTo = (process.env.CONTACT_TO_EMAIL || '').trim() || DEFAULT_TEST_TO
  const testTo = (process.env.RESEND_TEST_TO_EMAIL || '').trim() || DEFAULT_TEST_TO

  try {
    await resend.emails.send({
      from,
      to: [primaryTo],
      reply_to: email || undefined,
      subject: `New inquiry from ${name}${org ? ` — ${org}` : ''}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px">
          <h2 style="color:#D93B2B;margin-bottom:4px">SolarNexa — New Inquiry</h2>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p><strong>Name:</strong> ${name}</p>
          ${org ? `<p><strong>Organisation:</strong> ${org}</p>` : ''}
          ${usecase ? `<p><strong>Use case:</strong> ${usecase}</p>` : ''}
          ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p style="white-space:pre-wrap">${message}</p>
        </div>
      `,
    })
    res.json({ ok: true })
  } catch (err) {
    console.error('[contact] Resend error:', err)
    const detail = err?.message || err?.name || 'Unexpected provider error'
    const testingRecipientBlocked = String(detail).toLowerCase().includes('you can only send testing emails to your own email address')

    if (testingRecipientBlocked && primaryTo.toLowerCase() !== testTo.toLowerCase()) {
      try {
        await resend.emails.send({
          from: DEFAULT_FROM,
          to: [testTo],
          reply_to: email || undefined,
          subject: `[TEST MODE] New inquiry from ${name}${org ? ` — ${org}` : ''}`,
          html: `
            <div style="font-family:sans-serif;max-width:560px">
              <h2 style="color:#D93B2B;margin-bottom:4px">SolarNexa — New Inquiry (Test Mode Fallback)</h2>
              <p><strong>Original intended recipient:</strong> ${primaryTo}</p>
              <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
              <p><strong>Name:</strong> ${name}</p>
              ${org ? `<p><strong>Organisation:</strong> ${org}</p>` : ''}
              ${usecase ? `<p><strong>Use case:</strong> ${usecase}</p>` : ''}
              ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
              <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
              <p style="white-space:pre-wrap">${message}</p>
            </div>
          `,
        })
        return res.json({ ok: true, note: `Delivered to test recipient ${testTo} due to Resend testing restrictions` })
      } catch (retryErr) {
        console.error('[contact] Resend fallback retry failed:', retryErr)
      }
    }

    res.status(500).json({ error: `Failed to send — ${detail}` })
  }
})

// ─── Error Handlers ───────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

// Local dev only — Vercel ignores this and uses the export below
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`SolarNexa API running on http://localhost:${PORT}`)
  })
}

export default app
