import { ToastCard } from "./ToastCard";

export function ToastContainer({ toasts, onClose, lang }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex max-h-[90vh] flex-col gap-2 overflow-hidden">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastCard toast={toast} onClose={onClose} lang={lang} />
        </div>
      ))}
    </div>
  );
}
