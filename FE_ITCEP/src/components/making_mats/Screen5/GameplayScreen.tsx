import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Heart } from "lucide-react";
import { WeavingScenery } from "./WeavingScenery";
import { WeavingLoom } from "./WeavingLoom";
import { Craftsman } from "./Craftsman";
import { EnvironmentalEffects } from "./EnvironmentalEffects";
import "./animations.css";

interface Note {
  id: number;
  lane: number;
  position: number;
  type: "fiber" | "compress" | "pattern1" | "pattern2";
}

type Timing = "Perfect" | "Good" | "Miss" | null;

const LANE_KEYS = ["A", "S", "D", "F"];
const LANE_DESCRIPTIONS = [
  "Luồn sợi ngang",
  "Nén sợi",
  "Giữ hoa văn",
  "Đổi màu"
];
const NOTE_SPEED = 2;
const PERFECT_THRESHOLD = 50;
const GOOD_THRESHOLD = 100;
const TARGET_POSITION = 850;

export default function GameplayScreen() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timing, setTiming] = useState<Timing>(null);
  const [nextNoteId, setNextNoteId] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hearts, setHearts] = useState(3);
  const [highlightedLane, setHighlightedLane] = useState<number | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  // Generate notes
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const lane = Math.floor(Math.random() * 4);
      const type = ["fiber", "compress", "pattern1", "pattern2"][lane] as Note["type"];
      
      setNotes(prev => [
        ...prev,
        {
          id: nextNoteId,
          lane,
          position: -50,
          type,
        },
      ]);
      setNextNoteId(prev => prev + 1);
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying, nextNoteId]);

  // Move notes down
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setNotes(prev => {
        const updated = prev.map(note => ({
          ...note,
          position: note.position + NOTE_SPEED,
        }));

        // Check for missed notes
        const missedCount = updated.filter(n => n.position > TARGET_POSITION + GOOD_THRESHOLD).length;
        if (missedCount > 0) {
          setCombo(0);
          setTiming("Miss");
          setHearts(prev => Math.max(0, prev - missedCount));
          setTimeout(() => setTiming(null), 500);
        }

        // Remove notes that are off screen
        return updated.filter(note => note.position <= TARGET_POSITION + GOOD_THRESHOLD + 50);
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle key press with enhanced feedback
  const handleKeyPress = useCallback((lane: number) => {
    const notesInLane = notes.filter(n => n.lane === lane);
    if (notesInLane.length === 0) return;

    const closestNote = notesInLane.reduce((closest, note) => {
      const distCurrent = Math.abs(note.position - TARGET_POSITION);
      const distClosest = Math.abs(closest.position - TARGET_POSITION);
      return distCurrent < distClosest ? note : closest;
    });

    const distance = Math.abs(closestNote.position - TARGET_POSITION);

    // Highlight lane with feedback
    setHighlightedLane(lane);
    setTimeout(() => setHighlightedLane(null), 400);

    if (distance <= PERFECT_THRESHOLD) {
      setTiming("Perfect");
      setScore(prev => prev + 100);
      setCombo(prev => prev + 1);
      setProgress(prev => Math.min(prev + 2, 100));
    } else if (distance <= GOOD_THRESHOLD) {
      setTiming("Good");
      setScore(prev => prev + 50);
      setCombo(prev => prev + 1);
      setProgress(prev => Math.min(prev + 1, 100));
    } else {
      setTiming("Miss");
      setCombo(0);
      setHearts(prev => Math.max(0, prev - 1));
    }

    setNotes(prev => prev.filter(n => n.id !== closestNote.id));
    setTimeout(() => setTiming(null), 500);
  }, [notes]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const laneIndex = LANE_KEYS.indexOf(key);
      if (laneIndex !== -1) {
        handleKeyPress(laneIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  // Check win/lose condition
  useEffect(() => {
    if (progress >= 100) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsPlaying(false);
      setShowCompletion(true);
      setTimeout(() => navigate("/level5/success"), 2000);
    } else if (hearts <= 0) {
      setIsPlaying(false);
      setTimeout(() => navigate("/level5/fail"), 1000);
    }
  }, [progress, hearts, navigate]);

  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ backgroundColor: "#E8D5A8" }}>
      {/* Scenic background with parallax layers */}
      <WeavingScenery />

      {/* Environmental effects - dust, light, shadows */}
      <EnvironmentalEffects />

      {/* Weaving loom - interactive game area */}
      <WeavingLoom />

      {/* Craftsman character */}
      <Craftsman />

      {/* Game content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header UI - Game info and stats */}
        <div className="flex justify-between items-start p-8 relative z-30">
          {/* Left: Game title and level info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-start gap-4"
          >
            <div>
              <div className="text-sm font-bold uppercase tracking-widest" style={{ color: "#8B6F47" }}>
                Level 5 - Dệt Chiếu
              </div>
              <div className="text-2xl font-bold" style={{ color: "#C9A66B" }}>
                Nghề Dệt Truyền Thống
              </div>
              <div className="text-xs opacity-75" style={{ color: "#A39882" }}>
                Bắt những sợi chiếu trong nhịp độ chính xác
              </div>
            </div>
          </motion.div>

          {/* Right: Score and lives */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-right"
          >
            {/* Lives - Hearts */}
            <div className="flex items-center gap-2 justify-end mb-3 bg-white/20 px-4 py-2 rounded-lg backdrop-blur">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: i < hearts ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: i < hearts ? Infinity : 0, repeatDelay: 0.5 }}
                >
                  <Heart
                    className="w-6 h-6"
                    style={{
                      color: i < hearts ? "#E8A520" : "#D3D3D3",
                      fill: i < hearts ? "#E8A520" : "none",
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Score with animated shine */}
            <div className="text-4xl font-bold mb-2" style={{ color: "#E8A520" }}>
              {score.toLocaleString()}
            </div>
            <div className="text-xs font-semibold" style={{ color: "#8B6F47" }}>
              ĐIỂM SỐ
            </div>

            {/* Combo - High visibility */}
            <AnimatePresence>
              {combo > 0 && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="mt-3 px-4 py-2 rounded-full flex items-center gap-2 justify-end"
                  style={{
                    background: "linear-gradient(135deg, rgba(232, 165, 32, 0.9) 0%, rgba(255, 215, 0, 0.8) 100%)",
                    boxShadow: "0 0 15px rgba(232, 165, 32, 0.6)",
                  }}
                >
                  <span className="font-bold text-white">COMBO x{combo}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Enhanced Timing Feedback with particle effects */}
        <AnimatePresence>
          {timing && (
            <motion.div
              initial={{ scale: 1.5, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
            >
              {/* Main feedback text with glow */}
              <motion.div
                className="text-5xl px-8 py-4 rounded-full shadow-lg text-center"
                animate={
                  timing === "Perfect" 
                    ? { scale: [1, 1.1, 1], filter: ["drop-shadow(0 0 10px rgba(232, 165, 32, 0.5))", "drop-shadow(0 0 30px rgba(232, 165, 32, 0.8))", "drop-shadow(0 0 10px rgba(232, 165, 32, 0.5))"] }
                    : timing === "Good"
                    ? { scale: [1, 1.05, 1] }
                    : { 
                        x: [-10, 10, -10, 10, 0],
                        filter: "drop-shadow(0 0 15px rgba(166, 124, 82, 0.8))"
                      }
                }
                transition={{ 
                  duration: timing === "Perfect" ? 0.6 : timing === "Good" ? 0.5 : 0.4,
                }}
                style={{
                  color: timing === "Perfect" ? "#FFD700" : timing === "Good" ? "#C9A66B" : "#A67C52",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  textShadow: timing === "Perfect" ? "0 0 20px rgba(232, 165, 32, 0.5)" : "none",
                  fontWeight: "bold",
                }}
              >
                {timing === "Perfect" && "パーフェクト！"}
                {timing === "Good" && "Good!"}
                {timing === "Miss" && "Miss..."}
              </motion.div>

              {/* Particle effects for Perfect hits */}
              {timing === "Perfect" && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={`perfect-particle-${i}`}
                      className="absolute w-2 h-2 rounded-full pointer-events-none"
                      style={{
                        left: "50%",
                        top: "50%",
                        backgroundColor: "#FFD700",
                      }}
                      initial={{ x: 0, y: 0, opacity: 1 }}
                      animate={{
                        x: Math.cos((i / 8) * Math.PI * 2) * 100,
                        y: Math.sin((i / 8) * Math.PI * 2) * 100,
                        opacity: 0,
                        scale: 0,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  ))}
                </>
              )}

              {/* Shake effect particles for Miss */}
              {timing === "Miss" && (
                <>
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={`miss-particle-${i}`}
                      className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
                      style={{
                        left: "50%",
                        top: "50%",
                        backgroundColor: "#A67C52",
                      }}
                      initial={{ x: 0, y: 0, opacity: 1 }}
                      animate={{
                        x: Math.cos((i / 4) * Math.PI * 2) * 60,
                        y: Math.sin((i / 4) * Math.PI * 2) * 60,
                        opacity: 0,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  ))}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game lanes area */}
        <div className="flex-1 flex items-center justify-center px-32 relative pb-20">
          {/* 4 Lanes - Weaving action areas with enhanced feedback */}
          <div className="flex gap-12 h-full max-h-[75%] relative z-20">
            {[0, 1, 2, 3].map(laneIndex => (
              <motion.div 
                key={laneIndex} 
                className="relative w-24"
                animate={
                  highlightedLane === laneIndex 
                    ? { scale: [1, 1.05, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.3 }}
              >
                {/* Lane background - semi-transparent with texture and feedback */}
                <motion.div 
                  className="absolute inset-0 rounded-xl opacity-40 border-2"
                  animate={
                    highlightedLane === laneIndex
                      ? { boxShadow: "inset 0 0 20px rgba(232, 165, 32, 0.6), 0 0 20px rgba(232, 165, 32, 0.4)" }
                      : { boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.1)" }
                  }
                  transition={{ duration: 0.2 }}
                  style={{ 
                    backgroundColor: highlightedLane === laneIndex 
                      ? "rgba(232, 165, 32, 0.5)"
                      : "rgba(201, 166, 107, 0.3)",
                    borderColor: "rgba(232, 213, 168, 0.6)",
                    backdropFilter: "blur(2px)"
                  }}
                />
                
                {/* Lane action label at top with enhanced tooltip */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-16 z-20 text-center pointer-events-none">
                  {/* Key label */}
                  <motion.div 
                    className="text-3xl font-bold mb-2 px-3 py-1 rounded-lg"
                    style={{ 
                      color: "#8B6F47",
                      backgroundColor: "rgba(232, 213, 168, 0.8)",
                    }}
                    animate={highlightedLane === laneIndex ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {LANE_KEYS[laneIndex]}
                  </motion.div>
                  
                  {/* Function description as tooltip */}
                  <motion.div 
                    className="text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap"
                    style={{ 
                      color: "#FFFFFF",
                      backgroundColor: "rgba(139, 111, 71, 0.95)",
                    }}
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {LANE_DESCRIPTIONS[laneIndex]}
                  </motion.div>
                </div>

                {/* Target zone with enhanced glow effect */}
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 0 rgba(232, 165, 32, 0.3), inset 0 0 8px rgba(232, 165, 32, 0.1)", 
                      "0 0 20px rgba(232, 165, 32, 0.6), inset 0 0 15px rgba(232, 165, 32, 0.3)", 
                      "0 0 0 rgba(232, 165, 32, 0.3), inset 0 0 8px rgba(232, 165, 32, 0.1)"
                    ] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute left-0 right-0 h-24 border-2 rounded-lg"
                  style={{
                    top: `${TARGET_POSITION}px`,
                    borderColor: "#E8A520",
                    backgroundColor: "rgba(232, 165, 32, 0.15)",
                  }}
                />

                {/* Falling notes - weaving threads with enhanced visuals */}
                <AnimatePresence>
                  {notes
                    .filter(note => note.lane === laneIndex)
                    .map(note => (
                      <motion.div
                        key={note.id}
                        className="absolute left-1/2 transform -translate-x-1/2 rounded-lg shadow-xl"
                        style={{
                          top: `${note.position}px`,
                          width: "80px",
                          height: "80px",
                          backgroundColor: 
                            note.type === "fiber" ? "linear-gradient(135deg, #E8A520 0%, #FFD700 100%)" :
                            note.type === "compress" ? "linear-gradient(135deg, #C9A66B 0%, #D4A574 100%)" :
                            note.type === "pattern1" ? "linear-gradient(135deg, #A8C9A0 0%, #B8D4B0 100%)" :
                            "linear-gradient(135deg, #E8D5A8 0%, #F0E0C0 100%)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3)",
                          border: "2px solid rgba(255,255,255,0.4)",
                        }}
                        initial={{ scale: 0.6, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        {/* Note content based on type */}
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center font-bold text-xs px-1" style={{ color: "#FFF" }}>
                            {note.type === "fiber" && "---"}
                            {note.type === "compress" && "||"}
                            {note.type === "pattern1" && "~"}
                            {note.type === "pattern2" && "O"}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom UI - Progress and Character */}
        <div className="relative h-40 px-8 pb-4 flex items-end">
          <div className="flex items-end justify-between gap-8 h-full w-full">
            {/* Progress bar - Mat weaving progress with enhanced animations */}
            <div className="flex-1">
              <div className="mb-2 flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="text-xs font-semibold" style={{ color: "#8B6F47" }}>Tiến độ</div>
                    <motion.div 
                      className="text-2xl font-bold" 
                      style={{ color: "#E8A520" }}
                      key={progress}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5, type: "spring" }}
                    >
                      {progress}%
                    </motion.div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold" style={{ color: "#8B6F47" }}>Chiếu hoàn thiện:</span>
                    <span className="text-sm" style={{ color: "#A39882" }}>
                      {progress < 50 ? "Mới bắt đầu..." : progress < 80 ? "Đang tiến triển..." : "Sắp xong!"}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced progress bar with wave effect */}
              <div 
                className="h-8 rounded-lg overflow-hidden relative"
                style={{ 
                  backgroundColor: "rgba(232, 213, 168, 0.4)", 
                  border: "2px solid #C9A66B",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                }}
              >
                <motion.div
                  className="h-full relative"
                  style={{ 
                    background: "linear-gradient(90deg, #E8A520 0%, #FFD700 50%, #E8A520 100%)",
                    backgroundSize: "200% 100%",
                    width: `${progress}%`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${progress}%`,
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ 
                    width: { type: "spring", stiffness: 50, damping: 15 },
                    backgroundPosition: { duration: 2, repeat: Infinity }
                  }}
                >
                  {/* Shine effect on progress bar */}
                  {progress > 5 && (
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      animate={{ 
                        backgroundPosition: ["-100% 0", "100% 0"],
                        opacity: [0, 0.3, 0]
                      }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        ease: "easeInOut"
                      }}
                      style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 45%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
                        backgroundSize: "200% 100%",
                      }}
                    />
                  )}

                  {/* Checkmark indicator */}
                  {progress > 5 && (
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: "bold" }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Progress milestones indicators (visual feedback) */}
              <div className="flex justify-between mt-2 px-1 text-xs" style={{ color: "#A39882" }}>
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>

              <div className="mt-1 text-xs text-center" style={{ color: "#A67C52" }}>
                Nhấn phím A, S, D, F khi note chạm vào ô sáng
              </div>
            </div>
          </div>
        </div>

        {/* Completion effect overlay */}
        <AnimatePresence>
          {showCompletion && (
            <>
              {/* Light burst effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, transparent 70%)",
                }}
              />

              {/* Zoom/scale effect on mat */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 5, -5, 0],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-6xl font-bold"
                  style={{ color: "#E8A520" }}
                >
                  🎉
                </motion.div>
              </motion.div>

              {/* Particle effects */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-2 h-2 rounded-full pointer-events-none"
                  style={{
                    left: "50%",
                    top: "50%",
                    backgroundColor: ["#E8A520", "#FFD700", "#FFA500"][i % 3],
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos((i / 12) * Math.PI * 2) * 200,
                    y: Math.sin((i / 12) * Math.PI * 2) * 200,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
