import { useState } from 'react'
import { eventSchedule, formatLongDate, formatTime } from '../utils/dates'

export default function EventDetail({ event, application, today, onUpdate, onEdit, onDelete, onOpenApplication }) {
  const [notes, setNotes] = useState(event.notes)
  const [justSaved, setJustSaved] = useState(false)
  const unchanged = notes === event.notes

  return (
    <section className="panel section-card event-detail">
      <div className="event-detail-heading">
        <div>
          <p className="eyebrow">{event.type}</p>
          <h2>{event.title}</h2>
          <p>
            {formatLongDate(event.date)}
            {event.time ? ` · ${formatTime(event.time)}` : ' · All day'}
            {event.medium ? ` · ${event.medium}` : ''}
          </p>
        </div>
        <p className="event-schedule">{eventSchedule(event, today)}</p>
      </div>

      <div className="event-detail-grid">
        <label htmlFor="event-status">
          Status
          <select
            id="event-status"
            value={event.completed ? 'completed' : 'scheduled'}
            onChange={(change) => onUpdate(event.id, { completed: change.target.value === 'completed' })}
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <div>
          <p className="stat-label">Application</p>
          {application ? (
            <button type="button" className="link-button" onClick={() => onOpenApplication(application.id)}>
              {application.company} / {application.title}
            </button>
          ) : (
            <p>This application was removed.</p>
          )}
        </div>
        <label className="wide" htmlFor="event-notes">
          Notes
          <textarea
            id="event-notes"
            value={notes}
            maxLength={2000}
            onChange={(change) => {
              setNotes(change.target.value)
              setJustSaved(false)
            }}
          />
        </label>
      </div>

      <div className="inline-actions">
        <button
          type="button"
          className="btn-secondary"
          disabled={unchanged}
          onClick={() => {
            onUpdate(event.id, { notes: notes.trim() })
            setNotes(notes.trim())
            setJustSaved(true)
          }}
        >
          {justSaved && unchanged ? 'Saved' : 'Save notes'}
        </button>
        <button type="button" className="btn-secondary" onClick={onEdit}>
          Edit event
        </button>
        <button type="button" className="btn-danger" onClick={onDelete}>
          Delete event
        </button>
      </div>
    </section>
  )
}
