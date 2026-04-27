import { AlertCircle, ArrowLeft } from 'lucide-react';

interface FailureBannerProps {
  reason: 'timeout' | 'low-quality';
  quality: number;
  timeRemaining: number;
  onRetry: () => void;
  onBack: () => void;
}

export function FailureBanner({
  reason,
  quality,
  onRetry,
  onBack
}: FailureBannerProps) {
  const isTimeout = reason === 'timeout';
  const isLowQuality = reason === 'low-quality';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-red-50 to-orange-100 rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-8 text-center">
          <AlertCircle className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Thất Bại! ✗</h1>
          <p className="text-red-100">Không thể hoàn thành công đoạn này</p>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-6">
          {/* Reason Box */}
          <div className="bg-white rounded-lg p-4 border-2 border-red-200">
            {isTimeout && (
              <div className="text-center">
                <p className="text-lg font-bold text-red-600 mb-2">⏰ Hết Thời Gian!</p>
                <p className="text-sm text-gray-700">
                  Bạn đã hết 90 giây để xử lý mẻ cá. Hãy thử lại và làm nhanh hơn!
                </p>
              </div>
            )}

            {isLowQuality && (
              <div className="text-center">
                <p className="text-lg font-bold text-red-600 mb-2">⚠️ Chất Lượng Quá Thấp!</p>
                <p className="text-sm text-gray-700 mb-3">
                  Chất lượng mẻ cá xuống dưới 10% ({Math.round(quality)}%)
                </p>
                <p className="text-xs text-gray-600">
                  Mẻ cá bị hỏng, không thể sử dụng để làm nước mắm.
                </p>
              </div>
            )}
          </div>

          {/* Quality Meter for Low Quality */}
          {isLowQuality && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-xs text-gray-600 font-semibold mb-2 text-center">
                CHẤT LƯỢNG HIỆN TẠI
              </p>
              <div className="relative h-8 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    width: `${quality}%`,
                    background: 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)'
                  }}
                >
                  {quality > 5 && (
                    <span className="relative z-10 font-bold text-white text-sm drop-shadow-md">
                      {Math.round(quality)}%
                    </span>
                  )}
                </div>
                {quality <= 5 && (
                  <span className="relative z-20 font-bold text-red-600 text-sm">
                    {Math.round(quality)}%
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">
                Cần đạt ít nhất 10% để tiếp tục
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs font-semibold text-blue-800 mb-2">💡 Gợi ý:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              {isTimeout && (
                <>
                  <li>• Loại cá xấu nhanh trong giai đoạn lọc</li>
                  <li>• Rửa cá liên tục, không để tạp chất</li>
                  <li>• Dùng bàn chải sạch mỗi cá kỹ lưỡng</li>
                </>
              )}
              {isLowQuality && (
                <>
                  <li>• Chọn cá tốt (tránh cá xấu)</li>
                  <li>• Gỡ bỏ tất cả tạp chất từ rổ</li>
                  <li>• Rửa cá kỹ để tăng chất lượng</li>
                  <li>• Làm sạch mỗi cá để đạt điểm cao</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 bg-gray-50 flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <button
            onClick={onRetry}
            className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors"
          >
            Thử Lại →
          </button>
        </div>
      </div>
    </div>
  );
}
