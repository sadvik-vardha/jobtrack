import { useState, useRef } from "react";
import {
  Plus,
  Inbox,
  SearchX,
  Sparkles,
  Trash2,
  FilterX,
  Download,
  Upload,
  Table2,
  Columns3,
} from "lucide-react";
import ApplicationsTable from "../components/ApplicationsTable";
import KanbanBoard from "../components/KanbanBoard";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import usePersistedState from "../hooks/usePersistedState";
import { STATUSES, JOB_TYPES } from "../utils/constants";

export default function Applications({
  applications,
  search,
  onClearSearch,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  onClearAll,
  onLoadSamples,
  onExport,
  onImport,
}) {
  // These choices are remembered after refresh.
  const [statusFilter, setStatusFilter] = usePersistedState(
    "jobtrack.filter.status",
    "all",
    (v) => v === "all" || STATUSES.includes(v)
  );
  const [typeFilter, setTypeFilter] = usePersistedState(
    "jobtrack.filter.type",
    "all",
    (v) => v === "all" || JOB_TYPES.includes(v)
  );
  const [locationFilter, setLocationFilter] = usePersistedState(
    "jobtrack.filter.location",
    "all",
    (v) => typeof v === "string"
  );
  const [sortOrder, setSortOrder] = usePersistedState(
    "jobtrack.sortOrder",
    "desc", // desc = newest first
    (v) => v === "asc" || v === "desc"
  );
  const [view, setView] = usePersistedState(
    "jobtrack.view",
    "table",
    (v) => v === "table" || v === "board"
  );

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const fileInput = useRef(null);

  // Location options come from the real data.
  const locations = [...new Set(applications.map((a) => a.location))].sort((a, b) =>
    a.localeCompare(b)
  );
  // If the chosen location no longer exists, act like "all".
  const activeLocation = locations.includes(locationFilter) ? locationFilter : "all";

  const query = search.trim().toLowerCase();

  const visible = applications
    .filter((app) => {
      if (
        query &&
        !app.company.toLowerCase().includes(query) &&
        !app.title.toLowerCase().includes(query)
      ) {
        return false;
      }
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      if (typeFilter !== "all" && app.type !== typeFilter) return false;
      if (activeLocation !== "all" && app.location !== activeLocation) return false;
      return true;
    })
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.dateApplied.localeCompare(b.dateApplied)
        : b.dateApplied.localeCompare(a.dateApplied)
    );

  const filtersActive =
    query !== "" ||
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    activeLocation !== "all";

  function resetFilters() {
    setStatusFilter("all");
    setTypeFilter("all");
    setLocationFilter("all");
    onClearSearch();
  }

  function confirmClear() {
    onClearAll();
    setShowClearConfirm(false);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>All applications</h2>
          <p>
            {applications.length === 0
              ? "Nothing tracked yet."
              : `Showing ${visible.length} of ${applications.length} applications`}
          </p>
        </div>
        <div className="page-header__actions">
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(e) => {
              onImport(e.target.files[0]);
              e.target.value = "";
            }}
          />
          <button
            className="btn btn--secondary"
            onClick={() => fileInput.current.click()}
          >
            <Upload size={18} /> Import
          </button>
          {applications.length > 0 && (
            <button className="btn btn--secondary" onClick={onExport}>
              <Download size={18} /> Export
            </button>
          )}
          {applications.length > 0 && (
            <button
              className="btn btn--secondary"
              onClick={() => setShowClearConfirm(true)}
            >
              <Trash2 size={18} /> Clear all data
            </button>
          )}
          <button className="btn btn--primary" onClick={onAdd}>
            <Plus size={18} /> Add application
          </button>
        </div>
      </div>

      {applications.length > 0 && (
        <div className="toolbar">
          <select
            className="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by job type"
          >
            <option value="all">All job types</option>
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            className="select"
            value={activeLocation}
            onChange={(e) => setLocationFilter(e.target.value)}
            aria-label="Filter by location"
          >
            <option value="all">All locations</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          {filtersActive && (
            <button className="btn btn--ghost" onClick={resetFilters}>
              <FilterX size={18} /> Reset filters
            </button>
          )}

          <div
            className="view-toggle"
            role="group"
            aria-label="Choose view"
            style={{ marginLeft: "auto" }}
          >
            <button
              aria-pressed={view === "table"}
              onClick={() => setView("table")}
            >
              <Table2 size={16} /> Table
            </button>
            <button
              aria-pressed={view === "board"}
              onClick={() => setView("board")}
            >
              <Columns3 size={16} /> Board
            </button>
          </div>
        </div>
      )}

      <div className="card">
        {applications.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No applications yet"
            message="Add your first application, or load demo data to explore the app."
          >
            <button className="btn btn--primary" onClick={onAdd}>
              <Plus size={18} /> Add application
            </button>
            <button className="btn btn--secondary" onClick={onLoadSamples}>
              <Sparkles size={18} /> Load demo data
            </button>
          </EmptyState>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No matching applications"
            message="Nothing matches your search and filters. Try different words or reset the filters."
          >
            <button className="btn btn--primary" onClick={resetFilters}>
              <FilterX size={18} /> Reset filters
            </button>
          </EmptyState>
        ) : view === "board" ? (
          <KanbanBoard
            applications={visible}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            onStatusChange={onStatusChange}
          />
        ) : (
          <ApplicationsTable
            applications={visible}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            onStatusChange={onStatusChange}
            sortOrder={sortOrder}
            onToggleSort={() =>
              setSortOrder((o) => (o === "desc" ? "asc" : "desc"))
            }
          />
        )}
      </div>

      {showClearConfirm && (
        <ConfirmDialog
          title="Clear all data?"
          message={`This permanently deletes all ${applications.length} applications. Demo data will not come back automatically.`}
          confirmLabel="Clear all"
          onConfirm={confirmClear}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </div>
  );
}