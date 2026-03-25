import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

interface MascotMatProps {
  state: "idle" | "encourage" | "celebrate";
  message?: string;
}

export function MascotMat({ state, message }: MascotMatProps) {
  return (
    <motion.div
      className="fixed bottom-80 right-12 z-50 pointer-events-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {/* 3D Mat Mascot */}
      <motion.div
        animate={{
          rotateZ: state === "celebrate" ? [0, 5, -5, 0] : 0,
          scale: state === "celebrate" ? 1.1 : 1,
        }}
        transition={{
          duration: state === "celebrate" ? 0.6 : 0.3,
          repeat: state === "celebrate" ? 2 : 0,
        }}
        className="relative w-24 h-20"
      >
        {/* Mat Base - 3D perspective */}
        <div className="relative w-full h-full">
          {/* Front face */}
          <div
            className="absolute inset-0 rounded-lg border-4 flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #E8D5A8 0%, #F0E0C0 100%)",
              borderColor: "#C9A66B",
              boxShadow: "4px 4px 12px rgba(0,0,0,0.2), inset -2px -2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {/* Woven pattern */}
            <div className="absolute inset-2 opacity-30">
              <div className="absolute inset-0 bg-repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                #C9A66B 2px,
                #C9A66B 4px
              )" />
              <div className="absolute inset-0 bg-repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 2px,
                #8B7355 2px,
                #8B7355 4px
              )" />
            </div>

            {/* Smiley face */}
            <div className="relative z-10">
              {/* Eyes */}
              <motion.div
                className="flex gap-3 justify-center mb-1"
                animate={{
                  scale: state === "celebrate" ? [1, 1.2, 1] : 1,
                }}
              >
                <div className="w-2 h-2 bg-gray-800 rounded-full" />
                <div className="w-2 h-2 bg-gray-800 rounded-full" />
              </motion.div>

              {/* Smile */}
              <svg width="20" height="12" viewBox="0 0 20 12" className="mx-auto">
                <path
                  d="M 3 7 Q 10 12 17 7"
                  stroke="#8B4513"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* 3D Side depth */}
          <div
            className="absolute -right-1 top-1 w-1 h-full rounded-r"
            style={{
              background: "linear-gradient(to right, #8B7355, #A0826D)",
              boxShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          />
          <div
            className="absolute -bottom-1 left-1 h-1 w-full rounded-b"
            style={{
              background: "linear-gradient(to bottom, #A0826D, #8B7355)",
              boxShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          />
        </div>

        {/* Cheering hands */}
        {(state === "encourage" || state === "celebrate") && (
          <>
            {/* Left hand */}
            <motion.div
              className="absolute -left-4 top-0 w-4 h-10 rounded"
              style={{
                background: "#FFE4B5",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
              animate={{
                rotate: state === "celebrate" ? [-20, -40, -20] : -20,
              }}
              transition={{ duration: 0.6, repeat: state === "celebrate" ? 2 : 0 }}
            >
              {/* Thumb */}
              <div className="absolute top-0 right-1 w-2 h-3 bg-yellow-100 rounded-full" />
            </motion.div>

            {/* Right hand */}
            <motion.div
              className="absolute -right-4 top-0 w-4 h-10 rounded"
              style={{
                background: "#FFE4B5",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
              animate={{
                rotate: state === "celebrate" ? [20, 40, 20] : 20,
              }}
              transition={{ duration: 0.6, repeat: state === "celebrate" ? 2 : 0 }}
            >
              {/* Thumb */}
              <div className="absolute top-0 left-1 w-2 h-3 bg-yellow-100 rounded-full" />
            </motion.div>
          </>
        )}

        {/* Sparkles on celebrate */}
        {state === "celebrate" && (
          <>
            <motion.div
              className="absolute -top-3 -right-3"
              animate={{ scale: [0, 1, 0], rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" style={{ color: "#E8A520" }} />
            </motion.div>
            <motion.div
              className="absolute -top-3 -left-3"
              animate={{ scale: [0, 1, 0], rotate: -360 }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
            >
              <Sparkles className="w-4 h-4" style={{ color: "#FFD700" }} />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Encouraging message */}
      <AnimatePresence>
        {message && (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-lg font-bold px-5 py-2 rounded-full pointer-events-auto"
            style={{
              background: "#E8A520",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(232, 165, 32, 0.8), 0 0 24px rgba(232, 165, 32, 0.4)",
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
