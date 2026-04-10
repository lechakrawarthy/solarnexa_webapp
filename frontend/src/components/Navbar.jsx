import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/installations', label: 'Installations' },
]

export default function Navbar() {
  return (
    <nav className="bg-nexa-800 text-white shadow-md" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <span className="text-solar-400 font-bold text-xl tracking-tight">
          ☀️ SolarNexa
        </span>
        <ul className="flex gap-6">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  isActive
                    ? 'text-solar-400 font-semibold underline underline-offset-4'
                    : 'text-gray-200 hover:text-solar-300 transition-colors'
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
