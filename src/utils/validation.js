import { JOB_TYPES, STATUSES } from "./constants";
import { todayISO } from "./helpers";

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Returns an object like { company: "message" }. Empty object = form is valid.
export function validateApplication(values) {
  const errors = {};

  const company = values.company.trim();
  if (!company) errors.company = "Company name is required.";
  else if (company.length < 2) errors.company = "Company name is too short.";
  else if (company.length > 80) errors.company = "Company name must be under 80 characters.";

  const title = values.title.trim();
  if (!title) errors.title = "Job title is required.";
  else if (title.length < 2) errors.title = "Job title is too short.";
  else if (title.length > 100) errors.title = "Job title must be under 100 characters.";

  if (!values.location.trim()) errors.location = "Location is required (use Remote if remote).";

  if (!JOB_TYPES.includes(values.type)) errors.type = "Please choose a job type.";
  if (!STATUSES.includes(values.status)) errors.status = "Please choose a status.";

  if (!values.dateApplied) errors.dateApplied = "Application date is required.";
  else if (values.dateApplied > todayISO()) errors.dateApplied = "Date cannot be in the future.";

  const url = values.url.trim();
  if (url && !isValidUrl(url)) {
    errors.url = "Enter a full link starting with http:// or https://";
  }

  if (values.salary.trim().length > 40) errors.salary = "Salary text is too long (max 40 characters).";
  if (values.notes.length > 500) errors.notes = "Notes must be under 500 characters.";

  return errors;
}