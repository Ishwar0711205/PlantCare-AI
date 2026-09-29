export default function FeatureCard({ icon, title, text, accent = 'leaf' }) {
  const accents = {
    leaf: 'bg-leaf-50 text-leaf-600 group-hover:bg-leaf-100',
    amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
    blue: 'bg-sky-50 text-sky-600 group-hover:bg-sky-100',
    violet: 'bg-violet-50 text-violet-600 group-hover:bg-violet-100',
  }
  return (
    <div className="group rounded-2xl border border-leaf-100 bg-white p-6 shadow-sm shadow-leaf-900/5 transition-hover hover:-translate-y-1 hover:border-leaf-200 hover:shadow-md hover:shadow-leaf-900/10">
      <div className={`grid h-12 w-12 place-items-center rounded-xl transition-hover ${accents[accent]}`}>{icon}</div>
      <h3 className="mt-4 font-display text-lg font-semibold text-leaf-950">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-leaf-950/78">{text}</p>
    </div>
  )
}