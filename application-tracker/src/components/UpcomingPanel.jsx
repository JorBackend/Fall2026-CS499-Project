import { eventSchedule, isDueSoon } from '../utils/dates'

export default function UpcomingPanel({ events, applications, today, settings, onOpenEvent }) {
  return (
    <div>
      <h2 className="section-title">Upcoming</h2>
      <section className="panel upcoming-panel">
        {events.length === 0 ? (
          <p className="empty">No upcoming interviews or follow-ups. You are caught up.</p>
        ) : (
          <div className="upcoming-list">
            {events.map((event) => {
              const application = applications.find((item) => item.id === event.applicationId)
              const dueSoon = settings.emailReminders && isDueSoon(event, today, settings.reminderLeadDays)
              return (
                <button key={event.id} type="button" className="upcoming-item" onClick={() => onOpenEvent(event.id)}>
                  <span className="upcoming-title">
                    {event.title}
                    {dueSoon && <span className="badge-soon">Due soon</span>}
                  </span>
                  <span className="upcoming-meta">
                    {eventSchedule(event, today)}
                    {application ? ` · ${application.company}` : ''}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
