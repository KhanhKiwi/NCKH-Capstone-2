import { type RefObject } from 'react';

// 1. Định nghĩa cấu trúc cho từng item trong danh sách reeds
interface ReedItem {
  id: string | number;
  x: number;
  y: number;
  width: number;
  height: number;
  rot?: number; // Dấu ? nghĩa là có thể có hoặc không (optional)
}

// 2. Định nghĩa Props cho Component Board
interface BoardProps {
  containerRef: RefObject<HTMLDivElement>;
  reeds: ReedItem[];
  paddleX: number;
  paddleRef: RefObject<HTMLDivElement>;
  selectedColor: string | null;
  dragEnabled: boolean;
  onPaddlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onChangeColor: (color: string) => void;
}

// 3. Sử dụng BoardProps thay cho any
export default function Board({
  containerRef,
  reeds,
  paddleX,
  paddleRef,
  selectedColor,
  dragEnabled,
  onPaddlePointerDown,
  onChangeColor,
}: BoardProps) {
  return (
    <div className="phase2-board" ref={containerRef}>
      {reeds.map((r: ReedItem) => ( // Thay any ở đây thành ReedItem
        <div
          key={r.id}
          className="reed"
          style={{
            left: r.x,
            width: r.width,
            height: r.height,
            transform: `translateY(${r.y}px) rotate(${r.rot || 0}deg)`,
            opacity: 0.98
          }}
        />
      ))}

      {selectedColor && (
        <div
          className={`paddle ${dragEnabled ? 'dragging' : ''}`}
          ref={paddleRef}
          style={{ left: paddleX, background: selectedColor }}
          onPointerDown={onPaddlePointerDown}
        />
      )}

      <div className="board-side">
        {['#e74c3c', '#f1c40f', '#27ae60'].map((c, i) => (
          <button
            key={c}
            className={`swatch ${selectedColor === c ? 'selected' : ''}`}
            style={{ background: c, position: 'relative' }}
            onClick={() => onChangeColor(c)}
            aria-label={`Chọn màu ${c}`}
          >
            <span className="key-hint">{i === 0 ? 'Z' : i === 1 ? 'X' : 'C'}</span>
          </button>
        ))}
      </div>
    </div>
  );
}