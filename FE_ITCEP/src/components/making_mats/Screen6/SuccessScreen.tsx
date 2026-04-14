import { motion } from "motion/react";
import { Star, Trophy, Repeat, Home, CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import confetti from "canvas-confetti";

interface SuccessScreenProps {
  score?: number;
  onRestart?: () => void;
}

export function SuccessScreen({ score = 0, onRestart }: SuccessScreenProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Confetti celebration
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#E8A520", "#F0E0C0", "#A8C9A0", "#E8D5A8"];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const handleRestart = () => {
    if (onRestart) {
      onRestart();
    } else {
      navigate(`/craft-selection?openName=${encodeURIComponent('Đinh Yên')}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #F0E0C0 0%, #E8D5A8 50%, #F0E0C0 100%)",
      }}
    >
      {/* Decorative light rays */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-full origin-top"
            style={{
              background: "linear-gradient(180deg, #E8A520 0%, transparent 100%)",
              transform: `rotate(${i * 30}deg) translateY(-50%)`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #E8A520 0%, #FFD700 100%)",
              boxShadow: "0 8px 24px #E8A52060, 0 0 60px #E8A52040",
            }}
          >
            <Trophy className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        {/* Game Completed Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6"
          style={{
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
          }}
        >
          <CheckCircle className="w-6 h-6 text-white" />
          <span className="text-white font-bold text-lg">TRÒ CHƠI HOÀN THÀNH!</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-5xl mb-4"
          style={{
            color: "#E8A520",
            textShadow: "0 4px 12px rgba(232, 165, 32, 0.4)",
          }}
        >
          Hoàn thiện xuất sắc!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl mb-8"
          style={{ color: "#8B4513" }}
        >
          Bạn đã hoàn thành tất cả 6 cấp độ!<br/>Nghề thủ công Việt Nam tự hào!
        </motion.p>

        {/* Score */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
          className="inline-block px-12 py-6 rounded-2xl mb-8"
          style={{
            background: "linear-gradient(135deg, #FFFFFF 0%, #F0E0C0 100%)",
            border: "4px solid #E8A520",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}
        >
          <div className="flex items-center gap-4">
            <Star className="w-10 h-10" style={{ color: "#E8A520" }} fill="#E8A520" />
            <div>
              <div className="text-sm opacity-70" style={{ color: "#C9A66B" }}>
                Tổng điểm
              </div>
              <div className="text-4xl" style={{ color: "#E8A520" }}>
                {score}
              </div>
            </div>
            <Star className="w-10 h-10" style={{ color: "#E8A520" }} fill="#E8A520" />
          </div>
        </motion.div>

        {/* Decorative mat pattern */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="w-96 h-2 mx-auto mb-8 rounded-full"
          style={{
            background:
              "repeating-linear-gradient(90deg, #C9A66B 0px, #C9A66B 10px, #A8C9A0 10px, #A8C9A0 20px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        />

        {/* Buttons Container */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Replay button */}
          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleRestart}
            className="px-8 py-4 rounded-full flex items-center gap-3 font-bold text-lg"
            style={{
              background: "linear-gradient(135deg, #E8A520 0%, #FFD700 100%)",
              color: "#FFFFFF",
              boxShadow: "0 6px 20px #E8A52080",
              border: "3px solid #FFD700",
            }}
          >
            <Repeat className="w-6 h-6" />
            <span>Chơi lại</span>
          </motion.button>

          {/* Home button */}
          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => navigate(`/craft-selection?openName=${encodeURIComponent('Đinh Yên')}`)}
            className="px-8 py-4 rounded-full flex items-center gap-3 font-bold text-lg"
            style={{
              background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
              color: "#FFFFFF",
              boxShadow: "0 6px 20px #6366F180",
              border: "3px solid #4F46E5",
            }}
          >
            <Home className="w-6 h-6" />
            <span>Về làng nghề</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SuccessScreen;
