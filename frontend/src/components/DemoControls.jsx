import { t } from "../i18n";

export function DemoControls({ eventCatalog, onTrigger, lang }) {
  return (
    <div className="flex flex-wrap gap-2">
      {eventCatalog.map((event) => (
        <button
          key={event.id}
          type="button"
          onClick={() => onTrigger(event.id)}
          className="rounded-lg border border-cyan-400/40 bg-cyan-500/20 px-3 py-2 text-xs font-medium text-cyan-100 transition hover:bg-cyan-400/30"
        >
          {t(lang, "simulate")}: {event.title}
        </button>
      ))}
    </div>
  );
}
