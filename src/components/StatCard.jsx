export default function StatCard({ label, value, icon: Icon, color, background }) {
  return (
    <div className="card stat-card">
      <div className="stat-card__icon" style={{ background, color }}>
        <Icon size={24} />
      </div>
      <div>
        <div className="stat-card__label">{label}</div>
        <div className="stat-card__value">{value}</div>
      </div>
    </div>
  );
}