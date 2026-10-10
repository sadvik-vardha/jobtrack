export default function EmptyState({ icon: Icon, title, message, children }) {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-state__icon">
          <Icon size={28} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{message}</p>
      {children && <div className="empty-state__actions">{children}</div>}
    </div>
  );
}