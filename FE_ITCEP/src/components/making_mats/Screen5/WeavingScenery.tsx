import { motion } from "motion/react";

export function WeavingScenery() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #E8D5A8 0%, #F5E6D3 40%, #D4C5A9 100%)"
        }}
      />

      {/* Far mountains (back layer) */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-full h-1/3 bottom-2/3 opacity-30"
        style={{
          backgroundImage: `linear-gradient(to right, #9B8B7E 0%, #A39882 25%, #8B7B6E 50%, #9B8B7E 75%, #8B7B6E 100%)`,
          clipPath: "polygon(0% 100%, 5% 60%, 15% 40%, 30% 50%, 45% 30%, 60% 45%, 75% 35%, 85% 50%, 95% 40%, 100% 60%, 100% 100%)",
        }}
      />

      {/* Mid-ground hills (middle-back layer) */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute w-full h-2/5 bottom-1/2 opacity-40"
        style={{
          backgroundImage: `linear-gradient(to right, #A89B8F 0%, #B5A896 30%, #9F9284 60%, #A89B8F 100%)`,
          clipPath: "polygon(0% 100%, 8% 70%, 20% 50%, 35% 60%, 50% 40%, 65% 55%, 80% 45%, 92% 70%, 100% 65%, 100% 100%)",
        }}
      />

      {/* Rice fields (mid-bottom layer) */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute w-full h-1/3 bottom-1/3 opacity-35"
        style={{
          background: "linear-gradient(to bottom, #C4B8A0 0%, #D4C8B0 100%)",
          backgroundImage: `repeating-linear-gradient(90deg, #C4B8A0 0px, #C4B8A0 20px, #BFAF9A 20px, #BFAF9A 40px)`,
        }}
      />

      {/* Traditional house (left side) */}
      <div className="absolute left-0 bottom-0 w-1/3 h-2/3">
        {/* Wall */}
        <div className="absolute inset-0" style={{ backgroundColor: "#D4C4B0" }} />
        
        {/* Roof */}
        <div 
          className="absolute top-0 left-0 w-full"
          style={{
            height: "20%",
            background: "linear-gradient(135deg, #8B6F47 0%, #A39882 50%, #8B6F47 100%)",
            clipPath: "polygon(0% 100%, 20% 40%, 50% 0%, 80% 40%, 100% 100%)"
          }}
        />

        {/* Window - HIDDEN */}
        {/* 
        <div className="absolute top-1/3 left-1/4 w-12 h-12" style={{ backgroundColor: "#9B8B7E" }} />
        <div className="absolute top-1/3 left-1/4 w-12 h-12 flex">
          <div className="w-1/2 h-full" style={{ backgroundColor: "#D9E8F0" }} />
          <div className="w-1/2 h-full" style={{ backgroundColor: "#B8D4E8" }} />
        </div>
        */}
      </div>

      {/* Atmospheric light rays */}
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-0 right-1/4 w-96 h-96"
        style={{
          background: "radial-gradient(ellipse at center, rgba(232, 213, 168, 0.4) 0%, transparent 70%)",
        }}
      />

      {/* Wind effect - floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`wind-${i}`}
          animate={{
            x: [Math.random() * 1920, Math.random() * 1920],
            y: [Math.random() * 1080, -50],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: "rgba(201, 166, 107, 0.6)",
            filter: "blur(0.5px)",
          }}
        />
      ))}

      {/* Animated cloud shadows */}
      <motion.div
        animate={{ x: [-100, 2000], opacity: [0, 0.15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-0 w-96 h-32"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.3) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      {/* Secondary cloud shadow */}
      <motion.div
        animate={{ x: [-200, 1800], opacity: [0, 0.12, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
        className="absolute top-1/3 left-0 w-80 h-40"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.25) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
}
