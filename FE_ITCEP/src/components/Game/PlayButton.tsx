import { motion } from "motion/react";
import { Play } from "lucide-react";

export function PlayButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="group relative"
      >
        {/* Outer glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFB347] via-[#F0D4B0] to-[#FFB347] rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
        
        {/* Button */}
        <div className="relative bg-gradient-to-br from-[#FFB347] via-[#F0D4B0] to-[#E6A75E] rounded-full px-16 py-6 shadow-2xl border-4 border-white/30">
          <div className="flex items-center gap-3">
            <Play className="w-8 h-8 text-[#5D4E37] fill-[#5D4E37]" />
            <span className="text-[#5D4E37] font-bold text-3xl tracking-wide">CHƠI NGAY</span>
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        </div>
      </motion.button>
    </motion.div>
  );
}
