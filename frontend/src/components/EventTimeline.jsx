import { t } from "../i18n";

export function EventTimeline({ timeline, selectedEventId, onSelect, lang }) {
  const latestEventId = timeline[0]?.instanceId;
  return (
    <section className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 shadow-xl">
      <h2 className="mb-3 text-lg font-semibold text-white">{t(lang, "timeline")}</h2>
      <div className="max-h-80 space-y-2 overflow-auto pr-1">
        {timeline.length === 0 && <p className="text-sm text-slate-400">{t(lang, "noEvents")}</p>}
        {timeline.map((event) => {
          const isSelected = selectedEventId === event.instanceId;
          const isLatest = latestEventId === event.instanceId;
          return (
            <button
              key={event.instanceId}
              type="button"
              onClick={() => onSelect(event.instanceId)}
              className={`w-full rounded-lg border p-3 text-left text-sm transition ${
                isSelected
                  ? "border-cyan-400/60 bg-cyan-500/20 text-cyan-50"
                  : "border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700"
              } ${isLatest ? "ring-1 ring-cyan-300/70 shadow-[0_0_24px_rgba(34,211,238,0.18)]" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{event.title}</p>
                {isLatest && (
                  <span className="rounded-full border border-cyan-300/40 bg-cyan-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-100">
                    {t(lang, "latestChange")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs opacity-80">{new Date(event.timestamp).toLocaleString()}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
