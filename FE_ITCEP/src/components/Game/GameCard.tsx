import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

interface GameCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
  onClick?: () => void;
}

export function GameCard({ icon: Icon, title, description, delay, onClick }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="backdrop-blur-xl bg-white/15 border border-white/30 rounded-2xl p-6 shadow-2xl hover:shadow-[0_20px_60px_rgba(240,212,176,0.3)] transition-all duration-300 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F0D4B0]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F0D4B0] to-[#E6A75E] flex items-center justify-center shadow-lg mb-4 group-hover:shadow-[0_0_30px_rgba(240,212,176,0.6)] transition-all duration-300">
            <Icon className="w-8 h-8 text-[#5D4E37]" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
          <p className="text-[#F0D4B0]/80 text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
