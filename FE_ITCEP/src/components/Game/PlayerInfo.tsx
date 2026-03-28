import { motion } from "motion/react";
import { User, Coins } from "lucide-react";

export function PlayerInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-6 left-6 z-20"
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F0D4B0] to-[#E6A75E] flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-[#5D4E37]" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Nghệ nhân</p>
            <p className="text-[#F0D4B0] text-xs">Cấp độ 15</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 bg-black/20 rounded-lg px-3 py-2">
          <Coins className="w-5 h-5 text-[#FFD700]" />
          <span className="text-white font-bold">12,500</span>
        </div>
      </div>
    </motion.div>
  );
}
