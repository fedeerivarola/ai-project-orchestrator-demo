import { RoleCard } from "./RoleCard";
import { t } from "../i18n";

export function RoleBoard({ roleContexts, highlightedRoles = [], lang }) {
  return (
    <section className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 shadow-xl">
      <h2 className="mb-3 text-lg font-semibold text-white">{t(lang, "roleImpact")}</h2>
      <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-5">
        {Object.values(roleContexts).map((roleData) => {
          const withHighlight = {
            ...roleData,
            isHighlighted: highlightedRoles.includes(roleData.role),
          };
          return <RoleCard key={roleData.role} roleData={withHighlight} lang={lang} />;
        })}
      </div>
    </section>
  );
}
