import { motion } from 'motion/react';

export function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient with sun rays */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-blue-50" />

      {/* Animated sun rays */}
      <motion.div
        className="absolute top-0 right-1/4 w-96 h-96 opacity-20"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-yellow-200/40 via-transparent to-transparent" />
      </motion.div>

      {/* Coastal village silhouettes */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-30">
        <svg viewBox="0 0 1200 300" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,150 L100,140 L150,120 L200,130 L250,110 L300,120 L400,140 L500,130 L600,145 L700,135 L800,150 L900,140 L1000,155 L1100,145 L1200,150 L1200,300 L0,300 Z"
            fill="#0077B6"
            opacity="0.15"
          />
          <path
            d="M0,180 L150,170 L250,160 L350,175 L450,165 L550,180 L650,170 L750,185 L850,175 L950,190 L1050,180 L1200,185 L1200,300 L0,300 Z"
            fill="#00A8E8"
            opacity="0.1"
          />
        </svg>
      </div>

      {/* Floating particles - sea mist */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/30 rounded-full blur-sm"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Decorative boats */}
      <motion.div
        className="absolute top-1/4 right-20 opacity-20"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c5.5 0 10 2.5 10 5.5v10c0 2-4.5 3-10 3s-10-1-10-3v-10C2 4.5 6.5 2 12 2m0 2c-4 0-8 1-8 2.5V9h16V6.5c0-1.5-4-2.5-8-2.5z" />
        </svg>
      </motion.div>
    </div>
  );
}
