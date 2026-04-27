import { ArrowRight } from 'lucide-react';

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a1f17] to-[#3d2b1f] text-[#f5f0e8] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="text-6xl md:text-7xl mb-4">🏺</div>
          <h1 className="text-4xl md:text-5xl font-bold">Công Đoạn 4</h1>
          <h2 className="text-2xl md:text-3xl text-[#b87333]">Đóng Lu & Ủ Chượp</h2>
        </div>

        {/* Content */}
        <div className="space-y-6 text-lg text-[#d4c4a8]">
          <div className="bg-[#5c3d2e]/50 backdrop-blur-sm border border-[#8b7355]/30 rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#b87333] flex items-center gap-2">
              <span>🎯</span> Mục Đích
            </h3>
            <p className="leading-relaxed">
              Hoàn thiện quá trình chuẩn bị lu chượp bằng cách đóng nắp, niêm phong kín khí và tạo điều kiện tối ưu cho lên men tự nhiên. 
              Đây là bước quan trọng để đảm bảo chất lượng mắm tối ưu.
            </p>
          </div>

          <div className="bg-[#5c3d2e]/50 backdrop-blur-sm border border-[#8b7355]/30 rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#b87333] flex items-center gap-2">
              <span>⚙️</span> Quy Trình
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="text-[#5f7c8a] font-bold">1.</span>
                <span>Đóng nắp lu cẩn thận</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#5f7c8a] font-bold">2.</span>
                <span>Nén chặt hỗn hợp cá muối</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#5f7c8a] font-bold">3.</span>
                <span>Phủ lớp muối bảo vệ ngăn oxy</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#5f7c8a] font-bold">4.</span>
                <span>Niêm phong hoàn hảo</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#5f7c8a] font-bold">5.</span>
                <span>Bắt đầu quá trình lên men 12 tháng</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#5c3d2e]/50 backdrop-blur-sm border border-[#8b7355]/30 rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#b87333] flex items-center gap-2">
              <span>🌡️</span> Điều Kiện Tối Ưu
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-[#a0522d]">•</span>
                <span>Nhiệt độ: 28-32°C</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#a0522d]">•</span>
                <span>Độ ẩm: 70-85%</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#a0522d]">•</span>
                <span>Môi trường kỵ khí (không có oxy)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#a0522d]">•</span>
                <span>Thời gian lên men: 12 tháng</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-[#a0522d] to-[#b87333] hover:from-[#b87333] hover:to-[#d4a574] text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
        >
          <span>Bắt Đầu Quản Lý Lu Chượp</span>
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}
