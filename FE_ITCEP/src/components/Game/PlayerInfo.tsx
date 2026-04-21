import { motion } from "motion/react";
import { Coins } from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from "../../api/services/authService";

export function PlayerInfo() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    authService
      .getProfile()
      .then((p) => {
        if (!mounted) return;
        setUser(p || null);
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const displayName = user?.name || user?.fullName || 'Nghệ nhân';
  const avatarSrc = user?.avatar || null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-6 left-6 z-20"
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F0D4B0] to-[#E6A75E] flex items-center justify-center shadow-lg overflow-hidden">
            {avatarSrc ? (
              <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#5D4E37] font-bold">{(displayName && displayName.charAt(0)) || 'N'}</div>
            )}
          </div>
          <div>
            <p className="text-white font-bold text-sm">{displayName}</p>
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
