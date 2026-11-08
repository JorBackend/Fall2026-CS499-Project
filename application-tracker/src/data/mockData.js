import {
  dayOfCurrentMonth,
  daysFromToday,
  isBeforeToday,
  todayISO,
  upcomingWeekday,
} from '../utils/dates'

export const STATUSES = ['Interested', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn']

export const EMPLOYMENT_TYPES = ['Internship', 'Full-time', 'Part-time', 'Contract']

export const EVENT_TYPES = ['Interview', 'Phone screen', 'Recruiter call', 'Final round', 'Follow-up', 'Reminder']

export const EVENT_MEDIUMS = ['Video call', 'Phone', 'Email', 'On-site', 'Reminder']

export const INTERVIEW_TYPES = ['Interview', 'Phone screen', 'Final round']

export const FOLLOW_UP_TYPES = ['Follow-up', 'Reminder']

export function nextId(items) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

function application(partial) {
  const dateApplied = partial.dateApplied
  return {
    location: 'Remote',
    url: '',
    employmentType: 'Full-time',
    notes: '',
    createdAt: `${dateApplied}T15:00:00`,
    updatedAt: `${dateApplied}T15:00:00`,
    ...partial,
  }
}

function event(partial) {
  return {
    time: '',
    medium: 'Video call',
    notes: '',
    completed: isBeforeToday(partial.date),
    ...partial,
  }
}

export function createInitialApplications() {
  return [
    application({
      id: 1,
      company: 'Example Tech',
      title: 'SWE Intern',
      location: 'Remote',
      url: 'https://example.com/jobs/example-tech-swe-intern',
      employmentType: 'Internship',
      dateApplied: daysFromToday(-6),
      status: 'Applied',
      notes: 'Submitted through the company portal. The recruiter asked for a short follow-up once the application was in.',
    }),
    application({
      id: 2,
      company: 'Northstar',
      title: 'Developer Intern',
      location: 'Chicago, IL',
      url: 'https://example.com/jobs/northstar-developer-intern',
      employmentType: 'Internship',
      dateApplied: daysFromToday(-8),
      status: 'Interviewing',
      notes: 'Hiring manager wants a project walkthrough. The interview is Friday at 2:00 PM on video.',
    }),
    application({
      id: 3,
      company: 'Acme Systems',
      title: 'Junior Dev',
      location: 'Austin, TX',
      url: 'https://example.com/jobs/acme-junior-dev',
      employmentType: 'Full-time',
      dateApplied: daysFromToday(-10),
      status: 'Offer',
      notes: 'Verbal offer received. Waiting on the written letter and a recruiter call before deciding.',
    }),
    application({
      id: 4,
      company: 'Palantir',
      title: 'Software Engineer',
      location: 'New York, NY',
      url: 'https://example.com/jobs/palantir-software-engineer',
      employmentType: 'Full-time',
      dateApplied: daysFromToday(-4),
      status: 'Interviewing',
      notes: 'Technical interview is on the calendar. Review graphs and be ready to talk through a system design.',
    }),
    application({
      id: 5,
      company: 'Microsoft',
      title: 'Software Engineer',
      location: 'Redmond, WA',
      url: 'https://example.com/jobs/microsoft-software-engineer',
      employmentType: 'Full-time',
      dateApplied: daysFromToday(-12),
      status: 'Applied',
      notes: 'Recruiter asked for an updated transcript before the next conversation.',
    }),
    application({
      id: 6,
      company: 'JPMorgan Chase',
      title: 'Software Engineer',
      location: 'New York, NY',
      url: 'https://example.com/jobs/jpmorgan-software-engineer',
      employmentType: 'Full-time',
      dateApplied: daysFromToday(-9),
      status: 'Interviewing',
      notes: 'Phone screen already happened. The technical round covers coding and a short behavioral screen.',
    }),
    application({
      id: 7,
      company: 'CPholes',
      title: 'Backend Intern',
      location: 'Remote',
      url: 'https://example.com/jobs/cpholes-backend-intern',
      employmentType: 'Internship',
      dateApplied: daysFromToday(-3),
      status: 'Applied',
      notes: 'Application is in review. Check the portal early next week for a status change.',
    }),
    application({
      id: 8,
      company: 'Stripe',
      title: 'Frontend Engineer',
      location: 'Seattle, WA',
      url: 'https://example.com/jobs/stripe-frontend-engineer',
      employmentType: 'Full-time',
      dateApplied: daysFromToday(-1),
      status: 'Interested',
      notes: 'Strong match for the frontend work. The application has not been submitted yet.',
    }),
    application({
      id: 9,
      company: 'Notion',
      title: 'Product Engineer',
      location: 'San Francisco, CA',
      url: 'https://example.com/jobs/notion-product-engineer',
      employmentType: 'Full-time',
      dateApplied: daysFromToday(-20),
      status: 'Rejected',
      notes: 'Rejection email arrived after the recruiter screen. Keep the notes for future applications.',
    }),
    application({
      id: 10,
      company: 'Cloudflare',
      title: 'Systems Intern',
      location: 'Austin, TX',
      url: 'https://example.com/jobs/cloudflare-systems-intern',
      employmentType: 'Internship',
      dateApplied: daysFromToday(-15),
      status: 'Withdrawn',
      notes: 'Withdrew after another interview loop became the priority.',
    }),
    application({
      id: 11,
      company: 'Databricks',
      title: 'New Grad SWE',
      location: 'Mountain View, CA',
      url: 'https://example.com/jobs/databricks-new-grad',
      employmentType: 'Full-time',
      dateApplied: daysFromToday(-2),
      status: 'Applied',
      notes: 'Coding assessment is submitted. Follow up if there is no update later this month.',
    }),
    application({
      id: 12,
      company: 'Figma',
      title: 'Design Engineer',
      location: 'New York, NY',
      url: 'https://example.com/jobs/figma-design-engineer',
      employmentType: 'Full-time',
      dateApplied: daysFromToday(-7),
      status: 'Interviewing',
      notes: 'Portfolio review went well. Final round is later this month.',
    }),
    application({
      id: 13,
      company: 'Robinhood',
      title: 'Mobile Engineer',
      location: 'Palo Alto, CA',
      url: 'https://example.com/jobs/robinhood-mobile-engineer',
      employmentType: 'Full-time',
      dateApplied: daysFromToday(-5),
      status: 'Interviewing',
      notes: 'Recruiter screen went well. A later interview is on the calendar.',
    }),
  ]
}

export function createInitialEvents() {
  return [
    event({
      id: 1,
      applicationId: 4,
      type: 'Interview',
      title: 'Software Engineer',
      date: daysFromToday(1),
      time: '10:00',
      medium: 'Video call',
      notes: 'Bring a question about how the team ships and reviews design docs.',
      completed: false,
    }),
    event({
      id: 2,
      applicationId: 1,
      type: 'Follow-up',
      title: 'Follow-up with Example Tech',
      date: daysFromToday(1),
      medium: 'Reminder',
      notes: 'Send a short note and ask about the review timeline.',
      completed: false,
    }),
    event({
      id: 3,
      applicationId: 5,
      type: 'Follow-up',
      title: 'Recruiter follow-up',
      date: daysFromToday(2),
      time: '14:00',
      medium: 'Email',
      notes: 'Attach the updated transcript the recruiter requested.',
      completed: false,
    }),
    event({
      id: 4,
      applicationId: 6,
      type: 'Interview',
      title: 'Technical interview',
      date: daysFromToday(4),
      time: '11:30',
      medium: 'Video call',
      notes: 'Practice one array problem and one short behavioral story.',
      completed: false,
    }),
    event({
      id: 5,
      applicationId: 2,
      type: 'Interview',
      title: 'Northstar interview',
      date: upcomingWeekday(5, 2),
      time: '14:00',
      medium: 'Video call',
      notes: 'Walk through the last class project and the tradeoffs in the data model.',
      completed: false,
    }),
    event({
      id: 6,
      applicationId: 7,
      type: 'Follow-up',
      title: 'Check application status',
      date: upcomingWeekday(1, 2),
      medium: 'Reminder',
      notes: 'Look at the portal and send a nudge if the status is unchanged.',
      completed: false,
    }),
    event({
      id: 7,
      applicationId: 6,
      type: 'Phone screen',
      title: 'Phone screen',
      date: dayOfCurrentMonth(1),
      time: '09:30',
      medium: 'Phone',
      notes: 'Intro screen with the recruiter. Moved forward to the technical round.',
    }),
    event({
      id: 8,
      applicationId: 11,
      type: 'Follow-up',
      title: 'Follow-up',
      date: dayOfCurrentMonth(5),
      medium: 'Email',
      notes: 'Check whether the assessment was received.',
    }),
    event({
      id: 9,
      applicationId: 3,
      type: 'Recruiter call',
      title: 'Recruiter call',
      date: upcomingWeekday(3, 2),
      time: '13:00',
      medium: 'Phone',
      notes: 'Talk through the offer timeline and the start date.',
      completed: false,
    }),
    event({
      id: 10,
      applicationId: 11,
      type: 'Follow-up',
      title: 'Follow-up',
      date: dayOfCurrentMonth(23),
      medium: 'Email',
      notes: 'Second check-in if the assessment review is still open.',
    }),
    event({
      id: 11,
      applicationId: 12,
      type: 'Final round',
      title: 'Final round',
      date: dayOfCurrentMonth(26),
      time: '15:00',
      medium: 'Video call',
      notes: 'Portfolio review with the hiring manager.',
    }),
    event({
      id: 12,
      applicationId: 13,
      type: 'Interview',
      title: 'Interview',
      date: dayOfCurrentMonth(30),
      time: '10:00',
      medium: 'Video call',
      notes: 'Mobile architecture conversation.',
    }),
    event({
      id: 13,
      applicationId: 9,
      type: 'Phone screen',
      title: 'Recruiter screen',
      date: daysFromToday(-4),
      time: '15:00',
      medium: 'Phone',
      notes: 'Screen ended in a rejection the following week.',
      completed: true,
    }),
  ]
}

export function createEmptyApplication() {
  return {
    company: '',
    title: '',
    location: '',
    url: '',
    employmentType: 'Internship',
    dateApplied: todayISO(),
    status: 'Applied',
    notes: '',
  }
}

export function createEmptyEvent(overrides = {}) {
  const eventDraft = {
    applicationId: '',
    type: 'Interview',
    title: '',
    date: todayISO(),
    time: '',
    medium: 'Video call',
    notes: '',
    completed: false,
  }
  Object.entries(overrides).forEach(([key, value]) => {
    if (value !== undefined) eventDraft[key] = value
  })
  return eventDraft
}
