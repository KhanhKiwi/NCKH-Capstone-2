import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

interface CompletionBannerProps {
  quality: number;
  removedFish: number;
  totalFish: number;
  removedDebris: number;
  totalDebris: number;
  rinseCount: number;
  cleanedFishCount: number;
  onContinue: () => void;
  onBack: () => void;
  challengeMode?: boolean;
}

export function CompletionBanner({
  quality,
  removedFish,
  totalFish,
  removedDebris,
  totalDebris,
  rinseCount,
  cleanedFishCount,
  onContinue,
  onBack,
  challengeMode = false
}: CompletionBannerProps) {
  // Auto-proceed in challenge mode
  useEffect(() => {
    if (challengeMode) {
      const t = setTimeout(() => onContinue(), 2000);
      return () => clearTimeout(t);
    }
  }, [challengeMode, onContinue]);
  const getQualityRating = () => {
    if (quality >= 90) return { label: 'Hoàn hảo ✨', color: '#4a7c59' };
    if (quality >= 75) return { label: 'Rất tốt ✓', color: '#5a8f6f' };
    if (quality >= 60) return { label: 'Tốt ✓', color: '#6aa07f' };
    if (quality >= 45) return { label: 'Chấp nhận được', color: '#d4a853' };
    return { label: 'Cần cải thiện', color: '#c5a05a' };
  };

  const rating = getQualityRating();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8 text-center">
          <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Hoàn Thành! 🎉</h1>
          <p className="text-emerald-100">Bạn đã xử lý mẻ cá thành công</p>
        </div>

        {/* Stats Container */}
        <div className="px-6 py-8 space-y-6">
          {/* Quality Section */}
          <div className="bg-white rounded-lg p-4 border-2 border-amber-200 shadow-sm">
            <div className="text-center mb-3">
              <p className="text-sm text-gray-600 font-semibold mb-1">CHẤT LƯỢNG MẺ CÁ</p>
              <div className="relative h-10 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                <div
                  className="absolute inset-0 transition-all duration-500 flex items-center justify-center"
                  style={{
                    width: `${quality}%`,
                    background: `linear-gradient(90deg, ${rating.color} 0%, ${rating.color}dd 100%)`
                  }}
                >
                  <span className="relative z-10 font-bold text-white text-lg drop-shadow-md">
                    {Math.round(quality)}%
                  </span>
                </div>
                {quality < 50 && (
                  <span className="relative z-20 font-bold text-gray-700 text-lg">
                    {Math.round(quality)}%
                  </span>
                )}
              </div>
              <p className="text-lg font-bold mt-2" style={{ color: rating.color }}>
                {rating.label}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Loại cá */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-gray-600 font-semibold">CÁ ĐÃ LOẠI</p>
              <p className="text-2xl font-bold text-blue-600">
                {removedFish}/{totalFish}
              </p>
            </div>

            {/* Tạp chất */}
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
              <p className="text-xs text-gray-600 font-semibold">TẠP CHẤT GỠ</p>
              <p className="text-2xl font-bold text-amber-600">
                {removedDebris}/{totalDebris}
              </p>
            </div>

            {/* Rửa */}
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-xs text-gray-600 font-semibold">LẦN RỬA</p>
              <p className="text-2xl font-bold text-green-600">
                {rinseCount}/2
              </p>
            </div>

            {/* Cá sạch */}
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <p className="text-xs text-gray-600 font-semibold">CÁ SẠC</p>
              <p className="text-2xl font-bold text-purple-600">
                {cleanedFishCount}/17
              </p>
            </div>
          </div>

          {/* Summary Text */}
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-700">
              {quality >= 80
                ? '🌟 Tuyệt vời! Mẻ cá chất lượng cao, sẽ có hương vị tuyệt hảo!'
                : quality >= 60
                ? '✓ Tốt! Mẻ cá chất lượng khá, phù hợp để làm nước mắm.'
                : quality >= 40
                ? 'Có thể chấp nhận được, nhưng cần cải thiện kỹ năng xử lý.'
                : '⚠️ Chất lượng thấp, cần rèn luyện thêm để đạt kỹ năng cao.'}
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        {!challengeMode && (
          <div className="px-6 py-4 bg-gray-50 flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <button
              onClick={onContinue}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              ➡️ Đi Tiếp
            </button>
          </div>
        )}
        {challengeMode && (
          <div className="px-6 py-4 bg-gray-50 text-center">
            <p className="text-green-700 font-semibold animate-pulse">⏳ Đang chuyển sang màn tiếp theo...</p>
          </div>
        )}
      </div>
    </div>
  );
}
