import { useState, useEffect } from 'react';

interface JarDisplayProps {
  fillLevel: number;
  isSealed: boolean;
}

export function JarDisplay({ fillLevel, isSealed }: JarDisplayProps) {
  const [particles, setParticles] = useState<{ x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    if (!isSealed) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        x: 40 + Math.random() * 20,
        y: 20 + Math.random() * 30,
        delay: i * 0.3
      }));
      setParticles(newParticles);
    }
  }, [isSealed]);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <svg viewBox="0 0 200 280" className="w-full drop-shadow-2xl">
        <defs>
          <linearGradient id="jarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b7355" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#d4c4a8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b7355" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="contentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a0522d" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#8b4513" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#5c3d2e" stopOpacity="1" />
          </linearGradient>
          <filter id="jarTexture">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" />
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
          </filter>
          <radialGradient id="highlight">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Jar body - traditional lu sành shape */}
        <ellipse cx="100" cy="240" rx="70" ry="15" fill="#5c3d2e" opacity="0.3" />

        <path
          d="M 50 80 Q 45 120 50 160 L 50 220 Q 50 240 70 245 L 130 245 Q 150 240 150 220 L 150 160 Q 155 120 150 80 Z"
          fill="url(#jarGradient)"
          stroke="#3d2b1f"
          strokeWidth="2"
          filter="url(#jarTexture)"
        />

        {/* Jar rim/neck */}
        <ellipse cx="100" cy="80" rx="50" ry="12" fill="#8b7355" stroke="#3d2b1f" strokeWidth="2" />
        <rect x="50" y="68" width="100" height="12" fill="#8b7355" />
        <ellipse cx="100" cy="68" rx="50" ry="12" fill="#a0522d" stroke="#3d2b1f" strokeWidth="2" />

        {/* Content inside jar */}
        <clipPath id="jarClip">
          <path d="M 52 85 Q 48 120 52 160 L 52 220 Q 52 238 70 243 L 130 243 Q 148 238 148 220 L 148 160 Q 152 120 148 85 Z" />
        </clipPath>

        <g clipPath="url(#jarClip)">
          <rect
            x="50"
            y={245 - (fillLevel / 100) * 160}
            width="100"
            height={(fillLevel / 100) * 160}
            fill="url(#contentGradient)"
          />

          {/* Fish and salt texture simulation */}
          {Array.from({ length: 20 }).map((_, i) => (
            <circle
              key={i}
              cx={60 + (i % 5) * 20}
              cy={245 - (fillLevel / 100) * 160 + (Math.floor(i / 5) * 15)}
              r="2"
              fill="white"
              opacity="0.3"
            />
          ))}
        </g>

        {/* Lid/seal if sealed */}
        {isSealed && (
          <>
            <ellipse cx="100" cy="68" rx="52" ry="14" fill="#3d2b1f" opacity="0.9" />
            <ellipse cx="100" cy="66" rx="52" ry="14" fill="#5c3d2e" />
            <ellipse cx="100" cy="66" rx="48" ry="12" fill="#8b7355" />
            <text x="100" y="72" textAnchor="middle" className="text-xs" fill="#f5f0e8" opacity="0.8">
              NIÊM PHONG
            </text>
          </>
        )}

        {/* Fermentation particles */}
        {!isSealed && particles.map((particle, i) => (
          <circle
            key={i}
            cx={particle.x}
            cy={particle.y}
            r="1.5"
            fill="#5f7c8a"
            opacity="0.6"
            style={{
              animation: `float 3s ease-in-out ${particle.delay}s infinite`
            }}
          />
        ))}

        {/* Light reflection */}
        <ellipse
          cx="80"
          cy="140"
          rx="15"
          ry="40"
          fill="url(#highlight)"
          opacity="0.3"
        />
      </svg>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.6; }
          50% { transform: translateY(-20px); opacity: 0; }
        }
      `}</style>

      <div className="text-center mt-4">
        <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
          <div className="w-2 h-2 rounded-full bg-[#5f7c8a] animate-pulse"></div>
          <span className="text-xs opacity-70">
            {isSealed ? 'Đang lên men' : 'Chuẩn bị niêm phong'}
          </span>
        </div>
      </div>
    </div>
  );
}
