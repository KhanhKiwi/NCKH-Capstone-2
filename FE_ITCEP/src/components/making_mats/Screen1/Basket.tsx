interface Props {
  count: number;
  isDragOver: boolean;
  isDragOverWrong: boolean;
}

export default function Basket({ count, isDragOver, isDragOverWrong }: Props) {
  const fillH = (count / 5) * 62;

  return (
    <div
      id="basket-drop-zone"
      style={{
        position: "absolute",
        right: "5%",
        bottom: "6%",
        zIndex: 15,
        textAlign: "center",
        cursor: "default",
        filter: isDragOver
          ? isDragOverWrong
            ? "drop-shadow(0 0 16px #EF5350)"
            : "drop-shadow(0 0 20px #00E676)"
          : "drop-shadow(2px 4px 8px rgba(0,0,0,0.4))",
        transform: isDragOver ? "scale(1.08)" : "scale(1)",
        transition: "filter 0.2s, transform 0.2s",
      }}
    >
      <svg width="140" height="130" viewBox="0 0 140 130">
        {/* Handle */}
        <path
          d="M25,40 Q70,-5 115,40"
          stroke="#6D4C41"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        {/* Body shadow */}
        <path
          d="M12,40 L22,115 L118,115 L128,40 Z"
          fill="rgba(0,0,0,0.2)"
          transform="translate(3,3)"
        />
        {/* Body */}
        <path
          d="M12,40 L22,115 L118,115 L128,40 Z"
          fill="#A1887F"
          stroke="#5D4037"
          strokeWidth="3"
        />
        {/* Weave pattern */}
        <clipPath id="bClip">
          <path d="M12,40 L22,115 L118,115 L128,40 Z" />
        </clipPath>
        <g clipPath="url(#bClip)">
          {/* Horizontal weave lines */}
          {[50, 62, 74, 86, 98, 110].map((y) => (
            <line
              key={y}
              x1="10"
              y1={y}
              x2="130"
              y2={y}
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="1.5"
            />
          ))}
          {/* Vertical weave lines */}
          {[25, 40, 55, 70, 85, 100, 115].map((x) => (
            <line
              key={x}
              x1={x}
              y1="40"
              x2={x}
              y2="115"
              stroke="rgba(0,0,0,0.10)"
              strokeWidth="1"
            />
          ))}
          {/* Fill level */}
          <rect
            x="12"
            y={115 - fillH}
            width="116"
            height={fillH}
            fill="#A5D6A7"
            opacity="0.65"
          />
          {/* Sedge stems inside when plants added */}
          {count > 0 &&
            Array.from({ length: Math.min(count * 2, 10) }).map((_, i) => (
              <line
                key={i}
                x1={25 + i * 9 + (i % 3) * 3}
                y1={115 - fillH + 4}
                x2={28 + i * 9 + (i % 3) * 2}
                y2={115}
                stroke="#558B2F"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.8"
              />
            ))}
        </g>
        {/* Rim highlight */}
        <path d="M12,40 L128,40" stroke="#8D6E63" strokeWidth="3" />
        {/* Count badge */}
        {count > 0 && (
          <g>
            <circle
              cx="112"
              cy="30"
              r="14"
              fill="#F9A825"
              stroke="#E65100"
              strokeWidth="2"
            />
            <text
              x="112"
              y="35"
              textAnchor="middle"
              fill="#3E2723"
              fontSize="13"
              fontWeight="bold"
              fontFamily="'Baloo 2', cursive"
            >
              {count}
            </text>
          </g>
        )}
        {/* Drag indicator arrow */}
        {isDragOver && !isDragOverWrong && (
          <text x="70" y="30" textAnchor="middle" fontSize="18" fill="#00E676">
            ↓
          </text>
        )}
        {isDragOver && isDragOverWrong && (
          <text x="70" y="30" textAnchor="middle" fontSize="18" fill="#EF5350">
            ✗
          </text>
        )}
      </svg>

      {/* Label */}
      <div
        style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: 13,
          fontWeight: 800,
          color: count === 5 ? "#FFD54F" : "white",
          textShadow: "0 1px 5px rgba(0,0,0,0.8)",
          marginTop: 4,
        }}
      >
        {count === 0 && "Drop here! 🧺"}
        {count > 0 && count < 5 && `${count}/5 🧺`}
        {count === 5 && "✅ Done! 🎉"}
      </div>
    </div>
  );
}
