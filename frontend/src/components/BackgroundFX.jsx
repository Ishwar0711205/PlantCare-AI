import { useMemo } from 'react'
import { LeafIcon } from './icons'

/**
 * Site-wide ambient background.
 *
 * Purely decorative: fixed, `pointer-events-none`, aria-hidden, and painted at
 * very low opacity so it can never sit on top of text, buttons, charts, image
 * previews or prediction results in a way that reduces readability.
 *
 * The photographic layers reuse real PlantVillage reference images that already
 * ship in /public/healthy_images — nothing is generated or invented. They are
 * heavily blurred and dimmed to the point where they read as colour and texture
 * rather than as pictures.
 *
 * Everything animates with CSS only (no canvas, no rAF loop) and is switched
 * off by the global `prefers-reduced-motion` rule in index.css.
 */

const BLOBS = [
  { size: 'h-[30rem] w-[30rem]', pos: '-left-32 -top-40', color: 'bg-leaf-400/20', anim: 'blob-float', dur: 26 },
  { size: 'h-[24rem] w-[24rem]', pos: 'right-[-9rem] top-[10%]', color: 'bg-leaf-500/15', anim: 'blob-float-2', dur: 32 },
  { size: 'h-[26rem] w-[26rem]', pos: 'left-[40%] top-[58%]', color: 'bg-emerald-400/10', anim: 'blob-float', dur: 38 },
  { size: 'h-[20rem] w-[20rem]', pos: 'right-[8%] bottom-[-6rem]', color: 'bg-leaf-300/20', anim: 'blob-float-2', dur: 30 },
]

/* Real dataset photographs, heavily blurred — colour and depth, not content. */
const PHOTOS = [
  { src: '/healthy_images/Apple_healthy.png', pos: '-right-24 top-[6%]', size: 'h-[26rem] w-[26rem]', o: 0.05, blur: 'blur-3xl', dur: 34, delay: 0 },
  { src: '/healthy_images/Tomato_healthy.png', pos: '-left-28 bottom-[8%]', size: 'h-[30rem] w-[30rem]', o: 0.04, blur: 'blur-3xl', dur: 41, delay: 4 },
  { src: '/healthy_images/Grape_healthy.png', pos: 'right-[6%] bottom-[26%]', size: 'h-[20rem] w-[20rem]', o: 0.03, blur: 'blur-2xl', dur: 47, delay: 9 },
]

/** Deterministic particle field — no randomness, so React never re-orders nodes. */
const PARTICLES = [
  { left: '6%', size: 5, dur: 19, delay: 0, o: 0.4 },
  { left: '14%', size: 3, dur: 24, delay: 2.4, o: 0.3 },
  { left: '23%', size: 4, dur: 21, delay: 5.1, o: 0.35 },
  { left: '31%', size: 3, dur: 27, delay: 1.2, o: 0.28 },
  { left: '39%', size: 5, dur: 22, delay: 7.6, o: 0.35 },
  { left: '47%', size: 3, dur: 25, delay: 3.3, o: 0.3 },
  { left: '55%', size: 4, dur: 20, delay: 9.2, o: 0.4 },
  { left: '62%', size: 3, dur: 28, delay: 4.4, o: 0.28 },
  { left: '70%', size: 5, dur: 23, delay: 6.1, o: 0.35 },
  { left: '77%', size: 3, dur: 26, delay: 0.8, o: 0.3 },
  { left: '84%', size: 4, dur: 21, delay: 8.3, o: 0.35 },
  { left: '91%', size: 3, dur: 24, delay: 2.9, o: 0.28 },
]

const LEAVES = [
  { left: '8%', top: '22%', size: 30, rot: -18, dur: 21, delay: 0, o: 0.1 },
  { left: '80%', top: '16%', size: 24, rot: 24, dur: 26, delay: 3.2, o: 0.09 },
  { left: '64%', top: '72%', size: 34, rot: -8, dur: 29, delay: 6.5, o: 0.08 },
  { left: '26%', top: '82%', size: 26, rot: 14, dur: 24, delay: 1.8, o: 0.09 },
  { left: '46%', top: '36%', size: 20, rot: -30, dur: 31, delay: 9.4, o: 0.07 },
]

/** Faint neural lattice drawn as a single inline SVG. */
function NeuralLattice() {
  const nodes = useMemo(
    () => [
      [40, 30], [140, 70], [250, 26], [350, 78], [70, 130], [185, 150],
      [300, 140], [410, 120], [110, 210], [240, 226], [370, 200], [30, 190],
    ],
    [],
  )
  const links = useMemo(
    () => [
      [0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [3, 6], [4, 5], [5, 6],
      [6, 7], [4, 8], [5, 9], [6, 9], [7, 10], [8, 9], [9, 10], [4, 11], [8, 11],
    ],
    [],
  )

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 440 260"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" className="text-leaf-600" strokeWidth="0.6" fill="none" opacity="0.5">
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            strokeDasharray="4 10"
            style={{ animation: `dashFlow ${34 + i}s linear infinite` }}
          />
        ))}
      </g>
      <g className="text-leaf-500" opacity="0.45">
        {nodes.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="1.6"
            fill="currentColor"
            className="lattice-node"
            style={{ animationDelay: `${(i % 5) * 0.7}s` }}
          />
        ))}
      </g>
    </svg>
  )
}

export default function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Blurred dataset photographs — the main source of depth */}
      {PHOTOS.map((p, i) => (
        <div
          key={i}
          className={`absolute ${p.size} ${p.pos} ${p.blur} ${p.o > 0.12 ? 'blob-float' : 'blob-float-2'} overflow-hidden rounded-full`}
          style={{ opacity: p.o, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
        >
          <img
            src={p.src}
            alt=""
            aria-hidden="true"
            className="h-full w-full scale-125 object-cover"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      ))}

      {/* Slowly moving colour fields */}
      {BLOBS.map((b, i) => (
        <div
          key={`b${i}`}
          className={`absolute rounded-full blur-2xl ${b.size} ${b.pos} ${b.color} ${b.anim}`}
          style={{ animationDuration: `${b.dur}s`, willChange: 'transform' }}
        />
      ))}

      {/* Dot / neural texture, faded so it never competes with content */}
      <div className="net-dots mask-fade-radial absolute inset-0 opacity-15" />
      <div className="absolute inset-x-0 top-0 h-[70vh] text-leaf-700 opacity-[0.03]">
        <NeuralLattice />
      </div>
      <div className="leaf-texture mask-fade-radial absolute inset-0 opacity-[0.06]" />

      {/* Floating leaf silhouettes */}
      {LEAVES.map((l, i) => (
        <span
          key={`l${i}`}
          className="leaf-drift absolute text-leaf-700"
          style={{
            left: l.left,
            top: l.top,
            opacity: l.o,
            '--drift-dur': `${l.dur}s`,
            animationDelay: `${l.delay}s`,
          }}
        >
          <LeafIcon size={l.size} style={{ transform: `rotate(${l.rot}deg)` }} />
        </span>
      ))}

      {/* Slow rising particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={`p${i}`}
          className="particle-rise absolute bottom-[-20%] rounded-full bg-leaf-500"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            '--particle-dur': `${p.dur}s`,
            '--particle-o': p.o,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Vignette + bottom fade so sections read as one continuous surface */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,transparent_35%,rgba(4,26,14,0.05)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#eef6f1] to-transparent" />
    </div>
  )
}
