// 1. Định nghĩa Interface cho các Props
import { useNavigate } from 'react-router-dom'

interface ProgressFooterProps {
  selectedColor: string | null;
  isPlaying: boolean;
  currentPercent: number;
  hideSegmentsUntilCatch: boolean;
  caughtSegments: string[]; // Mảng các mã màu (string)
  startGame: () => void;
  replayGame: () => void;
  handleBack: () => void;
  resetGame?: () => void; // Dấu ? vì code của bạn có kiểm tra {resetGame && ...}
  gameResult: 'won' | 'lost' | 'idle' | null | string; 
}

export default function ProgressFooter({
  selectedColor,
  isPlaying,
  currentPercent,
  hideSegmentsUntilCatch,
  caughtSegments,
  startGame,
  replayGame,
  handleBack,
  gameResult,
}: ProgressFooterProps) { // Thay 'any' bằng 'ProgressFooterProps'
  const navigate = useNavigate()
  return (
    <div className="phase2-footer">
      <div className="processing-box">
        <div className="proc-left">
          <div 
            className="thumb" 
            style={{ display: (selectedColor && !isPlaying) ? undefined : 'none' }} 
          />
          <div className="proc-info">
            <div className="proc-title">
              Nhuộm màu bó <span className="proc-percent">{currentPercent}%</span>
            </div>
            <div className="proc-bar">
              {(() => {
                if (!selectedColor) {
                  const sample: string[] = ['#e74c3c', '#f1c40f', '#27ae60'];
                  return sample.map((c, i) => (
                    <div 
                      key={i} 
                      className="proc-piece proc-sample" 
                      style={{ background: c, flex: i === 0 ? 2 : 1 }} 
                    />
                  ));
                }
                
                const totalPieces = 10;
                if (hideSegmentsUntilCatch) {
                  return Array.from({ length: totalPieces }).map((_, i) => (
                    <div key={i} className="proc-piece" />
                  ));
                }

                // Sao chép mảng để tránh thay đổi trực tiếp props (Immutability)
                const padded: string[] = [...caughtSegments].slice(0, totalPieces);
                while (padded.length < totalPieces) {
                  padded.push('');
                }

                return padded.map((col: string, i: number) => (
                  <div 
                    key={i} 
                    className={`proc-piece ${col ? 'filled' : ''}`} 
                    style={{ background: col || undefined }} 
                  />
                ));
              })()}
            </div>
            <div className="proc-meta">
              {selectedColor ? 'TRẠNG THÁI: ĐANG THẤM THẤM...' : 'Hãy chọn màu'}
            </div>
          </div>
        </div>

        <div className="proc-right" style={{ opacity: selectedColor ? 1 : 0.5 }}>
          {!selectedColor ? (
            <div className="proc-empty">Chưa bắt đầu</div>
          ) : isPlaying ? (
            <div className="proc-empty">Đang chạy</div>
          ) : gameResult === 'lost' ? (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button className="ctrl primary" onClick={replayGame}>Chơi lại</button>
              <button className="ctrl" onClick={handleBack}>Quay lại</button>
            </div>
          ) : gameResult === 'won' ? (
            <div style={{ textAlign: 'center' }}>
              <div className="result win">Bạn đã thắng — Giai đoạn cuối</div>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 12 }}>
                <button className="ctrl" onClick={() => navigate('/phase3')}>Tiếp theo</button>
                <button className="ctrl" onClick={handleBack}>Quay lại</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button className="ctrl primary" onClick={startGame}>Bắt đầu</button>
              <button className="ctrl" onClick={handleBack}>Quay lại</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}