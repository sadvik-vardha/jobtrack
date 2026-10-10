# JobTrack: Job Application Tracker

JobTrack is a frontend-only dashboard for tracking job applications. Add applications, move them through hiring stages, search and filter them, drag them across a Kanban board, and see live charts of your progress. All data stays in your browser. There is no backend, no login and no API key.

**Live demo:** https://sadvik-vardha.github.io/jobtrack/
**Source code:** https://github.com/sadvik-vardha/jobtrack

> Inspired by tools like Huntr and Teal. Built from scratch as a portfolio project.

## Features

**Tracking**
- Add, edit and delete applications (delete asks for confirmation)
- Fields: company, job title, location, job type, date applied, job URL, status, salary (optional), notes
- Five statuses: Applied, Interview, Assessment, Offer, Rejected
- Change status from the table dropdown, the Kanban board, or the edit form
- Status history timeline for every application, with the date of each change

**Finding things**
- Search by company or job title
- Filter by status, job type and location
- Sort by date applied (newest or oldest first)
- Table view and drag-and-drop Kanban board view

**Dashboard**
- Live totals: applications, interviews, offers, rejections
- Status donut chart
- Weekly and monthly activity bar chart
- Recent applications table

**Product details**
- Form validation with clear messages
- Dark mode (light is the default)
- Export all data to a JSON file and import it back (imported data is checked and cleaned)
- Profile name shown in the welcome message and avatar
- View, filter, sort and sidebar choices are remembered after refresh
- Demo data on first visit only, with a "Clear all data" option. Demo data never returns after you clear it
- Empty states, success and error toasts, collapsible sidebar, mobile-friendly menu

## Tech stack

- React with Vite
- JavaScript (ES6+)
- Plain CSS with design tokens (CSS variables)
- Recharts for charts
- Lucide React for icons
- Browser LocalStorage for persistence
- GitHub Actions and GitHub Pages for deployment

No paid service, backend, database or API key is needed.

## Prerequisites

- Node.js 18 or newer (check with `node -v`)
- npm (comes with Node.js)
- Git (only needed to publish the code)

## Installation and run

```bash
git clone https://github.com/sadvik-vardha/jobtrack.git
cd jobtrack
npm install
npm run dev
```

Open the link shown in the terminal. Because the project is configured for GitHub Pages, the local address is `http://localhost:5173/jobtrack/`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Check the code for mistakes |

## Project structure

```
jobtrack/
├── .github/workflows/deploy.yml   Builds and deploys to GitHub Pages
├── index.html
├── package.json
├── vite.config.js                 Sets base path for GitHub Pages
├── README.md
└── src/
    ├── main.jsx                   App entry point
    ├── App.jsx                    Page switching, modals, toasts, top-level state
    ├── index.css                  Design system, layout, components, dark theme
    ├── components/
    │   ├── Sidebar.jsx
    │   ├── Topbar.jsx
    │   ├── StatCard.jsx
    │   ├── StatusChart.jsx
    │   ├── ActivityChart.jsx
    │   ├── ApplicationsTable.jsx
    │   ├── KanbanBoard.jsx
    │   ├── ApplicationFormModal.jsx
    │   ├── ApplicationDetailsModal.jsx
    │   ├── ProfileModal.jsx
    │   ├── Modal.jsx
    │   ├── ConfirmDialog.jsx
    │   ├── ToastContainer.jsx
    │   ├── EmptyState.jsx
    │   ├── StatusBadge.jsx
    │   └── CompanyLogo.jsx
    ├── pages/
    │   ├── Dashboard.jsx
    │   └── Applications.jsx
    ├── hooks/
    │   ├── useApplications.js     All data operations and saving
    │   ├── usePersistedState.js   useState that remembers its value
    │   ├── useTheme.js            Light and dark theme
    │   └── useToasts.js           Success and error messages
    ├── utils/
    │   ├── constants.js           Statuses, job types, storage keys
    │   ├── storage.js             Safe LocalStorage read and write
    │   ├── helpers.js             IDs, dates, initials, colors
    │   ├── validation.js          Form validation rules
    │   ├── stats.js               Dashboard numbers and chart data
    │   ├── history.js             Status history logic
    │   └── backup.js              JSON export and import with cleaning
    └── data/
        └── sampleData.js          Demo applications
```

## How it works

**Data flow.** `useApplications` holds the list of applications. Every change (add, edit, delete, status change, clear, import) goes through one `commit` function that updates React state and saves to LocalStorage in the same step. `App.jsx` passes data and handlers down to the pages.

**Dashboard numbers.** `stats.js` calculates totals and chart data directly from the stored applications, so charts update the moment data changes.

**Validation.** `validation.js` returns an object of error messages. An empty object means the form is valid. An error clears as soon as the user edits that field.

**Status history.** Each application stores a `history` list of `{ status, date }`. Changing status from any place (table, board, form) adds an entry. Applications saved before this feature show one starting entry.

**Kanban board.** Built with the native browser drag-and-drop API, no library. Each card also has a status dropdown, which works on touch screens where dragging is awkward.

**Import safety.** Imported files are parsed, every field is checked, bad rows are skipped, and the user is told how many were skipped. A broken file cannot crash the app.

## How LocalStorage works

LocalStorage is a small key-value store inside the browser. JobTrack saves JSON text under these keys:

| Key | Content |
|---|---|
| `jobtrack.applications` | The list of applications |
| `jobtrack.seeded` | `true` once demo data was shown, so it never returns after clearing |
| `jobtrack.theme` | `light` or `dark` |
| `jobtrack.profileName` | Name shown in the welcome message |
| `jobtrack.sidebarCollapsed` | Sidebar state |
| `jobtrack.view` | `table` or `board` |
| `jobtrack.sortOrder` | `asc` or `desc` |
| `jobtrack.filter.status`, `.type`, `.location` | Saved filter choices |

All reads and writes are wrapped in `try/catch`. If the browser blocks storage (private mode, storage full), the app keeps working and shows a warning that changes will be lost when the tab closes.

To reset everything, use **Clear all data** in the app, or clear site data in browser DevTools (Application tab, Storage).

## Limitations of the frontend-only version

- Data lives only in one browser on one device. There is no sync between devices.
- Clearing browser data deletes your applications. Use **Export** regularly for backups.
- Different browsers, and `localhost` versus the deployed site, each keep separate data.
- LocalStorage holds around 5 MB, which is plenty for thousands of applications but not unlimited.
- There is no login, so anyone using the same browser profile sees the same data.
- Import replaces current data. It does not merge.
- There are no reminders or notifications, because there is no server to send them.

## Deployment (GitHub Pages)

The site deploys automatically with GitHub Actions on every push to `main`.

1. Push the project to a GitHub repository named `jobtrack`.
2. In the repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` installs dependencies, runs `npm run build`, and publishes the `dist` folder.
4. After about a minute the site is live at `https://YOUR-USERNAME.github.io/jobtrack/`.

`vite.config.js` sets `base: "/jobtrack/"` because GitHub Pages serves the site from a sub-folder. If you rename the repository, change that value to match.

## Publish the source code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/jobtrack.git
git push -u origin main
```

GitHub no longer accepts account passwords for Git. Use a personal access token with Contents and Workflows (read and write) permissions, or sign in through the browser prompt.

## Possible future improvements

- Follow-up reminders and "no reply" detection
- Source and resume-version analytics
- Interview scheduling with calendar (.ics) export
- Pagination for very large lists
- Unit tests with Vitest
- Optional backend with login for cross-device sync

## License

MIT. Free to use and modify.