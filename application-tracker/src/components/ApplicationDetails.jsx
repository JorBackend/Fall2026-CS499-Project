import { useState } from 'react'
import { STATUSES } from '../data/mockData'
import { eventSchedule, formatLongDate, formatShortDate, normalizeUrl } from '../utils/dates'
import StatusBadge from './StatusBadge'

const RETURN_LABELS = {
  dashboard: 'dashboard',
  applications: 'applications',
  calendar: 'calendar',
  settings: 'settings',
}

export default function ApplicationDetails({
  application,
  events,
  today,
  returnLabel,
  onBack,
  onStatus,
  onSaveNotes,
  onEdit,
  onDelete,
  onAddEvent,
  onScheduleFollowUp,
  onUpdateEvent,
  onOpenEvent,
}) {
  const [notes, setNotes] = useState(application.notes)
  const [justSaved, setJustSaved] = useState(false)
  const [followUpDate, setFollowUpDate] = useState('')
  const unchanged = notes === application.notes
  const posting = normalizeUrl(application.url)
  const related = [...events].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))

  return (
    <>
      <button type="button" className="back-button" onClick={onBack}>
        ← Back to {RETURN_LABELS[returnLabel] ?? 'applications'}
      </button>
      <div className="details-heading">
        <div>
          <h1>{application.company}</h1>
          <p>
            {application.title}
            {application.location ? ` · ${application.location}` : ''}
          </p>
          <p className="meta">Updated {formatLongDate(application.updatedAt.slice(0, 10))}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <section className="info-grid">
        <article className="info-tile">
          <p>Location</p>
          <strong>{application.location || 'Not set'}</strong>
        </article>
        <article className="info-tile">
          <p>Employment type</p>
          <strong>{application.employmentType}</strong>
        </article>
        <article className="info-tile">
          <p>Date applied</p>
          <strong>{application.dateApplied ? formatShortDate(application.dateApplied) : 'Not set'}</strong>
        </article>
        <article className="info-tile">
          <p>Job posting</p>
          {posting ? (
            <a href={posting} target="_blank" rel="noreferrer">
              View posting
            </a>
          ) : (
            <strong>Not added</strong>
          )}
        </article>
      </section>

      <div className="details-layout">
        <div className="stack-lg">
          <section className="panel section-card">
            <h2>Interview notes</h2>
            <label className="wide-label" htmlFor="application-notes">
              Notes about conversations, preparation, and next steps
              <textarea
                id="application-notes"
                value={notes}
                maxLength={2000}
                onChange={(event) => {
                  setNotes(event.target.value)
                  setJustSaved(false)
                }}
              />
            </label>
            <div className="inline-actions">
              <button
                type="button"
                className="btn-secondary"
                disabled={unchanged}
                onClick={() => {
                  onSaveNotes(notes.trim())
                  setNotes(notes.trim())
                  setJustSaved(true)
                }}
              >
                {justSaved && unchanged ? 'Saved' : 'Save notes'}
              </button>
            </div>
          </section>

          <section className="panel section-card">
            <div className="panel-header in-card">
              <h2>Interviews and follow-ups</h2>
              <button type="button" className="link-button" onClick={onAddEvent}>
                Add event
              </button>
            </div>
            {related.length === 0 ? (
              <p className="empty">No interviews or follow-ups yet.</p>
            ) : (
              <ul className="related-list">
                {related.map((event) => (
                  <li key={event.id} className={event.completed ? 'is-complete' : undefined}>
                    <div>
                      <button type="button" className="link-button" onClick={() => onOpenEvent(event.id)}>
                        {event.title}
                      </button>
                      <p>
                        {eventSchedule(event, today)} · {event.medium || event.type}
                        {event.completed ? ' · Completed' : ''}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => onUpdateEvent(event.id, { completed: !event.completed })}
                    >
                      {event.completed ? 'Reopen' : 'Mark complete'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="panel section-card details-side">
          <label htmlFor="detail-status">
            Status
            <select id="detail-status" value={application.status} onChange={(event) => onStatus(event.target.value)}>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <p className="field-help">Changing the status updates the dashboard totals immediately.</p>

          <label htmlFor="follow-up-date">
            Follow-up date
            <input
              id="follow-up-date"
              type="date"
              value={followUpDate}
              onChange={(event) => setFollowUpDate(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="btn-secondary"
            disabled={!followUpDate}
            onClick={() => {
              onScheduleFollowUp(followUpDate)
              setFollowUpDate('')
            }}
          >
            Schedule follow-up
          </button>

          <button type="button" className="btn-primary" onClick={onEdit}>
            Edit application
          </button>
          <button type="button" className="btn-danger" onClick={onDelete}>
            Delete application
          </button>
        </aside>
      </div>
    </>
  )
}
