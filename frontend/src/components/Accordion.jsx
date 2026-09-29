import { useState } from 'react'
import { ChevronDown } from './icons'

export default function Accordion({ items }) {
  const [openIdx, setOpenIdx] = useState(0)
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIdx === i
        return (
          <div
            key={i}
            className={`overflow-hidden rounded-xl border transition-hover ${
              isOpen ? 'border-leaf-300 bg-white shadow-sm shadow-leaf-900/5' : 'border-leaf-100 bg-white/70'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-leaf-50 text-leaf-600">
                  {item.icon}
                </span>
                <span className="font-display text-sm font-semibold text-leaf-950 sm:text-base">{item.label}</span>
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-leaf-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-leaf-50 px-5 py-4 text-sm leading-relaxed text-leaf-950/85">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}