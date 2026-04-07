import { t } from "../i18n";

export function DecisionPanel({ decision, highlight, lang }) {
  return (
    <section
      className={`rounded-2xl border border-violet-500/30 bg-violet-900/20 p-4 transition ${
        highlight ? "ring-2 ring-violet-300/70 animate-pulse" : ""
      }`}
    >
      <h2 className="text-lg font-semibold text-white">{t(lang, "globalDecision")}</h2>
      {decision ? (
        <>
          <p className="mt-2 text-sm font-medium text-violet-100">{decision.title}</p>
          <p className="mt-2 text-sm text-slate-200">{decision.summary}</p>
        </>
      ) : (
        <p className="mt-2 text-sm text-slate-300">{t(lang, "noDecisions")}</p>
      )}
    </section>
  );
}
