import { motion } from "motion/react";
import { ThumbsUp, Sparkles } from "lucide-react";

interface CharacterProps {
  state: "idle" | "encourage" | "celebrate";
  message?: string;
}

export function Character({ state, message }: CharacterProps) {
  return (
    <motion.div
      className="absolute bottom-48 right-12 z-20 pointer-events-none"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {/* Character illustration */}
      <motion.div
        animate={{
          y: state === "idle" ? [0, -3, 0] : state === "celebrate" ? [0, -5, 0] : 0,
        }}
        transition={{
          duration: state === "idle" ? 3 : 0.5,
          repeat: state === "idle" ? Infinity : state === "celebrate" ? 3 : 0,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* Vietnamese girl character */}
        <div className="relative w-32 h-56 overflow-hidden">
          {/* Body - áo bà ba */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full"
            style={{
              width: "90px",
              height: "70px",
              background: "linear-gradient(180deg, #E8D5A8 0%, #C9A66B 100%)",
              border: "2px solid #C9A66B",
            }}
          />

          {/* Head */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "#FFE4B5",
              border: "2px solid #C9A66B",
              top: "15px",
            }}
          >
            {/* Eyes */}
            <div className="flex gap-3 justify-center mt-4">
              <motion.div
                animate={state === "celebrate" ? { scaleY: [1, 0.2, 1] } : {}}
                transition={{
                  duration: 0.3,
                  repeat: state === "celebrate" ? Infinity : 0,
                  repeatDelay: 2,
                }}
                className="w-2 h-2 rounded-full bg-black"
              />
              <motion.div
                animate={state === "celebrate" ? { scaleY: [1, 0.2, 1] } : {}}
                transition={{
                  duration: 0.3,
                  repeat: state === "celebrate" ? Infinity : 0,
                  repeatDelay: 2,
                }}
                className="w-2 h-2 rounded-full bg-black"
              />
            </div>

            {/* Smile */}
            <motion.div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-2 border-b-2 border-black rounded-b-full"
              animate={state === "celebrate" ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5, repeat: state === "celebrate" ? Infinity : 0 }}
            />
          </div>

          {/* Nón lá (conical hat) */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              width: "0",
              height: "0",
              borderLeft: "40px solid transparent",
              borderRight: "40px solid transparent",
              borderTop: "30px solid #E8A520",
              top: "-5px",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
          >
            {/* Hat rings */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-16 h-0.5 rounded-full"
              style={{ backgroundColor: "#C9A66B", top: "-20px" }}
            />
            <div
              className="absolute left-1/2 -translate-x-1/2 w-14 h-0.5 rounded-full"
              style={{ backgroundColor: "#C9A66B", top: "-14px" }}
            />
          </div>

          {/* Arms - búa/kéo */}
          <motion.div
            animate={
              state === "celebrate"
                ? { rotate: [-20, 20, -20] }
                : state === "encourage"
                ? { rotate: [0, 15, 0] }
                : {}
            }
            transition={{ duration: 0.5, repeat: state !== "idle" ? Infinity : 0 }}
            className="absolute rounded-full"
            style={{
              width: "30px",
              height: "10px",
              backgroundColor: "#E8D5A8",
              border: "2px solid #C9A66B",
              top: "70px",
              right: "0px",
              transformOrigin: "left center",
            }}
          >
            {state === "encourage" && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute -right-6 -top-3"
              >
                <ThumbsUp className="w-6 h-6" style={{ color: "#E8A520" }} />
              </motion.div>
            )}
            {state === "celebrate" && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute -right-6 -top-3"
              >
                <Sparkles className="w-6 h-6" style={{ color: "#E8A520" }} />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Speech bubble */}
        {message && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-16 -left-32 px-4 py-2 rounded-2xl whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #F0E0C0 100%)",
              border: "2px solid #E8A520",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <div className="text-sm" style={{ color: "#8B4513" }}>
              {message}
            </div>
            {/* Bubble tail */}
            <div
              className="absolute bottom-0 left-1/2 translate-y-1/2"
              style={{
                width: "0",
                height: "0",
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "12px solid #E8A520",
              }}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Decoration - tiny mat pieces */}
      {state === "celebrate" && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: 0, x: 0, opacity: 1 }}
              animate={{
                y: -60,
                x: (i - 1) * 30,
                opacity: 0,
                rotate: 360,
              }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="absolute w-4 h-4 rounded"
              style={{
                backgroundColor: "#A8C9A0",
                left: "50%",
                top: "0%",
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}
