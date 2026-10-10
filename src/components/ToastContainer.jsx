import { CheckCircle2, AlertCircle } from "lucide-react";

export default function ToastContainer({ toasts }) {
  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          {t.type === "error" ? (
            <AlertCircle size={18} color="#ef4444" />
          ) : (
            <CheckCircle2 size={18} color="#22c55e" />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}