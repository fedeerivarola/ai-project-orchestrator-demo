import { roleMeta } from "../data/roleMeta";
import { t } from "../i18n";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getCompletion(roleData) {
  const tasks = roleData.tasks?.length || 0;
  const blockers = roleData.blockers?.length || 0;
  const dependencies = roleData.dependencies?.length || 0;
  const raw = 92 - tasks * 7 - dependencies * 5 - blockers * 18;
  return clamp(raw, 20, 96);
}

function getStatus(roleData, completion) {
  const blockers = roleData.blockers?.length || 0;
  const dependencies = roleData.dependencies?.length || 0;
  if (blockers > 0) return "blocked";
  if (dependencies > 0 && completion < 70) return "at_risk";
  return "active";
}

const statusStyles = {
  active: "text-emerald-200 bg-emerald-500/20 border-emerald-400/40",
  at_risk: "text-amber-100 bg-amber-500/20 border-amber-400/40",
  blocked: "text-rose-100 bg-rose-500/20 border-rose-400/40",
};

export function ExecutionMonitor({ roleContexts, lang }) {
  const rows = Object.values(roleContexts).map((roleData) => {
    const completion = getCompletion(roleData);
    const status = getStatus(roleData, completion);
    return { roleData, completion, status };
  });

  return (
    <section className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 shadow-xl">
      <h2 className="text-lg font-semibold text-white">{t(lang, "executionMonitor")}</h2>
      <p className="mt-1 text-xs text-slate-400">{t(lang, "executionMonitorSubtitle")}</p>
      <div className="mt-3 space-y-2">
        {rows.map(({ roleData, completion, status }) => {
          const meta = roleMeta[roleData.role];
          const statusLabel =
            status === "blocked" ? t(lang, "statusBlocked") : status === "at_risk" ? t(lang, "statusRisk") : t(lang, "statusActive");
          const blockersCount = roleData.blockers?.length || 0;
          const tasksCount = roleData.tasks?.length || 0;
          const dependenciesCount = roleData.dependencies?.length || 0;
          return (
            <div key={roleData.role} className="rounded-lg border border-slate-700 bg-slate-800/80 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">{meta?.labels?.[lang] || roleData.role}</p>
                <span className={`rounded border px-2 py-0.5 text-[11px] ${statusStyles[status]}`}>
                  {statusLabel}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded bg-slate-700">
                <div className="h-full rounded bg-cyan-300/80" style={{ width: `${completion}%` }} />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                <p>{t(lang, "completion")}: {completion}%</p>
                <p>{t(lang, "tasks")}: {tasksCount}</p>
                <p>{t(lang, "blockers")}: {blockersCount}</p>
                <p>{t(lang, "dependencies")}: {dependenciesCount}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
