import styles from "../../../styles/Screen1/Screen1.module.css";

interface Props {
  count: number;
  isDragOver: boolean;
  isDragOverWrong: boolean;
}

export default function RopeBundle({
  count,
  isDragOver,
  isDragOverWrong,
}: Props) {
  // Rope wrapping stages based on count
  const ropeStages = [
    // 0: straight rope on ground
    // 1-4: rope partially coiled
    // 5: fully coiled bundle
  ];

  return (
    <div
      id="rope-bundle-zone"
      style={{
        position: "absolute",
        bottom: "4%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 15,
        minWidth: "340px",
        minHeight: "100px",
        padding: "10px 50px 8px",
        textAlign: "center",
        cursor: "default",
        userSelect: "none",
      }}
    >
      <svg
        width="340"
        height="160"
        viewBox="0 0 340 160"
        style={{ display: "block", margin: "0 auto" }}
      >
        {/* ── SEDGE STEMS in bundle (grow as count increases) ── */}
        {count > 0 &&
          Array.from({ length: count }).map((_, i) => {
            const totalSpread = Math.min(count * 12, 80);
            const startX =
              170 -
              totalSpread / 2 +
              i * (totalSpread / Math.max(count - 1, 1));
            const jitter = ((i * 37 + 13) % 8) - 4;
            return (
              <g key={`stem-${i}`}>
                {/* Each stem = tall sedge lying on ground */}
                <line
                  x1={startX + jitter}
                  y1={count === 5 ? 30 : 55 - count * 4}
                  x2={startX + jitter * 0.5}
                  y2={118}
                  stroke={i % 2 === 0 ? "#7CB342" : "#8BC34A"}
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* Leaf detail on each stem */}
                <line
                  x1={startX + jitter}
                  y1={count === 5 ? 50 : 70 - count * 3}
                  x2={startX + jitter + 10}
                  y2={count === 5 ? 38 : 60 - count * 3}
                  stroke="#9CCC65"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </g>
            );
          })}

        {/* ── ROPE WRAPPING (appears/grows as count increases) ── */}

        {/* Stage 0: Rope straight on ground (no plants yet) */}
        {count === 0 && (
          <g>
            {/* Shadow */}
            <path
              d="M20,128 Q85,115 170,122 Q255,115 320,128"
              fill="none"
              stroke="rgba(0,0,0,0.25)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Main rope */}
            <path
              d="M20,124 Q85,111 170,118 Q255,111 320,124"
              fill="none"
              stroke="#8D6E63"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* Rope highlight */}
            <path
              d="M20,121 Q85,108 170,115 Q255,108 320,121"
              fill="none"
              stroke="#BCAAA4"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Knots */}
            <circle
              cx="20"
              cy="124"
              r="7"
              fill="#6D4C41"
              stroke="#5D4037"
              strokeWidth="1.5"
            />
            <circle
              cx="320"
              cy="124"
              r="7"
              fill="#6D4C41"
              stroke="#5D4037"
              strokeWidth="1.5"
            />
            {/* Texture dots */}
            {[70, 120, 170, 220, 270].map((x) => (
              <circle
                key={x}
                cx={x}
                cy={118}
                r="3"
                fill="#6D4C41"
                opacity="0.4"
              />
            ))}
          </g>
        )}

        {/* Stage 1-2: Rope begins to coil at base */}
        {count >= 1 && count <= 2 && (
          <g>
            {/* Rope still mostly straight but dips toward bundle */}
            <path
              d="M20,128 Q60,118 100,122 Q130,118 150,112
                 Q170,108 190,112 Q210,118 240,122
                 Q280,118 320,128"
              fill="none"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d="M20,124 Q60,114 100,118 Q130,114 150,108
                 Q170,104 190,108 Q210,114 240,118
                 Q280,114 320,124"
              fill="none"
              stroke="#8D6E63"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M20,121 Q80,111 150,105 Q170,101 190,105
                 Q260,111 320,121"
              fill="none"
              stroke="#BCAAA4"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
            <circle
              cx="20"
              cy="124"
              r="7"
              fill="#6D4C41"
              stroke="#5D4037"
              strokeWidth="1.5"
            />
            <circle
              cx="320"
              cy="124"
              r="7"
              fill="#6D4C41"
              stroke="#5D4037"
              strokeWidth="1.5"
            />
          </g>
        )}

        {/* Stage 3-4: Rope wraps around base of bundle */}
        {count >= 3 && count <= 4 && (
          <g>
            {/* Bottom wrap */}
            <ellipse
              cx="170"
              cy="116"
              rx={30 + count * 8}
              ry="8"
              fill="none"
              stroke="#8D6E63"
              strokeWidth="6"
              opacity="0.9"
            />
            {/* Side ropes going out */}
            <path
              d="M20,128 Q80,120 140,116"
              fill="none"
              stroke="#8D6E63"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M320,128 Q260,120 200,116"
              fill="none"
              stroke="#8D6E63"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Upper wrap band */}
            <ellipse
              cx="170"
              cy={100 - count * 5}
              rx={20 + count * 6}
              ry="6"
              fill="none"
              stroke="#795548"
              strokeWidth="5"
              opacity="0.85"
            />
            <circle
              cx="20"
              cy="128"
              r="7"
              fill="#6D4C41"
              stroke="#5D4037"
              strokeWidth="1.5"
            />
            <circle
              cx="320"
              cy="128"
              r="7"
              fill="#6D4C41"
              stroke="#5D4037"
              strokeWidth="1.5"
            />
          </g>
        )}

        {/* Stage 5: Fully wrapped tight bundle */}
        {count === 5 && (
          <g>
            {/* Bottom band */}
            <ellipse
              cx="170"
              cy="112"
              rx="55"
              ry="10"
              fill="none"
              stroke="#8D6E63"
              strokeWidth="7"
            />
            {/* Middle band */}
            <ellipse
              cx="170"
              cy="78"
              rx="45"
              ry="8"
              fill="none"
              stroke="#795548"
              strokeWidth="6"
            />
            {/* Top band */}
            <ellipse
              cx="170"
              cy="46"
              rx="30"
              ry="6"
              fill="none"
              stroke="#8D6E63"
              strokeWidth="5"
            />
            {/* Left rope end coiled */}
            <path
              d="M115,112 Q60,118 30,122 Q18,124 14,128"
              fill="none"
              stroke="#8D6E63"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Right rope end coiled */}
            <path
              d="M225,112 Q280,118 310,122 Q322,124 326,128"
              fill="none"
              stroke="#8D6E63"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Celebration glow ring */}
            <ellipse
              cx="170"
              cy="78"
              rx="62"
              ry="55"
              fill="none"
              stroke="#FFD54F"
              strokeWidth="2.5"
              opacity="0.7"
              strokeDasharray="8,5"
            />
          </g>
        )}

        {/* ── DRAG OVER INDICATOR ── */}
        {isDragOver && (
          <ellipse
            cx="170"
            cy="120"
            rx="140"
            ry="25"
            fill={
              isDragOverWrong ? "rgba(239,83,80,0.2)" : "rgba(255,213,79,0.2)"
            }
            stroke={isDragOverWrong ? "#EF5350" : "#FFD54F"}
            strokeWidth="2.5"
            strokeDasharray="8,5"
          />
        )}
      </svg>

      {/* Label */}
      <div
        style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: 13,
          fontWeight: 800,
          color: count === 5 ? "#FFD54F" : "rgba(255,255,255,0.92)",
          marginTop: 2,
          textShadow: "0 1px 5px rgba(0,0,0,0.85)",
        }}
      >
        {count === 0 && "🌾 Drag sedge onto the rope!"}
        {count >= 1 && count < 5 && `🌾 Bundle: ${count}/5`}
        {count === 5 && "✅ Bundle complete! 🎉"}
      </div>
    </div>
  );
}
