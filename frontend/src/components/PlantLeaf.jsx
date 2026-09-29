// Self-contained SVG leaf artwork. Used for the hero visual and disease cards
// so the UI has consistent, reliable, dependency-free plant imagery.
export default function PlantLeaf({
  healthy = true,
  className = '',
  spotCount = 5,
  tooltip = '',
}) {
  const spots = healthy
    ? []
    : [
        [44, 40],
        [70, 52],
        [50, 66],
        [76, 74],
        [36, 72],
        [62, 90],
        [80, 42],
      ].slice(0, spotCount)

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={tooltip}
    >
      <defs>
        <linearGradient id="leaf-body" x1="0" y1="0" x2="1" y2="1">
          {healthy ? (
            <>
              <stop offset="0%" stopColor="#5fb474" />
              <stop offset="55%" stopColor="#3c9854" />
              <stop offset="100%" stopColor="#2c7c43" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#96a86f" />
              <stop offset="55%" stopColor="#7a8f58" />
              <stop offset="100%" stopColor="#63744a" />
            </>
          )}
        </linearGradient>
        <radialGradient id="leaf-glow" cx="0.35" cy="0.25" r="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path
        d="M60 112 C40 96 22 76 20 54 C19 34 36 16 60 12 C84 16 101 34 100 54 C98 76 80 96 60 112 Z"
        fill="url(#leaf-body)"
      />
      <path
        d="M60 112 C40 96 22 76 20 54 C19 34 36 16 60 12 C84 16 101 34 100 54 C98 76 80 96 60 112 Z"
        fill="url(#leaf-glow)"
      />

      <path
        d="M60 16 C59 42 59 78 60 106"
        stroke={healthy ? '#1c4228' : '#47533a'}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />

      {!healthy && (
        <g opacity="0.8">
          {spots.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={2.4 + ((i * 7) % 3)}
              fill="#7c3a12"
              opacity={0.75}
            />
          ))}
        </g>
      )}

      <g stroke={healthy ? '#1c4228' : '#47533a'} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.4">
        <path d="M59.5 36 C54 34 46 34 40 38" />
        <path d="M59.5 36 C65 34 73 34 79 38" />
        <path d="M59 56 C52 53 42 53 34 59" />
        <path d="M59 56 C66 53 76 53 85 59" />
        <path d="M58.5 76 C52 73 45 74 38 80" />
        <path d="M58.5 76 C65 73 72 74 80 80" />
        <path d="M58 94 C55 92 51 92 47 96" />
        <path d="M58 94 C61 92 65 92 70 96" />
      </g>
    </svg>
  )
}