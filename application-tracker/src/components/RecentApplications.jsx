import StatusBadge from './StatusBadge'
import { formatShortDate } from '../utils/dates'

export default function RecentApplications({ applications, onOpen, onViewAll }) {
  return (
    <div>
      <h2 className="section-title">Recent Applications</h2>
      <section className="panel">
        {applications.length === 0 ? (
          <p className="empty">No applications yet. Add the first role you want to track.</p>
        ) : (
          <div className="table-scroll compact">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Company / Role</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td className="company-cell">
                      {application.company} <span>/ {application.title}</span>
                    </td>
                    <td>{formatShortDate(application.dateApplied)}</td>
                    <td>
                      <StatusBadge status={application.status} />
                    </td>
                    <td>
                      <button type="button" className="link-button" onClick={() => onOpen(application.id)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="panel-footer">
          <button type="button" className="link-button" onClick={onViewAll}>
            View all applications →
          </button>
        </div>
      </section>
    </div>
  )
}
