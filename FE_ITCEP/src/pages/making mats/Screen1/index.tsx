import { useState, useCallback, useEffect, useRef } from "react";
import styles from "../../../styles/Screen1/Screen1.module.css";
import { useGameState } from "../../../hooks/making_mats/Screen1/useGameState";
import FarmerNPC from "../../../components/making_mats/Screen1/FarmerNPC";
import SpeechBubble from "../../../components/making_mats/Screen1/SpeechBubble";
import SedgePlant from "../../../components/making_mats/Screen1/SedgePlant";
import Phase3Plant from "../../../components/making_mats/Screen1/Phase3Plant";
import HUD from "../../../components/making_mats/Screen1/HUD";
import HintPanel from "../../../components/making_mats/Screen1/HintPanel";
import ScorePop from "../../../components/making_mats/Screen1/ScorePop";
import Basket from "../../../components/making_mats/Screen1/Basket";

// Import background images
import bg0 from "../../../assets/bg0-intro.png";
import bg1 from "../../../assets/bg1-select.png";
import bg2 from "../../../assets/bg2-harvest.png";
import bg3 from "../../../assets/bg3-collect.png";

const BG: Record<number, string> = {
  0: bg0,
  1: bg1,
  2: bg2,
  3: bg3,
  4: bg0,
};

const OVERLAY: Record<number, string> = {
  0: "rgba(0,0,0,0.30)",
  1: "rgba(0,0,0,0.15)",
  2: "rgba(0,0,0,0.20)",
  3: "rgba(0,0,0,0.18)",
  4: "rgba(0,0,0,0.28)",
};

