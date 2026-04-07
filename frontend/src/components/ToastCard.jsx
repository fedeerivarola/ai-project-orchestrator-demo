import { useEffect, useMemo, useState } from "react";
import { t } from "../i18n";

const typeStyles = {
  info: "border-sky-400/50 bg-sky-500/15",
  success: "border-emerald-400/50 bg-emerald-500/15",
  warning: "border-amber-400/50 bg-amber-500/15",
  impact: "border-fuchsia-400/50 bg-fuchsia-500/15",
  decision: "border-violet-400/50 bg-violet-500/15",
};

export function ToastCard({ toast, onClose, lang }) {
  const typeLabels = {
    es: { info: "info", success: "exito", warning: "alerta", impact: "impacto", decision: "decision" },
    en: { info: "info", success: "success", warning: "warning", impact: "impact", decision: "decision" },
  };
  const [now, setNow] = useState(Date.now());
  const ttlMs = toast.ttlMs || 5000;
  const createdAt = toast.createdAt || now;

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 150);
    return () => clearInterval(timer);
  }, []);

  const remainingMs = Math.max(0, createdAt + ttlMs - now);
  const remainingSeconds = (remainingMs / 1000).toFixed(1);
  const progress = useMemo(() => {
    if (!ttlMs) return 0;
    return Math.max(0, Math.min(100, (remainingMs / ttlMs) * 100));
  }, [remainingMs, ttlMs]);

  return (
    <article
      className={`w-[320px] rounded-xl border p-3 shadow-2xl backdrop-blur transition-all duration-300 ${
        typeStyles[toast.type] || "border-slate-500/50 bg-slate-700/30"
      } ${toast.leaving ? "translate-x-8 opacity-0" : "translate-x-0 opacity-100"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-200">
            {typeLabels[lang]?.[toast.type] || toast.type}
          </p>
          <p className="mt-1 text-sm font-semibold text-white">{toast.title}</p>
        </div>
        <button
          type="button"
          onClick={() => onClose(toast.id)}
          className="rounded border border-slate-400/40 px-2 py-0.5 text-xs text-slate-200 hover:bg-slate-700/40"
        >
          {t(lang, "close")}
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-200">{toast.message}</p>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-300">
          <span>{t(lang, "visibleFor")}</span>
          <span>{remainingSeconds}s</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded bg-slate-700/70">
          <div
            className="h-full rounded bg-white/80 transition-[width] duration-150 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </article>
  );
}
