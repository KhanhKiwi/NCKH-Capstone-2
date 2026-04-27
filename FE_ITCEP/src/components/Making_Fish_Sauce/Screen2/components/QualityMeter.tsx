interface QualityMeterProps {
  value: number; // 0-100
}

export function QualityMeter({ value }: QualityMeterProps) {
  const getBarColor = () => {
    if (value >= 67) return '#4a7c59'; // Green - Tốt
    if (value >= 34) return '#d4a853'; // Orange - Trung bình
    return '#c85a54'; // Red - Xấu
  };

  const getQualityLabel = () => {
    if (value >= 90) return 'Hoàn hảo ✨';
    if (value >= 75) return 'Rất tốt ✓';
    if (value >= 60) return 'Tốt ✓';
    if (value >= 45) return 'Chấp nhận được';
    if (value >= 30) return 'Cần cải thiện';
    return 'Xấu ✗';
  };

  return (
    <div className="w-full px-4 py-3 md:px-8 md:py-4 lg:px-12">
      <div
        className="relative w-full max-w-2xl mx-auto rounded-lg overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #8b7355 0%, #6b5844 100%)',
          padding: 'clamp(8px, 2vw, 12px)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {/* Label */}
        <div
          className="mb-2 text-center"
          style={{
            fontSize: 'clamp(11px, 2.5vw, 14px)',
            fontWeight: 600,
            color: '#f5e6d3',
            letterSpacing: '0.5px',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          CHẤT LƯỢNG MẺ CÁ
        </div>

        {/* Progress Bar Container */}
        <div
          className="relative rounded overflow-hidden"
          style={{
            height: 'clamp(24px, 5vw, 32px)',
            background: 'linear-gradient(180deg, #2d2416 0%, #1a1410 100%)',
            border: '1px solid rgba(0,0,0,0.3)'
          }}
        >
          {/* Progress Fill */}
          <div
            className="absolute inset-y-0 left-0 transition-all duration-300"
            style={{
              width: `${value}%`,
              background: `linear-gradient(180deg, ${getBarColor()} 0%, ${getBarColor()}dd 100%)`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
          >
            {/* Shine effect */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
              }}
            />
          </div>

          {/* Percentage Text */}
          <div
            className="absolute inset-0 flex items-center justify-center gap-3"
            style={{
              fontSize: 'clamp(12px, 3vw, 16px)',
              fontWeight: 700,
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            <span>{value}%</span>
            <span style={{ fontSize: 'clamp(10px, 2.5vw, 13px)', opacity: 0.9 }}>
              {getQualityLabel()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