export default function Screen1() {
  const {
    state,
    startGame,
    selectPlant,
    cutPlant,
    collectPlant,
    toggleHint,
    resetGame,
  } = useGameState();

  // Sickle position tracking with useRef (not state)
  const sicklePosRef = useRef({ x: 0, y: 0 });
  const sickleElRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Phase 3 drag state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isDragOverRope, setIsDragOverRope] = useState(false);
  const [isDragWrong, setIsDragWrong] = useState(false);
  const ghostRef = useRef<HTMLDivElement>(null);
  const draggingIdRef = useRef<string | null>(null);

  // Only use useState for display state (showing/hiding)
  const [sickleHeld, setSickleHeld] = useState(false);

  // Global mousemove and mouseup handlers for sickle drag
  useEffect(() => {
    if (!sickleHeld) return;

    const handleMove = (e: MouseEvent) => {
      // Update sickle position via DOM directly (no setState)
      sicklePosRef.current = { x: e.clientX, y: e.clientY };
      if (sickleElRef.current) {
        sickleElRef.current.style.left = e.clientX - 25 + "px";
        sickleElRef.current.style.top = e.clientY - 55 + "px";
      }

      // Throttle plant overlap check with requestAnimationFrame
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const plantEls = document.querySelectorAll("[data-plant-id]");
        let found: string | null = null;
        plantEls.forEach((el) => {
          // Only check standing plants
          const plant = el as HTMLElement;
          // Skip if it's a cut plant (fixed position)
          if (plant.style.pointerEvents === "none") return;

          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
          if (dist < 35) found = el.getAttribute("data-plant-id");
        });

        if (found) {
          // Highlight the plant
          const plantEl = document.querySelector(`[data-plant-id="${found}"]`);
          if (plantEl) {
            plantEl.classList.add("hover-highlight");
          }
        } else {
          // Remove highlights
          document.querySelectorAll("[data-plant-id]").forEach((el) => {
            el.classList.remove("hover-highlight");
          });
        }
      });
    };

    const handleUp = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);

      // Check for cut on plant
      const plantEls = document.querySelectorAll("[data-plant-id]");
      let found: string | null = null;
      plantEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (dist < 35) found = el.getAttribute("data-plant-id");
      });

      setSickleHeld(false);
      if (found) {
        cutPlant(found, e.clientX, e.clientY);
      }

      // Clean up highlights
      document.querySelectorAll("[data-plant-id]").forEach((el) => {
        el.classList.remove("hover-highlight");
      });
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [sickleHeld, cutPlant]);

  const handleDragStart = useCallback(
    (id: string, startX: number, startY: number) => {
      draggingIdRef.current = id;
      setDraggingId(id);
      if (ghostRef.current) {
        ghostRef.current.style.display = "block";
        ghostRef.current.style.left = startX - 22 + "px";
        ghostRef.current.style.top = startY - 22 + "px";
      }
    },
    [],
  );

  // Drag event listeners for phase 3
  useEffect(() => {
    if (!draggingId) return;

    const onMove = (e: MouseEvent) => {
      // Move ghost via DOM directly (no setState = no jitter)
      if (ghostRef.current) {
        ghostRef.current.style.left = e.clientX - 22 + "px";
        ghostRef.current.style.top = e.clientY - 22 + "px";
      }
      // Check basket overlap with hit area
      const basketEl = document.getElementById("basket-drop-zone");
      if (basketEl) {
        const r = basketEl.getBoundingClientRect();
        // Basket is on RIGHT side: centered hit area with buffer
        const over =
          e.clientX >= r.left - 30 &&
          e.clientX <= r.right + 30 &&
          e.clientY >= r.top - 30 &&
          e.clientY <= r.bottom + 30;
        setIsDragOverRope(over);

        const plant = state.plants.find((p) => p.id === draggingIdRef.current);
        const wrong =
          !plant ||
          plant.type !== "mature" ||
          !!plant.isWrong ||
          plant.state !== "cut";
        setIsDragWrong(wrong);
      }
    };

    const onUp = (e: MouseEvent) => {
      // Hide ghost
      if (ghostRef.current) {
        ghostRef.current.style.display = "none";
      }
      // Check drop on basket
      const basketEl = document.getElementById("basket-drop-zone");
      if (basketEl && draggingIdRef.current) {
        const r = basketEl.getBoundingClientRect();
        // Basket is on RIGHT side: centered hit area
        const over =
          e.clientX >= r.left - 30 &&
          e.clientX <= r.right + 30 &&
          e.clientY >= r.top - 30 &&
          e.clientY <= r.bottom + 30;
        if (over) {
          collectPlant(draggingIdRef.current, e.clientX, e.clientY);
        }
      }
      draggingIdRef.current = null;
      setDraggingId(null);
      setIsDragOverRope(false);
      setIsDragWrong(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [draggingId, state.plants, collectPlant]);

  const handleSickleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (state.phase !== 2) return;
      e.preventDefault();
      setSickleHeld(true);
    },
    [state.phase],
  );

  const handleBack = useCallback(() => {
    const ok = window.confirm(
      "Bạn có muốn trở về không?\nTiến trình sẽ bị mất.",
    );
    if (ok) resetGame();
  }, [resetGame]);

  const {
    phase,
    plants,
    stars,
    score,
    selectedIds,
    cutIds,
    farmerMood,
    bubbleText,
    showHint,
  } = state;

  return (
    <div className={styles.root}>
      {/* Background */}
      <img
        key={`bg${phase}`}
        src={BG[phase]}
        alt=""
        className={styles.bgPhoto}
      />
      <div
        className={styles.bgOverlay}
        style={{ background: OVERLAY[phase] }}
      />

      {/* HUD */}
      {phase >= 1 && phase <= 3 && (
        <HUD state={state} onToggleHint={toggleHint} onBack={handleBack} />
      )}

      {/* Hint panel */}
      {showHint && phase >= 1 && phase <= 3 && <HintPanel phase={phase} />}

      {/* ── PHASE 0: INTRO ── */}
      {phase === 0 && (
        <div className={styles.scene}>
          <div className={styles.introBadge}>
            🏮 Nghề Làm Chiếu Truyền Thống — Level 1
          </div>
          <FarmerNPC mood={farmerMood} />
          <SpeechBubble text={bubbleText} visible />
          <button className={styles.startBtn} onClick={startGame}>
            Bắt Đầu! →
          </button>
        </div>
      )}

      {/* ── PHASE 1: SELECT ── */}
      {phase === 1 && (
        <div className={styles.scene}>
          <FarmerNPC mood={farmerMood} />
          <SpeechBubble text={bubbleText} visible />
          {plants.map((p) =>
            p.state === "standing" || p.state === "selected" ? (
              <SedgePlant
                key={p.id}
                plant={p}
                phase={phase}
                onClick={selectPlant}
              />
            ) : null,
          )}
          <div className={styles.progressWrap}>
            <div className={styles.progressLabel}>
              Đã chọn: {selectedIds.length}/5 🌿
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${(selectedIds.length / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── PHASE 2: HARVEST ── */}
      {phase === 2 && (
        <div className={styles.scene}>
          <FarmerNPC mood={farmerMood} />
          <SpeechBubble
            text="Cầm liềm của tôi kéo vào cây có vòng xanh để cắt! 🌾"
            visible
          />

          {/* SICKLE at rest (when NOT held) */}
          {!sickleHeld && (
            <div
              className={styles.sickleContainer}
              onMouseDown={handleSickleMouseDown}
            >
              <svg
                className={styles.sickleSVG}
                width="90"
                height="90"
                viewBox="0 0 90 90"
              >
                {/* Handle */}
                <rect
                  x="38"
                  y="40"
                  width="14"
                  height="48"
                  rx="6"
                  fill="#8D6E63"
                  stroke="#5D4037"
                  strokeWidth="2"
                />
                {/* Blade */}
                <path
                  d="M45,42 Q78,20 80,5 Q60,15 38,38"
                  fill="#CFD8DC"
                  stroke="#546E7A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Blade shine */}
                <path
                  d="M48,38 Q72,22 74,10"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.6"
                />
              </svg>
              <div className={styles.sickleLabel}>
                Cầm liềm kéo vào cây có vòng xanh!
              </div>
            </div>
          )}

          {/* Sickle at cursor when HELD - always in DOM but hidden */}
          <div
            ref={sickleElRef}
            style={{
              display: sickleHeld ? "block" : "none",
              position: "fixed",
              pointerEvents: "none",
              zIndex: 200,
              left: sickleHeld ? sicklePosRef.current.x - 25 + "px" : "0px",
              top: sickleHeld ? sicklePosRef.current.y - 55 + "px" : "0px",
            }}
          >
            <svg width="90" height="90" viewBox="0 0 90 90">
              {/* Handle */}
              <rect
                x="38"
                y="40"
                width="14"
                height="48"
                rx="6"
                fill="#8D6E63"
                stroke="#5D4037"
                strokeWidth="2"
              />
              {/* Blade */}
              <path
                d="M45,42 Q78,20 80,5 Q60,15 38,38"
                fill="#CFD8DC"
                stroke="#546E7A"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Blade shine */}
              <path
                d="M48,38 Q72,22 74,10"
                fill="none"
                stroke="white"
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* All plants in phase 2 */}
          {plants.map((p) =>
            p.state !== "collected" ? (
              <SedgePlant
                key={p.id}
                plant={p}
                phase={phase}
                onClick={selectPlant}
              />
            ) : null,
          )}
          <div className={styles.progressWrap}>
            <div className={styles.progressLabel}>
              Đã cắt: {cutIds.length}/5 ✂️
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${(cutIds.length / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── PHASE 3: COLLECT ── */}
      {phase === 3 && (
        <div className={styles.scene}>
          <FarmerNPC mood={farmerMood} />
          <SpeechBubble text={bubbleText} visible />

          {/* ALL cut plants lying on ground */}
          {state.plants
            .filter(
              (p) =>
                p.state === "cut" ||
                p.state === "standing" ||
                p.state === "selected",
            )
            .map((p) => (
              <Phase3Plant
                key={p.id}
                plant={p}
                onDragStart={handleDragStart}
                isDragging={draggingId === p.id}
              />
            ))}

          {/* Basket drop zone */}
          <Basket
            count={state.collectedCount}
            isDragOver={isDragOverRope}
            isDragOverWrong={isDragWrong}
          />

          {/* Progress */}
          <div className={styles.progressWrap}>
            <div className={styles.progressLabel}>
              Bó cói: {state.collectedCount}/5 🌾
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${(state.collectedCount / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── PHASE 4: RESULT ── */}
      {phase === 4 && (
        <div className={styles.scene}>
          <FarmerNPC mood="excited" />
          <SpeechBubble text={bubbleText} visible />
          <div className={styles.resultCard}>
            <div className={styles.resultTitle}>🌾 Hoàn Thành! 🌾</div>
            <div className={styles.resultScore}>{score}</div>
            <div className={styles.resultScoreSub}>điểm</div>
            <div className={styles.resultStars}>
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 42,
                    opacity: i <= stars ? 1 : 0.22,
                    filter: i <= stars ? "none" : "grayscale(1)",
                    display: "inline-block",
                    animation:
                      i <= stars
                        ? `starPop 0.4s ease-out ${(i - 1) * 0.22}s both`
                        : "none",
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>
            <div className={styles.resultStats}>
              Lần sai: {state.penalties} &nbsp;|&nbsp; Điểm: {score} pts
            </div>
            <div
              style={{
                background: "rgba(0,0,0,0.05)",
                borderRadius: 10,
                padding: "10px 14px",
                margin: "8px 0",
                fontFamily: "'Nunito', sans-serif",
                fontSize: 12,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontFamily: "'Baloo 2', cursive",
                  fontSize: 13,
                  color: "#4E342E",
                  marginBottom: 6,
                }}
              >
                Chi tiết điểm:
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                  color: "#2E7D32",
                }}
              >
                <span>🌿 Bước 1 — Chọn cây</span>
                <span style={{ fontWeight: 700 }}>{state.scoreB1}/100đ</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                  color: "#E65100",
                }}
              >
                <span>✂️ Bước 2 — Cắt cây</span>
                <span style={{ fontWeight: 700 }}>{state.scoreB2}/100đ</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                  color: "#993C1D",
                }}
              >
                <span>🧺 Bước 3 — Gom cói</span>
                <span style={{ fontWeight: 700 }}>{state.scoreB3}/100đ</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "0.5px solid rgba(0,0,0,0.1)",
                  paddingTop: 6,
                  marginTop: 4,
                  fontWeight: 800,
                  fontFamily: "'Baloo 2', cursive",
                  fontSize: 14,
                  color: "#F57F17",
                }}
              >
                <span>Tổng điểm</span>
                <span>{state.score}/300đ</span>
              </div>
            </div>
            <div className={styles.knowledgeTitle}>📚 Bạn đã học được gì?</div>
            <div className={styles.cards}>
              {[
                {
                  icon: "🌊",
                  front: "Cói & vùng ngập nước",
                  back: "Cây cói mọc ở vùng đất ngập nước ven biển",
                },
                {
                  icon: "📏",
                  front: "Khi nào thu hoạch",
                  back: "Thu hoạch khi cây cao, lá xanh đậm và dày",
                },
                {
                  icon: "🌱",
                  front: "Cây non",
                  back: "Cây non cần thêm 3-4 tháng để trưởng thành",
                },
              ].map((c, i) => (
                <div key={i} className={styles.flipCard}>
                  <div className={styles.flipInner}>
                    <div className={styles.flipFront}>
                      <span style={{ fontSize: 30 }}>{c.icon}</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textAlign: "center",
                        }}
                      >
                        {c.front}
                      </span>
                    </div>
                    <div className={styles.flipBack}>
                      <span style={{ fontSize: 11, textAlign: "center" }}>
                        {c.back}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.resultBtns}>
              <button className={styles.btnRetry} onClick={resetGame}>
                Chơi Lại 🔄
              </button>
              <button className={styles.btnNext}>Level 2 →</button>
            </div>
          </div>
        </div>
      )}

      {/* Score pops */}
      <ScorePop pops={state.scorePops} />

      {/* Drag ghost div - place OUTSIDE all scene divs */}
      <div
        ref={ghostRef}
        style={{
          display: "none",
          position: "fixed",
          pointerEvents: "none",
          zIndex: 500,
          fontSize: 36,
          userSelect: "none",
          filter: isDragWrong
            ? "drop-shadow(0 0 10px #EF5350)"
            : "drop-shadow(0 0 10px #00E676)",
        }}
      >
        🌿
      </div>
    </div>
  );
}
