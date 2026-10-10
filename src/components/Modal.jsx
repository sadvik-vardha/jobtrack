import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ title, onClose, children, footer, small = false }) {
  // Close with Escape key.
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        // Close only when clicking the dark area, not the modal itself.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modal ${small ? "modal--sm" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal__header">
          <h3>{title}</h3>
          <button
            className="icon-btn icon-btn--plain"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}