import farmerImg from "../../../assets/farmer.png";
import styles from "../../../styles/Screen1/Screen1.module.css";
import type { FarmerMood } from "../../../types/making_mats/Screen1/game.types";

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
