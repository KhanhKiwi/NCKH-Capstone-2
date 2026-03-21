import farmerImg from "../../../assets/ChatGPT Image 22_38_54 17 thg 3, 2026.png";
import styles from "./Screen1.module.css";
import type { FarmerMood } from "./game.types";

export default function FarmerNPC({ mood }: { mood: FarmerMood }) {
  return (
    <div className={styles.farmerWrap}>
      <img
        src={farmerImg}
        alt="Chi Lan"
        className={`${styles.farmerImg} ${styles["farmer_" + mood]}`}
      />
    </div>
  );
}
