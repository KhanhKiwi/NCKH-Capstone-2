import { motion } from "motion/react";
import { RefreshCw, Heart } from "lucide-react";
import { useNavigate } from "react-router";

interface FailScreenProps {
  score?: number;
  onRestart?: () => void;
}

export function FailScreen({ score = 0, onRestart }: FailScreenProps) {
  const navigate = useNavigate();

  const handleRestart = () => {
    if (onRestart) {
      onRestart();
    } else {
      navigate("/level6");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #E8D5A8 0%, #C9A66B 100%)",
      }}
    >
      {/* Dust particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: -20,
              x: Math.random() * window.innerWidth,
              opacity: 0.6,
            }}
            animate={{
              y: window.innerHeight + 20,
              opacity: [0.6, 0.3, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            className="absolute w-1 h-1 rounded-full"
            style={{ backgroundColor: "#C9A66B" }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Sad character head */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex justify-center mb-6"
        >
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, #FFE4B5 0%, #E8D5A8 100%)",
              border: "4px solid #C9A66B",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          >
            {/* Sad eyes */}
            <div className="flex gap-6 mb-2">
              <div
                className="w-4 h-4 rounded-full bg-black"
                style={{ transform: "scaleY(0.6)" }}
              />
              <div
                className="w-4 h-4 rounded-full bg-black"
                style={{ transform: "scaleY(0.6)" }}
              />
            </div>

            {/* Sad mouth */}
            <div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 w-8 h-4 border-t-2 border-black rounded-t-full"
              style={{ transform: "scaleY(-1)" }}
            />

            {/* Sweat drop */}
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute top-6 right-8 w-3 h-4 rounded-full"
              style={{
                background: "linear-gradient(135deg, #A8C9A0 0%, #90B090 100%)",
                border: "1px solid #A8C9A0",
              }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold mb-2"
          style={{ color: "#8B4513", letterSpacing: "0.5px" }}
        >
          Thử lại nhé!
        </motion.h1>

        {/* Encouragement message */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg mb-10 font-medium"
          style={{ color: "#C9A66B", letterSpacing: "0.3px" }}
        >
          Cố lên, lần sau sẽ đẹp hơn!
        </motion.p>

        {/* Score achieved */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6 }}
          className="px-12 py-6 rounded-2xl mb-8 shadow-lg"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.5) 100%)",
            border: "3px solid #C9A66B",
            minWidth: "200px",
          }}
        >
          <div className="text-base font-semibold opacity-75" style={{ color: "#8B4513", letterSpacing: "0.3px" }}>
            Điểm đã đạt
          </div>
          <div className="text-5xl font-bold mt-1" style={{ color: "#E8A520" }}>
            {score}
          </div>
        </motion.div>

        {/* Encouragement icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="flex justify-center mb-6"
        >
          <Heart className="w-12 h-12" style={{ color: "#FF6B6B" }} fill="#FF6B6B" />
        </motion.div>

        {/* Retry button */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRestart}
            className="px-20 py-6 rounded-full inline-flex items-center justify-center gap-4 font-bold text-2xl"
            style={{
              background: "linear-gradient(135deg, #E8A520 0%, #FFD700 100%)",
              color: "#FFFFFF",
              boxShadow: "0 10px 30px #E8A52080",
              letterSpacing: "0.5px",
            }}
          >
            <RefreshCw className="w-8 h-8" />
            <span>Thử lại</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default FailScreen;
