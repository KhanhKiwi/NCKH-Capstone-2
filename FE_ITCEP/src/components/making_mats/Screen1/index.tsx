import { useState, useCallback } from "react";
import styles from "./Screen1.module.css";
import { useGameState } from "./useGameState";
import FarmerNPC from "./FarmerNPC";
import SpeechBubble from "./SpeechBubble";
import SedgePlant from "./SedgePlant";
import HUD from "./HUD";
import HintPanel from "./HintPanel";
import ScorePop from "./ScorePop";
import Basket from "./Basket";
import bg0 from "../../../assets/ChatGPT Image 23_51_53 17 thg 3, 2026.png";
import bg1 from "../../../assets/ChatGPT Image 23_34_54 17 thg 3, 2026.png";
import bg2 from "../../../assets/ChatGPT Image 23_25_32 17 thg 3, 2026.png";
import bg3 from "../../../assets/ChatGPT Image 23_32_12 17 thg 3, 2026.png";

const BG: Record<number, string> = {
  0: bg0,
  1: bg1,
  2: bg2,
  3: bg3,
  4: bg3,
};

const OVERLAY: Record<number, string> = {
  0: "rgba(0,0,0,0.30)",
  1: "rgba(0,0,0,0.15)",
  2: "rgba(0,0,0,0.20)",
  3: "rgba(0,0,0,0.18)",
  4: "rgba(0,0,0,0.25)",
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

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [isSickleHeld, setIsSickleHeld] = useState(false);
  const [sicklePos, setSicklePos] = useState({ x: 0, y: 0 });
  const [hoveredPlantId, setHoveredPlantId] = useState<string | null>(null);

  const handleDragStart = useCallback(
    (id: string, e: React.MouseEvent<HTMLDivElement>) => {
      if (state.phase !== 3) return;
      setDraggingId(id);
      setDragPos({ x: e.clientX, y: e.clientY });
    },
    [state.phase],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!draggingId && !isSickleHeld) return;
      if (draggingId) setDragPos({ x: e.clientX, y: e.clientY });
      if (isSickleHeld) {
        setSicklePos({ x: e.clientX, y: e.clientY });
        // Check for plant collisions
        let hoveredId: string | null = null;
        state.plants.forEach((plant) => {
          if (plant.state === "standing" && state.phase === 2) {
            const plantEl = document.getElementById(`plant-${plant.id}`);
            if (plantEl) {
              const rect = plantEl.getBoundingClientRect();
              const sickleX = e.clientX;
              const sickleY = e.clientY;
              // Check if sickle is within plant bounds (with some tolerance)
              if (
                sickleX >= rect.left - 30 &&
                sickleX <= rect.right + 30 &&
                sickleY >= rect.top - 30 &&
                sickleY <= rect.bottom + 30
              ) {
                hoveredId = plant.id;
              }
            }
          }
        });
        setHoveredPlantId(hoveredId);
      }
    },
    [draggingId, isSickleHeld, state],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (draggingId) {
        const basket = document.getElementById("basket-drop-zone");
        if (basket) {
          const r = basket.getBoundingClientRect();
          if (
            e.clientX >= r.left &&
            e.clientX <= r.right &&
            e.clientY >= r.top &&
            e.clientY <= r.bottom
          ) {
            collectPlant(draggingId, e.clientX, e.clientY);
          }
        }
        setDraggingId(null);
      }
      if (isSickleHeld) {
        setIsSickleHeld(false);
        setSicklePos({ x: 0, y: 0 });
        // Cut the hovered plant if any
        if (hoveredPlantId) {
          cutPlant(hoveredPlantId, sicklePos.x, sicklePos.y);
        }
        setHoveredPlantId(null);
      }
    },
    [
      draggingId,
      isSickleHeld,
      hoveredPlantId,
      sicklePos,
      collectPlant,
      cutPlant,
    ],
  );

  const handleSickleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (state.phase !== 2) return;
      e.preventDefault();
      setIsSickleHeld(true);
      setSicklePos({ x: e.clientX, y: e.clientY });
    },
    [state.phase],
  );

  const {
    phase,
    plants,
    stars,
    score,
    selectedIds,
    cutIds,
    collectedCount,
    farmerMood,
    bubbleText,
    showHint,
  } = state;

  return (
    <div
      className={styles.root}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
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
        <HUD state={state} onToggleHint={toggleHint} />
      )}

      {/* Hint panel */}
      {showHint && phase >= 1 && phase <= 3 && <HintPanel phase={phase} />}

      {/* ── PHASE 0: INTRO ── */}
      {phase === 0 && (
        <div className={styles.scene}>
          <div className={styles.introBadge}>
            🏮 Traditional Mat Weaving — Level 1
          </div>
          <FarmerNPC mood={farmerMood} />
          <SpeechBubble text={bubbleText} visible />
          <button className={styles.startBtn} onClick={startGame}>
            Let's Start! →
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
              Selected: {selectedIds.length}/5 🌿
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
          <SpeechBubble text={bubbleText} visible />

          {/* SICKLE */}
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
            <div className={styles.sickleLabel}>Hold to cut!</div>
          </div>

          {/* Sickle ghost when held */}
          {isSickleHeld && (
            <svg
              className={styles.sickleGhost}
              width="90"
              height="90"
              viewBox="0 0 90 90"
              style={{
                top: sicklePos.y - 45,
                left: sicklePos.x - 45,
              }}
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
                opacity="0.7"
              />
              {/* Blade */}
              <path
                d="M45,42 Q78,20 80,5 Q60,15 38,38"
                fill="#CFD8DC"
                stroke="#546E7A"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.7"
              />
              {/* Blade shine */}
              <path
                d="M48,38 Q72,22 74,10"
                fill="none"
                stroke="white"
                strokeWidth="1"
                opacity="0.4"
              />
            </svg>
          )}

          <div className={styles.sickleHint}>
            ✂️ Select the mature ✓ plants first, then cut them!
          </div>
          {plants.map((p) =>
            p.state !== "collected" ? (
              <SedgePlant
                key={p.id}
                plant={p}
                phase={phase}
                onClick={cutPlant}
              />
            ) : null,
          )}
          <div className={styles.progressWrap}>
            <div className={styles.progressLabel}>
              Cut: {cutIds.length}/5 ✂️
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
          {plants
            .filter((p) => p.state === "cut")
            .map((p) => (
              <SedgePlant
                key={p.id}
                plant={p}
                phase={phase}
                onDragStart={handleDragStart}
              />
            ))}
          <Basket count={collectedCount} isHighlight={!!draggingId} />
          <div className={styles.progressWrap}>
            <div className={styles.progressLabel}>
              Collected: {collectedCount}/5 🧺
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${(collectedCount / 5) * 100}%` }}
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
            <div className={styles.resultTitle}>🌾 Level Complete!</div>
            <div className={styles.resultScore}>{score}</div>
            <div className={styles.resultScoreSub}>points</div>
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
              Mistakes: {state.penalties} &nbsp;|&nbsp; Score: {score} pts
            </div>
            <div className={styles.knowledgeTitle}>
              📚 What you learned today:
            </div>
            <div className={styles.cards}>
              {[
                {
                  icon: "🌊",
                  front: "Sedge & wetlands",
                  back: "Sedge grass grows in coastal wetland areas",
                },
                {
                  icon: "📏",
                  front: "When to harvest",
                  back: "Harvest when tall with thick dark green leaves",
                },
                {
                  icon: "🌱",
                  front: "Young plants",
                  back: "Young plants need 3–4 more months to grow",
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
                Play Again 🔄
              </button>
              <button className={styles.btnNext}>Level 2 →</button>
            </div>
          </div>
        </div>
      )}

      {/* Drag ghost */}
      {draggingId && (
        <div
          style={{
            position: "fixed",
            left: dragPos.x - 16,
            top: dragPos.y - 32,
            pointerEvents: "none",
            zIndex: 300,
            fontSize: 32,
            transform: "rotate(-20deg) scale(1.15)",
          }}
        >
          🌿
        </div>
      )}

      {/* Score pops */}
      <ScorePop pops={state.scorePops} />
    </div>
  );
}
