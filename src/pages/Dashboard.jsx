import {
  Briefcase,
  CalendarCheck,
  Trophy,
  XCircle,
  Plus,
  Inbox,
  Sparkles,
} from "lucide-react";
import StatCard from "../components/StatCard";
import StatusChart from "../components/StatusChart";
import ActivityChart from "../components/ActivityChart";
import ApplicationsTable from "../components/ApplicationsTable";
import EmptyState from "../components/EmptyState";
import { getStats, getStatusData } from "../utils/stats";

export default function Dashboard({
  name,
  applications,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onNavigate,
  onLoadSamples,
}) {
  const stats = getStats(applications);
  const statusData = getStatusData(applications);

  const recent = [...applications]
    .sort((a, b) => b.dateApplied.localeCompare(a.dateApplied))
    .slice(0, 5);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>{name ? `Welcome back, ${name}` : "Welcome back"}</h2>
          <p>Here is how your job search is going.</p>
        </div>
        <div className="page-header__actions">
          <button className="btn btn--primary" onClick={onAdd}>
            <Plus size={18} /> Add application
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard
          label="Total applications"
          value={stats.total}
          icon={Briefcase}
          color="var(--primary)"
          background="var(--primary-soft)"
        />
        <StatCard
          label="Interviews"
          value={stats.interviews}
          icon={CalendarCheck}
          color="var(--purple)"
          background="var(--purple-soft)"
        />
        <StatCard
          label="Offers"
          value={stats.offers}
          icon={Trophy}
          color="var(--success)"
          background="var(--success-soft)"
        />
        <StatCard
          label="Rejections"
          value={stats.rejections}
          icon={XCircle}
          color="var(--danger)"
          background="var(--danger-soft)"
        />
      </div>

      <div className="grid-2">
        <StatusChart data={statusData} />
        <ActivityChart applications={applications} />
      </div>

      <div className="card">
        <div className="card__header">
          <div>
            <h3 className="card__title">Recent applications</h3>
            <p className="card__subtitle">Your 5 latest applications</p>
          </div>
          {applications.length > 0 && (
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => onNavigate("applications")}
            >
              View all
            </button>
          )}
        </div>

        {applications.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No applications yet"
            message="Add your first application to start tracking, or load demo data to explore the app."
          >
            <button className="btn btn--primary" onClick={onAdd}>
              <Plus size={18} /> Add application
            </button>
            <button className="btn btn--secondary" onClick={onLoadSamples}>
              <Sparkles size={18} /> Load demo data
            </button>
          </EmptyState>
        ) : (
          <ApplicationsTable
            applications={recent}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        )}
      </div>
    </div>
  );
}