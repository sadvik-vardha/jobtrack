import {
  Pencil,
  Trash2,
  Eye,
  ExternalLink,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import CompanyLogo from "./CompanyLogo";
import StatusBadge from "./StatusBadge";
import { STATUSES } from "../utils/constants";
import { formatDate } from "../utils/helpers";

// onStatusChange given -> status is a dropdown. Otherwise a plain badge.
// onToggleSort given   -> date header is a sort button.
// onView given         -> eye button opens details popup.
export default function ApplicationsTable({
  applications,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  sortOrder,
  onToggleSort,
}) {
  const SortIcon = sortOrder === "asc" ? ArrowUp : ArrowDown;

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>
              {onToggleSort ? (
                <button
                  className="sort-btn"
                  onClick={onToggleSort}
                  title="Sort by date applied"
                >
                  Date applied <SortIcon size={14} />
                </button>
              ) : (
                "Date applied"
              )}
            </th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>
                <div className="company-cell">
                  <CompanyLogo name={app.company} />
                  <div>
                    <div className="company-name">{app.company}</div>
                    <div className="muted">{app.location}</div>
                  </div>
                </div>
              </td>
              <td>
                <div>{app.title}</div>
                <div className="muted">{app.type}</div>
              </td>
              <td>{formatDate(app.dateApplied)}</td>
              <td>
                {onStatusChange ? (
                  <select
                    className="status-select"
                    value={app.status}
                    onChange={(e) => onStatusChange(app, e.target.value)}
                    aria-label={`Status for ${app.company}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge status={app.status} />
                )}
              </td>
              <td>
                <div className="row-actions">
                  {app.url && (
                    <a
                      className="icon-btn"
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open job link"
                      aria-label={`Open job link for ${app.company}`}
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {onView && (
                    <button
                      className="icon-btn"
                      onClick={() => onView(app)}
                      title="View details and history"
                      aria-label={`View details for ${app.company}`}
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  <button
                    className="icon-btn"
                    onClick={() => onEdit(app)}
                    title="Edit"
                    aria-label={`Edit ${app.company} application`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => onDelete(app)}
                    title="Delete"
                    aria-label={`Delete ${app.company} application`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}