# Job Application Tracker

Interactive React prototype for the CS 499 job-search tracker. The app is a front end only: sample applications and events live in React state for the browser session.

## Live prototype

https://jorbackend.github.io/Fall2026-CS499-Project/

## Setup and run

From this folder:

```bash
npm install
npm run dev
```

Open the local site at http://localhost:5173/Fall2026-CS499-Project/

The `/Fall2026-CS499-Project/` path is required because Vite `base` is set to the GitHub repository name so the production build loads on GitHub Pages.

Other commands:

```bash
npm run build
npm run preview
npm run deploy
```

`npm run deploy` builds the app and publishes the `dist` folder to the `gh-pages` branch.

## Component overview and mock data

State lives in `src/App.jsx`. Views are separate functional components:

| Component | Role |
| --- | --- |
| `Navbar` | Switches between Dashboard, Applications, Calendar, and Settings |
| `PageHeader` | Page title, subtitle, and primary action |
| `StatCard` | Summary counts on the dashboard and calendar |
| `StatusBadge` | Colored status label |
| `Dashboard` | Totals, recent applications, and upcoming events |
| `RecentApplications` | Newest applications, rendered with `.map()` |
| `UpcomingPanel` | Next interviews and follow-ups |
| `ApplicationsView` | Search, status filters, sort, edit, and delete |
| `ApplicationForm` | Modal form for creating and editing an application |
| `ApplicationDetails` | Status, notes, follow-up date, and related events |
| `CalendarView` | Month grid, agenda mode, and upcoming event list |
| `EventForm` | Modal form for creating and editing an event |
| `EventDetail` | Selected event, with a status control and notes |
| `SettingsView` | Display name, reminder lead time, and closed-application visibility |
| `Modal` | Dialog shell for forms and confirmations |

Mock records are created in `src/data/mockData.js`. Dates are calculated from the current day so upcoming items stay on the calendar.

Application fields: `id`, `company`, `title`, `location`, `url`, `employmentType`, `dateApplied`, `status`, `notes`, `createdAt`, `updatedAt`.

Statuses: Interested, Applied, Interviewing, Offer, Rejected, Withdrawn.

Event fields: `id`, `applicationId`, `type`, `title`, `date`, `time`, `medium`, `notes`, `completed`.

Event types: Interview, Phone screen, Recruiter call, Final round, Follow-up, Reminder.

Lists are rendered with `.map()` and filtered with `.filter()`. Adding, editing, deleting, searching, changing a status, and marking an event complete all update `useState`. Refreshing the page restores the sample data.
