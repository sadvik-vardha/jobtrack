import { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import CompanyLogo from "./CompanyLogo";
import { STATUSES } from "../utils/constants";
import { formatDate } from "../utils/helpers";

export default function KanbanBoard({
  applications,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
}) {
  const [draggingId, setDraggingId] = useState(null);
  const [overColumn, setOverColumn] = useState(null);

  function handleDrop(e, status) {
    e.preventDefault();
    const app = applications.find((a) => a.id === draggingId);
    if (app && app.status !== status) onStatusChange(app, status);
    setDraggingId(null);
    setOverColumn(null);
  }

  return (
    <div className="kanban">
      {STATUSES.map((status) => {
        const items = applications.filter((a) => a.status === status);
        return (
          <section
            key={status}
            className={`kanban__col ${overColumn === status ? "kanban__col--over" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setOverColumn(status);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setOverColumn(null);
            }}
            onDrop={(e) => handleDrop(e, status)}
            aria-label={`${status} column`}
          >
            <header className="kanban__head">
              <span className={`badge badge--${status.toLowerCase()}`}>{status}</span>
              <span className="muted">{items.length}</span>
            </header>

            <div className="kanban__list">
              {items.map((app) => (
                <article
                  key={app.id}
                  className={`kanban__card ${draggingId === app.id ? "kanban__card--dragging" : ""}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", app.id);
                    setDraggingId(app.id);
                  }}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setOverColumn(null);
                  }}
                >
                  <div className="company-cell">
                    <CompanyLogo name={app.company} />
                    <div style={{ minWidth: 0 }}>
                      <div className="company-name">{app.company}</div>
                      <div className="muted">{app.title}</div>
                    </div>
                  </div>
                  <div className="kanban__meta muted">
                    {app.location} · {formatDate(app.dateApplied)}
                  </div>
                  <div className="kanban__actions">
                    <select
                      className="status-select"
                      value={app.status}
                      onChange={(e) => onStatusChange(app, e.target.value)}
                      aria-label={`Move ${app.company} to another status`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <div className="row-actions">
                      {onView && (
                        <button
                          className="icon-btn"
                          onClick={() => onView(app)}
                          aria-label={`View details for ${app.company}`}
                          title="View details and history"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        className="icon-btn"
                        onClick={() => onEdit(app)}
                        aria-label={`Edit ${app.company} application`}
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => onDelete(app)}
                        aria-label={`Delete ${app.company} application`}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {items.length === 0 && <p className="kanban__empty muted">Drop here</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}