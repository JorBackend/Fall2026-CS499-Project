import { useMemo, useState } from 'react'
import { STATUSES } from '../data/mockData'
import { formatShortDate } from '../utils/dates'
import PageHeader from './PageHeader'
import StatusBadge from './StatusBadge'

const STATUS_RANK = Object.fromEntries(STATUSES.map((status, index) => [status, index]))

export default function ApplicationsView({ applications, onAdd, onOpen, onEdit, onDelete }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sort, setSort] = useState('newest')

  const counts = useMemo(() => {
    const tally = { All: applications.length }
    STATUSES.forEach((status) => {
      tally[status] = applications.filter((application) => application.status === status).length
    })
    return tally
  }, [applications])

  const visible = applications
    .filter((application) => {
      const haystack = `${application.company} ${application.title} ${application.location} ${application.status}`.toLowerCase()
      const matchesQuery = haystack.includes(query.trim().toLowerCase())
      const matchesStatus = statusFilter === 'All' || application.status === statusFilter
      return matchesQuery && matchesStatus
    })
    .sort((a, b) => {
      if (sort === 'oldest') return a.dateApplied.localeCompare(b.dateApplied)
      if (sort === 'company') return a.company.localeCompare(b.company) || a.title.localeCompare(b.title)
      if (sort === 'status') return STATUS_RANK[a.status] - STATUS_RANK[b.status]
      return b.dateApplied.localeCompare(a.dateApplied)
    })

  const filtersActive = query.trim() !== '' || statusFilter !== 'All' || sort !== 'newest'

  return (
    <>
      <PageHeader
        title="Applications"
        subtitle="Search, filter, and update every role in your search."
        action={
          <button type="button" className="btn-primary" onClick={onAdd}>
            + Add Application
          </button>
        }
      />

      <div className="toolbar">
        <input
          className="search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by company, role, or location"
          aria-label="Search applications"
        />
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort applications">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="company">Company A-Z</option>
          <option value="status">Status</option>
        </select>
      </div>

      <div className="chip-row" role="radiogroup" aria-label="Filter by status">
        {['All', ...STATUSES].map((status) => (
          <button
            key={status}
            type="button"
            role="radio"
            aria-checked={statusFilter === status}
            className={statusFilter === status ? 'chip active' : 'chip'}
            onClick={() => setStatusFilter(status)}
          >
            {status}
            <span>{counts[status]}</span>
          </button>
        ))}
      </div>

      <p className="result-count" role="status">
        Showing {visible.length} of {applications.length} applications
      </p>

      <section className="panel">
        {applications.length === 0 ? (
          <div className="empty-panel">
            <h2>No applications to show</h2>
            <p>Add a role you want to track, or turn closed applications back on in Settings.</p>
            <button type="button" className="btn-primary" onClick={onAdd}>
              + Add Application
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="empty-panel">
            <h2>No matching applications</h2>
            <p>Try a different company, role, or status.</p>
            {filtersActive && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setQuery('')
                  setStatusFilter('All')
                  setSort('newest')
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="table-scroll wide">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Company / Role</th>
                  <th scope="col">Location</th>
                  <th scope="col">Type</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((application) => (
                  <tr
                    key={application.id}
                    className="clickable-row"
                    tabIndex={0}
                    onClick={() => onOpen(application.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onOpen(application.id)
                      }
                    }}
                  >
                    <td className="company-cell">
                      {application.company} <span>/ {application.title}</span>
                    </td>
                    <td>{application.location || '—'}</td>
                    <td>{application.employmentType}</td>
                    <td>{formatShortDate(application.dateApplied)}</td>
                    <td>
                      <StatusBadge status={application.status} />
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="link-button"
                          onClick={(event) => {
                            event.stopPropagation()
                            onOpen(application.id)
                          }}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="btn-ghost"
                          onClick={(event) => {
                            event.stopPropagation()
                            onEdit(application)
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-ghost danger"
                          onClick={(event) => {
                            event.stopPropagation()
                            onDelete(application)
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
