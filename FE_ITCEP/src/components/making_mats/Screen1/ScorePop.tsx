import styles from "../../../styles/Screen1/Screen1.module.css";
import type { ScorePopItem } from "../../../types/making_mats/Screen1/game.types";

export default function ScorePop({ pops }: { pops: ScorePopItem[] }) {
  return (
    <>
      {pops.map((pop) => (
        <div
          key={pop.id}
          className={styles.scorePop}
          style={{ left: pop.x, top: pop.y, color: pop.color }}
        >
          {pop.text}
        </div>
      ))}
    </>
  );
}
