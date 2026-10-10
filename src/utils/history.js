import { todayISO } from "./helpers";

// Old data has no history yet, so build one entry from what we know.
export function getHistory(app) {
  if (Array.isArray(app.history) && app.history.length > 0) return app.history;
  return [{ status: app.status, date: app.dateApplied }];
}

// Returns the application with the new status and one extra history entry.
// Same status = nothing changes.
export function withStatusChange(app, status) {
  if (app.status === status) return app;
  return {
    ...app,
    status,
    history: [...getHistory(app), { status, date: todayISO() }],
  };
}