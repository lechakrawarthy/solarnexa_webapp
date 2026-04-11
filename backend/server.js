import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }))
app.use(express.json())

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'solarnexa-api', ts: new Date().toISOString() })
})

// Mock installations data
const installations = [
  { id: 1, name: 'Greenfield Rooftop', location: 'Chennai', capacity_kw: 10.5, status: 'online', energy_today_kwh: 42.3 },
  { id: 2, name: 'Sunridge Villa', location: 'Bengaluru', capacity_kw: 6.0, status: 'online', energy_today_kwh: 23.1 },
  { id: 3, name: 'TechPark Block C', location: 'Hyderabad', capacity_kw: 50.0, status: 'online', energy_today_kwh: 187.6 },
  { id: 4, name: 'Coastal Farm Array', location: 'Vizag', capacity_kw: 25.0, status: 'offline', energy_today_kwh: 0 },
  { id: 5, name: 'Heritage Bungalow', location: 'Mysuru', capacity_kw: 4.2, status: 'online', energy_today_kwh: 15.4 },
]

// Installations
app.get('/api/installations', (_req, res) => {
  res.json({ data: installations, total: installations.length })
})

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`SolarNexa API running on http://localhost:${PORT}`)
})
