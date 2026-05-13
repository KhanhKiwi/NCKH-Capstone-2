import type { JarState } from '../types/gameTypes';

interface LoseScreenProps {
  jars: JarState[];
  baseQuality: number;
  onRetry: () => void;
  onBack: () => void;
}

export function LoseScreen({
  jars,
  baseQuality,
  onRetry,
  onBack
}: LoseScreenProps) {
  // Determine failure reasons
  const failures = jars.map((jar, idx) => {
    const reasons = [];
    if (jar.quality < 30) reasons.push(`Chất lượng quá thấp: ${Math.round(jar.quality)}%`);
    if (jar.health <= 0) reasons.push('Chum bị hỏng hoàn toàn');
    return { jarIndex: idx, reasons };
  }).filter(f => f.reasons.length > 0);

  // Get main failure reason
  const getFailureMessage = () => {
    if (failures.length === 3) return '😭 Tất cả 3 chum đều bị hỏng!';
    if (failures.length === 2) return '😢 2 chum đã bị hỏng!';
    return '😞 Một chum đã bị hỏng trong quá trình ủ!';
  };

  // Get advice
  const getAdvice = () => {
    const qualityFailures = failures.filter(f => f.reasons.some(r => r.includes('Chất lượng')));
    const healthFailures = failures.filter(f => f.reasons.some(r => r.includes('hỏng hoàn toàn')));

    if (healthFailures.length > 0) {
      return '🔧 Lời khuyên: Hãy chú ý hơn đến việc xử lý các sự kiện (K, L, I, H). Mỗi sự kiện không được xử lý sẽ làm mất 10-20% chất lượng!';
    }
    if (qualityFailures.length > 0) {
      return '📝 Lời khuyên: Chất lượng của bạn bị hỏng. Hãy cố gắng giữ cho chum luôn ở trạng thái tốt bằng cách xử lý đúng mỗi sự kiện!';
    }
    return '💪 Lời khuyên: Cố gắng hơn lần sau. Bạn có thể làm tốt hơn!';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#2a1f17] via-[#1f1410] to-[#2a1f17] backdrop-blur-sm z-50 overflow-y-auto">
      <div className="relative w-full max-w-3xl px-6 py-12">
        {/* Sad animation */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-pulse opacity-0"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.2
              }}
            >
              😢
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-[#3d2b1f] to-[#2a1f17] rounded-3xl border-2 border-[#8b4513] shadow-2xl p-10 backdrop-blur-xl relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">😭</div>
            <h1 className="text-5xl font-bold text-[#8b4513] mb-2">
              QUÁ TRÌNH LÊN MEN THẤT BẠI!
            </h1>
            <p className="text-[#d4c4a8] text-xl font-semibold">
              {getFailureMessage()}
            </p>
          </div>

          {/* Failure Reasons Grid */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {jars.map((jar, idx) => {
              const jarFailures = failures.find(f => f.jarIndex === idx);
              const isFailed = jarFailures !== undefined;

              return (
                <div
                  key={jar.id}
                  className={`rounded-xl p-6 text-center border-2 transition-all ${
                    isFailed
                      ? 'bg-[#8b4513]/20 border-[#8b4513]'
                      : 'bg-[#5f7c8a]/20 border-[#5f7c8a] opacity-50'
                  }`}
                >
                  <div className={`text-4xl mb-3 ${isFailed ? 'animate-pulse' : ''}`}>
                    {isFailed ? '💔' : '✅'}
                  </div>
                  <p className="text-[#d4c4a8] text-sm font-semibold mb-4">Chum {idx + 1}</p>

                  {isFailed ? (
                    <div className="bg-[#2a1f17]/80 rounded-lg p-4 space-y-2">
                      <p className="text-[#8b4513] font-bold text-lg mb-3">⚠️ LỖI:</p>
                      {jarFailures.reasons.map((reason, rIdx) => (
                        <p key={rIdx} className="text-[#d4c4a8] text-sm">
                          • {reason}
                        </p>
                      ))}
                      <div className="mt-4 pt-4 border-t border-[#8b7355]/30">
                        <p className="text-xs text-[#d4c4a8] opacity-70">
                          Chất lượng hiện tại: {Math.round(jar.quality)}%<br />
                          Sức khỏe: {Math.round(jar.health)}%
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#2a1f17]/80 rounded-lg p-4">
                      <p className="text-[#5f7c8a] font-bold mb-2">✨ Chất lượng tốt</p>
                      <p className="text-2xl font-bold text-[#5f7c8a] mb-2">
                        {Math.round(jar.quality)}%
                      </p>
                      <p className="text-xs text-[#d4c4a8] opacity-70">
                        Sức khỏe: {Math.round(jar.health)}%
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detailed Failure Analysis */}
          <div className="bg-[#8b4513]/10 border-l-4 border-[#8b4513] rounded-lg p-6 mb-10">
            <p className="text-[#8b4513] font-bold mb-3">📋 Phân tích Thất bại:</p>
            <ul className="space-y-2 text-[#d4c4a8]">
              {failures.map((failure, idx) => (
                <li key={idx} className="text-sm">
                  <span className="font-semibold text-[#a0522d]">🏺 Chum {failure.jarIndex + 1}:</span>
                  {failure.reasons.map((reason, rIdx) => (
                    <p key={rIdx} className="ml-6 text-xs opacity-80">
                      • {reason}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </div>

          {/* Advice */}
          <div className="bg-[#5f7c8a]/10 border-l-4 border-[#5f7c8a] rounded-lg p-6 mb-10">
            <p className="text-[#5f7c8a] font-semibold mb-2">💡 {getAdvice()}</p>
          </div>

          {/* Tips Section */}
          <div className="bg-[#2a1f17]/50 rounded-xl p-6 mb-10 border border-[#8b7355]/30">
            <p className="text-[#f5f0e8] font-semibold mb-4 text-center">🎯 Mẹo Để Thắng</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-sm text-[#d4c4a8]">
                <p className="font-bold text-[#5f7c8a] mb-2">⚡ Xử Lý Nhanh Sự Kiện:</p>
                <p>Khi có sự kiện, hãy nhấn nút đúng (K, L, I, H) để tránh mất chất lượng.</p>
              </div>
              <div className="text-sm text-[#d4c4a8]">
                <p className="font-bold text-[#5f7c8a] mb-2">🔬 Xử Lý Nhiễm Khuẩn:</p>
                <p>Khi chum bị nhiễm (🦠), nhấn J để xử lý ngay. Mỗi giây chất lượng mất 1%!</p>
              </div>
              <div className="text-sm text-[#d4c4a8]">
                <p className="font-bold text-[#5f7c8a] mb-2">📊 Theo Dõi Chỉ Số:</p>
                <p>Quan sát áp suất, nhiệt độ, nước. Giữ chúng ở mức cân bằng để chất lượng tốt.</p>
              </div>
              <div className="text-sm text-[#d4c4a8]">
                <p className="font-bold text-[#5f7c8a] mb-2">🎮 Thực Hành Bộ Kỹ Năng:</p>
                <p>Ở Phase 1, hoàn thành 5 seals nhanh. Điều này giúp tăng chất lượng ban đầu.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
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
          </div>

          {/* Footer */}
          <p className="text-center text-sm opacity-60 mt-8">
            💪 Đừng nản chí! Mỗi lần thử đều là bài học. Hãy cố gắng lại! 💪
          </p>
        </div>
      </div>
    </div>
  );
}
