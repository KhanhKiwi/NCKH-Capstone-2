import { useEffect, useState } from "react";
import styles from "../../../styles/Screen1/Screen1.module.css";

export default function SpeechBubble({
  text,
  visible,
}: {
  text: string;
  visible: boolean;
}) {
  const [hint, setHint] = useState(false);

  useEffect(() => {
    setHint(false);
    const t = setTimeout(() => setHint(true), 1400);
    return () => clearTimeout(t);
  }, [text]);

  if (!visible) return null;
  return (
    <div className={styles.bubble}>
      {text}
      {hint && <span className={styles.bubbleHint}>Nhấn để tiếp tục...</span>}
    </div>
  );
}
