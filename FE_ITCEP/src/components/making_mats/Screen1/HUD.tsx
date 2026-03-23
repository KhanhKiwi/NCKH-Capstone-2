import styles from "../../../styles/Screen1/Screen1.module.css";
import type { GameState } from "./game.types";

const PHASE_LABEL = [
  "",
  "Bước 1: Chọn cây trưởng thành",
  "Bước 2: Cắt cây đã chọn",
  "Bước 3: Thu gom vào rổ",
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
  onBack,
}: {
  state: GameState;
  onToggleHint: () => void;
  onBack: () => void;
}) {
  const counter = COUNTER(state)[state.phase];
  return (
    <div className={styles.hud}>
      <div className={styles.hudLeft}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Trở về
        </button>
        <span className={styles.badgeGold}>Level 1</span>
        <span className={styles.badgeOutline}>Thu Hoạch Cói</span>
      </div>
      <div className={styles.hudCenter}>
        <span className={styles.phaseLabel}>
          {PHASE_LABEL[state.phase]}
          {counter ? ` (${counter})` : ""}
        </span>
      </div>
      <div className={styles.hudRight}>
        <span className={styles.scoreText}>{state.score}/300 đ</span>
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
