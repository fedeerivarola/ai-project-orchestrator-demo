import { t } from "../i18n";

export function Header({ project, onReset, children, lang, onLangChange }) {
  return (
    <header className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-6 shadow-2xl backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">AI Project Orchestrator</p>
          <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{t(lang, "headerTitle")}</h1>
          <p className="mt-1 text-sm text-slate-300">{t(lang, "headerSubtitle")}</p>
          <p className="mt-2 text-xs text-slate-400">
            {project.codename} · {project.status}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-100">
            {t(lang, "publicDemo")}
          </span>
          <label className="flex items-center gap-2 rounded-lg border border-slate-600/80 bg-slate-800/80 px-2 py-1 text-xs text-slate-200">
            {t(lang, "language")}
            <select
              value={lang}
              onChange={(event) => onLangChange(event.target.value)}
              className="rounded bg-slate-900 px-2 py-0.5 text-xs text-slate-100 outline-none"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
          </label>
          {children}
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg border border-slate-500 px-3 py-2 text-sm text-slate-100 transition hover:bg-slate-700"
          >
            {t(lang, "resetDemo")}
          </button>
        </div>
      </div>
    </header>
  );
}
