import { LeafIcon } from './icons'

export default function Logo({ className = '', compact = false }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-leaf-500 to-leaf-700 text-white shadow-sm shadow-leaf-600/30">
        <LeafIcon size={20} />
      </span>
      {!compact && (
        <span className="font-display text-lg font-semibold tracking-tight text-leaf-950">
          PlantCare <span className="text-leaf-600">AI</span>
        </span>
      )}
    </span>
  )
}