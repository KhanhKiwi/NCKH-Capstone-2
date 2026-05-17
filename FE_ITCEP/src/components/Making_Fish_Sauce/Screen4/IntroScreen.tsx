
interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a1f17] to-[#3d2b1f] text-[#f5f0e8] flex items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full space-y-8 animate-fade-in">
        
        {/* Title & Intro */}
        <div className="text-center space-y-3">
          <div className="text-6xl md:text-7xl mb-2 drop-shadow-lg">🏺</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#e8c39e] drop-shadow-md tracking-wide">
            Thử Thách Ủ Chượp Nam Ô
          </h1>
          <p className="text-lg md:text-xl text-[#b87333] font-medium italic">
            "Sự kiên nhẫn làm nên những giọt nước mắm tuyệt hảo"
          </p>
        </div>

        {/* Main Content Container */}
        <div className="bg-[#3d2b1f]/80 backdrop-blur-md border border-[#8b7355]/50 rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl">
          
          {/* Mission */}
          <section className="text-center">
            <h2 className="text-2xl font-bold text-[#e8c39e] mb-3 flex items-center justify-center gap-2">
              <span className="text-3xl">📜</span> Nhiệm Vụ Của Bạn
            </h2>
            <p className="text-[#d4c4a8] text-lg max-w-2xl mx-auto leading-relaxed">
              Vào vai một nghệ nhân Nam Ô thực thụ. Bạn phải niêm phong lu mắm thật kín, sau đó <strong>bảo vệ 3 lu mắm</strong> khỏi thời tiết khắc nghiệt và côn trùng trong suốt 12 tháng ủ ròng rã!
            </p>
          </section>

          {/* Gameplay Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Phase 1: Rhythm */}
            <div className="bg-[#2a1f17]/90 border border-[#8b7355]/30 rounded-2xl p-5 shadow-inner">
              <h3 className="text-xl font-bold text-[#e8c39e] mb-4 flex items-center gap-2">
                <span>🔨</span> Giai Đoạn 1: Đóng Lu
              </h3>
              <p className="text-[#d4c4a8] mb-4 text-sm leading-relaxed">
                Canh nhịp thở, dùng búa gõ niêm phong thật chắc chắn để mắm không bị hỏng!
              </p>
              <div className="bg-[#3d2b1f] rounded-xl p-4 border border-white/5">
                <p className="text-[#e8c39e] font-semibold mb-2">Điều khiển:</p>
                <div className="flex items-center gap-3 text-sm text-[#d4c4a8]">
                  <kbd className="px-2 py-1 bg-[#2a1f17] border border-[#8b7355]/50 rounded font-mono shadow-sm">SPACE</kbd>
                  <span>hoặc</span>
                  <kbd className="px-2 py-1 bg-[#2a1f17] border border-[#8b7355]/50 rounded font-mono shadow-sm">→</kbd>
                  <span className="ml-1">Gõ trúng vùng xanh</span>
                </div>
              </div>
            </div>

            {/* Phase 2: Defense */}
            <div className="bg-[#2a1f17]/90 border border-[#8b7355]/30 rounded-2xl p-5 shadow-inner">
              <h3 className="text-xl font-bold text-[#e8c39e] mb-4 flex items-center gap-2">
                <span>🛡️</span> Giai Đoạn 2: Bảo Quản
              </h3>
              <p className="text-[#d4c4a8] mb-4 text-sm leading-relaxed">
                Luân chuyển giữa 3 lu mắm để phản ứng nhanh với các sự kiện bất ngờ.
              </p>
              
              <div className="space-y-3">
                <div className="bg-[#3d2b1f] rounded-xl p-3 border border-white/5 flex items-center gap-4">
                  <p className="text-[#e8c39e] font-semibold text-sm whitespace-nowrap">Chọn Lu:</p>
                  <div className="flex gap-2">
                    <kbd className="px-2 py-1 bg-[#2a1f17] border border-[#8b7355]/50 rounded font-mono text-sm text-[#d4c4a8]">A</kbd>
                    <kbd className="px-2 py-1 bg-[#2a1f17] border border-[#8b7355]/50 rounded font-mono text-sm text-[#d4c4a8]">S</kbd>
                    <kbd className="px-2 py-1 bg-[#2a1f17] border border-[#8b7355]/50 rounded font-mono text-sm text-[#d4c4a8]">D</kbd>
                  </div>
                </div>

                <div className="bg-[#3d2b1f] rounded-xl p-3 border border-white/5">
                  <p className="text-[#e8c39e] font-semibold text-sm mb-2">Hành Động Khẩn Cấp:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-[#d4c4a8]">
                    <div><kbd className="px-1.5 py-0.5 bg-[#2a1f17] rounded mr-1 border border-[#8b7355]/50">K</kbd> Xả khí</div>
                    <div><kbd className="px-1.5 py-0.5 bg-[#2a1f17] rounded mr-1 border border-[#8b7355]/50">L</kbd> Lau nước</div>
                    <div><kbd className="px-1.5 py-0.5 bg-[#2a1f17] rounded mr-1 border border-[#8b7355]/50">I</kbd> Hạ nhiệt</div>
                    <div><kbd className="px-1.5 py-0.5 bg-[#2a1f17] rounded mr-1 border border-[#8b7355]/50">H</kbd> Đuổi ruồi</div>
                    <div className="col-span-2 text-[#f87171] mt-1"><kbd className="px-1.5 py-0.5 bg-[#2a1f17] rounded mr-1 border border-[#ef4444]/50">J</kbd> Diệt khuẩn (cực kỳ nguy hiểm)</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Conditions & Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-emerald-900/40 to-transparent border-l-4 border-emerald-500 p-4 rounded-r-xl">
              <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">🏆 Điều Kiện Thắng</h4>
              <ul className="text-sm text-emerald-100/80 space-y-1 ml-2">
                <li>• Đóng thành công 5 niêm phong</li>
                <li>• Sinh tồn đủ 12 tháng (72 giây)</li>
                <li>• Chất lượng mắm cuối cùng ≥ 30%</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-rose-900/40 to-transparent border-l-4 border-rose-500 p-4 rounded-r-xl">
              <h4 className="font-bold text-rose-400 mb-2 flex items-center gap-2">💀 Cảnh Báo Mất Điểm</h4>
              <ul className="text-sm text-rose-100/80 space-y-1 ml-2">
                <li>• Bấm sai phím: <strong>-8% chất lượng</strong></li>
                <li>• Bỏ lỡ sự kiện: <strong>Giảm chất lượng liên tục</strong></li>
                <li>• Nhiễm khuẩn: <strong>Phá hủy mắm rất nhanh</strong></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Start Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full hover:from-amber-500 hover:to-orange-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(217,119,6,0.4)] active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full -translate-x-full transition-transform duration-700 skew-x-12" />
            <span className="text-xl tracking-wider uppercase drop-shadow-md">Bắt Đầu Thử Thách</span>
            <span className="text-2xl transition-transform group-hover:translate-x-1">🚀</span>
          </button>
        </div>

      </div>
    </div>
  );
}
