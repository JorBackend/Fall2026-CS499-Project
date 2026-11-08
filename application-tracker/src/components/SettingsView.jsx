import PageHeader from './PageHeader'

export default function SettingsView({ settings, applicationCount, eventCount, onChange, onReset }) {
  const name = settings.displayName.trim() || 'You'

  return (
    <>
      <PageHeader title="Settings" subtitle="Choose how this tracker presents your search." />
      <div className="settings-grid">
        <section className="panel section-card settings-card">
          <h2>Profile and reminders</h2>
          <label htmlFor="display-name">
            Display name
            <input
              id="display-name"
              value={settings.displayName}
              maxLength={40}
              onChange={(event) => onChange({ displayName: event.target.value })}
            />
          </label>
          <p className="field-help">
            The top bar currently shows <strong>{name}</strong>.
          </p>

          <div className="toggle-row">
            <div>
              <p className="toggle-title">Email reminder badges</p>
              <p className="field-help">Mark interviews and follow-ups that fall inside your lead time.</p>
            </div>
            <button
              type="button"
              className={settings.emailReminders ? 'switch on' : 'switch'}
              role="switch"
              aria-checked={settings.emailReminders}
              aria-label="Email reminder badges"
              onClick={() => onChange({ emailReminders: !settings.emailReminders })}
            >
              <span />
            </button>
          </div>

          <label htmlFor="lead-days">
            Reminder lead time
            <select
              id="lead-days"
              value={settings.reminderLeadDays}
              disabled={!settings.emailReminders}
              onChange={(event) => onChange({ reminderLeadDays: Number(event.target.value) })}
            >
              <option value={0}>Same day</option>
              <option value={1}>1 day before</option>
              <option value={2}>2 days before</option>
              <option value={3}>3 days before</option>
            </select>
          </label>

          <div className="toggle-row">
            <div>
              <p className="toggle-title">Show rejected and withdrawn</p>
              <p className="field-help">Hidden roles stay saved, but they leave the dashboard and lists.</p>
            </div>
            <button
              type="button"
              className={settings.showClosedApplications ? 'switch on' : 'switch'}
              role="switch"
              aria-checked={settings.showClosedApplications}
              aria-label="Show rejected and withdrawn applications"
              onClick={() => onChange({ showClosedApplications: !settings.showClosedApplications })}
            >
              <span />
            </button>
          </div>
        </section>

        <aside className="panel section-card preview-card">
          <p className="stat-label">Session preview</p>
          <p className="preview-name">{name}</p>
          <p>
            {settings.emailReminders
              ? `Reminders are on, ${settings.reminderLeadDays} day${Number(settings.reminderLeadDays) === 1 ? '' : 's'} ahead.`
              : 'Reminders are off, so due-soon badges stay hidden.'}
          </p>
          <p>
            {settings.showClosedApplications
              ? 'Rejected and withdrawn applications are visible.'
              : 'Rejected and withdrawn applications are hidden.'}
          </p>
          <p className="preview-count">
            Tracking {applicationCount} applications and {eventCount} events.
          </p>
          <button type="button" className="btn-secondary" onClick={onReset}>
            Restore sample data
          </button>
          <p className="field-help">Sample data lives in this browser session. A refresh brings the original set back.</p>
        </aside>
      </div>
    </>
  )
}
