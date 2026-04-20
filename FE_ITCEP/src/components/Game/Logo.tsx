import { motion } from "motion/react";
import { Hammer } from "lucide-react";

export function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-8"
    >
      <div className="relative">
        {/* Logo glow */}
        <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-[#FFB347] to-[#F0D4B0] opacity-50" />
        
        <div className="relative flex flex-col items-center">
          {/* Icon */}
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#F0D4B0] to-[#E6A75E] flex items-center justify-center shadow-2xl mb-4"
          >
            <Hammer className="w-12 h-12 text-[#5D4E37]" />
          </motion.div>
          
          {/* Title */}
          <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#FFB347] via-[#F0D4B0] to-[#E6A75E] drop-shadow-[0_0_30px_rgba(240,212,176,0.8)] mb-2">
            CraftSteps
          </h1>
          
          {/* Subtitle */}
          <p className="text-[#F0D4B0] text-lg tracking-widest">LÀNG NGHỀ VIỆT NAM</p>
        </div>
      </div>
    </motion.div>
  );
}
