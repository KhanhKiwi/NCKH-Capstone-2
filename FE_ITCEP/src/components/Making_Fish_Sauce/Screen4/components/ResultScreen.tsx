
import { CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

interface ResultScreenProps {
  passed: boolean;
  finalQuality: number;
  history: Array<{ month: number; choice: string; result: string }>;
  temperature: number;
  humidity: number;
}

export function ResultScreen({
  passed,
  finalQuality,
  history,
  temperature,
  humidity
}: ResultScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a1f17] to-[#3d2b1f] text-[#f5f0e8] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Result Icon & Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {passed ? (
              <CheckCircle2 size={120} className="text-[#5f7c8a] animate-pulse" />
            ) : (
              <XCircle size={120} className="text-[#b87333] animate-pulse" />
            )}
          </div>

          <h2 className="text-4xl font-bold">
            {passed ? '✨ Thành Công!' : '❌ Thất Bại'}
          </h2>

          <p className="text-xl text-[#b87333]">
            {passed
              ? 'Nước mắm của bạn đã lên men hoàn hảo!'
              : 'Nước mắm bị hỏng, vui lòng thử lại'}
          </p>
        </div>

        {/* Final Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#5c3d2e]/60 rounded-lg p-4 border border-[#8b7355]/20">
            <p className="text-xs opacity-70 mb-2">Chất lượng cuối</p>
            <div className={`text-3xl font-bold ${passed ? 'text-[#5f7c8a]' : 'text-[#b87333]'}`}>
              {Math.round(finalQuality)}%
            </div>
            <p className="text-xs mt-2 opacity-60">
              {finalQuality >= 90 ? '🏆 Xuất sắc' : finalQuality >= 80 ? '⭐ Tốt' : '📊 Khá'}
            </p>
          </div>

          <div className="bg-[#5c3d2e]/60 rounded-lg p-4 border border-[#8b7355]/20">
            <p className="text-xs opacity-70 mb-2">Nhiệt độ cuối</p>
            <div className="text-3xl font-bold">{temperature}°C</div>
            <p className="text-xs mt-2 opacity-60">
              {temperature >= 28 && temperature <= 32 ? '✅ Tối ưu' : '⚠️ Ngoài range'}
            </p>
          </div>

          <div className="bg-[#5c3d2e]/60 rounded-lg p-4 border border-[#8b7355]/20">
            <p className="text-xs opacity-70 mb-2">Độ ẩm cuối</p>
            <div className="text-3xl font-bold">{humidity}%</div>
            <p className="text-xs mt-2 opacity-60">
              {humidity >= 70 && humidity <= 85 ? '✅ Tối ưu' : '⚠️ Ngoài range'}
            </p>
          </div>
        </div>

        {/* Feedback */}
        <div className={`bg-gradient-to-br rounded-xl border p-6 ${
          passed
            ? 'from-[#5f7c8a]/20 to-[#a0522d]/20 border-[#5f7c8a]/40'
            : 'from-[#b87333]/20 to-[#8b4513]/20 border-[#b87333]/40'
        }`}>
          <h3 className="font-semibold mb-3 text-[#b87333]">
            {passed ? '🎉 Kết quả xuất sắc!' : '📝 Phân tích thất bại'}
          </h3>

          <p className="text-sm leading-relaxed text-[#d4c4a8]">
            {passed ? (
              <>
                Bạn đã hoàn thành quy trình lên men 12 tháng thành công! Nước mắm có chất lượng
                {finalQuality >= 90 ? ' xuất sắc' : finalQuality >= 80 ? ' tốt' : ' khá'}.
                <br />
                <br />
                Những lựa chọn tốt của bạn đã tạo nên sự cân bằng hoàn hảo giữa nhiệt độ, độ ẩm
                và thời gian ủ. Vi khuẩn lactic acid đã phân hủy protein thành amino acid, tạo ra
                hương vị đặc trưng của mắm Nam Ô truyền thống.
              </>
            ) : (
              <>
                Nước mắm của bạn bị hỏng do một số lựa chọn không tối ưu. Những yếu tố như nhiệt độ
                quá thấp, độ ẩm không phù hợp, hoặc can thiệp quá nhiều đã ảnh hưởng đến quá trình
                lên men.
                <br />
                <br />
                Hãy thử lại và chú ý đến cân bằng giữa các thông số. Mỗi quyết định đều ảnh hưởng
                đến kết quả cuối cùng!
              </>
            )}
          </p>
        </div>

        {/* History Summary */}
        <div className="bg-[#5c3d2e]/40 rounded-xl border border-[#8b7355]/20 p-4 space-y-3 max-h-48 overflow-y-auto">
          <h4 className="font-semibold text-[#b87333] text-sm">📋 Lịch sử lựa chọn</h4>
          <div className="space-y-2">
            {history.map((entry, idx) => (
              <div key={idx} className="text-xs p-2 bg-[#3d2b1f]/40 rounded border border-[#8b7355]/20">
                <p className="font-medium text-[#b87333]">Tháng {entry.month}</p>
                <p className="text-[#d4c4a8] opacity-80">{entry.choice}</p>
                {entry.result !== entry.choice && (
                  <p className="text-[#a0522d] text-xs mt-1">ℹ️ {entry.result}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-6">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-gradient-to-r from-[#a0522d] to-[#b87333] hover:from-[#b87333] hover:to-[#d4a574] text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            <RotateCcw size={20} />
            Thử Lại
          </button>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-[#5c3d2e] hover:bg-[#3d2b1f] text-[#f5f0e8] font-bold py-3 px-6 rounded-xl border border-[#8b7355]/40 transition-all hover:scale-105 active:scale-95"
          >
            Quay Lại
          </button>
        </div>
      </div>
    </div>
  );
}
