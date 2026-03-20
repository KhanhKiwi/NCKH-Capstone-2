import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Scissors, Circle, Search, Feather } from "lucide-react";
import confetti from "canvas-confetti";

interface DefectHoleProps {
  id: number;
  type: "frayed" | "loose" | "error";
  position: { x: number; y: number };
  onFix: (id: number) => void;
  onMiss: (id: number) => void;
  duration: number;
  hammerRadius: number;
}

export function DefectHole({
  id,
  type,
  position,
  onFix,
  onMiss,
  duration,
  hammerRadius,
}: DefectHoleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasBeenHit, setHasBeenHit] = useState(false);
  const [hasMissed, setHasMissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasBeenHit) {
        setHasMissed(true);
        // Animate out then call onMiss after animation completes
        setTimeout(() => onMiss(id), 250);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onMiss, hasBeenHit]);

  const getIcon = () => {
    switch (type) {
      case "frayed":
        return <Feather className="w-8 h-8" style={{ color: "#E8A520" }} strokeWidth={1.5} />;
      case "loose":
        return <Circle className="w-8 h-8" style={{ color: "#C9A66B" }} strokeWidth={2.5} />;
      case "error":
        return <Search className="w-8 h-8" style={{ color: "#A8C9A0" }} strokeWidth={2.5} />;
    }
  };

  const getDefectStyle = () => {
    switch (type) {
      case "frayed":
        return { bg: "#FFE4B5", border: "#E8A520", shadow: "#E8A52060" };
      case "loose":
        return { bg: "#F5DEB3", border: "#C9A66B", shadow: "#C9A66B60" };
      case "error":
        return { bg: "#E8F5E9", border: "#A8C9A0", shadow: "#A8C9A060" };
    }
  };

  const handleClick = () => {
    if (hasBeenHit) return;
    
    setHasBeenHit(true);

    // Vàng cát particle effect
    confetti({
      particleCount: 25,
      angle: 90,
      spread: 60,
      origin: { x: 0.5, y: 0.5 },
      colors: ["#E8A520", "#FFD700", "#F0E0C0", "#FFA500"],
      gravity: 1.2,
      scalar: 0.9,
    });

    onFix(id);
  };

  const style = getDefectStyle();
  const baseRadius = 50;
  const displayRadius = baseRadius * hammerRadius;
  const isEnded = hasBeenHit || hasMissed;

  const getTypeLabel = () => {
    switch (type) {
      case "frayed":
        return "Mép lởm";
      case "loose":
        return "Viền bung";
      case "error":
        return "Hoa văn";
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 0, y: 40 }}
      animate={isEnded ? { scale: 0, y: 40, opacity: 0 } : { scale: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        exit: { duration: 0.25 },
      }}
      className="absolute cursor-pointer z-40"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={handleClick}
    >
      {/* Main defect hole container */}
      <motion.div
        animate={{
          y: isEnded ? 0 : [0, -8, 0],
          rotate: isEnded ? 0 : [0, -4, 4, -2, 0],
        }}
        transition={{
          y: { duration: 0.6, repeat: isEnded ? 0 : Infinity, ease: "easeInOut" },
          rotate: { duration: 0.8, repeat: isEnded ? 0 : Infinity, ease: "easeInOut" },
        }}
        className="relative"
      >
        {/* Large glow background */}
        <motion.div
          animate={{
            scale: isEnded ? 0 : [0.9, 1.5, 0.9],
            opacity: isEnded ? 0 : [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 1, repeat: isEnded ? 0 : Infinity }}
          className="absolute inset-0 rounded-full blur-2xl -z-10"
          style={{
            backgroundColor: style.border,
            width: `${displayRadius + 40}px`,
            height: `${displayRadius + 40}px`,
            left: "-20px",
            top: "-20px",
          }}
        />

        {/* Shine sparkle */}
        <motion.div
          animate={{ opacity: isEnded ? 0 : [0.2, 0.6, 0.2] }}
          transition={{ duration: 1.5, repeat: isEnded ? 0 : Infinity }}
          className="absolute top-3 left-3 w-5 h-5 rounded-full blur-sm"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.9), transparent)",
          }}
        />

        {/* Main defect hole circle */}
        <div
          className="flex flex-col items-center justify-center shadow-2xl border-4 relative overflow-hidden"
          style={{
            width: `${displayRadius}px`,
            height: `${displayRadius}px`,
            backgroundColor: style.bg,
            borderColor: style.border,
            borderRadius: "50%",
            boxShadow: `0 0 40px ${style.shadow}, 0 10px 25px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.4)`,
          }}
        >
          {/* Icon with pulse */}
          <motion.div
            animate={{ scale: [0.95, 1.1, 0.95] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          >
            {getIcon()}
          </motion.div>

          {/* Type label */}
          <div className="text-xs font-bold mt-1" style={{ color: style.border }}>
            {getTypeLabel()}
          </div>

          {/* Timer ring countdown */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{
              width: `${displayRadius}px`,
              height: `${displayRadius}px`,
            }}
          >
            <motion.circle
              cx={displayRadius / 2}
              cy={displayRadius / 2}
              r={displayRadius / 2 - 5}
              fill="none"
              stroke={style.border}
              strokeWidth="3"
              strokeDasharray={Math.PI * displayRadius}
              initial={{ strokeDashoffset: 0 }}
              animate={{
                strokeDashoffset: isEnded ? 0 : Math.PI * displayRadius,
              }}
              transition={{
                duration: duration / 1000,
                ease: "linear",
              }}
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Pulse ripple waves */}
        {!isEnded && (
          <>
            <motion.div
              initial={{ scale: 0.7, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
              className="absolute inset-0 rounded-full border-2"
              style={{
                borderColor: style.border,
                width: `${displayRadius}px`,
                height: `${displayRadius}px`,
              }}
            />
            <motion.div
              initial={{ scale: 0.7, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.5 }}
              className="absolute inset-0 rounded-full border-2"
              style={{
                borderColor: style.border,
                width: `${displayRadius}px`,
                height: `${displayRadius}px`,
              }}
            />
          </>
        )}

        {/* Floating sparkles */}
        {!isEnded &&
          [0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: Math.cos((i * Math.PI * 2) / 3) * 25,
                y: Math.sin((i * Math.PI * 2) / 3) * 25,
                opacity: [0, 0.8, 0.8, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.4,
              }}
              className="absolute pointer-events-none"
              style={{
                left: `${displayRadius / 2 - 4}px`,
                top: `${displayRadius / 2 - 4}px`,
                width: "8px",
                height: "8px",
                backgroundColor: style.border,
                borderRadius: "50%",
                boxShadow: `0 0 8px ${style.border}, 0 0 16px ${style.border}80`,
              }}
            />
          ))}
      </motion.div>
    </motion.div>
  );
}
