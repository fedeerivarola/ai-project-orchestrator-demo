import { t } from "../i18n";

export function EventDetail({ event, lang }) {
  if (!event) {
    return (
      <section className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
        <h2 className="text-lg font-semibold text-white">{t(lang, "eventDetail")}</h2>
        <p className="mt-2 text-sm text-slate-400">{t(lang, "selectEvent")}</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
      <h2 className="text-lg font-semibold text-white">{t(lang, "eventDetail")}</h2>
      <p className="mt-3 text-sm text-cyan-100">{event.payload.message}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-slate-200">
          {t(lang, "type")}: {event.type}
        </span>
        <span className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-slate-200">
          {t(lang, "source")}: {event.sourceRole}
        </span>
      </div>
    </section>
  );
}
