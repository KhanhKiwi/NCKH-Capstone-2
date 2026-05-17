
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
            "12 tháng thăng trầm, thử tài nghệ nhân mắm"
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
              Bạn sẽ trải qua mô phỏng <strong>12 tháng</strong> ủ mắm truyền thống. Mỗi tháng mang đến một tình huống thời tiết hoặc môi trường khác nhau. Quyết định của bạn sẽ định đoạt chất lượng mẻ mắm cuối cùng!
            </p>
          </section>

          {/* Gameplay Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Mechanics */}
            <div className="bg-[#2a1f17]/90 border border-[#8b7355]/30 rounded-2xl p-5 shadow-inner">
              <h3 className="text-xl font-bold text-[#e8c39e] mb-4 flex items-center gap-2">
                <span>⚙️</span> Cách Chơi
              </h3>
              <ul className="text-[#d4c4a8] text-sm leading-relaxed space-y-3 ml-2">
                <li>• Mỗi tháng sẽ có <strong>1 tình huống</strong> xảy ra (Mùa hè nóng bức, Mùa thu mát mẻ...).</li>
                <li>• Có 3 phương án giải quyết (Ví dụ: Đặt lu chỗ mát, Giữ nguyên, Thêm nước).</li>
                <li>• Mỗi phương án sẽ làm tăng/giảm <strong>Nhiệt Độ</strong>, <strong>Độ Ẩm</strong>, và <strong>Chất Lượng</strong> của mẻ mắm.</li>
              </ul>
              <div className="mt-4 bg-[#3d2b1f] rounded-xl p-4 border border-white/5">
                <p className="text-[#e8c39e] font-semibold mb-2">Điều khiển (Bàn phím):</p>
                <div className="flex items-center gap-3 text-sm text-[#d4c4a8]">
                  <kbd className="px-2 py-1 bg-[#2a1f17] border border-[#8b7355]/50 rounded font-mono shadow-sm">A</kbd>
                  <kbd className="px-2 py-1 bg-[#2a1f17] border border-[#8b7355]/50 rounded font-mono shadow-sm">S</kbd>
                  <kbd className="px-2 py-1 bg-[#2a1f17] border border-[#8b7355]/50 rounded font-mono shadow-sm">D</kbd>
                  <span className="ml-1">để chọn phương án</span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="bg-[#2a1f17]/90 border border-[#8b7355]/30 rounded-2xl p-5 shadow-inner">
              <h3 className="text-xl font-bold text-[#e8c39e] mb-4 flex items-center gap-2">
                <span>📊</span> Chỉ Số Cần Nhớ
              </h3>
              <div className="space-y-4">
                <div className="bg-[#3d2b1f] rounded-xl p-3 border border-white/5 flex flex-col gap-1">
                  <p className="text-[#e8c39e] font-semibold text-sm">🌡️ Nhiệt độ tối ưu:</p>
                  <p className="text-[#d4c4a8] text-sm">28°C - 32°C</p>
                </div>
                <div className="bg-[#3d2b1f] rounded-xl p-3 border border-white/5 flex flex-col gap-1">
                  <p className="text-[#e8c39e] font-semibold text-sm">💧 Độ ẩm tối ưu:</p>
                  <p className="text-[#d4c4a8] text-sm">70% - 85%</p>
                </div>
                <div className="bg-[#3d2b1f] rounded-xl p-3 border border-[#8b7355]/30 flex flex-col gap-1 shadow-md">
                  <p className="text-amber-400 font-bold text-sm">⭐ Chất Lượng (Quan trọng nhất):</p>
                  <p className="text-[#d4c4a8] text-sm italic">Bắt đầu ở mức 50%. Hãy đưa ra quyết định thông minh để cộng thêm điểm Chất Lượng!</p>
                </div>
              </div>
            </div>

          </div>

          {/* Conditions & Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-emerald-900/40 to-transparent border-l-4 border-emerald-500 p-4 rounded-r-xl flex flex-col justify-center">
              <h4 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">🏆 Điều Kiện Thắng</h4>
              <p className="text-sm text-emerald-100/80 ml-2">
                Kết thúc tháng 12, chất lượng mắm đạt <strong>≥ 75%</strong>.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-rose-900/40 to-transparent border-l-4 border-rose-500 p-4 rounded-r-xl flex flex-col justify-center">
              <h4 className="font-bold text-rose-400 mb-2 flex items-center gap-2">💀 Cảnh Báo Thua</h4>
              <p className="text-sm text-rose-100/80 ml-2">
                Ra quyết định sai lầm khiến chất lượng cuối cùng <strong>dưới 75%</strong>.
              </p>
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
