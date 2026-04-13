import { motion } from 'motion/react';

interface WaterSplashProps {
  x: number;
  y: number;
}

export function WaterSplash({ x, y }: WaterSplashProps) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
    >
      {/* Main splash ring */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute -translate-x-1/2 -translate-y-1/2 border-2 border-cyan-400/60 rounded-full"
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{
            width: 100 + i * 30,
            height: 100 + i * 30,
            opacity: 0,
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.1,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Water droplets */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const distance = 40 + Math.random() * 30;
        const size = 4 + Math.random() * 6;

        return (
          <motion.div
            key={`droplet-${i}`}
            className="absolute w-2 h-2 bg-blue-400/80 rounded-full"
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance - 20,
              scale: [0, 1, 0.5],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 0.6,
              delay: i * 0.02,
              ease: 'easeOut',
            }}
            style={{
              width: size,
              height: size,
            }}
          />
        );
      })}

      {/* Small spray particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 40;

        return (
          <motion.div
            key={`spray-${i}`}
            className="absolute w-1 h-1 bg-cyan-300/60 rounded-full blur-sm"
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
            }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance - 10,
              opacity: 0,
            }}
            transition={{
              duration: 0.5,
              delay: i * 0.01,
            }}
          />
        );
      })}

      {/* Foam bubbles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 40;
        const bubbleSize = 3 + Math.random() * 5;

        return (
          <motion.div
            key={`bubble-${i}`}
            className="absolute bg-white/70 rounded-full border border-blue-200/50"
            initial={{
              x: offsetX,
              y: offsetY,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: offsetX,
              y: offsetY - 30,
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.8,
              delay: i * 0.05,
            }}
            style={{
              width: bubbleSize,
              height: bubbleSize,
            }}
          />
        );
      })}

      {/* Center impact flash */}
      <motion.div
        className="absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/60 rounded-full blur-md"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}
