import { FOLLOW_UP_TYPES } from '../data/mockData'
import { eventDateTime, isUpcoming } from '../utils/dates'
import PageHeader from './PageHeader'
import RecentApplications from './RecentApplications'
import StatCard from './StatCard'
import UpcomingPanel from './UpcomingPanel'

export default function Dashboard({
  applications,
  events,
  today,
  settings,
  onAdd,
  onOpenApplication,
  onOpenAll,
  onOpenEvent,
}) {
  const recent = [...applications]
    .sort((a, b) => b.dateApplied.localeCompare(a.dateApplied))
    .slice(0, 4)
  const upcoming = events
    .filter((event) => isUpcoming(event, today))
    .sort((a, b) => eventDateTime(a) - eventDateTime(b))
    .slice(0, 3)
  const followUpCount = events.filter(
    (event) => FOLLOW_UP_TYPES.includes(event.type) && isUpcoming(event, today),
  ).length

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="A quick overview of your job search."
        action={
          <button type="button" className="btn-primary" onClick={onAdd}>
            + Add Application
          </button>
        }
      />
      <section className="stat-grid cols-4" aria-label="Application summary">
        <StatCard tone="blue" label="Total Applications" value={applications.length} />
        <StatCard
          tone="green"
          label="Interviews"
          value={applications.filter((application) => application.status === 'Interviewing').length}
        />
        <StatCard
          tone="orange"
          label="Offers"
          value={applications.filter((application) => application.status === 'Offer').length}
        />
        <StatCard tone="purple" label={'Upcoming Follow\u2011ups'} value={followUpCount} />
      </section>
      <div className="split">
        <RecentApplications applications={recent} onOpen={onOpenApplication} onViewAll={onOpenAll} />
        <UpcomingPanel
          events={upcoming}
          applications={applications}
          today={today}
          settings={settings}
          onOpenEvent={onOpenEvent}
        />
      </div>
    </>
  )
}
