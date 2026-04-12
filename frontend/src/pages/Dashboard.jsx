import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Dashboard() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get('/api/installations')
      .then(({ data: res }) => setData(res.data ?? []))
      .catch(() => setError('Could not load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  const totalEnergy = data.reduce((s, i) => s + i.energy_today_kwh, 0)
  const activeCount = data.filter(i => i.status === 'online').length

  const stats = [
    { label: 'Total Energy Generated', value: `${totalEnergy.toFixed(1)} kWh`,                                    sub: 'Today' },
    { label: 'Active Installations',   value: `${activeCount}`,                                                    sub: `of ${data.length} online` },
    { label: 'CO₂ Offset',             value: `${(totalEnergy * 0.72).toFixed(1)} kg`,                            sub: 'Today' },
    { label: 'Revenue',                value: `₹${Math.round(totalEnergy * 8).toLocaleString('en-IN')}`,          sub: 'Today' },
  ]

  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>

  return (
    <section aria-labelledby="dashboard-heading">
      <h1 id="dashboard-heading" className="text-2xl font-bold text-gray-800 mb-6">
        Overview
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-3xl font-bold text-nexa-800">
              {loading ? <span className="animate-pulse text-gray-300">—</span> : value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{loading ? '' : sub}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
