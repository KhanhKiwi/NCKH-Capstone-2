import styles from "../../../styles/Screen1/Screen1.module.css";
import type { GamePhase } from "./game.types";

const HINTS: Record<number, { title: string; items: string[] }> = {
  1: {
    title: "💡 Step 1 — Select",
    items: [
      "🌿 Mature: tall, thick, dark green",
      "🍃 Many large leaves spreading wide",
      "❌ Short & thin = young (skip!)",
      "❌ Yellow drooping = wilted (skip!)",
    ],
  },
  2: {
    title: "✂️ Step 2 — Cut",
    items: [
      "✅ Click plants with green ✓ ring",
      "🔆 Selected plants are brighter",
      "⚠️ Faded = do NOT cut",
      "⚡ Cut all 5 quickly for bonus!",
    ],
  },
  3: {
    title: "🧺 Step 3 — Collect",
    items: [
      "✅ Drag DARK GREEN into basket",
      "❌ Pale / yellow = leave them!",
      '💚 "drag me ✓" label = correct',
      "🏆 5 correct = level complete!",
    ],
  },
};

export default function HintPanel({ phase }: { phase: GamePhase }) {
  const hint = HINTS[phase];
  if (!hint) return null;
  return (
    <div className={styles.hintPanel}>
      <div className={styles.hintTitle}>{hint.title}</div>
      {hint.items.map((item, i) => (
        <div key={i} className={styles.hintRow}>
          {item}
        </div>
      ))}
    </div>
  );
}
