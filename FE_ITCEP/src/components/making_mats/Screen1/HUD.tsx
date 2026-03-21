import styles from "../../../styles/Screen1/Screen1.module.css";
import type { GameState } from "./game.types";

const PHASE_LABEL = [
  "",
  "Step 1: Select mature plants",
  "Step 2: Cut the marked plants",
  "Step 3: Collect into basket",
  "",
];
const COUNTER = (s: GameState) => [
  "",
  `${s.selectedIds.length}/5`,
  `${s.cutIds.length}/5`,
  `${s.collectedCount}/5`,
  "",
];

export default function HUD({
  state,
  onToggleHint,
}: {
  state: GameState;
  onToggleHint: () => void;
}) {
  const counter = COUNTER(state)[state.phase];
  return (
    <div className={styles.hud}>
      <div className={styles.hudLeft}>
        <span className={styles.badgeGold}>Level 1</span>
        <span className={styles.badgeOutline}>Sedge Harvesting</span>
      </div>
      <div className={styles.hudCenter}>
        <span className={styles.phaseLabel}>
          {PHASE_LABEL[state.phase]}
          {counter ? ` (${counter})` : ""}
        </span>
      </div>
      <div className={styles.hudRight}>
        <span className={styles.scoreText}>{state.score} pts</span>
        <div className={styles.starsRow}>
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={i <= state.stars ? styles.starOn : styles.starOff}
            >
              ⭐
            </span>
          ))}
        </div>
        <button className={styles.hintBtn} onClick={onToggleHint}>
          ?
        </button>
      </div>
    </div>
  );
}
