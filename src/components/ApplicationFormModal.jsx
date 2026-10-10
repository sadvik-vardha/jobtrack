import { useState } from "react";
import Modal from "./Modal";
import { JOB_TYPES, STATUSES } from "../utils/constants";
import { validateApplication } from "../utils/validation";
import { todayISO } from "../utils/helpers";

const EMPTY_FORM = {
  company: "",
  title: "",
  location: "",
  type: "Full-time",
  dateApplied: todayISO(),
  url: "",
  status: "Applied",
  salary: "",
  notes: "",
};

// application = null  -> Add mode
// application = {...} -> Edit mode
export default function ApplicationFormModal({ application, onSave, onClose }) {
  const isEdit = Boolean(application);

  const [values, setValues] = useState(() =>
    isEdit
      ? {
          company: application.company,
          title: application.title,
          location: application.location,
          type: application.type,
          dateApplied: application.dateApplied,
          url: application.url || "",
          status: application.status,
          salary: application.salary || "",
          notes: application.notes || "",
        }
      : { ...EMPTY_FORM, dateApplied: todayISO() }
  );
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Remove the error of this field as soon as user edits it.
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const foundErrors = validateApplication(values);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;

    onSave({
      company: values.company.trim(),
      title: values.title.trim(),
      location: values.location.trim(),
      type: values.type,
      dateApplied: values.dateApplied,
      url: values.url.trim(),
      status: values.status,
      salary: values.salary.trim(),
      notes: values.notes.trim(),
    });
  }

  // Small helper so each field is not repeated 9 times.
  function renderError(name) {
    return errors[name] ? (
      <span id={`${name}-error`} className="field__error" role="alert">
        {errors[name]}
      </span>
    ) : null;
  }

  function inputProps(name) {
    return {
      id: name,
      name,
      value: values[name],
      onChange: handleChange,
      "aria-invalid": errors[name] ? "true" : "false",
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    };
  }

  return (
    <Modal
      title={isEdit ? "Edit application" : "Add application"}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="application-form" className="btn btn--primary">
            {isEdit ? "Save changes" : "Add application"}
          </button>
        </>
      }
    >
      <form id="application-form" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="company">
              Company <span className="required">*</span>
            </label>
            <input
              {...inputProps("company")}
              className={`input ${errors.company ? "input--error" : ""}`}
              placeholder="e.g. Google"
              autoFocus
            />
            {renderError("company")}
          </div>

          <div className="field">
            <label htmlFor="title">
              Job title <span className="required">*</span>
            </label>
            <input
              {...inputProps("title")}
              className={`input ${errors.title ? "input--error" : ""}`}
              placeholder="e.g. Frontend Developer"
            />
            {renderError("title")}
          </div>

          <div className="field">
            <label htmlFor="location">
              Location <span className="required">*</span>
            </label>
            <input
              {...inputProps("location")}
              className={`input ${errors.location ? "input--error" : ""}`}
              placeholder="e.g. Bengaluru or Remote"
            />
            {renderError("location")}
          </div>

          <div className="field">
            <label htmlFor="type">
              Job type <span className="required">*</span>
            </label>
            <select
              {...inputProps("type")}
              className={`select ${errors.type ? "input--error" : ""}`}
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {renderError("type")}
          </div>

          <div className="field">
            <label htmlFor="dateApplied">
              Date applied <span className="required">*</span>
            </label>
            <input
              {...inputProps("dateApplied")}
              type="date"
              max={todayISO()}
              className={`input ${errors.dateApplied ? "input--error" : ""}`}
            />
            {renderError("dateApplied")}
          </div>

          <div className="field">
            <label htmlFor="status">
              Status <span className="required">*</span>
            </label>
            <select
              {...inputProps("status")}
              className={`select ${errors.status ? "input--error" : ""}`}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {renderError("status")}
          </div>

          <div className="field">
            <label htmlFor="salary">Salary (optional)</label>
            <input
              {...inputProps("salary")}
              className={`input ${errors.salary ? "input--error" : ""}`}
              placeholder="e.g. 12 LPA"
            />
            {renderError("salary")}
          </div>

          <div className="field">
            <label htmlFor="url">Job URL (optional)</label>
            <input
              {...inputProps("url")}
              type="url"
              className={`input ${errors.url ? "input--error" : ""}`}
              placeholder="https://company.com/jobs/123"
            />
            {renderError("url")}
          </div>

          <div className="field field--full">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea
              {...inputProps("notes")}
              className={`textarea ${errors.notes ? "input--error" : ""}`}
              placeholder="Referral, interview dates, contacts..."
            />
            <span className="field__hint">{values.notes.length}/500</span>
            {renderError("notes")}
          </div>
        </div>
      </form>
    </Modal>
  );
}