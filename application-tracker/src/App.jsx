import { useCallback, useMemo, useState } from 'react'
import ApplicationDetails from './components/ApplicationDetails'
import ApplicationForm from './components/ApplicationForm'
import ApplicationsView from './components/ApplicationsView'
import CalendarView from './components/CalendarView'
import Dashboard from './components/Dashboard'
import EventForm from './components/EventForm'
import Modal from './components/Modal'
import Navbar from './components/Navbar'
import SettingsView from './components/SettingsView'
import {
  createEmptyApplication,
  createEmptyEvent,
  createInitialApplications,
  createInitialEvents,
  nextId,
} from './data/mockData'
import { nowStamp, startOfDay } from './utils/dates'

const INITIAL_SETTINGS = {
  displayName: 'Alex',
  emailReminders: true,
  reminderLeadDays: 1,
  showClosedApplications: true,
}

export default function App() {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [applications, setApplications] = useState(createInitialApplications)
  const [events, setEvents] = useState(createInitialEvents)
  const [settings, setSettings] = useState(INITIAL_SETTINGS)
  const [view, setView] = useState('dashboard')
  const [returnView, setReturnView] = useState('dashboard')
  const [selectedAppId, setSelectedAppId] = useState(null)
  const [focusedEventId, setFocusedEventId] = useState(null)
  const [modal, setModal] = useState(null)

  const visibleApplications = applications.filter(
    (application) =>
      settings.showClosedApplications || (application.status !== 'Rejected' && application.status !== 'Withdrawn'),
  )
  const visibleIds = new Set(visibleApplications.map((application) => application.id))
  const visibleEvents = events.filter((event) => visibleIds.has(event.applicationId))
  const selectedApplication = applications.find((application) => application.id === selectedAppId) ?? null

  function navigate(next) {
    setFocusedEventId(null)
    setView(next)
  }

  function openApplication(id, from) {
    setReturnView(from)
    setSelectedAppId(id)
    setView('details')
  }

  function openEvent(id) {
    setFocusedEventId(id)
    setView('calendar')
  }

  const closeModal = useCallback(() => setModal(null), [])

  function updateSettings(patch) {
    setSettings((current) => ({ ...current, ...patch }))
  }

  function saveApplication(data) {
    if (data.id) {
      setApplications((current) =>
        current.map((application) =>
          application.id === data.id ? { ...application, ...data, updatedAt: nowStamp() } : application,
        ),
      )
      setModal(null)
      return
    }

    const id = nextId(applications)
    const stamp = nowStamp()
    setApplications((current) => [{ ...data, id, createdAt: stamp, updatedAt: stamp }, ...current])
    setReturnView(view === 'details' ? returnView : view)
    setSelectedAppId(id)
    setView('details')
    setModal(null)
  }

  function updateApplication(id, patch) {
    setApplications((current) =>
      current.map((application) =>
        application.id === id ? { ...application, ...patch, updatedAt: nowStamp() } : application,
      ),
    )
  }

  function deleteApplication(id) {
    setApplications((current) => current.filter((application) => application.id !== id))
    setEvents((current) => current.filter((event) => event.applicationId !== id))
    if (selectedAppId === id) setSelectedAppId(null)
    if (view === 'details' && selectedAppId === id) {
      setView(returnView === 'details' ? 'applications' : returnView)
    }
    setModal(null)
  }

  function saveEvent(data) {
    const payload = {
      ...data,
      applicationId: Number(data.applicationId),
      title: data.title.trim(),
      notes: data.notes.trim(),
      completed: Boolean(data.completed),
    }

    if (data.id) {
      setEvents((current) => current.map((event) => (event.id === data.id ? { ...event, ...payload } : event)))
      setFocusedEventId(data.id)
      setView('calendar')
      setModal(null)
      return
    }

    const id = nextId(events)
    setEvents((current) => [...current, { ...payload, id }])
    setFocusedEventId(id)
    setView('calendar')
    setModal(null)
  }

  function updateEvent(id, patch) {
    setEvents((current) => current.map((event) => (event.id === id ? { ...event, ...patch } : event)))
  }

  function deleteEvent(id) {
    setEvents((current) => current.filter((event) => event.id !== id))
    if (focusedEventId === id) setFocusedEventId(null)
    setModal(null)
  }

  function addFollowUp(application, date) {
    const id = nextId(events)
    setEvents((current) => [
      ...current,
      {
        id,
        applicationId: application.id,
        type: 'Follow-up',
        title: `Follow-up with ${application.company}`,
        date,
        time: '',
        medium: 'Reminder',
        notes: '',
        completed: false,
      },
    ])
  }

  function requestDeleteApplication(application) {
    setModal({
      type: 'confirm',
      title: 'Delete application',
      message: `Remove ${application.company} / ${application.title}? Interviews and follow-ups linked to it will be removed too.`,
      confirmLabel: 'Delete',
      tone: 'danger',
      onConfirm: () => deleteApplication(application.id),
    })
  }

  function requestDeleteEvent(event) {
    setModal({
      type: 'confirm',
      title: 'Delete event',
      message: `Remove "${event.title}"?`,
      confirmLabel: 'Delete',
      tone: 'danger',
      onConfirm: () => deleteEvent(event.id),
    })
  }

  function requestReset() {
    setModal({
      type: 'confirm',
      title: 'Restore sample data',
      message: 'This clears applications and events you added or edited in this session and brings back the original sample search.',
      confirmLabel: 'Restore',
      tone: 'primary',
      onConfirm: () => {
        setApplications(createInitialApplications())
        setEvents(createInitialEvents())
        setSelectedAppId(null)
        setFocusedEventId(null)
        setView('dashboard')
        setModal(null)
      },
    })
  }

  return (
    <div className="app">
      <Navbar activeView={view} displayName={settings.displayName} onNavigate={navigate} />
      <main className="page">
        {view === 'dashboard' && (
          <Dashboard
            applications={visibleApplications}
            events={visibleEvents}
            today={today}
            settings={settings}
            onAdd={() => setModal({ type: 'application', mode: 'create' })}
            onOpenApplication={(id) => openApplication(id, 'dashboard')}
            onOpenAll={() => navigate('applications')}
            onOpenEvent={openEvent}
          />
        )}
        {view === 'applications' && (
          <ApplicationsView
            applications={visibleApplications}
            onAdd={() => setModal({ type: 'application', mode: 'create' })}
            onOpen={(id) => openApplication(id, 'applications')}
            onEdit={(application) => setModal({ type: 'application', mode: 'edit', application })}
            onDelete={requestDeleteApplication}
          />
        )}
        {view === 'details' && selectedApplication && (
          <ApplicationDetails
            key={selectedApplication.id}
            application={selectedApplication}
            events={events.filter((event) => event.applicationId === selectedApplication.id)}
            today={today}
            returnLabel={returnView}
            onBack={() => navigate(returnView)}
            onStatus={(status) => updateApplication(selectedApplication.id, { status })}
            onSaveNotes={(notes) => updateApplication(selectedApplication.id, { notes })}
            onEdit={() => setModal({ type: 'application', mode: 'edit', application: selectedApplication })}
            onDelete={() => requestDeleteApplication(selectedApplication)}
            onAddEvent={() =>
              setModal({
                type: 'event',
                mode: 'create',
                draft: createEmptyEvent({
                  applicationId: selectedApplication.id,
                  title: `${selectedApplication.company} follow-up`,
                  type: 'Follow-up',
                  medium: 'Reminder',
                }),
              })
            }
            onScheduleFollowUp={(date) => addFollowUp(selectedApplication, date)}
            onUpdateEvent={updateEvent}
            onOpenEvent={openEvent}
          />
        )}
        {view === 'details' && !selectedApplication && (
          <div className="empty-panel panel">
            <h2>That application is no longer available.</h2>
            <button type="button" className="btn-primary" onClick={() => navigate('applications')}>
              Back to applications
            </button>
          </div>
        )}
        {view === 'calendar' && (
          <CalendarView
            key={focusedEventId ?? 'calendar'}
            applications={visibleApplications}
            events={visibleEvents}
            today={today}
            settings={settings}
            focusedEventId={focusedEventId}
            onAddEvent={(date) => setModal({ type: 'event', mode: 'create', draft: createEmptyEvent({ date }) })}
            onEditEvent={(event) => setModal({ type: 'event', mode: 'edit', event })}
            onDeleteEvent={requestDeleteEvent}
            onUpdateEvent={updateEvent}
            onOpenApplication={(id) => openApplication(id, 'calendar')}
          />
        )}
        {view === 'settings' && (
          <SettingsView
            settings={settings}
            applicationCount={visibleApplications.length}
            eventCount={visibleEvents.length}
            onChange={updateSettings}
            onReset={requestReset}
          />
        )}
      </main>

      {modal?.type === 'application' && (
        <Modal title={modal.mode === 'edit' ? 'Edit application' : 'Add application'} onClose={closeModal}>
          <ApplicationForm
            initial={modal.application ?? createEmptyApplication()}
            onSubmit={saveApplication}
            onCancel={closeModal}
          />
        </Modal>
      )}
      {modal?.type === 'event' && (
        <Modal title={modal.mode === 'edit' ? 'Edit event' : 'Add event'} onClose={closeModal}>
          <EventForm
            initial={modal.event ?? modal.draft ?? createEmptyEvent()}
            applications={applications}
            onSubmit={saveEvent}
            onCancel={closeModal}
          />
        </Modal>
      )}
      {modal?.type === 'confirm' && (
        <Modal title={modal.title} onClose={closeModal} size="narrow">
          <div className="modal-body">
            <p className="confirm-copy">{modal.message}</p>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="button"
                className={modal.tone === 'danger' ? 'btn-danger' : 'btn-primary'}
                onClick={modal.onConfirm}
              >
                {modal.confirmLabel}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
