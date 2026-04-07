import { roleMeta } from "../data/roleMeta";
import { t } from "../i18n";
import { TaskList } from "./TaskList";

export function RoleCard({ roleData, lang }) {
  const meta = roleMeta[roleData.role];
  return (
    <article
      className={`rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-lg transition hover:-translate-y-0.5 ${
        roleData.isHighlighted ? "ring-2 ring-cyan-400/70 ring-offset-1 ring-offset-slate-950" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">{meta?.labels?.[lang] || roleData.role}</h3>
        <span className={`rounded border px-2 py-0.5 text-[11px] ${meta?.color || ""}`}>{t(lang, "active")}</span>
      </div>
      <p className="mt-2 text-sm text-slate-300">{roleData.impact}</p>
      <div className="mt-3 space-y-3">
        <TaskList items={roleData.tasks} title={t(lang, "tasks")} emptyText={t(lang, "noTasks")} />
        <TaskList items={roleData.blockers} title={t(lang, "blockers")} emptyText={t(lang, "noBlockers")} />
        <TaskList items={roleData.dependencies} title={t(lang, "dependencies")} emptyText={t(lang, "noDependencies")} />
        <TaskList items={roleData.artifacts} title={t(lang, "artifacts")} emptyText={t(lang, "noArtifacts")} />
      </div>
    </article>
  );
}
