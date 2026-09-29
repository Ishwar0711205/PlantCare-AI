/**
 * Small titled panel used by the result sections. Content is always visible —
 * nothing important is hidden behind a click.
 */
export default function InfoCard({ icon, title, children, tone = 'leaf', className = '' }) {
  const tones = {
    leaf: 'bg-leaf-50 text-leaf-600',
    amber: 'bg-amber-50 text-amber-600',
    sky: 'bg-sky-50 text-sky-600',
    slate: 'bg-slate-100 text-slate-600',
  }

  return (
    <section
      className={`group rounded-2xl border border-leaf-100 bg-white p-5 shadow-sm shadow-leaf-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-leaf-200 hover:shadow-md ${className}`}
    >
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${tones[tone] || tones.leaf}`}>
            {icon}
          </span>
        )}
        <h3 className="font-display text-[13px] font-bold uppercase tracking-wider text-leaf-900">{title}</h3>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-leaf-950/85">{children}</div>
    </section>
  )
}

/**
 * Notice for a field the knowledge base does not record at all.
 *
 * Names the exact JSON key that is missing so the gap reads as a known,
 * documented limitation of `plant_info.json` rather than a loading failure or
 * a bug — and so nobody is tempted to fill it with invented advice.
 */
export function MissingFieldNote({ field, children }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-3 py-2.5">
      <p className="text-[13px] italic leading-relaxed text-slate-700">{children}</p>
      <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-slate-500">
        Not recorded in <code className="rounded bg-slate-200/70 px-1 py-0.5 font-mono text-[10px] text-slate-700">{field}</code>{' '}
        — no content is shown rather than generated.
      </p>
    </div>
  )
}
