import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import ApplicationFormModal from "./components/ApplicationFormModal";
import ApplicationDetailsModal from "./components/ApplicationDetailsModal";
import ProfileModal from "./components/ProfileModal";
import ConfirmDialog from "./components/ConfirmDialog";
import ToastContainer from "./components/ToastContainer";
import useApplications from "./hooks/useApplications";
import useToasts from "./hooks/useToasts";
import useTheme from "./hooks/useTheme";
import usePersistedState from "./hooks/usePersistedState";
import { exportApplications, importApplications } from "./utils/backup";
import { getInitials } from "./utils/helpers";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  applications: "Applications",
};

export default function App() {
  const store = useApplications();
  const { toasts, showToast } = useToasts();
  const { theme, toggleTheme } = useTheme();

  // Remembered after refresh.
  const [collapsed, setCollapsed] = usePersistedState(
    "jobtrack.sidebarCollapsed",
    false,
    (v) => typeof v === "boolean"
  );
  const [name, setName] = usePersistedState(
    "jobtrack.profileName",
    "",
    (v) => typeof v === "string" && v.length <= 40
  );

  const [page, setPage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  // null = closed, "new" = add mode, object = edit that application
  const [formTarget, setFormTarget] = useState(null);
  // null = closed, object = application waiting for delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  // null = closed, object = application shown in details popup
  const [viewTarget, setViewTarget] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  function navigate(nextPage) {
    setPage(nextPage);
    setMobileOpen(false);
  }

  function handleSearchChange(value) {
    setSearch(value);
    if (value.trim() !== "" && page !== "applications") {
      setPage("applications");
    }
  }

  function handleSave(data) {
    if (formTarget === "new") {
      store.addApplication(data);
      showToast(`Added ${data.company} application`);
    } else {
      store.updateApplication(formTarget.id, data);
      showToast(`Updated ${data.company} application`);
    }
    setFormTarget(null);
  }

  function handleConfirmDelete() {
    store.deleteApplication(deleteTarget.id);
    showToast(`Deleted ${deleteTarget.company} application`);
    setDeleteTarget(null);
  }

  function handleStatusChange(app, status) {
    store.updateStatus(app.id, status);
    showToast(`${app.company} moved to ${status}`);
  }

  function handleLoadSamples() {
    store.loadSamples();
    showToast("Demo data loaded");
  }

  function handleClearAll() {
    store.clearAll();
    showToast("All applications cleared");
  }

  function handleExport() {
    exportApplications(store.applications);
    showToast(`Exported ${store.applications.length} applications`);
  }

  async function handleImport(file) {
    try {
      const { applications, skipped } = await importApplications(file);
      store.replaceAll(applications);
      showToast(
        skipped > 0
          ? `Imported ${applications.length} applications (${skipped} skipped)`
          : `Imported ${applications.length} applications`
      );
    } catch (error) {
      showToast(error.message, "error");
    }
  }

  function handleSaveProfile(newName) {
    setName(newName);
    setProfileOpen(false);
    showToast(newName ? "Profile saved" : "Name removed");
  }

  return (
    <div className="app-shell">
      <Sidebar
        currentPage={page}
        onNavigate={navigate}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="main">
        <Topbar
          title={PAGE_TITLES[page]}
          search={search}
          onSearchChange={handleSearchChange}
          onOpenMenu={() => setMobileOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          initials={name ? getInitials(name) : "ME"}
          onOpenProfile={() => setProfileOpen(true)}
        />

        {store.storageError && (
          <div
            role="alert"
            style={{
              background: "var(--warning-soft)",
              color: "var(--warning)",
              padding: "10px 28px",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Browser storage is unavailable. Your changes will be lost when you close this tab.
          </div>
        )}

        {page === "dashboard" && (
          <Dashboard
            name={name}
            applications={store.applications}
            onAdd={() => setFormTarget("new")}
            onEdit={(app) => setFormTarget(app)}
            onDelete={(app) => setDeleteTarget(app)}
            onView={(app) => setViewTarget(app)}
            onNavigate={navigate}
            onLoadSamples={handleLoadSamples}
          />
        )}
        {page === "applications" && (
          <Applications
            applications={store.applications}
            search={search}
            onClearSearch={() => setSearch("")}
            onAdd={() => setFormTarget("new")}
            onEdit={(app) => setFormTarget(app)}
            onDelete={(app) => setDeleteTarget(app)}
            onView={(app) => setViewTarget(app)}
            onStatusChange={handleStatusChange}
            onClearAll={handleClearAll}
            onLoadSamples={handleLoadSamples}
            onExport={handleExport}
            onImport={handleImport}
          />
        )}
      </div>

      {viewTarget && (
        <ApplicationDetailsModal
          application={viewTarget}
          onEdit={(app) => {
            setViewTarget(null);
            setFormTarget(app);
          }}
          onClose={() => setViewTarget(null)}
        />
      )}

      {formTarget && (
        <ApplicationFormModal
          application={formTarget === "new" ? null : formTarget}
          onSave={handleSave}
          onClose={() => setFormTarget(null)}
        />
      )}

      {profileOpen && (
        <ProfileModal
          name={name}
          onSave={handleSaveProfile}
          onClose={() => setProfileOpen(false)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete application?"
          message={`Delete your ${deleteTarget.title} application at ${deleteTarget.company}? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}