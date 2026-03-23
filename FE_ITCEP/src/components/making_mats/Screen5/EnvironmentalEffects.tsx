import { motion } from "motion/react";

export function EnvironmentalEffects() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Dust particles in sunlight */}
      <motion.div
        animate={{ y: [0, 100], opacity: [0, 0.6, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 0 }}
        className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full"
        style={{ backgroundColor: "rgba(232, 213, 168, 0.8)" }}
      />
      <motion.div
        animate={{ y: [0, 80], opacity: [0, 0.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute top-1/3 left-1/3 w-0.5 h-0.5 rounded-full"
        style={{ backgroundColor: "rgba(232, 213, 168, 0.6)" }}
      />
      <motion.div
        animate={{ y: [0, 90], opacity: [0, 0.7, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, delay: 0.5 }}
        className="absolute top-1/4 right-1/4 w-0.5 h-0.5 rounded-full"
        style={{ backgroundColor: "rgba(232, 213, 168, 0.7)" }}
      />

      {/* Atmospheric glow effect */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 30% 20%, rgba(232, 213, 168, 0.3) 0%, transparent 50%)",
        }}
      />

      {/* Time-of-day light effect */}
      <motion.div
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 80% 30%, rgba(232, 165, 32, 0.15) 0%, transparent 60%)",
        }}
      />

      {/* Subtle shadow movement (simulating sun movement) */}
      <motion.div
        animate={{ x: [-50, 50, -50], y: [-30, 30, -30] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 400px 200px at 50% 50%, rgba(0, 0, 0, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Leafy shadows from nearby trees (animated) */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`leaf-shadow-${i}`}
          animate={{ 
            x: [Math.sin(i) * 20, Math.cos(i) * 20],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
          className="absolute"
          style={{
            left: `${20 + i * 15}%`,
            top: "10%",
            width: "100px",
            height: "150px",
            background: `radial-gradient(ellipse at center, rgba(0, 0, 0, 0.1) 0%, transparent 70%)`,
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
}
