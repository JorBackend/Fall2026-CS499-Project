<img width="606" height="452" alt="image" src="https://github.com/user-attachments/assets/dea46e8a-0f10-4058-90fc-9cb1293f6d63" /># Job Application Tracker

## Live Prototype URL

https://jorbackend.github.io/Fall2026-CS499-Project/

## Setup & Run Instructions

The React app is in the `application-tracker` folder.

```bash
cd application-tracker
npm install
npm run dev
```

Open http://localhost:5173/Fall2026-CS499-Project/

Vite is configured with `base: '/Fall2026-CS499-Project/'`, so the local dev server uses that same path. Other commands:

```bash
npm run build     # production build in dist/
npm run preview   # preview the production build
npm run deploy    # build and publish dist/ with gh-pages
```

`npm run deploy` publishes the site to the `gh-pages` branch. GitHub Pages should use that branch at the root path.

## Component Overview & Mock Data

The interface is a set of functional components under `application-tracker/src/components`. `App.jsx` owns the mock data and the current view.

- **Navbar** switches between Dashboard, Applications, Calendar, and Settings.
- **Dashboard** shows totals, the newest applications, and the next interviews or follow-ups.
- **ApplicationsView** searches and filters the full list, and can edit or delete a row.
- **ApplicationForm** adds or edits a company, role, location, posting URL, employment type, date, status, and notes.
- **ApplicationDetails** changes status, saves interview notes, schedules a follow-up, and edits or deletes the application.
- **CalendarView** shows a month grid and an agenda, with upcoming events beside it.
- **EventForm** and **EventDetail** add events and update their status or notes.
- **SettingsView** changes the display name, reminder lead time, and whether rejected or withdrawn applications stay visible.
- **StatCard**, **StatusBadge**, **PageHeader**, and **Modal** are shared pieces used across those screens.

Mock applications and events are built in `application-tracker/src/data/mockData.js`. Dates are relative to the current day, so the dashboard and calendar still show upcoming items.

An application stores `company`, `title`, `location`, `url`, `employmentType`, `dateApplied`, `status`, `notes`, and created/updated timestamps. Status values are Interested, Applied, Interviewing, Offer, Rejected, and Withdrawn.

An event stores the related `applicationId`, `type`, `title`, `date`, `time`, `medium`, `notes`, and `completed`. Types are Interview, Phone screen, Recruiter call, Final round, Follow-up, and Reminder.

Lists are drawn with `.map()`. Search, status chips, dashboard totals, and the calendar all use `.filter()`. Forms, filters, status changes, and deletes update React `useState`. Data lasts for the browser session; a refresh restores the sample set.

## Project Description

The Job Application Tracker is a web application that helps people organize their job and internship searches in one place. Applying to multiple positions can make it difficult to remember which companies have been contacted, when applications were submitted, what stage each application is in, and when to follow up. This application provides a central place to keep that information organized instead of relying on scattered notes, spreadsheets, or email searches.

Users will be able to add job applications, update their status as they move through the hiring process, record interview notes, and keep track of important dates. A dashboard will summarize their applications and highlight upcoming follow-ups or deadlines. The goal is to make the job search easier to manage and help users avoid missing important next steps.

## Target Users

The main target users are college students, recent graduates, and other job seekers who are applying to multiple positions at the same time. These users need a simple way to remember where they applied, prepare for interviews, and keep track of responses and follow-up dates. The application is designed for individual use rather than for recruiters or company hiring teams.

## Core Features

- **Add an application:** Users can save a company name, job title, location, job posting URL, application date, and notes.
- **View and search applications:** Users can see their saved applications in a list and search or filter them by company, job title, or status.
- **Update application status:** Users can move an application through stages such as Interested, Applied, Interviewing, Offer, Rejected, or Withdrawn.
- **Track interviews and follow-ups:** Users can record interview dates, follow-up reminders, and notes about conversations or next steps.
- **View a dashboard:** Users can see application totals by status and a list of upcoming follow-ups or interviews.
- **Edit or delete applications:** Users can update incorrect or outdated details and remove applications they no longer want to track.

## Project Scope

The essential scope is a working application that supports creating, viewing, editing, searching, filtering, and deleting job applications; updating application statuses; saving interview or follow-up information; and displaying a basic dashboard. The project will focus on a single user's application records and a clear, usable interface.

Optional features may include user account registration, email or browser notifications, resume-file uploads, importing applications from a spreadsheet, and integrations with job boards. These features are not required for the initial version and will only be considered if the core application is complete.

Potential challenges include designing a database structure that keeps application details and interview records organized, validating user input, handling dates correctly, and keeping dashboard totals consistent when an application changes status. The project is feasible within approximately eight weeks because its main workflows are limited and can be developed incrementally. The initial version will not automatically submit job applications or connect to external job-board services.

Milestone 2 is the interactive front-end prototype above. It does not include a backend or accounts.

## Initial UI Sketch

The wireframe below shows the planned dashboard and the main application form. It is a preliminary design and may change during development.

## Wireframe Link

Figma - https://www.figma.com/design/RZjgsdLLTHlxAmMKX9Oshq/Untitled?node-id=0-1&t=9bvO0QwvJHQtfnTd-1
<img width="606" height="450" alt="image" src="https://github.com/user-attachments/assets/0dd9ab48-442b-4de7-ad40-1e6fc2903a48" />
<img width="606" height="452" alt="image" src="https://github.com/user-attachments/assets/45ebe990-c7f0-4eab-be35-ecda5014e68a" />


The main navigation provides access to the dashboard, the full application list, the calendar, and settings. From the application list, users can open an application to view or edit its details. A form is used to add a new application or update an existing one. Interview and follow-up information is available from the application details and the calendar.

## Initial Data Requirements

- **Job applications:** Company name, job title, location, job posting URL, employment type, date applied, current status, notes, and created/updated timestamps.
- **Interviews and follow-ups:** Related application, event type, date and time, reminder or follow-up date, notes, and completion status.
- **Application status:** The current stage of an application, such as Interested, Applied, Interviewing, Offer, Rejected, or Withdrawn. These may be represented as predefined values rather than a separate database table.
- **Users (optional):** Account information if user authentication is added. If the initial version is limited to one local user, account management may be omitted.

The initial database design will likely use a job applications table and a related interviews/follow-ups table. A users table will only be necessary if authentication is included.
