import { STATUSES, JOB_TYPES } from "./constants";
import { generateId, todayISO } from "./helpers";

// Download all applications as a .json file.
export function exportApplications(applications) {
  const payload = {
    app: "JobTrack",
    version: 1,
    exportedAt: new Date().toISOString(),
    applications,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `jobtrack-backup-${todayISO()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const text = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function cleanHistory(history) {
  if (!Array.isArray(history)) return undefined;
  const cleaned = history
    .filter(
      (h) =>
        h &&
        STATUSES.includes(h.status) &&
        typeof h.date === "string" &&
        DATE_PATTERN.test(h.date)
    )
    .slice(0, 50)
    .map((h) => ({ status: h.status, date: h.date }));
  return cleaned.length > 0 ? cleaned : undefined;
}

// Clean one row. Returns null if row is unusable.
function cleanRow(row) {
  if (!row || typeof row !== "object") return null;

  const company = text(row.company, 80);
  const title = text(row.title, 100);
  const location = text(row.location, 100);
  const dateApplied = typeof row.dateApplied === "string" ? row.dateApplied : "";

  if (!company || !title || !location) return null;
  if (!DATE_PATTERN.test(dateApplied)) return null;

  return {
    id: generateId(),
    company,
    title,
    location,
    type: JOB_TYPES.includes(row.type) ? row.type : "Full-time",
    dateApplied,
    url: text(row.url, 500),
    status: STATUSES.includes(row.status) ? row.status : "Applied",
    salary: text(row.salary, 40),
    notes: typeof row.notes === "string" ? row.notes.trim().slice(0, 500) : "",
    history: cleanHistory(row.history),
  };
}

// Reads a File. Resolves { applications, skipped }. Rejects with a readable message.
export function importApplications(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file selected."));
    if (file.size > 5 * 1024 * 1024) {
      return reject(new Error("File is too large (max 5 MB)."));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      let data;
      try {
        data = JSON.parse(reader.result);
      } catch {
        return reject(new Error("This is not a valid JSON file."));
      }

      const rows = Array.isArray(data) ? data : data && data.applications;
      if (!Array.isArray(rows)) {
        return reject(new Error("No applications found in this file."));
      }

      const applications = rows.map(cleanRow).filter(Boolean);
      if (applications.length === 0) {
        return reject(new Error("No valid applications found in this file."));
      }
      resolve({ applications, skipped: rows.length - applications.length });
    };
    reader.readAsText(file);
  });
}