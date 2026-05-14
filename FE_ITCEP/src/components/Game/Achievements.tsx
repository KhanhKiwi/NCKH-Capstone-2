import { motion } from "motion/react";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from "../../api/services/authService";
import { progressService } from "../../api/services/progressService";

interface AchievementsProps {
  inline?: boolean;
}

export function Achievements({ inline = false }: AchievementsProps) {
  const [wins, setWins] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadWins() {
      try {
        let userId: number | undefined;
        try {
          const profile = await authService.getProfile();
          userId = Number(profile?.user_id ?? profile?.id ?? profile?.userId);
        } catch (e) {
          userId = undefined;
        }

        if (!userId) {
          try {
            const token = localStorage.getItem('access_token');
            if (token) {
              const parts = token.split('.');
              if (parts.length >= 2) {
                const payload = JSON.parse(atob(parts[1]));
                userId = Number(payload?.user_id ?? payload?.sub ?? payload?.id);
              }
            }
          } catch (e) {
            userId = undefined;
          }
        }

        if (!userId) {
          if (mounted) setWins(0);
          return;
        }

        const progress = await progressService.getUserProgress(userId);
        const completedCount = Array.isArray(progress) ? progress.filter(p => p.status === 'completed').length : 0;
        if (mounted) setWins(completedCount);
      } catch (e) {
        if (mounted) setWins(0);
      }
    }

    loadWins();
    return () => { mounted = false; };
  }, []);

  const outerClass = inline ? 'mt-3 w-full' : 'absolute top-6 right-6 z-20';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className={outerClass}
    >
      <div className="backdrop-blur-lg bg-white/6 border border-white/8 rounded-2xl p-3 shadow-lg w-full">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="flex items-center gap-3 bg-black/25 rounded-xl px-3 py-2"
        >
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#F0D4B0] to-[#E6A75E] flex items-center justify-center shadow-sm">
              <div className="w-7 h-7 rounded-full bg-white/95 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-[#3d2b1f]" />
              </div>
            </div>

            <div className="flex-1 flex items-center gap-2">
              <div className="text-[#F0D4B0] font-semibold text-lg">Qua ải:</div>
              <motion.div
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 280 }}
                className="text-white font-extrabold text-lg leading-none"
              >
                {wins ?? '—'}
              </motion.div>
            </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
