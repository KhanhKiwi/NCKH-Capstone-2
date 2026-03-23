import { motion } from "motion/react";

export function WeavingScenery() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient background - Base layer */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #F0E4D7 0%, #E8D5A8 25%, #F5E6D3 50%, #E6D4B8 100%)",
        }}
      />

      {/* Atmospheric light rays - Far back */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-1/4 w-full h-2/3"
        style={{
          background: "radial-gradient(ellipse 800px 400px at 70% 20%, rgba(232, 213, 168, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Distant mountains (back layer) - Slowest parallax */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-full h-1/3 bottom-2/3 opacity-25 parallax-slow"
        style={{
          backgroundImage: `linear-gradient(to right, #9B8B7E 0%, #A39882 25%, #8B7B6E 50%, #9B8B7E 75%, #8B7B6E 100%)`,
          clipPath: "polygon(0% 100%, 5% 65%, 15% 45%, 30% 55%, 45% 35%, 60% 50%, 75% 40%, 85% 55%, 95% 45%, 100% 65%, 100% 100%)",
        }}
      />

      {/* Mid-ground hills (middle-back layer) - Slow parallax */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute w-full h-2/5 bottom-1/2 opacity-35 parallax-medium"
        style={{
          backgroundImage: `linear-gradient(to right, #A89B8F 0%, #B5A896 30%, #9F9284 60%, #A89B8F 100%)`,
          clipPath: "polygon(0% 100%, 8% 75%, 20% 55%, 35% 65%, 50% 45%, 65% 60%, 80% 50%, 92% 75%, 100% 70%, 100% 100%)",
        }}
      />

      {/* Mid-ground greenery/vegetation (medium layer) */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute w-full h-1/3 bottom-1/3 opacity-40 parallax-fast"
        style={{
          background: "linear-gradient(to bottom, #B8AA9C 0%, #C4B8A0 50%, #D4C8B0 100%)",
          backgroundImage: `repeating-linear-gradient(90deg, #B8AA9C 0px, #B8AA9C 25px, #B0A292 25px, #B0A292 50px, #BCA89E 50px, #BCA89E 75px)`,
        }}
      />

      {/* Foreground field detail (closest layer) - Fastest parallax with more movement */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        className="absolute w-full h-1/4 bottom-0 opacity-45"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #C4B8A0 30%, #B5A896 100%)",
          backgroundImage: `repeating-linear-gradient(90deg, 
            transparent 0px, 
            rgba(169, 150, 130, 0.1) 15px, 
            rgba(169, 150, 130, 0.2) 30px, 
            rgba(169, 150, 130, 0.1) 45px, 
            transparent 60px)`,
        }}
      />

      {/* Traditional Vietnamese house (left side) - Fixed position for reference */}
      <div className="absolute left-0 bottom-0 w-1/3 h-2/3 pointer-events-none">
        {/* House background blur for depth */}
        <motion.div
          animate={{ opacity: [0.4, 0.5, 0.4] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(212, 196, 176, 0.8) 0%, rgba(212, 180, 160, 0.6) 100%)",
            backdropFilter: "blur(1px)",
          }}
        />

        {/* Wall with subtle texture */}
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: "#D4C4B0",
            backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, rgba(0, 0, 0, 0.02) 2px, transparent 4px, transparent 20px)`,
            backgroundSize: "100% 1px",
          }} 
        />

        {/* Roof with depth shadow */}
        <motion.div
          animate={{ y: [0, -1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full"
          style={{
            height: "22%",
            background: "linear-gradient(135deg, #8B6F47 0%, #A39882 40%, #9B7F5C 70%, #8B6F47 100%)",
            clipPath: "polygon(0% 100%, 18% 35%, 50% 0%, 82% 35%, 100% 100%)",
            boxShadow: "inset 0 -4px 10px rgba(0, 0, 0, 0.3)",
          }}
        />

        {/* House accent shadow for depth */}
        <div 
          className="absolute left-0 bottom-0 w-full h-full"
          style={{
            background: "linear-gradient(90deg, rgba(0, 0, 0, 0.15) 0%, transparent 30%)",
            borderRadius: "0 40px 0 0",
          }}
        />
      </div>

      {/* Atmospheric light rays (medium depth) */}
      <motion.div
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 80% 30%, rgba(232, 165, 32, 0.15) 0%, transparent 60%)",
        }}
      />

      {/* Enhanced wind effect - floating particles with depth */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`wind-${i}`}
          animate={{
            x: [Math.random() * 1920 - 960, Math.random() * 1920 - 960],
            y: [Math.random() * 1080, -50],
            opacity: [0, 0.4, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 8 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "linear",
          }}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${2 + Math.random() * 2}px`,
            height: `${2 + Math.random() * 2}px`,
            backgroundColor: i < 10 
              ? `rgba(201, 166, 107, ${0.3 + Math.random() * 0.4})` 
              : `rgba(232, 213, 168, ${0.2 + Math.random() * 0.3})`,
            filter: `blur(${Math.random()}px)`,
            zIndex: i < 10 ? 5 : 2,
          }}
        />
      ))}

      {/* Subtle shadow overlay for foreground depth */}
      <motion.div
        animate={{ opacity: [0.08, 0.12, 0.08] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 500px 300px at center center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.1) 100%)",
        }}
      />

      {/* Optional: Heat haze effect on horizon (subtle) */}
      <motion.div
        animate={{ 
          skewY: [0, 1, -1, 0],
          opacity: [0.02, 0.05, 0.02]
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute w-full h-1/4 bottom-1/4 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(232, 213, 168, 0.1) 0%, transparent 100%)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
}
