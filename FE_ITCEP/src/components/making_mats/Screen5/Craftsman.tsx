import { motion } from "motion/react";

export function Craftsman() {
  return (
    <motion.div
      className="absolute bottom-48 left-16 pointer-events-none"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="200" height="300" viewBox="0 0 200 300" style={{ filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))" }}>
        {/* Head */}
        <circle cx="100" cy="50" r="30" fill="#D4A574" />
        
        {/* Hair */}
        <path d="M 70 35 Q 100 10 130 35 Q 120 25 100 20 Q 80 25 70 35" fill="#8B6F47" />
        
        {/* Face - peaceful expression */}
        <circle cx="90" cy="45" r="4" fill="#5C4033" />
        <circle cx="110" cy="45" r="4" fill="#5C4033" />
        
        {/* Smile */}
        <path d="M 90 55 Q 100 62 110 55" stroke="#5C4033" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Body - sitting position */}
        <ellipse cx="100" cy="110" rx="35" ry="50" fill="#9B7F52" />
        
        {/* Arms (reaching toward loom) */}
        {/* Left arm */}
        <g>
          <ellipse cx="70" cy="105" rx="12" ry="45" fill="#D4A574" transform="rotate(-25 70 105)" />
          {/* Hand */}
          <circle cx="45" cy="135" r="10" fill="#D4A574" />
        </g>
        
        {/* Right arm */}
        <g>
          <ellipse cx="130" cy="105" rx="12" ry="45" fill="#D4A574" transform="rotate(25 130 105)" />
          {/* Hand */}
          <circle cx="155" cy="135" r="10" fill="#D4A574" />
        </g>
        
        {/* Legs (crossed/sitting) */}
        <g>
          {/* Left leg */}
          <ellipse cx="85" cy="180" rx="15" ry="45" fill="#664C33" transform="rotate(-35 85 180)" />
          {/* Right leg */}
          <ellipse cx="115" cy="180" rx="15" ry="45" fill="#664C33" transform="rotate(35 115 180)" />
        </g>
        
        {/* Feet */}
        <ellipse cx="65" cy="240" rx="12" ry="8" fill="#8B6F47" />
        <ellipse cx="135" cy="240" rx="12" ry="8" fill="#8B6F47" />
        
        {/* Hat (traditional Vietnamese conical hat - nón lá) */}
        <g>
          <path d="M 75 15 Q 100 -5 125 15 Q 125 20 100 25 Q 75 20 75 15" fill="#C9A66B" />
          <ellipse cx="100" cy="28" rx="40" ry="8" fill="#B5936F" opacity="0.6" />
          {/* Hat detail - bamboo rings */}
          <circle cx="100" cy="28" r="36" fill="none" stroke="#8B6F47" strokeWidth="1" opacity="0.5" />
        </g>
      </svg>

      {/* Animated weaving motion - hands moving */}
      <motion.div
        animate={{ x: [0, 10, 0], y: [0, -8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute top-16 left-12 text-lg"
        style={{ color: "#E8A520" }}
      >
        ✋
      </motion.div>

      {/* Name tag */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center"
      >
        <div className="text-xl font-bold" style={{ color: "#3e2400" }}>
          Thợ dệt
        </div>
        <div className="text-sm font-semibold" style={{ color: "#5d4a26" }}>
          Nghề thủ công truyền thống
        </div>
      </motion.div>
    </motion.div>
  );
}
