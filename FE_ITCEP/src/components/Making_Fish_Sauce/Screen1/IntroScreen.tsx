import { motion } from 'motion/react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7ed] via-[#fff1e6] to-[#fff3f0] py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* === SECTION 1: HERO === */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-[#5d4e37]">
            🎣 Làng Mắm Nam Ô
          </h1>
          <p className="text-xl text-[#4b4336] max-w-2xl mx-auto mb-8">
            Để tạo nên nước mắm ngon nhất,<br />
            <span className="font-bold text-[#b7843b]">cần chọn cá cơm than tươi</span>
          </p>
        </motion.div>

        {/* === SECTION 2: 3-COLUMN CARDS === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Card 1: Gameplay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#d4b896] hover:shadow-xl transition-all"
          >
            <h3 className="text-2xl font-bold text-[#5d4e37] mb-6">Cách Chơi</h3>
            <ul className="space-y-4 text-[#4b4336]">
              <li className="flex gap-3 items-start">
                <span className="text-2xl flex-shrink-0">🎣</span>
                <span className="font-semibold">Kéo lưới bắt cá</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-2xl flex-shrink-0">🐟</span>
                <span className="font-semibold">Chọn đúng loại cá</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-2xl flex-shrink-0">❌</span>
                <span className="font-semibold">Tránh cá sai/hỏng</span>
              </li>
            </ul>
          </motion.div>

          {/* Card 2: Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#d4b896] hover:shadow-xl transition-all"
          >
            <h3 className="text-2xl font-bold text-[#5d4e37] mb-6">Luật Chơi</h3>
            <div className="space-y-4 text-[#4b4336]">
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="font-semibold">Bắt sai</p>
                <p className="text-sm">Mất 1 trái tim ❤️</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-semibold">Thời gian</p>
                <p className="text-sm">2 phút ra khơi</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <p className="font-semibold">Thắng</p>
                <p className="text-sm">Bắt đủ & tránh sai ✓</p>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Knowledge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#d4b896] hover:shadow-xl transition-all"
          >
            <h3 className="text-2xl font-bold text-[#5d4e37] mb-6">Bạn Sẽ Học</h3>
            <ul className="space-y-4 text-sm text-[#4b4336]">
              <li>• Cá cơm than: nhỏ, sáng, nhanh</li>
              <li>• Mùa tốt: tháng 1-3 âm lịch</li>
              <li>• Chất lượng: tươi, không hỏng</li>
              <li>• Mắm ngon: từ cá chọn lựa</li>
            </ul>
          </motion.div>

        </div>

        {/* === SECTION 3: STORY SECTION === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#b7843b]/10 to-[#d4b896]/10 rounded-2xl p-8 mb-12 border border-[#d4b896]/30"
        >
          <h3 className="text-2xl font-bold text-[#5d4e37] mb-4">Tại Sao Chơi?</h3>
          <p className="text-[#4b4336] leading-relaxed">
            Ở Làng nghề Nam Ô, quy trình bắt cá là <strong>bước quan trọng nhất</strong> để tạo nước mắm ngon. 
            Hàng thế kỷ, thế hệ thợ mắm đã tích lũy kinh nghiệm để chọn lựa và bảo quản cá cơm than tươi. 
            <span className="text-[#b7843b] font-bold"> Chất lượng cá = Hương vị cuối cùng</span>.
          </p>
        </motion.div>

        {/* === SECTION 4: CTA === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 text-2xl font-bold text-white bg-gradient-to-r from-[#b7843b] to-[#8b6f47] rounded-full shadow-xl hover:shadow-2xl transition-all border-3 border-[#e6d7b3] flex items-center gap-3"
          >
            Bắt Đầu Ra Khơi 🚤
            <ChevronRight size={24} />
          </motion.button>
          
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 text-[#5d4e37] border-2 border-[#d4b896] rounded-full hover:bg-[#faf5f0] transition-all flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Quay Lại
          </button>
        </motion.div>

      </div>
    </div>
  );
}

