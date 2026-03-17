import styles from "./Screen1.module.css";

export default function Basket({
  count,
  isHighlight,
}: {
  count: number;
  isHighlight: boolean;
}) {
  const fillH = (count / 5) * 58;
  return (
    <div
      id="basket-drop-zone"
      className={`${styles.basketWrap} ${isHighlight ? styles.basketGlow : ""}`}
    >
      <svg width="130" height="115" viewBox="0 0 130 115">
        <path
          d="M22,38 Q65,-8 108,38"
          stroke="#6D4C41"
          strokeWidth="5.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M12,38 L20,105 L110,105 L118,38 Z"
          fill="#A1887F"
          stroke="#5D4037"
          strokeWidth="3"
        />
        <clipPath id="bClip">
          <path d="M12,38 L20,105 L110,105 L118,38 Z" />
        </clipPath>
        <rect
          x="12"
          y={105 - fillH}
          width="106"
          height={fillH}
          fill="#A5D6A7"
          opacity="0.72"
          clipPath="url(#bClip)"
        />
        <path
          d="M12,38 L20,105 L110,105 L118,38 Z"
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="0"
          style={{
            background:
              "repeating-linear-gradient(45deg,transparent,transparent 6px,rgba(0,0,0,0.1) 6px,rgba(0,0,0,0.1) 7px)",
          }}
        />
      </svg>
      <div className={styles.basketLabel}>Drop here! 🧺 ({count}/5)</div>
    </div>
  );
}
