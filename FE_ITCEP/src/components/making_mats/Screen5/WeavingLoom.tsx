import { motion } from "motion/react";

export function WeavingLoom() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Main wooden frame - 3D perspective */}
        <svg width="400" height="500" viewBox="0 0 400 500" style={{ filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))" }}>
          {/* Shadows for depth */}
          <ellipse cx="200" cy="480" rx="180" ry="30" fill="rgba(0, 0, 0, 0.15)" />

          {/* Left vertical beam */}
          <rect x="40" y="40" width="20" height="400" fill="#5C4033" rx="4" />
          <rect x="40" y="40" width="20" height="400" fill="#8B6F47" rx="4" opacity="0.4" />

          {/* Right vertical beam */}
          <rect x="340" y="40" width="20" height="400" fill="#5C4033" rx="4" />
          <rect x="340" y="40" width="20" height="400" fill="#8B6F47" rx="4" opacity="0.4" />

          {/* Top horizontal beam */}
          <rect x="40" y="40" width="320" height="24" fill="#664C33" rx="4" />
          <rect x="40" y="40" width="320" height="12" fill="#9B7F52" rx="4" opacity="0.3" />

          {/* Bottom horizontal beam */}
          <rect x="40" y="416" width="320" height="24" fill="#664C33" rx="4" />
          <rect x="40" y="416" width="320" height="12" fill="#9B7F52" rx="4" opacity="0.3" />

          {/* Warp threads (vertical) - animated */}
          {[...Array(12)].map((_, i) => {
            const x = 60 + (i * 26);
            return (
              <g key={`warp-${i}`}>
                <line x1={x} y1="70" x2={x} y2="420" stroke="#D4A574" strokeWidth="2" opacity="0.9" />
                <line x1={x + 1} y1="70" x2={x + 1} y2="420" stroke="#E8B884" strokeWidth="1" opacity="0.4" />
              </g>
            );
          })}

          {/* Weft threads (horizontal) - will be animated during game */}
          {[...Array(8)].map((_, i) => {
            const y = 90 + (i * 40);
            return (
              <g key={`weft-${i}`}>
                <line x1="60" y1={y} x2="340" y2={y} stroke="#C9A66B" strokeWidth="2" opacity="0.7" />
                <line x1="60" y1={y + 1} x2="340" y2={y + 1} stroke="#E8D5A8" strokeWidth="1" opacity="0.3" />
              </g>
            );
          })}

          {/* Corner decorative knots */}
          {[[50, 45], [350, 45], [50, 430], [350, 430]].map(([x, y], i) => (
            <circle key={`knot-${i}`} cx={x} cy={y} r="6" fill="#A39882" opacity="0.8" />
          ))}
        </svg>

        {/* Woven mat preview (center) */}
        <motion.div
          animate={{ opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div 
            className="w-64 h-48 rounded-lg shadow-lg"
            style={{
              backgroundImage: `repeating-linear-gradient(
                90deg,
                #D4A574 0px,
                #D4A574 8px,
                #E8B884 8px,
                #E8B884 16px,
                #C9A66B 16px,
                #C9A66B 24px
              ),
              repeating-linear-gradient(
                0deg,
                #E8D5A8 0px,
                #E8D5A8 6px,
                #D4C4B0 6px,
                #D4C4B0 12px
              )`,
              border: "2px solid #A39882",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
