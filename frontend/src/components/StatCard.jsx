export default function StatCard({ value, label, icon }) {
  return (
    <div className="group rounded-2xl border border-leaf-100 bg-white p-6 text-center shadow-sm shadow-leaf-900/5 transition-hover hover:-translate-y-1 hover:border-leaf-200 hover:shadow-md hover:shadow-leaf-900/10">
      {icon && <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl bg-leaf-50 text-leaf-600 transition-hover group-hover:bg-leaf-100">{icon}</div>}
      <p className="font-display text-3xl font-bold tracking-tight text-leaf-700">{value}</p>
      <p className="mt-1 text-sm text-leaf-950/78">{label}</p>
    </div>
  )
}