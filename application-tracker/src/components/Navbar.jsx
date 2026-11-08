const LINKS = [
  ['dashboard', 'Dashboard'],
  ['applications', 'Applications'],
  ['calendar', 'Calendar'],
  ['settings', 'Settings'],
]

export default function Navbar({ activeView, displayName, onNavigate }) {
  const active = activeView === 'details' ? 'applications' : activeView
  const name = displayName.trim() || 'You'

  return (
    <header className="navbar">
      <button type="button" className="brand" onClick={() => onNavigate('dashboard')}>
        Job Application Tracker
      </button>
      <div className="nav-right">
        <span className="nav-user">{name}</span>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={active === id ? 'active' : undefined}
              aria-current={active === id ? 'page' : undefined}
              onClick={() => onNavigate(id)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
