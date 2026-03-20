import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Sparkles, Music, Heart } from "lucide-react";

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
    <div className="w-screen h-screen overflow-hidden relative" style={{ backgroundColor: "#F0E0C0" }}>
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1626753904920-36db9c9e6ba8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBob3VyJTIwcmljZSUyMGZpZWxkcyUyMHN1bnNldCUyMHdhcm18ZW58MXx8fHwxNzczOTkwMTEzfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Vietnamese countryside"
          className="w-full h-full object-cover opacity-40 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F0E0C0]/50 to-[#F0E0C0]" />
      </div>

      {/* Game content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header UI */}
        <div className="flex justify-between items-start p-8">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8" style={{ color: "#C9A66B" }} />
            <div>
              <div className="text-sm" style={{ color: "#C9A66B" }}>Level 5</div>
              <div className="text-xl" style={{ color: "#8B6F47" }}>Dệt Chiếu</div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 justify-end mb-2">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className="w-6 h-6"
                  style={{
                    color: i < hearts ? "#E8A520" : "#D3D3D3",
                    fill: i < hearts ? "#E8A520" : "none",
                  }}
                />
              ))}
            </div>
            <div className="text-3xl mb-2" style={{ color: "#8B6F47" }}>
              {score.toLocaleString()}
            </div>
            {combo > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xl flex items-center gap-2 justify-end"
                style={{ color: "#E8A520" }}
              >
                <Sparkles className="w-5 h-5" />
                Combo x{combo}
              </motion.div>
            )}
          </div>
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
        <div className="flex-1 flex items-center justify-center px-32 relative">
          {/* Mat being woven - decorative element */}
          <div 
            className="absolute inset-x-32 top-20 h-32 opacity-30"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1737606985741-479bece921b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMFZpZXRuYW1lc2UlMjBzdHJhdyUyMG1hdCUyMHdlYXZpbmclMjBwYXR0ZXJufGVufDF8fHx8MTc3Mzk5MDExMXww&ixlib=rb-4.1.0&q=80&w=1080)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "8px",
            }}
          />

          {/* 4 Lanes */}
          <div className="flex gap-8 h-full max-h-[900px] relative">
            {[0, 1, 2, 3].map(laneIndex => (
              <div key={laneIndex} className="relative w-32">
                {/* Lane background */}
                <div 
                  className="absolute inset-0 rounded-lg opacity-20"
                  style={{ backgroundColor: "#E8D5A8" }}
                />
                
                {/* Lane icon at top */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20 p-3 rounded-full" style={{ backgroundColor: "rgba(232, 213, 168, 0.6)" }}>
                  {laneIndex === 0 && (
                    <div className="w-12 h-12 flex items-center justify-center">
                      <div className="w-10 h-2 rounded-full" style={{ backgroundColor: "#E8A520" }} />
                    </div>
                  )}
                  {laneIndex === 1 && (
                    <div className="w-12 h-12 flex items-center justify-center">
                      <div className="w-8 h-8 rounded" style={{ backgroundColor: "#C9A66B", clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
                    </div>
                  )}
                  {laneIndex === 2 && (
                    <div className="w-12 h-12 flex items-center justify-center">
                      <div className="w-8 h-8" style={{ backgroundColor: "#A8C9A0" }}>
                        <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
                          <div className="rounded-sm" style={{ backgroundColor: "#C9A66B" }} />
                          <div className="rounded-sm" style={{ backgroundColor: "#E8D5A8" }} />
                          <div className="rounded-sm" style={{ backgroundColor: "#E8D5A8" }} />
                          <div className="rounded-sm" style={{ backgroundColor: "#C9A66B" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  {laneIndex === 3 && (
                    <div className="w-12 h-12 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: "#A8C9A0" }}>
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E8A520" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Target zone */}
                <div
                  className="absolute left-0 right-0 h-20 border-2 rounded-lg"
                  style={{
                    top: `${TARGET_POSITION}px`,
                    borderColor: "#E8A520",
                    backgroundColor: "rgba(232, 165, 32, 0.1)",
                  }}
                />

                {/* Falling notes */}
                <AnimatePresence>
                  {notes
                    .filter(note => note.lane === laneIndex)
                    .map(note => (
                      <motion.div
                        key={note.id}
                        className="absolute left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-lg shadow-lg"
                        style={{
                          top: `${note.position}px`,
                          backgroundColor: 
                            note.type === "fiber" ? "#E8A520" :
                            note.type === "compress" ? "#C9A66B" :
                            note.type === "pattern1" ? "#A8C9A0" :
                            "#E8D5A8",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        {/* Note content based on type */}
                        <div className="w-full h-full flex items-center justify-center">
                          {note.type === "fiber" && (
                            <div className="text-center text-white font-bold text-sm px-2">
                              Luồn sợi ngang
                            </div>
                          )}
                          {note.type === "compress" && (
                            <div className="text-center text-white font-bold text-sm px-2">
                              Nén sợi
                            </div>
                          )}
                          {note.type === "pattern1" && (
                            <div className="text-center text-white font-bold text-sm px-2">
                              Giữ hoa văn
                            </div>
                          )}
                          {note.type === "pattern2" && (
                            <div className="text-center text-white font-bold text-sm px-2">
                              Đổi màu
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom UI - Progress and Character */}
        <div className="relative h-32 px-8 pb-4">
          <div className="flex items-end justify-between gap-8 h-full">
            {/* Character */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 rounded-full overflow-hidden border-4 shadow-lg flex-shrink-0"
              style={{ borderColor: "#E8D5A8" }}
            >
              <img
                src="https://images.unsplash.com/photo-1681372750321-83d344c77167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWaWV0bmFtZXNlJTIweW91bmclMjB3b21hbiUyMHRyYWRpdGlvbmFsJTIwYW8lMjBiYSUyMGJhJTIwY29uaWNhbCUyMGhhdHxlbnwxfHx8fDE3NzM5OTAxMTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Vietnamese girl"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Progress bar */}
            <div className="flex-1">
              <div className="mb-1 flex justify-between items-center">
                <span className="text-sm" style={{ color: "#8B6F47" }}>Chiếu hoàn thiện:</span>
                <span className="text-lg" style={{ color: "#E8A520" }}>{progress}%</span>
              </div>
              <div className="h-10 rounded-lg overflow-hidden relative" style={{ backgroundColor: "#E8D5A8" }}>
                <motion.div
                  className="h-full relative"
                  style={{ 
                    backgroundColor: "#C9A66B",
                    width: `${progress}%`,
                    backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(232, 213, 168, 0.3) 10px, rgba(232, 213, 168, 0.3) 20px)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                >
                  {progress > 10 && (
                    <Sparkles className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white" />
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
