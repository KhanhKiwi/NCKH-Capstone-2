import React, { useState } from "react";

// Định nghĩa Interface chuẩn để hết lỗi "any"
interface BoardCanvasProps {
  pieces?: { 
    seg: { type: string; w: number }; 
    left: number; 
    idx: number 
  }[]; 
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

const BoardCanvas: React.FC<BoardCanvasProps> = ({ 
  onSplit, 
  started = true, 
  onRequireStart = () => {}, 
  gameOver = false,
  onKnifeClick
}) => {
  const [split, setSplit] = useState(false);
  
  // Đã xóa biến 'count' bị lỗi unused ở đây

  const handleKnifeClick = () => {
    if (!started) { 
      onRequireStart(); 
      return; 
    }
    if (split) return; 
    if (gameOver) return; 

    setSplit(true);

    // Thay vì dùng state count, ta dùng một biến cục bộ hoặc logic từ cha
    // Nếu bạn cần gửi một con số nào đó về cho onSplit:
    if (onSplit) {
        onSplit(1); // Gửi giá trị 1 hoặc logic đếm từ Game.tsx sẽ tự xử lý
    }

    if (onKnifeClick) onKnifeClick();

    setTimeout(() => {
      setSplit(false);
    }, 1200);
  };

  return (
    <div className="board-canvas-root">
      <div className="board-canvas-center">
        <div className="wood-split-container">
          {/* Giữ nguyên logic class cũ của bạn */}
          <div className={split ? "wood-left split" : "wood-left"} />
          <div className={split ? "wood-right split" : "wood-right"} />
          {!split && (
            <svg className="arrow-down" width="32" height="32">
              <polyline points="16,6 16,22" stroke="#333" strokeWidth="3" fill="none" />
              <polyline points="10,18 16,24 22,18" stroke="#333" strokeWidth="3" fill="none" />
            </svg>
          )}
        </div>
        <div 
          className={"knife" + (split ? " disabled" : "")} 
          onClick={handleKnifeClick} 
          style={split ? { pointerEvents: "none", opacity: 0.5 } : {}}
        >
          <div className="knife-head" />
          <div className="knife-blade" />
        </div>
      </div>
    </div>
  );
};

export default BoardCanvas;