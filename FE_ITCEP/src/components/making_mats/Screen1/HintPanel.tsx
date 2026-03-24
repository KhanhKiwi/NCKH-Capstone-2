import styles from "../../../styles/Screen1/Screen1.module.css";
import type { GamePhase } from "../../../types/making_mats/Screen1/game.types";

const HINTS: Record<number, { title: string; items: string[] }> = {
  1: {
    title: "💡 Gợi ý - Bước 1",
    items: [
      "🌿 Trưởng thành: cao, thân dày, xanh đậm",
      "🍃 Nhiều lá to xòe rộng ra hai bên",
      "❌ Cây thấp mảnh = cây non (bỏ qua!)",
      "❌ Lá vàng rũ xuống = cây héo (bỏ!)",
    ],
  },
  2: {
    title: "✂️ Gợi ý - Bước 2",
    items: [
      "✅ Cầm liềm kéo vào cây có vòng xanh",
      "🔆 Cây đã chọn sáng hơn các cây khác",
      "⚠️ Cây mờ = KHÔNG được cắt",
      "⚡ Cắt nhanh 5 cây để nhận thưởng tốc độ!",
    ],
  },
  3: {
    title: "🧺 Gợi ý - Bước 3",
    items: [
      "✅ Kéo cây xanh đậm vào rổ",
      "❌ Cây nhạt/vàng = để lại (trừ 20 điểm!)",
      "💚 Nhãn \"kéo vào ✓\" = đúng loại",
      "🏆 Gom đủ 5 cây = hoàn thành bước 3!",
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
