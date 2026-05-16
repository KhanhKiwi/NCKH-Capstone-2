import { useEffect, useRef } from 'react';
import type { JarState } from '../types/gameTypes';

interface WinScreenProps {
  jars: JarState[];
  baseQuality: number;
  onContinue: () => void | Promise<void>;
  onRetry: () => void | Promise<void>;
  onBack: () => void | Promise<void>;
  challengeMode?: boolean;
}

export function WinScreen({
  jars,
  baseQuality,
  onContinue,
  onRetry,
  onBack,
  challengeMode = false
}: WinScreenProps) {
  
  // Keep latest callback in ref to avoid stale closure / infinite re-run
  const onContinueRef = useRef(onContinue);
  useEffect(() => { onContinueRef.current = onContinue; });

  // Auto-proceed in challenge mode — run only once on mount
  useEffect(() => {
    if (!challengeMode) return;
    const t = setTimeout(() => { onContinueRef.current(); }, 2500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const averageQuality = Math.round((jars[0].quality + jars[1].quality + jars[2].quality) / 3);
  
  // Determine quality rating
  const getQualityRating = (avg: number) => {
    if (avg >= 90) return { text: '🌟 XUẤT SẮC', color: 'text-[#5f7c8a]', bg: 'bg-[#5f7c8a]/10' };
    if (avg >= 80) return { text: '⭐ TỐT', color: 'text-[#5f7c8a]', bg: 'bg-[#5f7c8a]/10' };
    if (avg >= 70) return { text: '👍 BÌNH THƯỜNG', color: 'text-[#b87333]', bg: 'bg-[#b87333]/10' };
    return { text: '⚠️ CẬP VỢI', color: 'text-[#8b4513]', bg: 'bg-[#8b4513]/10' };
  };
  
  const rating = getQualityRating(averageQuality);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#2a1f17] via-[#1f1410] to-[#2a1f17] backdrop-blur-sm z-50 overflow-y-auto">
      <div className="relative w-full max-w-3xl px-6 py-12">
        {/* Celebration animation */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce opacity-0"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `bounce 2s ease-in-out ${Math.random() * 0.5}s infinite`,
                opacity: 0.3
              }}
            >
              {['🎉', '🥳', '✨', '🌟'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-[#3d2b1f] to-[#2a1f17] rounded-3xl border-2 border-[#5f7c8a] shadow-2xl p-10 backdrop-blur-xl relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-6xl mb-4 animate-bounce">🎊</div>
            <h1 className="text-5xl font-bold text-[#5f7c8a] mb-2">
              THÀNH CÔNG! 🎉
            </h1>
            <p className="text-[#d4c4a8] text-lg opacity-80">
              Chum mắm của bạn đã lên men thành công!
            </p>
          </div>

          {/* Quality Score Section */}
          <div className={`${rating.bg} border-2 border-[#5f7c8a] rounded-2xl p-8 mb-10 text-center`}>
            <p className="text-[#f5f0e8] text-lg font-semibold mb-3">Chất lượng Trung Bình</p>
            <div className="text-7xl font-bold text-[#5f7c8a] mb-3 animate-pulse">
              {averageQuality}%
            </div>
            <p className={`${rating.color} text-2xl font-bold`}>
              {rating.text}
            </p>
          </div>

          {/* Jar Details Grid */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {jars.map((jar, idx) => (
              <div
                key={jar.id}
                className="bg-[#2a1f17] border-2 border-[#8b7355] rounded-xl p-6 text-center hover:border-[#5f7c8a] transition-colors"
              >
                <div className="text-4xl mb-3">
                  {idx === 0 ? '🏺' : idx === 1 ? '🏺' : '🏺'}
                </div>
                <p className="text-[#d4c4a8] text-sm font-semibold mb-2">Chum {idx + 1}</p>
                <div className="bg-[#1f1410] rounded-lg p-3 mb-3">
                  <p className="text-3xl font-bold text-[#5f7c8a]">
                    {Math.round(jar.quality)}%
                  </p>
                </div>
                <div className="space-y-2 text-xs text-[#d4c4a8]">
                  <p>💨 Áp suất: {Math.round(jar.pressure)}%</p>
                  <p>🌡️ Nhiệt độ: {Math.round(jar.temperature)}°C</p>
                  <p>💧 Nước: {Math.round(jar.water)}%</p>
                </div>
              </div>
            ))}
          </div>

          {/* Performance Stats */}
          <div className="bg-[#2a1f17]/50 rounded-xl p-6 mb-10 border border-[#8b7355]/30">
            <p className="text-[#f5f0e8] font-semibold mb-4 text-center">📊 Thống kê Quá trình</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-[#f5f0e8] text-sm opacity-60">Chất lượng Ban Đầu</p>
                <p className="text-2xl font-bold text-[#b87333]">{baseQuality}%</p>
              </div>
              <div className="text-center">
                <p className="text-[#f5f0e8] text-sm opacity-60">Trung Bình</p>
                <p className="text-2xl font-bold text-[#5f7c8a]">{averageQuality}%</p>
              </div>
              <div className="text-center">
                <p className="text-[#f5f0e8] text-sm opacity-60">Chênh Lệch</p>
                <p className={`text-2xl font-bold ${averageQuality >= baseQuality ? 'text-[#5f7c8a]' : 'text-[#8b4513]'}`}>
                  {averageQuality >= baseQuality ? '+' : ''}{averageQuality - baseQuality}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-[#f5f0e8] text-sm opacity-60">Mức Độ Hoàn Thành</p>
                <p className="text-2xl font-bold text-[#5f7c8a]">100%</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-[#5f7c8a]/10 border-l-4 border-[#5f7c8a] rounded-lg p-6 mb-10">
            <p className="text-[#5f7c8a] font-semibold mb-3">💡 Mẹo Hay:</p>
            <p className="text-[#d4c4a8]">
              {averageQuality >= 90 
                ? '🌟 Xuất sắc! Bạn là một Thầy Mắm thực thụ. Chất lượng cao nhất có thể đạt!'
                : averageQuality >= 80
                ? '⭐ Tuyệt vời! Bạn nắm vững kỹ thuật ủ mắm. Hãy tiếp tục cải thiện!'
                : averageQuality >= 70
                ? '👍 Tốt! Mắm của bạn đạt chuẩn. Cố gắng hơn lần sau để chất lượng tốt hơn.'
                : '⚠️ Chưa phải tốt nhất. Hãy chú ý hơn đến các yếu tố như áp suất và nhiệt độ!'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            {challengeMode ? (
              <p className="text-[#d4c4a8] text-lg animate-pulse">⏳ Đang chuyển sang màn tiếp theo...</p>
            ) : (
              <>
                <button
                  onClick={onContinue}
                  className="bg-gradient-to-r from-[#5f7c8a] to-[#4a7c9a] hover:from-[#6a8c9a] hover:to-[#5a8caa] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  🚀 Tiếp Tục → Level 5
                </button>
                <button
                  onClick={onRetry}
                  className="bg-gradient-to-r from-[#a0522d] to-[#8b4513] hover:from-[#b0623d] hover:to-[#9b5523] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  🔄 Chơi Lại
                </button>
                <button
                  onClick={onBack}
                  className="bg-gradient-to-r from-[#8b7355] to-[#6b5345] hover:from-[#9b8365] hover:to-[#7b6355] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  ← Quay Lại
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-sm opacity-60 mt-8">
            ✨ Đã hoàn thành Level 4! Bạn sẵn sàng cho thử thách tiếp theo chưa? ✨
          </p>
        </div>
      </div>
    </div>
  );
}
