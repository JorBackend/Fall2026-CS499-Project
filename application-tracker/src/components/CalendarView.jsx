import { useEffect, useRef, useState } from 'react'
import { FOLLOW_UP_TYPES, INTERVIEW_TYPES } from '../data/mockData'
import {
  buildMonthGrid,
  eventDateTime,
  eventSchedule,
  formatLongDate,
  formatMonthBadge,
  formatMonthYear,
  formatShortDate,
  formatTime,
  isDueSoon,
  isSameMonth,
  isSameWeek,
  isUpcoming,
  nextEventDetail,
  parseISODate,
  shiftMonth,
  startOfMonth,
  toISODate,
  typeSlug,
} from '../utils/dates'
import EventDetail from './EventDetail'
import Icon from './Icon'
import PageHeader from './PageHeader'
import StatCard from './StatCard'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

export default function CalendarView({
  applications,
  events,
  today,
  settings,
  focusedEventId,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onUpdateEvent,
  onOpenApplication,
}) {
  const focusedEvent = events.find((event) => event.id === focusedEventId) ?? null
  const [cursor, setCursor] = useState(() =>
    focusedEvent ? startOfMonth(parseISODate(focusedEvent.date)) : startOfMonth(today),
  )
  const [selectedDate, setSelectedDate] = useState(() => focusedEvent?.date ?? toISODate(today))
  const [selectedEventId, setSelectedEventId] = useState(focusedEventId ?? null)
  const [mode, setMode] = useState('month')
  const [showAllEvents, setShowAllEvents] = useState(false)
  const [expandedDay, setExpandedDay] = useState(null)
  const detailRef = useRef(null)

  useEffect(() => {
    if (!selectedEventId) return
    detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [selectedEventId])

  const todayKey = toISODate(today)
  const interviewsThisWeek = events.filter(
    (event) => INTERVIEW_TYPES.includes(event.type) && isSameWeek(event.date, today),
  ).length
  const upcomingFollowUps = events.filter(
    (event) => FOLLOW_UP_TYPES.includes(event.type) && isUpcoming(event, today),
  ).length
  const nextEvent = events
    .filter((event) => isUpcoming(event, today))
    .sort((a, b) => eventDateTime(a) - eventDateTime(b))[0]
  const selectedEvent = events.find((event) => event.id === selectedEventId) ?? null
  const selectedApplication = selectedEvent
    ? applications.find((application) => application.id === selectedEvent.applicationId)
    : null
  const monthEvents = events
    .filter((event) => isSameMonth(parseISODate(event.date), cursor))
    .sort((a, b) => eventDateTime(a) - eventDateTime(b))
  const agenda = (showAllEvents ? [...events] : events.filter((event) => isUpcoming(event, today))).sort(
    (a, b) => eventDateTime(a) - eventDateTime(b),
  )
  const selectedDayEvents = events.filter((event) => event.date === selectedDate)

  function selectDay(date) {
    const iso = toISODate(date)
    setSelectedDate(iso)
    if (!isSameMonth(date, cursor)) setCursor(startOfMonth(date))
  }

  function selectEvent(event) {
    setSelectedEventId(event.id)
    setSelectedDate(event.date)
    setCursor(startOfMonth(parseISODate(event.date)))
  }

  return (
    <>
      <PageHeader
        title="Calendar"
        subtitle="Keep track of upcoming interviews, meetings, and follow-ups."
        action={
          <button type="button" className="btn-primary" onClick={() => onAddEvent(selectedDate)}>
            + Add event
          </button>
        }
      />

      <section className="stat-grid cols-3" aria-label="Calendar summary">
        <StatCard
          variant="soft"
          tone="blue"
          icon={<Icon name="calendar" />}
          label="Interviews this week"
          value={interviewsThisWeek}
        />
        <StatCard
          variant="soft"
          tone="green"
          icon={<Icon name="check" />}
          label="Upcoming follow-ups"
          value={upcomingFollowUps}
        />
        <StatCard
          variant="feature"
          tone="amber"
          icon={<Icon name="clock" />}
          label="Next event"
          value={nextEvent ? eventSchedule(nextEvent, today) : 'Nothing scheduled'}
          detail={nextEventDetail(nextEvent)}
        />
      </section>

      <div className="split calendar-split">
        <section className="panel calendar-panel">
          <div className="calendar-toolbar">
            <div className="month-switch">
              <button type="button" className="pill" onClick={() => setCursor(shiftMonth(cursor, -1))} aria-label="Previous month">
                ‹
              </button>
              <h2>{formatMonthYear(cursor)}</h2>
              <button type="button" className="pill" onClick={() => setCursor(shiftMonth(cursor, 1))} aria-label="Next month">
                ›
              </button>
            </div>
            <div className="calendar-controls">
              <button
                type="button"
                className="pill"
                onClick={() => {
                  setCursor(startOfMonth(today))
                  setSelectedDate(todayKey)
                }}
              >
                Today
              </button>
              <select className="pill select-pill" value={mode} onChange={(event) => setMode(event.target.value)} aria-label="Calendar view">
                <option value="month">Month</option>
                <option value="agenda">Agenda</option>
              </select>
            </div>
          </div>

          {mode === 'month' ? (
            <>
              <div className="weekday-row">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="weekday">
                    {day}
                  </div>
                ))}
              </div>
              <div className="calendar-grid">
                {buildMonthGrid(cursor).map((date) => {
                  const iso = toISODate(date)
                  const dayEvents = events.filter((event) => event.date === iso)
                  const limit = expandedDay === iso ? dayEvents.length : 2
                  const visibleEvents = dayEvents.slice(0, limit)
                  const hiddenCount = dayEvents.length - visibleEvents.length
                  return (
                    <div
                      key={iso}
                      className={cx(
                        'day-cell',
                        !isSameMonth(date, cursor) && 'outside',
                        iso === selectedDate && 'selected',
                      )}
                      onClick={() => selectDay(date)}
                    >
                      <span className={cx('day-number', iso === todayKey && 'today')}>{date.getDate()}</span>
                      {visibleEvents.map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          className={cx(
                            'event-pill',
                            `tone-${typeSlug(event.type)}`,
                            event.completed && 'done',
                            event.id === selectedEventId && 'selected',
                          )}
                          aria-pressed={event.id === selectedEventId}
                          onClick={(click) => {
                            click.stopPropagation()
                            selectEvent(event)
                          }}
                        >
                          {event.type}
                        </button>
                      ))}
                      {hiddenCount > 0 && (
                        <button
                          type="button"
                          className="more-events"
                          onClick={(click) => {
                            click.stopPropagation()
                            setExpandedDay(iso)
                            setSelectedDate(iso)
                          }}
                        >
                          +{hiddenCount} more
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="month-agenda">
              {monthEvents.length === 0 ? (
                <p className="empty">No events in {formatMonthYear(cursor)}.</p>
              ) : (
                monthEvents.map((event) => {
                  const application = applications.find((item) => item.id === event.applicationId)
                  return (
                    <button
                      key={event.id}
                      type="button"
                      className={cx('month-agenda-item', event.id === selectedEventId && 'selected')}
                      onClick={() => selectEvent(event)}
                    >
                      <span>{formatShortDate(event.date)}</span>
                      <strong>{event.title}</strong>
                      <span>
                        {application ? `${application.company} · ` : ''}
                        {event.type}
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          )}
        </section>

        <aside className="panel agenda-panel">
          <div className="agenda-heading">
            <h2>Upcoming events</h2>
            <p>Your next interviews and reminders</p>
          </div>
          <div className="agenda-list">
            {agenda.length === 0 ? (
              <p className="empty">Nothing coming up. Add an interview or follow-up.</p>
            ) : (
              agenda.map((event) => {
                const application = applications.find((item) => item.id === event.applicationId)
                const badge = formatMonthBadge(event.date)
                const dueSoon = settings.emailReminders && isDueSoon(event, today, settings.reminderLeadDays)
                return (
                  <button
                    key={event.id}
                    type="button"
                    className={cx('agenda-item', event.id === selectedEventId && 'selected')}
                    onClick={() => selectEvent(event)}
                  >
                    <span className="date-badge">
                      <small>{badge.month}</small>
                      <strong>{badge.day}</strong>
                    </span>
                    <span>
                      <span className="upcoming-title">
                        {event.title}
                        {dueSoon && <span className="badge-soon">Due soon</span>}
                      </span>
                      <span className="upcoming-meta">
                        {application ? `${application.company} · ` : ''}
                        {event.type}
                      </span>
                      <span className="upcoming-meta">
                        {event.time ? formatTime(event.time) : 'All day'} · {event.medium || 'Reminder'}
                      </span>
                    </span>
                  </button>
                )
              })
            )}
          </div>
          <div className="panel-footer">
            <button type="button" className="link-button" onClick={() => setShowAllEvents((current) => !current)}>
              {showAllEvents ? 'Show upcoming only' : 'View all events →'}
            </button>
          </div>
        </aside>
      </div>

      <div className="hint-bar">
        <p>
          {selectedDayEvents.length > 0
            ? `${formatLongDate(selectedDate)} has ${selectedDayEvents.length} event${selectedDayEvents.length === 1 ? '' : 's'}. Select one to update its status.`
            : 'Select a calendar event to view its details or update its status.'}
        </p>
        <button type="button" className="link-button" onClick={() => onAddEvent(selectedDate)}>
          Add event on {formatShortDate(selectedDate)}
        </button>
      </div>

      <div ref={detailRef}>
        {selectedEvent && (
          <EventDetail
            key={selectedEvent.id}
            event={selectedEvent}
            application={selectedApplication}
            today={today}
            onUpdate={onUpdateEvent}
            onEdit={() => onEditEvent(selectedEvent)}
            onDelete={() => onDeleteEvent(selectedEvent)}
            onOpenApplication={onOpenApplication}
          />
        )}
      </div>
    </>
  )
}
