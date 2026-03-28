import { motion } from "motion/react";
import { Trophy, Star, Award } from "lucide-react";

export function Achievements() {
  const achievements = [
    { icon: Trophy, label: "Chiến thắng", count: 45 },
    { icon: Star, label: "Điểm cao", count: 8750 },
    { icon: Award, label: "Huy chương", count: 23 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-6 right-6 z-20"
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl">
        <h3 className="text-white font-bold text-sm mb-3">Thành tích</h3>
        <div className="space-y-2">
          {achievements.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center gap-2 bg-black/20 rounded-lg px-3 py-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F0D4B0] to-[#E6A75E] flex items-center justify-center">
                <item.icon className="w-4 h-4 text-[#5D4E37]" />
              </div>
              <div className="flex-1">
                <p className="text-[#F0D4B0] text-xs">{item.label}</p>
                <p className="text-white font-bold text-sm">{item.count}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
