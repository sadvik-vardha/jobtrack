import { useState } from "react";
import Modal from "./Modal";

const MAX_NAME = 40;

export default function ProfileModal({ name, onSave, onClose }) {
  const [value, setValue] = useState(name);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length > MAX_NAME) {
      setError(`Name must be under ${MAX_NAME} characters.`);
      return;
    }
    onSave(trimmed);
  }

  return (
    <Modal
      title="Your profile"
      onClose={onClose}
      small
      footer={
        <>
          <button type="button" className="btn btn--secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="profile-form" className="btn btn--primary">
            Save
          </button>
        </>
      }
    >
      <form id="profile-form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="profile-name">Your name</label>
          <input
            id="profile-name"
            className={`input ${error ? "input--error" : ""}`}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            placeholder="e.g. Sadvik"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "profile-name-error" : "profile-name-hint"}
            autoFocus
          />
          {error ? (
            <span id="profile-name-error" className="field__error" role="alert">
              {error}
            </span>
          ) : (
            <span id="profile-name-hint" className="field__hint">
              Saved only in this browser. Leave empty to remove it.
            </span>
          )}
        </div>
      </form>
    </Modal>
  );
}