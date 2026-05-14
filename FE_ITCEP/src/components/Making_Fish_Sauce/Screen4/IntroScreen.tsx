
interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a1f17] to-[#3d2b1f] text-[#f5f0e8] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="text-7xl md:text-8xl mb-4">🏺</div>
          <h1 className="text-4xl md:text-5xl font-bold">Công Đoạn 4: Đóng Lu & Ủ Chượp</h1>
          <p className="text-lg text-[#b87333]">Hoàn thiện quá trình lên men mắm tự nhiên</p>
        </div>

        {/* Game Overview */}
        <div className="bg-gradient-to-br from-[#5c3d2e]/60 to-[#3d2b1f]/60 backdrop-blur-sm border border-[#8b7355]/40 rounded-2xl p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#5f7c8a] flex items-center gap-2">
              📋 Mục Đích Của Trò Chơi
            </h2>
            <p className="text-lg leading-relaxed text-[#d4c4a8]">
              Bạn sẽ quản lý 3 chum mắm trong quá trình lên men 12 tháng. Xử lý các sự cố như áp suất cao, nước thải, nhiệt độ bất thường, 
              và nhiễm khuẩn để duy trì chất lượng tối ưu. Mục tiêu: đạt chất lượng ≥ 30% để hoàn thành thành công.
            </p>
          </div>

          {/* Phase 1 */}
          <div className="bg-[#2a1f17]/80 border-l-4 border-[#5f7c8a] rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-bold text-[#5f7c8a]">Giai Đoạn 1: Niêm Phong Nhạc 🎵</h3>
            <p className="text-[#d4c4a8]">
              <strong>Thời gian:</strong> 30 giây
            </p>
            <ul className="space-y-2 text-[#d4c4a8] ml-4">
              <li>✓ Bấm phím <strong>PHẢI</strong> hoặc <strong>SPACE</strong> khi thanh vào vùng xanh (Perfect Zone)</li>
              <li>✓ Cần hoàn thành <strong>ít nhất 5 niêm phong</strong> thành công</li>
              <li>✓ Perfect hit = +20%, Good hit = +10%, Miss = -5% chất lượng</li>
              <li>✓ Base quality khởi đầu: <strong>30%</strong></li>
            </ul>
            <p className="text-sm text-[#8b7355] italic mt-2">⚠️ Hết 30 giây mà chưa 5 niêm phong = thua cuộc</p>
          </div>

          {/* Phase 2 */}
          <div className="bg-[#2a1f17]/80 border-l-4 border-[#a0522d] rounded-lg p-6 space-y-3">
            <h3 className="text-xl font-bold text-[#a0522d]">Giai Đoạn 2: Ủ Chượp 🌾</h3>
            <p className="text-[#d4c4a8]">
              <strong>Thời gian:</strong> 72 giây (12 tháng mô phỏng)
            </p>
            <ul className="space-y-2 text-[#d4c4a8] ml-4">
              <li>🔄 <strong>A:</strong> Chọn Chum 1</li>
              <li>🔄 <strong>S:</strong> Chọn Chum 2</li>
              <li>🔄 <strong>D:</strong> Chọn Chum 3</li>
              <li>💨 <strong>K:</strong> Xả khí (xử lý sự kiện áp suất)</li>
              <li>💧 <strong>L:</strong> Lau nước (xử lý sự kiện nước thải)</li>
              <li>🌡️ <strong>I:</strong> Hạ nhiệt độ (xử lý sự kiện quá nóng)</li>
              <li>🤪 <strong>H:</strong> Đuổi ruồi (xử lý sự kiện ruồi bay)</li>
              <li>🔬 <strong>J:</strong> Xử lý nhiễm khuẩn (khóa chum 3s, chất lượng -1%/s khi bị nhiễm)</li>
            </ul>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm">
              <div className="bg-[#5f7c8a]/20 p-3 rounded border border-[#5f7c8a]/30">
                <p className="font-bold text-[#5f7c8a]">Thành công</p>
                <p className="text-[#d4c4a8]">Xử lý đúng event = +6-10% chất lượng</p>
              </div>
              <div className="bg-[#b87333]/20 p-3 rounded border border-[#b87333]/30">
                <p className="font-bold text-[#b87333]">Sai hành động</p>
                <p className="text-[#d4c4a8]">Ấn nút sai = -8% chất lượng</p>
              </div>
              <div className="bg-[#8b4513]/20 p-3 rounded border border-[#8b4513]/30">
                <p className="font-bold text-[#8b4513]">Event hết hạn</p>
                <p className="text-[#d4c4a8]">-10 đến -20% chất lượng + sức khỏe</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-[#5f7c8a]/20 border border-[#5f7c8a]/40 rounded-lg p-4 space-y-2">
            <p className="font-bold text-[#5f7c8a]">💡 Mẹo Thắng:</p>
            <ul className="text-sm text-[#d4c4a8] space-y-1 ml-4">
              <li>• Chú ý các biểu tượng event trên chum để xác định cần xử lý gì</li>
              <li>• Ưu tiên chum bị nhiễm (🦠) - xử lý sớm để tránh mất quá nhiều chất lượng</li>
              <li>• Đừng ấn nút nếu không có event tương ứng (sẽ bị -8%)</li>
              <li>• Duy trì chất lượng ≥ 30% để chiến thắng</li>
            </ul>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-[#a0522d] to-[#b87333] hover:from-[#b87333] hover:to-[#d4a574] text-white font-bold py-4 px-6 rounded-2xl text-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          ▶️ Bắt Đầu Quản Lý Lu Chượp
        </button>
      </div>
    </div>
  );
}
