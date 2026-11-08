import { useId, useState } from 'react'
import { EVENT_MEDIUMS, EVENT_TYPES } from '../data/mockData'

function toForm(initial) {
  return {
    id: initial.id,
    applicationId: initial.applicationId ?? '',
    type: initial.type ?? 'Interview',
    title: initial.title ?? '',
    date: initial.date ?? '',
    time: initial.time ?? '',
    medium: initial.medium ?? 'Video call',
    notes: initial.notes ?? '',
    completed: Boolean(initial.completed),
  }
}

export default function EventForm({ initial, applications, onSubmit, onCancel }) {
  const formId = useId()
  const [form, setForm] = useState(() => toForm(initial))
  const [error, setError] = useState('')
  const options = [...applications].sort((a, b) => a.company.localeCompare(b.company))

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.title.trim() || !form.date || !form.applicationId) {
      setError('Title, date, and a related application are required.')
      return
    }
    setError('')
    onSubmit({
      ...form,
      applicationId: Number(form.applicationId),
      title: form.title.trim(),
      notes: form.notes.trim(),
      completed: Boolean(form.completed),
    })
  }

  return (
    <form className="modal-body" onSubmit={handleSubmit}>
      <p className="form-intro">Attach an interview, call, or follow-up to an application.</p>
      {applications.length === 0 && (
        <p className="form-error" role="alert">
          Add an application before scheduling an event.
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-grid">
        <label className="wide" htmlFor={`${formId}-title`}>
          Title
          <input
            id={`${formId}-title`}
            value={form.title}
            onChange={(event) => update('title', event.target.value)}
            maxLength={80}
            required
            autoComplete="off"
          />
        </label>
        <label htmlFor={`${formId}-application`}>
          Application
          <select
            id={`${formId}-application`}
            value={String(form.applicationId)}
            onChange={(event) => update('applicationId', event.target.value)}
            required
          >
            <option value="">Select an application</option>
            {options.map((application) => (
              <option key={application.id} value={application.id}>
                {application.company} / {application.title}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={`${formId}-type`}>
          Type
          <select id={`${formId}-type`} value={form.type} onChange={(event) => update('type', event.target.value)}>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={`${formId}-date`}>
          Date
          <input
            id={`${formId}-date`}
            type="date"
            value={form.date}
            onChange={(event) => update('date', event.target.value)}
            required
          />
        </label>
        <label htmlFor={`${formId}-time`}>
          Time
          <input id={`${formId}-time`} type="time" value={form.time} onChange={(event) => update('time', event.target.value)} />
        </label>
        <label htmlFor={`${formId}-medium`}>
          Where
          <select id={`${formId}-medium`} value={form.medium} onChange={(event) => update('medium', event.target.value)}>
            {EVENT_MEDIUMS.map((medium) => (
              <option key={medium} value={medium}>
                {medium}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={`${formId}-status`}>
          Status
          <select
            id={`${formId}-status`}
            value={form.completed ? 'completed' : 'scheduled'}
            onChange={(event) => update('completed', event.target.value === 'completed')}
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label className="wide" htmlFor={`${formId}-notes`}>
          Notes
          <textarea
            id={`${formId}-notes`}
            value={form.notes}
            onChange={(event) => update('notes', event.target.value)}
            maxLength={2000}
          />
        </label>
      </div>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={applications.length === 0}>
          {form.id ? 'Save changes' : 'Add event'}
        </button>
      </div>
    </form>
  )
}
