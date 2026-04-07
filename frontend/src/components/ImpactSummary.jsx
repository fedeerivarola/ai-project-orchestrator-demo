import { t } from "../i18n";

export function ImpactSummary({ trace, highlight, lang }) {
  return (
    <section
      className={`rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 transition ${
        highlight ? "ring-2 ring-cyan-300/70 animate-pulse" : ""
      }`}
    >
      <h2 className="text-lg font-semibold text-white">{t(lang, "impactSummary")}</h2>
      {!trace ? (
        <p className="mt-2 text-sm text-slate-400">{t(lang, "triggerToSeeImpact")}</p>
      ) : (
        <>
          <p className="mt-2 text-sm text-slate-200">{trace.crossImpactSummary}</p>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {trace.impacts.map((impact) => (
              <div key={impact.role} className="rounded border border-slate-700 bg-slate-800/80 p-2 text-xs text-slate-200">
                <p className="font-semibold text-white">{impact.roleLabel}</p>
                <p className="mt-1">{impact.impact}</p>
                {impact.blockers.length > 0 && (
                  <p className="mt-1 text-rose-300">
                    {t(lang, "blockers")}: {impact.blockers.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
