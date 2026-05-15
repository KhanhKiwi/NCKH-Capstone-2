type Props = {
  data: number[]
  labels?: string[]
  height?: number
  showValues?: boolean
}

export default function VisitsChart({ data, labels = [], height = 120, showValues = false }: Props) {
  if (!data || data.length === 0) return <div className="text-sm text-slate-500">No data</div>

  const baseWidth = 600
  const pointSpacing = 80
  const svgWidth = Math.max(baseWidth, data.length * pointSpacing)
  const w = svgWidth
  const h = height
  const padding = 28
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((v, i) => {
    const x = padding + (i * (w - padding * 2)) / (data.length - 1)
    const y = padding + ((max - v) * (h - padding * 2)) / range
    return { x, y, v }
  })

  return (
    <div className="w-full overflow-x-auto">
      <svg width={w} height={h} className="block">
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <rect x={0} y={0} width={w} height={h} fill="transparent" />

        {/* area */}
        <path
          d={
            'M ' +
            points.map((p) => `${p.x} ${p.y}`).join(' L ') +
            ` L ${points[points.length - 1].x} ${h - padding} L ${points[0].x} ${h - padding} Z`
          }
          fill="url(#g1)"
          stroke="none"
        />

        {/* line */}
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#4f46e5"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill="#4f46e5" />
            {showValues && (
              <text x={p.x} y={p.y - 8} fontSize={11} textAnchor="middle" fill="#0f172a" className="font-semibold">
                {p.v}
              </text>
            )}
          </g>
        ))}

        {/* labels */}
        {labels.length === data.length &&
          labels.map((lab, i) => (
            <text key={i} x={points[i].x} y={h - 8} fontSize={11} textAnchor="middle" fill="#64748b">
              {lab}
            </text>
          ))}
      </svg>
    </div>
  )
}
