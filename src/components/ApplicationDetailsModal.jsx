import { Pencil, ExternalLink } from "lucide-react";
import Modal from "./Modal";
import CompanyLogo from "./CompanyLogo";
import StatusBadge from "./StatusBadge";
import { getHistory } from "../utils/history";
import { formatDate } from "../utils/helpers";

export default function ApplicationDetailsModal({ application: app, onEdit, onClose }) {
  const history = getHistory(app);

  return (
    <Modal
      title="Application details"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn--secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn--primary" onClick={() => onEdit(app)}>
            <Pencil size={16} /> Edit
          </button>
        </>
      }
    >
      <div className="company-cell" style={{ marginBottom: 20 }}>
        <CompanyLogo name={app.company} />
        <div style={{ minWidth: 0 }}>
          <div className="company-name">{app.company}</div>
          <div className="muted">{app.title}</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <StatusBadge status={app.status} />
        </div>
      </div>

      <dl className="details">
        <div>
          <dt>Location</dt>
          <dd>{app.location}</dd>
        </div>
        <div>
          <dt>Job type</dt>
          <dd>{app.type}</dd>
        </div>
        <div>
          <dt>Date applied</dt>
          <dd>{formatDate(app.dateApplied)}</dd>
        </div>
        <div>
          <dt>Salary</dt>
          <dd>{app.salary || "-"}</dd>
        </div>
        <div className="details__full">
          <dt>Job link</dt>
          <dd>
            {app.url ? (
              <a href={app.url} target="_blank" rel="noopener noreferrer">
                Open job posting <ExternalLink size={13} />
              </a>
            ) : (
              "-"
            )}
          </dd>
        </div>
        <div className="details__full">
          <dt>Notes</dt>
          <dd style={{ whiteSpace: "pre-wrap" }}>{app.notes || "-"}</dd>
        </div>
      </dl>

      <h4 className="timeline__title">Status history</h4>
      <ol className="timeline">
        {history.map((item, index) => (
          <li
            key={`${item.status}-${item.date}-${index}`}
            className={
              index === history.length - 1
                ? "timeline__item timeline__item--current"
                : "timeline__item"
            }
          >
            <StatusBadge status={item.status} />
            <span className="muted">{formatDate(item.date)}</span>
          </li>
        ))}
      </ol>
    </Modal>
  );
}