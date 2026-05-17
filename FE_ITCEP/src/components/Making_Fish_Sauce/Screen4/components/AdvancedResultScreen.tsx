import { CheckCircle2, XCircle, ArrowLeft, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router';

interface GameMetrics {
  month: number;
  temperature: number;
  humidity: number;
  quality: number;
  microbes: number;
  fermentationLevel: number;
}

interface AdvancedResultScreenProps {
  passed: boolean;
  finalQuality: number;
  history: GameMetrics[];
  temperature: number;
  humidity: number;
  challengeMode?: boolean;
}

export function AdvancedResultScreen({
  passed,
  finalQuality,
  history,
  temperature,
  humidity,
  challengeMode = false
}: AdvancedResultScreenProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f0e8] to-[#e8dcc8] overflow-auto">
      <button
        onClick={() => navigate(-2)}
        className="fixed top-6 left-6 z-50 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-3 transition-all hover:scale-110 shadow-lg"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            {passed ? (
              <div className="relative">
                <CheckCircle2 size={140} className="text-green-500 animate-pulse" />
                <div className="absolute inset-0 animate-ping">
                  <CheckCircle2 size={140} className="text-green-500 opacity-30" />
                </div>
              </div>
            ) : (
              <div className="relative">
                <XCircle size={140} className="text-red-500 animate-pulse" />
                <div className="absolute inset-0 animate-ping">
                  <XCircle size={140} className="text-red-500 opacity-30" />
                </div>
              </div>
            )}
          </div>

          <h1 className="text-5xl font-bold text-[#3d2b1f] mb-4">
            {passed ? '🏆 Thành Công!' : '❌ Thất Bại'}
          </h1>

          <p className="text-2xl text-[#5f7c8a] mb-2">
            {passed
              ? 'Nước mắm của bạn đã lên men hoàn hảo'
              : 'Nước mắm bị hỏng, vui lòng thử lại'}
          </p>

          <p className="text-lg opacity-70 text-[#5c3d2e]">
            {passed
              ? 'Vi khuẩn lactic acid đã tạo ra hương vị đặc trưng Nam Ô truyền thống'
              : 'Một số lựa chọn không tối ưu đã ảnh hưởng đến quá trình lên men'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`bg-white/80 backdrop-blur-xl rounded-2xl border-2 shadow-lg p-8 text-center ${
            passed ? 'border-green-400/50' : 'border-red-400/50'
          }`}>
            <div className="text-6xl font-bold mb-3" style={{
              color: finalQuality >= 85 ? '#5f7c8a' : finalQuality >= 70 ? '#b87333' : '#c85a54'
            }}>
              {finalQuality.toFixed(1)}%
            </div>
            <p className="text-lg font-semibold text-[#3d2b1f] mb-2">Chất Lượng Cuối</p>
            <div className="inline-block px-4 py-2 rounded-full text-sm font-bold" style={{
              backgroundColor: finalQuality >= 85 ? '#5f7c8a20' : finalQuality >= 70 ? '#b8733320' : '#c85a5420',
              color: finalQuality >= 85 ? '#5f7c8a' : finalQuality >= 70 ? '#b87333' : '#c85a54'
            }}>
              {finalQuality >= 90 ? '🏆 Xuất sắc' : finalQuality >= 80 ? '⭐ Tốt' : finalQuality >= 70 ? '👍 Chấp nhận' : '❌ Kém'}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-orange-400/50 shadow-lg p-8 text-center">
            <div className="text-5xl font-bold mb-3 text-orange-500">{temperature.toFixed(1)}°C</div>
            <p className="text-lg font-semibold text-[#3d2b1f] mb-2">Nhiệt Độ Cuối</p>
            <div className="inline-block px-4 py-2 rounded-full text-sm font-bold"
              style={{
                backgroundColor: (temperature >= 28 && temperature <= 32) ? '#5f7c8a20' : '#b8733320',
                color: (temperature >= 28 && temperature <= 32) ? '#5f7c8a' : '#b87333'
              }}
            >
              {(temperature >= 28 && temperature <= 32) ? '✅ Tối ưu' : '⚠️ Ngoài range'}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-blue-400/50 shadow-lg p-8 text-center">
            <div className="text-5xl font-bold mb-3 text-blue-500">{humidity.toFixed(1)}%</div>
            <p className="text-lg font-semibold text-[#3d2b1f] mb-2">Độ Ẩm Cuối</p>
            <div className="inline-block px-4 py-2 rounded-full text-sm font-bold"
              style={{
                backgroundColor: (humidity >= 70 && humidity <= 85) ? '#5f7c8a20' : '#b8733320',
                color: (humidity >= 70 && humidity <= 85) ? '#5f7c8a' : '#b87333'
              }}
            >
              {(humidity >= 70 && humidity <= 85) ? '✅ Tối ưu' : '⚠️ Ngoài range'}
            </div>
          </div>
        </div>

        <div className={`bg-gradient-to-br rounded-2xl border-2 p-8 mb-12 ${
          passed
            ? 'from-green-100 to-emerald-50 border-green-300'
            : 'from-red-100 to-orange-50 border-red-300'
        }`}>
          <h2 className="text-2xl font-bold text-[#3d2b1f] mb-4 flex items-center gap-3">
            {passed ? '🎉' : '📝'} {passed ? 'Phân tích Thành Công' : 'Phân tích Thất Bại'}
          </h2>

          <div className="text-lg text-[#3d2b1f] leading-relaxed space-y-4">
            {passed ? (
              <>
                <p>
                  ✅ Bạn đã hoàn thành quy trình lên men 12 tháng thành công! Nước mắm có chất lượng
                  {finalQuality >= 90 ? ' xuất sắc' : finalQuality >= 80 ? ' tốt' : ' chấp nhận được'}.
                </p>
                <p>
                  🧬 Những lựa chọn tốt của bạn đã tạo ra sự cân bằng hoàn hảo giữa:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>🌡️ <strong>Nhiệt độ:</strong> Vi khuẩn lactic acid phát triển tối ưu</li>
                  <li>💧 <strong>Độ ẩm:</strong> Môi trường lên men ổn định</li>
                  <li>⏰ <strong>Thời gian:</strong> 12 tháng cho quá trình phân hủy đầy đủ</li>
                </ul>
                <p>
                  🌟 Vi khuẩn đã phân hủy protein thành amino acid, tạo ra hương vị đặc trưng và vị
                  mặn của mắm Nam Ô truyền thống.
                </p>
              </>
            ) : (
              <>
                <p>
                  ❌ Nước mắm của bạn bị hỏng do một số lựa chọn không tối ưu trong quá trình lên men.
                </p>
                <p>
                  ⚠️ Những yếu tố ảnh hưởng:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>🌡️ <strong>Nhiệt độ hiện tại:</strong> {temperature > 32 ? 'quá nóng' : temperature < 28 ? 'quá lạnh' : 'tối ưu'} (Nên: 28-32°C)</li>
                  <li>💧 <strong>Độ ẩm hiện tại:</strong> {humidity > 85 ? 'quá ẩm' : humidity < 70 ? 'quá khô' : 'tối ưu'} (Nên: 70-85%)</li>
                  <li>📊 <strong>Chất lượng cuối:</strong> {finalQuality}% (Cần ≥75% để thành công)</li>
                </ul>
                <p>
                  💡 <strong>Gợi ý:</strong> Hãy cân nhắc kỹ hơn lựa chọn mỗi tháng. Hãy thử lại!
                </p>
              </>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-[#d4a574]/30 shadow-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-[#3d2b1f] mb-6 flex items-center gap-3">
              <TrendingUp size={28} className="text-[#5f7c8a]" />
              Biểu Đồ Tiến Trình 12 Tháng
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-[#3d2b1f] mb-4">Xu Hướng Chất Lượng</h4>
                <div className="space-y-2">
                  {history.map((metric) => (
                    <div key={metric.month} className="flex items-center gap-3">
                      <span className="w-8 font-bold text-[#5f7c8a]">T{metric.month}</span>
                      <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-gradient-to-r from-orange-400 to-green-500 transition-all"
                          style={{ width: `${metric.quality}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-semibold text-[#3d2b1f]">
                        {metric.quality.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[#3d2b1f] mb-4">Thông Số Môi Trường</h4>
                <div className="space-y-3">
                  {history.map((metric) => (
                    <div key={metric.month} className="text-sm flex justify-between items-center p-3 bg-[#f5f0e8] rounded-lg">
                      <span className="font-bold text-[#5f7c8a]">Tháng {metric.month}</span>
                      <div className="flex gap-4">
                        <span className={`px-3 py-1 rounded ${
                          metric.temperature >= 28 && metric.temperature <= 32
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {metric.temperature.toFixed(1)}°C
                        </span>
                        <span className={`px-3 py-1 rounded ${
                          metric.humidity >= 70 && metric.humidity <= 85
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {metric.humidity.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate(-2)}
            className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#b87333] to-[#8b4513] hover:shadow-lg transition-all transform hover:scale-105 text-lg"
          >
            {passed ? '✨ Tiếp Tục Chơi' : '🔄 Thử Lại'}
          </button>
          {!challengeMode && (
            <button
              onClick={() => navigate(-3)}
              className="px-8 py-4 rounded-xl font-bold text-[#3d2b1f] bg-white border-2 border-[#b87333] hover:shadow-lg transition-all transform hover:scale-105 text-lg"
            >
              🏠 Về Làng Mắm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
