
import React, { useState } from "react";

interface BoardCanvasProps {
  pieces?: any;
  trackRef?: React.RefObject<HTMLDivElement | null>;
  moverRef?: React.RefObject<HTMLDivElement | null>;
  bladeRef?: React.RefObject<HTMLDivElement | null>;
  bladeUp?: boolean;
  onKnifeClick?: () => void;
  onSplit?: (count: number) => void;
  started?: boolean;
  onRequireStart?: () => void;
  gameOver?: boolean;
}

const BoardCanvas: React.FC<BoardCanvasProps> = ({ onSplit, started = true, onRequireStart = () => {}, gameOver = false }) => {
  const [split, setSplit] = useState(false);
  const [, setCount] = useState(0);


  const handleKnifeClick = () => {
    if (!started) { onRequireStart(); return; }
    if (split) return; // Only allow click when plank is merged
    if (gameOver) return; // Disable click when game over
    setSplit(true);
    setCount((c) => {
      const newCount = c + 1;
      if (onSplit) onSplit(newCount);
      return newCount;
    });
    setTimeout(() => {
      setSplit(false);
    }, 1200);
  };

  return (
    <div className="board-canvas-root">
      <div className="board-canvas-center">
        <div className="wood-split-container">
          <div className={split ? "wood-left split" : "wood-left"} />
          <div className={split ? "wood-right split" : "wood-right"} />
          {!split && (
            <svg className="arrow-down" width="32" height="32">
              <polyline points="16,6 16,22" stroke="#333" strokeWidth="3" fill="none" />
              <polyline points="10,18 16,24 22,18" stroke="#333" strokeWidth="3" fill="none" />
            </svg>
          )}
        </div>
        <div className={"knife" + (split ? " disabled" : "")} onClick={handleKnifeClick} style={split ? { pointerEvents: "none", opacity: 0.5 } : {}}>
          <div className="knife-head" />
          <div className="knife-blade" />
        </div>
      </div>
    </div>
  );
};

export default BoardCanvas;
