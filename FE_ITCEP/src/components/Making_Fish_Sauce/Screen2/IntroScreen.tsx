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
            💧 Rửa & Làm Sạch Cá
          </h1>
          <p className="text-xl text-[#4b4336] max-w-2xl mx-auto mb-8">
            Bước quan trọng để chuẩn bị cá<br />
            <span className="font-bold text-[#b7843b]">cho quá trình ướp muối mắm</span>
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
                <span className="text-2xl flex-shrink-0">🐟</span>
                <span className="font-semibold">Chọn lọc cá tốt</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-2xl flex-shrink-0">🌊</span>
                <span className="font-semibold">Kéo nước biển rửa</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-2xl flex-shrink-0">🪮</span>
                <span className="font-semibold">Chải sạch từng con</span>
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
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <p className="font-semibold">3 Công Đoạn</p>
                <p className="text-sm">Chọn lọc → Rửa → Chải sạch</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-semibold">Thời gian</p>
                <p className="text-sm">Tối đa 90 giây</p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <p className="font-semibold">Chất Lượng</p>
                <p className="text-sm">Phải ≥ 10% để qua</p>
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
              <li>• Loại bỏ cá xấu, hỏng, mắt đục</li>
              <li>• Gỡ bỏ tạp chất (lá, bùn, cát)</li>
              <li>• Rửa kỹ lưỡng bằng nước biển</li>
              <li>• Chải sạch mỗi con cá</li>
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
          <h3 className="text-2xl font-bold text-[#5d4e37] mb-4">Tại Sao Bước Này Quan Trọng?</h3>
          <p className="text-[#4b4336] leading-relaxed">
            Sau khi bắt được cá tươi, bước rửa và làm sạch là <strong>nền tảng của chất lượng mắm</strong>. 
            Những thợ mắm Nam Ô tỉ mỉ loại bỏ từng sợi tạp chất và rửa sạch bằng nước biển tự nhiên. 
            <span className="text-[#b7843b] font-bold"> Cá sạch = Mắm ngon = Hương vị truyền thống</span>.
            Đây không chỉ là kỹ năng mà còn là nghệ thuật của người thợ!
          </p>
        </motion.div>

        {/* === SECTION 4: STAGES INFO === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-800 mb-2">📋 Công Đoạn 1: Chọn Lọc</h4>
            <p className="text-sm text-blue-700">Phân loại cá tốt, loại bỏ cá xấu và tạp chất từ rổ</p>
          </div>
          <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-6">
            <h4 className="font-bold text-cyan-800 mb-2">🌊 Công Đoạn 2: Gáo Nước</h4>
            <p className="text-sm text-cyan-700">Kéo nước biển tươi để rửa sạch cát, bùn đất</p>
          </div>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-800 mb-2">🪮 Công Đoạn 3: Chải Cá</h4>
            <p className="text-sm text-green-700">Chải sạch sẽ từng con cá để chuẩn bị ướp muối</p>
          </div>
        </motion.div>

        {/* === SECTION 5: CTA === */}
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
            Bắt Đầu Rửa Cá 💧
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
