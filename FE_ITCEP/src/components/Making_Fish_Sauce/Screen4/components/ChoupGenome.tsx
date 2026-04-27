import { useEffect, useState } from 'react';

interface ChoupGenomeProps {
  quality: number;
}

export function ChoupGenome({ quality }: ChoupGenomeProps) {
  const [animatedQuality, setAnimatedQuality] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedQuality(quality), 300);
    return () => clearTimeout(timer);
  }, [quality]);

  const getColor = (value: number) => {
    if (value < 40) return '#8b4513';
    if (value < 70) return '#b87333';
    return '#5f7c8a';
  };

  const segments = 12;
  const radius = 80;
  const innerRadius = 50;
  const centerX = 100;
  const centerY = 100;

  return (
    <div className="relative flex flex-col items-center gap-4">
      <div className="text-center">
        <p className="text-sm opacity-70 tracking-wide uppercase mb-1">Chất lượng Chượp Genome</p>
        <p className="text-xs opacity-50">Phân tích vi sinh vật lên men</p>
      </div>

      <svg width="200" height="200" className="drop-shadow-lg">
        <defs>
          <radialGradient id="genomeGradient">
            <stop offset="0%" stopColor={getColor(quality)} stopOpacity="0.3" />
            <stop offset="100%" stopColor={getColor(quality)} stopOpacity="0.8" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {Array.from({ length: segments }).map((_, i) => {
          const angle = (i * 360) / segments - 90;
          const nextAngle = ((i + 1) * 360) / segments - 90;
          const isActive = (i / segments) * 100 < animatedQuality;

          const x1 = centerX + innerRadius * Math.cos((angle * Math.PI) / 180);
          const y1 = centerY + innerRadius * Math.sin((angle * Math.PI) / 180);
          const x2 = centerX + radius * Math.cos((angle * Math.PI) / 180);
          const y2 = centerY + radius * Math.sin((angle * Math.PI) / 180);
          const x3 = centerX + radius * Math.cos((nextAngle * Math.PI) / 180);
          const y3 = centerY + radius * Math.sin((nextAngle * Math.PI) / 180);
          const x4 = centerX + innerRadius * Math.cos((nextAngle * Math.PI) / 180);
          const y4 = centerY + innerRadius * Math.sin((nextAngle * Math.PI) / 180);

          return (
            <path
              key={i}
              d={`M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`}
              fill={isActive ? 'url(#genomeGradient)' : 'rgba(139, 115, 85, 0.15)'}
              stroke={isActive ? getColor(quality) : 'rgba(61, 43, 31, 0.2)'}
              strokeWidth="1"
              filter={isActive ? 'url(#glow)' : 'none'}
              className="transition-all duration-500"
            />
          );
        })}

        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius - 5}
          fill="rgba(245, 240, 232, 0.9)"
          stroke={getColor(quality)}
          strokeWidth="2"
        />

        <text
          x={centerX}
          y={centerY - 5}
          textAnchor="middle"
          className="text-3xl"
          fill={getColor(quality)}
          style={{ fontWeight: 600 }}
        >
          {Math.round(animatedQuality)}%
        </text>
        <text
          x={centerX}
          y={centerY + 15}
          textAnchor="middle"
          className="text-xs"
          fill="currentColor"
          opacity="0.6"
        >
          Độ lành mạnh
        </text>
      </svg>

      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#5f7c8a' }}></div>
          <span className="opacity-70">Tối ưu</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#b87333' }}></div>
          <span className="opacity-70">Trung bình</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#8b4513' }}></div>
          <span className="opacity-70">Thấp</span>
        </div>
      </div>
    </div>
  );
}
