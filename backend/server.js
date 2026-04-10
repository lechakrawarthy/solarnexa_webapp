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

// Placeholder: installations
app.get('/api/installations', (_req, res) => {
  res.json({ data: [], message: 'Installations endpoint — coming soon' })
})

app.listen(PORT, () => {
  console.log(`SolarNexa API running on http://localhost:${PORT}`)
})
