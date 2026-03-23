import { motion } from "motion/react";

export function WeavingLoom() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Main wooden frame - 3D perspective with enhanced shadow */}
        <motion.svg 
          width="400" 
          height="500" 
          viewBox="0 0 400 500"
          animate={{ 
            filter: [
              "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))",
              "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.35))",
              "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Shadows for depth - enhanced */}
          <ellipse cx="200" cy="480" rx="200" ry="35" fill="rgba(0, 0, 0, 0.2)" />
          <ellipse cx="200" cy="480" rx="180" ry="30" fill="rgba(0, 0, 0, 0.15)" />

          {/* Left vertical beam */}
          <rect x="40" y="40" width="20" height="400" fill="#5C4033" rx="4" />
          <rect x="40" y="40" width="20" height="400" fill="#8B6F47" rx="4" opacity="0.5" />

          {/* Right vertical beam */}
          <rect x="340" y="40" width="20" height="400" fill="#5C4033" rx="4" />
          <rect x="340" y="40" width="20" height="400" fill="#8B6F47" rx="4" opacity="0.5" />

          {/* Top horizontal beam */}
          <rect x="40" y="40" width="320" height="24" fill="#664C33" rx="4" />
          <rect x="40" y="40" width="320" height="12" fill="#9B7F52" rx="4" opacity="0.5" />

          {/* Bottom horizontal beam */}
          <rect x="40" y="416" width="320" height="24" fill="#664C33" rx="4" />
          <rect x="40" y="416" width="320" height="12" fill="#9B7F52" rx="4" opacity="0.5" />

          {/* Warp threads (vertical) - with subtle animation */}
          {[...Array(12)].map((_, i) => {
            const x = 60 + (i * 26);
            return (
              <motion.g 
                key={`warp-${i}`}
                animate={{ opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2 + Math.random(), repeat: Infinity }}
              >
                <line x1={x} y1="70" x2={x} y2="420" stroke="#D4A574" strokeWidth="2" opacity="0.9" />
                <line x1={x + 1} y1="70" x2={x + 1} y2="420" stroke="#E8B884" strokeWidth="1" opacity="0.5" />
              </motion.g>
            );
          })}

          {/* Weft threads (horizontal) - with subtle animation */}
          {[...Array(8)].map((_, i) => {
            const y = 90 + (i * 40);
            return (
              <motion.g 
                key={`weft-${i}`}
                animate={{ opacity: [0.7, 0.85, 0.7] }}
                transition={{ duration: 2.5 + Math.random(), repeat: Infinity, delay: i * 0.1 }}
              >
                <line x1="60" y1={y} x2="340" y2={y} stroke="#C9A66B" strokeWidth="2" opacity="0.8" />
                <line x1="60" y1={y + 1} x2="340" y2={y + 1} stroke="#E8D5A8" strokeWidth="1" opacity="0.4" />
              </motion.g>
            );
          })}

          {/* Corner decorative knots - with glow */}
          {[[50, 45], [350, 45], [50, 430], [350, 430]].map(([x, y], i) => (
            <motion.circle 
              key={`knot-${i}`} 
              cx={x} 
              cy={y} 
              r="6" 
              fill="#A39882" 
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </motion.svg>

        {/* Woven mat preview (center) - Enhanced with glowing effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            scale: [1, 1.02, 1],
            filter: [
              "drop-shadow(0 0 8px rgba(232, 213, 168, 0.4)) drop-shadow(0 10px 30px rgba(0, 0, 0, 0.15))",
              "drop-shadow(0 0 16px rgba(232, 213, 168, 0.6)) drop-shadow(0 10px 35px rgba(0, 0, 0, 0.2))",
              "drop-shadow(0 0 8px rgba(232, 213, 168, 0.4)) drop-shadow(0 10px 30px rgba(0, 0, 0, 0.15))"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div 
            className="w-64 h-48 rounded-lg shadow-lg relative overflow-hidden"
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
              border: "3px solid #A39882",
              boxShadow: "inset 0 2px 8px rgba(255, 255, 255, 0.3), inset 0 -2px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Light shimmer effect on mat surface */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{ 
                backgroundPosition: ["-100% 0", "100% 0"],
                opacity: [0, 0.4, 0]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }}
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 45%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
              }}
            />

            {/* Subtle center highlight for 3D effect */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{ opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{
                background: "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%)",
              }}
            />
          </div>
        </motion.div>

        {/* Ambient light glow around mat - creates immersive mood */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "400px",
            height: "300px",
            background: "radial-gradient(ellipse at center, rgba(232, 165, 32, 0.3) 0%, transparent 80%)",
            filter: "blur(30px)",
            zIndex: -1,
          }}
        />
      </motion.div>
    </div>
  );
}
