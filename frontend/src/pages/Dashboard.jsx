const stats = [
  { label: 'Total Energy Generated', value: '142.6 kWh', sub: 'Today' },
  { label: 'Active Installations', value: '8', sub: 'of 10 online' },
  { label: 'CO₂ Offset', value: '98.4 kg', sub: 'This month' },
  { label: 'Revenue', value: '₹4,320', sub: 'This month' },
]

export default function Dashboard() {
  return (
    <section aria-labelledby="dashboard-heading">
      <h1 id="dashboard-heading" className="text-2xl font-bold text-gray-800 mb-6">
        Overview
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub }) => (
          <div
            key={label}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
          >
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-3xl font-bold text-nexa-800">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
