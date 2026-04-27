import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7a92a3] via-[#9faab5] to-[#b5a88f] flex items-center justify-center px-2 py-6 md:px-4 md:py-10">
      <div className="w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col shadow-2xl bg-gradient-to-b from-[#e8dcc8] to-[#d4c4a8] max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 md:py-8 border-b-2 border-[#4a3220]/30 flex-shrink-0">
          <button
            onClick={() => navigate('/craft-selection')}
            className="flex items-center gap-2 text-[#4a3220] hover:text-[#2a1a0f] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">Quay lại</span>
          </button>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2a1a0f] mb-2 tracking-wide"
          >
            Công Đoạn 3
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-[#5d7a8c] font-medium"
          >
            Pha Muối & Ướp Cá 🧂
          </motion.p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6">
          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 sm:mb-8 p-4 md:p-5 bg-gradient-to-br from-[#fff9e6] to-[#f5ecd4] rounded-lg border-2 border-[#4a3220]/20 shadow-md"
          >
            <p className="text-sm md:text-base text-[#2a1a0f] leading-relaxed">
              Sau khi rửa sạch cá, bước tiếp theo là pha muối và ướp cá. Đây là công đoạn cực kỳ quan trọng! 
              <br />
              <br />
              💡 <strong>Muối</strong> không chỉ bảo quản cá mà còn <strong>khử nước</strong> và <strong>tiêu diệt vi khuẩn</strong>. 
              Tỷ lệ muối phù hợp (2.5-4.0) sẽ tạo ra điều kiện lý tưởng cho quá trình lên men sau này.
            </p>
          </motion.div>

          {/* Game Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6 sm:mb-8"
          >
            <h3 className="text-lg md:text-xl font-bold text-[#2a1a0f] mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🎮</span> Cách Chơi
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="p-3 md:p-4 bg-[#fff9e6] rounded-lg border-l-4 border-[#c9936d]">
                <p className="text-xs sm:text-sm md:text-base text-[#2a1a0f]">
                  <strong>Bước 1: Đổ muối</strong> - Điều chỉnh slider tỷ lệ muối (2.0-5.0) sao cho hợp lý, rồi nhấn "Đổ muối"
                </p>
              </div>
              <div className="p-3 md:p-4 bg-[#fff9e6] rounded-lg border-l-4 border-[#b8a88f]">
                <p className="text-xs sm:text-sm md:text-base text-[#2a1a0f]">
                  <strong>Bước 2: Trộn đều</strong> - Nhấn "Trộn đều" nhiều lần (4 lần) để muối phân bố đồng đều. Mục tiêu ≥ 75% độ đồng đều
                </p>
              </div>
              <div className="p-3 md:p-4 bg-[#fff9e6] rounded-lg border-l-4 border-[#a6934d]">
                <p className="text-xs sm:text-sm md:text-base text-[#2a1a0f]">
                  <strong>Bước 3: Chuyển thùng</strong> - Chuyển hỗn hợp vào thùng chượp lớn (thùng fermentation)
                </p>
              </div>
              <div className="p-3 md:p-4 bg-[#fff9e6] rounded-lg border-l-4 border-[#8b6939]">
                <p className="text-xs sm:text-sm md:text-base text-[#2a1a0f]">
                  <strong>Bước 4: Nén chặt</strong> - Nén chặt hỗn hợp để tạo môi trường kỵ khí (oxygen-free)
                </p>
              </div>
              <div className="p-3 md:p-4 bg-[#fff9e6] rounded-lg border-l-4 border-[#c0c0c0]">
                <p className="text-xs sm:text-sm md:text-base text-[#2a1a0f]">
                  <strong>Bước 5: Đậy nắp</strong> - Phủ một lớp muối lên mặt và đậy kín nắp. Chuẩn bị cho quá trình lên men kỵ khí
                </p>
              </div>
            </div>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6 sm:mb-8"
          >
            <h3 className="text-lg md:text-xl font-bold text-[#2a1a0f] mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">⚠️</span> Lưu Ý Quan Trọng
            </h3>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base text-[#2a1a0f]">
              <p>✓ Tỷ lệ muối <strong>2.5-4.0 là lý tưởng</strong> (quá thấp → mốc, quá cao → quá mặn)</p>
              <p>✓ <strong>Trộn đều</strong> là chìa khóa để muối thấm đều vào cá</p>
              <p>✓ <strong>Nén chặt</strong> giúp tạo môi trường kỵ khí cho vi khuẩn lên men tốt</p>
              <p>✓ <strong>Chất lượng</strong> phụ thuộc vào tỷ lệ muối + độ đồng đều + nén chặt</p>
            </div>
          </motion.div>

          {/* Learning Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6 p-3 md:p-5 bg-gradient-to-br from-[#5d7a8c]/10 to-[#4a7c59]/10 rounded-lg border-2 border-[#5d7a8c]/30"
          >
            <h3 className="text-lg md:text-xl font-bold text-[#2a1a0f] mb-2 sm:mb-3 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">📚</span> Kiến Thức Khoa Học
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base text-[#2a1a0f]">
              <li>🧪 <strong>Osmosis:</strong> Muối giúp khử nước khỏi cá qua hiện tượng thẩm thấu</li>
              <li>🦠 <strong>Kỵ khí lên men:</strong> Vi khuẩn lợi ích cần môi trường không có oxy</li>
              <li>⏱️ <strong>Thời gian:</strong> Công đoạn này mất 3-6 tháng để hoàn thành</li>
              <li>🌊 <strong>Nước mắm cổ truyền:</strong> Là sản phẩm lên men tự nhiên, không có hóa chất</li>
            </ul>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex-shrink-0 px-4 sm:px-6 md:px-8 py-4 md:py-6 border-t-2 border-[#4a3220]/30 bg-gradient-to-t from-[#d4c4a8] to-[#e8dcc8] flex flex-col sm:flex-row gap-2 sm:gap-3"
        >
          <button
            onClick={() => navigate('/craft-selection')}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 md:py-4 bg-[#8b7355] hover:bg-[#7a6545] text-[#e8dcc8] font-semibold rounded-lg border-2 border-[#4a3220] transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 flex-shrink-0" />
            <span>Quay lại</span>
          </button>
          <button
            onClick={onStart}
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-[#c9936d] to-[#b8754d] hover:from-[#b8754d] hover:to-[#a6653d] text-[#1a0f08] font-bold rounded-lg border-2 border-[#8b6939] transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 text-xs sm:text-sm md:text-base"
          >
            <span>Bắt Đầu</span>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
