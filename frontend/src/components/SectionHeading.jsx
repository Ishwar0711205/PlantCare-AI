export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full bg-leaf-100 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-leaf-700">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-leaf-950 sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base leading-relaxed text-leaf-950/88">{subtitle}</p>}
    </div>
  )
}