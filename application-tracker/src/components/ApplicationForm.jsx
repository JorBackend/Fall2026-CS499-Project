import { useId, useState } from 'react'
import { EMPLOYMENT_TYPES, STATUSES } from '../data/mockData'

function toForm(initial) {
  return {
    id: initial.id,
    company: initial.company ?? '',
    title: initial.title ?? '',
    location: initial.location ?? '',
    url: initial.url ?? '',
    employmentType: initial.employmentType ?? 'Internship',
    dateApplied: initial.dateApplied ?? '',
    status: initial.status ?? 'Applied',
    notes: initial.notes ?? '',
  }
}

export default function ApplicationForm({ initial, onSubmit, onCancel }) {
  const formId = useId()
  const [form, setForm] = useState(() => toForm(initial))
  const [error, setError] = useState('')

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.company.trim() || !form.title.trim()) {
      setError('Company and role are required.')
      return
    }
    setError('')
    onSubmit({
      ...form,
      company: form.company.trim(),
      title: form.title.trim(),
      location: form.location.trim(),
      url: form.url.trim(),
      notes: form.notes.trim(),
    })
  }

  return (
    <form className="modal-body" onSubmit={handleSubmit}>
      <p className="form-intro">Save the company, role, and where this application stands.</p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="form-grid">
        <label htmlFor={`${formId}-company`}>
          Company
          <input
            id={`${formId}-company`}
            value={form.company}
            onChange={(event) => update('company', event.target.value)}
            maxLength={80}
            required
            autoComplete="off"
          />
        </label>
        <label htmlFor={`${formId}-title`}>
          Role
          <input
            id={`${formId}-title`}
            value={form.title}
            onChange={(event) => update('title', event.target.value)}
            maxLength={80}
            required
            autoComplete="off"
          />
        </label>
        <label htmlFor={`${formId}-location`}>
          Location
          <input
            id={`${formId}-location`}
            value={form.location}
            onChange={(event) => update('location', event.target.value)}
            maxLength={80}
            autoComplete="off"
          />
        </label>
        <label htmlFor={`${formId}-type`}>
          Employment type
          <select
            id={`${formId}-type`}
            value={form.employmentType}
            onChange={(event) => update('employmentType', event.target.value)}
          >
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="wide" htmlFor={`${formId}-url`}>
          Job posting URL
          <input
            id={`${formId}-url`}
            value={form.url}
            onChange={(event) => update('url', event.target.value)}
            placeholder="https://example.com/jobs/role"
            autoComplete="off"
          />
        </label>
        <label htmlFor={`${formId}-date`}>
          Date applied
          <input
            id={`${formId}-date`}
            type="date"
            value={form.dateApplied}
            onChange={(event) => update('dateApplied', event.target.value)}
            required
          />
        </label>
        <label htmlFor={`${formId}-status`}>
          Status
          <select id={`${formId}-status`} value={form.status} onChange={(event) => update('status', event.target.value)}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
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
        <button type="submit" className="btn-primary">
          {form.id ? 'Save changes' : 'Add application'}
        </button>
      </div>
    </form>
  )
}
