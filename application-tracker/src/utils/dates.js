export function toISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseISODate(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addDays(date, amount) {
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export function shiftMonth(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

export function todayISO() {
  return toISODate(startOfDay(new Date()))
}

export function daysFromToday(offset) {
  return toISODate(addDays(startOfDay(new Date()), offset))
}

export function upcomingWeekday(targetDay, minimumDays = 1) {
  const today = startOfDay(new Date())
  let delta = (targetDay - today.getDay() + 7) % 7
  if (delta < minimumDays) delta += 7
  return toISODate(addDays(today, delta))
}

export function dayOfCurrentMonth(day) {
  const today = new Date()
  const last = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  return toISODate(new Date(today.getFullYear(), today.getMonth(), Math.min(day, last)))
}

export function isSameMonth(date, cursor) {
  return date.getFullYear() === cursor.getFullYear() && date.getMonth() === cursor.getMonth()
}

export function isBeforeToday(iso) {
  return parseISODate(iso) < startOfDay(new Date())
}

export function daysUntil(iso, today = startOfDay(new Date())) {
  return Math.round((parseISODate(iso) - startOfDay(today)) / 86400000)
}

export function formatShortDate(iso) {
  return parseISODate(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatLongDate(iso) {
  return parseISODate(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatMonthYear(date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function formatMonthBadge(iso) {
  const date = parseISODate(iso)
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: date.getDate(),
  }
}

export function formatTime(time) {
  if (!time) return ''
  const [hourString, minute] = time.split(':')
  const hour = Number(hourString)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  return `${hour % 12 || 12}:${minute} ${suffix}`
}

export function formatRelativeDay(iso, today = startOfDay(new Date())) {
  const diff = daysUntil(iso, today)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  if (diff > 1 && diff < 14) {
    return parseISODate(iso).toLocaleDateString('en-US', { weekday: 'long' })
  }
  return formatShortDate(iso)
}

export function eventSchedule(event, today) {
  const relative = formatRelativeDay(event.date, today)
  if (!event.time && (event.type === 'Follow-up' || event.type === 'Reminder')) {
    return `${relative} · Follow-up reminder`
  }
  if (event.time) return `${relative} · ${formatTime(event.time)}`
  return `${relative} · ${event.medium || event.type}`
}

export function eventDateTime(event) {
  const date = parseISODate(event.date)
  if (event.time) {
    const [hour, minute] = event.time.split(':').map(Number)
    date.setHours(hour, minute, 0, 0)
  } else {
    date.setHours(18, 0, 0, 0)
  }
  return date.getTime()
}

export function isUpcoming(event, today = startOfDay(new Date())) {
  return !event.completed && daysUntil(event.date, today) >= 0
}

export function isSameWeek(iso, today = startOfDay(new Date())) {
  const start = addDays(startOfDay(today), -startOfDay(today).getDay())
  const diff = daysUntil(iso, start)
  return diff >= 0 && diff < 7
}

export function isDueSoon(event, today, leadDays) {
  if (event.completed) return false
  const diff = daysUntil(event.date, today)
  return diff >= 0 && diff <= Number(leadDays)
}

export function buildMonthGrid(cursor) {
  const first = startOfMonth(cursor)
  const start = addDays(first, -first.getDay())
  return Array.from({ length: 42 }, (_, index) => addDays(start, index))
}

export function nowStamp() {
  const date = new Date()
  return `${toISODate(date)}T${date.toTimeString().slice(0, 8)}`
}

export function normalizeUrl(url) {
  if (!url) return ''
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

export function typeSlug(type) {
  return String(type).toLowerCase().replace(/\s+/g, '-')
}

export function nextEventDetail(event) {
  if (!event) return 'Add an interview or follow-up'
  if (event.title.toLowerCase().includes(event.type.toLowerCase())) return event.title
  return `${event.title} ${event.type}`
}
