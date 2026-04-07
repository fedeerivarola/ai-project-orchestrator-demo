import { t } from "../i18n";

function ListBlock({ title, items }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-white">{title}</h3>
      <ul className="space-y-1 text-sm text-slate-300">
        {items.map((item) => (
          <li key={typeof item === "string" ? item : `${item.label}-${item.date}`} className="rounded bg-slate-800/70 px-2 py-1">
            {typeof item === "string" ? item : `${item.label}: ${item.date} (${item.priority})`}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GlobalContextPanel({ context, lang }) {
  return (
    <aside className="space-y-4 rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 shadow-xl">
      <h2 className="text-lg font-semibold text-white">{t(lang, "globalContext")}</h2>
      <ListBlock title={t(lang, "businessGoals")} items={context.businessGoals} />
      <ListBlock title={t(lang, "designRules")} items={context.designRules} />
      <ListBlock title={t(lang, "architecture")} items={context.architecture} />
      <ListBlock title={t(lang, "deadlines")} items={context.deadlines} />
      <ListBlock title={t(lang, "risks")} items={context.risks} />
    </aside>
  );
}
