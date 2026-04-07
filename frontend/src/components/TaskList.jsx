export function TaskList({ items, title, emptyText }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-300">{title}</h4>
      <ul className="mt-2 space-y-1 text-sm text-slate-200">
        {items.length === 0 ? (
          <li className="rounded bg-slate-800/80 px-2 py-1 text-slate-400">{emptyText}</li>
        ) : (
          items.slice(0, 4).map((item) => (
            <li key={item} className="rounded bg-slate-800/80 px-2 py-1">
              {item}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
