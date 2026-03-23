import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Heart } from "lucide-react";
import { WeavingScenery } from "./WeavingScenery";
import { WeavingLoom } from "./WeavingLoom";
import { Craftsman } from "./Craftsman";
import { EnvironmentalEffects } from "./EnvironmentalEffects";

interface Note {
  id: number;
  lane: number;
  position: number;
  type: "fiber" | "compress" | "pattern1" | "pattern2";
}

type Timing = "Perfect" | "Good" | "Miss" | null;

const LANE_KEYS = ["A", "S", "D", "F"];
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

  // Handle key press
  const handleKeyPress = useCallback((lane: number) => {
    const notesInLane = notes.filter(n => n.lane === lane);
    if (notesInLane.length === 0) return;

    const closestNote = notesInLane.reduce((closest, note) => {
      const distCurrent = Math.abs(note.position - TARGET_POSITION);
      const distClosest = Math.abs(closest.position - TARGET_POSITION);
      return distCurrent < distClosest ? note : closest;
    });

    const distance = Math.abs(closestNote.position - TARGET_POSITION);

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
      setIsPlaying(false);
      setTimeout(() => navigate("/level5/success"), 1000);
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

        {/* Timing Feedback */}
        <AnimatePresence>
          {timing && (
            <motion.div
              initial={{ scale: 1.5, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div
                className="text-5xl px-8 py-4 rounded-full shadow-lg"
                style={{
                  color: timing === "Perfect" ? "#E8A520" : timing === "Good" ? "#C9A66B" : "#A67C52",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  textShadow: timing === "Perfect" ? "0 0 20px rgba(232, 165, 32, 0.5)" : "none",
                }}
              >
                {timing}!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game lanes area */}
        <div className="flex-1 flex items-center justify-center px-32 relative pb-20">
          {/* 4 Lanes - Weaving action areas */}
          <div className="flex gap-12 h-full max-h-[75%] relative z-20">
            {[0, 1, 2, 3].map(laneIndex => (
              <div key={laneIndex} className="relative w-24">
                {/* Lane background - semi-transparent with texture */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-40 border-2"
                  style={{ 
                    backgroundColor: "rgba(201, 166, 107, 0.3)",
                    borderColor: "rgba(232, 213, 168, 0.6)",
                    backdropFilter: "blur(2px)"
                  }}
                />
                
                {/* Lane action label at top */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 z-20 text-center">
                  <div className="text-3xl font-bold" style={{ color: "#8B6F47" }}>
                    {LANE_KEYS[laneIndex]}
                  </div>
                  <div className="text-xs font-semibold mt-1" style={{ color: "#A39882" }}>
                    {laneIndex === 0 && "Luồn sợi ngang"}
                    {laneIndex === 1 && "Nén sợi"}
                    {laneIndex === 2 && "Giữ hoa văn"}
                    {laneIndex === 3 && "đổi màu"}
                  </div>
                </div>

                {/* Target zone with glow effect */}
                <motion.div
                  animate={{ boxShadow: ["0 0 0 rgba(232, 165, 32, 0.3)", "0 0 15px rgba(232, 165, 32, 0.6)", "0 0 0 rgba(232, 165, 32, 0.3)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute left-0 right-0 h-24 border-2 rounded-lg"
                  style={{
                    top: `${TARGET_POSITION}px`,
                    borderColor: "#E8A520",
                    backgroundColor: "rgba(232, 165, 32, 0.15)",
                  }}
                />

                {/* Falling notes - weaving threads */}
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
              </div>
            ))}
          </div>
        </div>

        {/* Bottom UI - Progress and Character */}
        <div className="relative h-40 px-8 pb-4 flex items-end">
          <div className="flex items-end justify-between gap-8 h-full w-full">
            {/* Progress bar - Mat weaving progress */}
            <div className="flex-1">
              <div className="mb-2 flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="text-xs font-semibold" style={{ color: "#8B6F47" }}>Tiến độ</div>
                    <div className="text-2xl font-bold" style={{ color: "#E8A520" }}>{progress}%</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold" style={{ color: "#8B6F47" }}>Chiếu hoàn thiện:</span>
                    <span className="text-sm" style={{ color: "#A39882" }}>Dệt từng sợi...</span>
                  </div>
                </div>
              </div>
              <div className="h-8 rounded-lg overflow-hidden relative" style={{ backgroundColor: "rgba(232, 213, 168, 0.4)", border: "2px solid #C9A66B" }}>
                <motion.div
                  className="h-full relative"
                  style={{ 
                    background: "linear-gradient(90deg, #E8A520 0%, #FFD700 50%, #E8A520 100%)",
                    backgroundSize: "200% 100%",
                    width: `${progress}%`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                >
                  {progress > 5 && (
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "bold" }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.div>
              </div>
              <div className="mt-1 text-xs text-center" style={{ color: "#A67C52" }}>
                Nhấn phím A, S, D, F khi note chạm vào ô sáng
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
