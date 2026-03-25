import { motion } from "motion/react";
import { Heart, Sun, Star } from "lucide-react";

interface GameUIProps {
  score: number;
  combo: number;
  lives: number;
  maxLives: number;
  timeLeft: number;
  progress: number;
}

export function GameUI({
  score,
  combo,
  lives,
  maxLives,
  timeLeft,
  progress,
}: GameUIProps) {
  return (
    <>
      {/* Top bar - Timer (left), Lives (right) */}
      <div className="absolute top-0 left-0 right-0 p-6 z-30 pointer-events-none">
        <div className="flex items-start justify-between">
          {/* Left column - Timer & Score stacked */}
          <div className="flex flex-col gap-4">
            {/* Timer */}
            <motion.div
              className="flex flex-col items-center justify-center px-8 py-4 rounded-full"
              style={{
                background: "linear-gradient(135deg, #F0E0C0 0%, #E8D5A8 100%)",
                border: "3px solid #C9A66B",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              >
                <Sun className="w-10 h-10" style={{ color: "#E8A520" }} />
              </motion.div>
              <div className="text-center">
                <div className="text-sm opacity-70 mt-2 font-medium" style={{ color: "#C9A66B" }}>
                  Thời gian
                </div>
                <div className="text-3xl font-bold" style={{ color: "#8B4513" }}>
                  {timeLeft}s
                </div>
              </div>
            </motion.div>

            {/* Score & Combo - Below Timer */}
            <motion.div
              className="flex flex-col items-center justify-center px-14 py-5 rounded-full"
              style={{
                background: "linear-gradient(135deg, #F0E0C0 0%, #E8D5A8 100%)",
                border: "3px solid #E8A520",
                boxShadow: "0 4px 16px #E8A52060",
                minWidth: "160px",
              }}
            >
              <div className="text-center">
                <div className="text-xs opacity-70 font-medium leading-tight" style={{ color: "#C9A66B" }}>
                  Điểm số
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <motion.div
                    key={score}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold leading-none"
                    style={{ color: "#E8A520" }}
                  >
                    {score}
                  </motion.div>
                  {combo > 1 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-0.5"
                    >
                      <Star className="w-7 h-7" style={{ color: "#E8A520" }} fill="#E8A520" />
                      <div className="text-3xl font-bold" style={{ color: "#E8A520" }}>
                        x{combo}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Lives - Right side */}
          <motion.div
            className="flex items-center gap-3 px-7 py-4 rounded-full"
            style={{
              background: "linear-gradient(135deg, #F0E0C0 0%, #E8D5A8 100%)",
              border: "3px solid #C9A66B",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            {Array.from({ length: maxLives }).map((_, i) => (
              <motion.div
                key={i}
                animate={i >= lives ? { scale: [1, 0.8, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  className="w-9 h-9"
                  style={{ color: i < lives ? "#FF6B6B" : "#C9A66B40" }}
                  fill={i < lives ? "#FF6B6B" : "none"}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Progress bar - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-30 pointer-events-none">
        <motion.div>
          <motion.div
            className="rounded-full overflow-hidden"
            style={{
              background: "#C9A66B40",
              border: "3px solid #C9A66B",
              height: "48px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full relative"
              style={{
                background: "linear-gradient(90deg, #A8C9A0 0%, #E8A520 100%)",
                boxShadow: "0 0 20px #E8A52080",
              }}
            >
              {/* Animated shine */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 w-1/3"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                }}
              />
            </motion.div>
          </motion.div>

          {/* Progress text below bar */}
          <div
            className="text-center text-sm mt-2"
            style={{ color: "#8B4513" }}
          >
            Hoàn thiện chiếu: {progress.toFixed(0)}%
          </div>
        </motion.div>
      </div>
    </>
  );
}
