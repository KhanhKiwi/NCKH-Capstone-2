import React, { useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { motion } from 'framer-motion'

export default function FinalExtractionPhase0() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Mắm Nam Ô — Công đoạn 5: Di sản Giọt Cuối — Giới thiệu'
  }, [])

  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-white py-12"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      <div className="max-w-4xl mx-auto px-6 h-full flex flex-col">
        <motion.header
          className="rounded-2xl overflow-hidden bg-white shadow-xl border border-amber-200 mb-6"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="p-10 bg-gradient-to-r from-amber-50 to-yellow-50">
            <h1 className="text-4xl font-extrabold mb-2 text-amber-900">
              🫙 Công đoạn 5: Di sản Giọt Cuối
            </h1>
            <p className="text-lg text-amber-700 font-semibold">
              Rút trích tinh hoa cuối cùng của mắm Nam Ô
            </p>
          </div>
        </motion.header>

        <motion.main
          className="flex-1 overflow-y-auto bg-white rounded-xl shadow border border-amber-100 p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.section variants={itemVariants} className="mb-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">📖 Giới thiệu</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Đây là giai đoạn cuối cùng và quan trọng nhất trong quá trình làm mắm Nam Ô. Bạn sẽ thực hiện
              <strong> 4 công đoạn phức tạp</strong> để rút trích những giọt mắm tinh hoa nhất. Mỗi công đoạn
              có các thử thách riêng, đòi hỏi sự tập trung, kỹ năng, và cảm nhạn tinh tế.
            </p>
          </motion.section>

          <motion.section variants={itemVariants} className="mb-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">⏱️ Các công đoạn</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-amber-500 pl-4 py-3 bg-amber-50 rounded">
                <h3 className="font-bold text-amber-900 mb-1">
                  1️⃣ Chuẩn Bị (15 giây)
                </h3>
                <p className="text-gray-700 text-sm">
                  Lắc chai kiểm tra độ trong, điều chỉnh mật độ bằng slider, và chọn mùi thơm đặc trưng. Đây là
                  bước chuẩn bị tâm lý và kỹ thuật.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4 py-3 bg-yellow-50 rounded">
                <h3 className="font-bold text-amber-900 mb-1">
                  2️⃣ Lọc 3 Lớp (45 giây)
                </h3>
                <p className="text-gray-700 text-sm">
                  <strong>Lớp 1:</strong> Quét lọc từ trái sang phải | <strong>Lớp 2:</strong> Nhấn nhanh 8 lần |
                  <strong> Lớp 3:</strong> Nhấn khi sóng ở đỉnh (60-80%). Mỗi perfect hit = +8% chất lượng.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4 py-3 bg-orange-50 rounded">
                <h3 className="font-bold text-amber-900 mb-1">
                  3️⃣ Pha Trộn (25 giây)
                </h3>
                <p className="text-gray-700 text-sm">
                  Kéo thả 4 loại chai vào máy pha trộn. Cân bằng hương vị sao cho mỗi thành phần ≥70% để nhận
                  bonus +10%.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4 py-3 bg-red-50 rounded">
                <h3 className="font-bold text-amber-900 mb-1">
                  4️⃣ Đánh Giá (20 giây)
                </h3>
                <p className="text-gray-700 text-sm">
                  Lắc 3 lần để cảm nhận, chọn hương vị chính là UMAMI, và đánh giá màu sắc. Hoàn thành tất cả =
                  +15% chất lượng.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="mb-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">🏆 Hệ thống xếp hạng</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="text-center p-3 bg-yellow-100 rounded-lg border border-yellow-400">
                <span className="text-2xl font-bold text-yellow-700">S+</span>
                <p className="text-xs text-gray-700 mt-1">≥95%</p>
              </div>
              <div className="text-center p-3 bg-yellow-200 rounded-lg border border-yellow-500">
                <span className="text-2xl font-bold text-yellow-800">S</span>
                <p className="text-xs text-gray-700 mt-1">≥85%</p>
              </div>
              <div className="text-center p-3 bg-red-200 rounded-lg border border-red-500">
                <span className="text-2xl font-bold text-red-700">A</span>
                <p className="text-xs text-gray-700 mt-1">≥75%</p>
              </div>
              <div className="text-center p-3 bg-purple-200 rounded-lg border border-purple-500">
                <span className="text-2xl font-bold text-purple-700">B</span>
                <p className="text-xs text-gray-700 mt-1">≥65%</p>
              </div>
              <div className="text-center p-3 bg-gray-200 rounded-lg border border-gray-500">
                <span className="text-2xl font-bold text-gray-700">C</span>
                <p className="text-xs text-gray-700 mt-1">&lt;65%</p>
              </div>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="mb-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-4">💡 Mẹo chơi</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Master's Touch:</strong> Nếu bạn đạt 3 "Perfect" liên tiếp ở Lớp 3 của Lọc, bạn sẽ
                nhận thêm bonus +20%!
              </li>
              <li>
                <strong>Combo Multiplier:</strong> Thực hiện tốt các công đoạn liên tiếp để tích lũy combo và
                nhân chất lượng.
              </li>
              <li>
                <strong>Hương vị cân bằng:</strong> Ở công đoạn Pha Trộn, hãy cố gắng giữ tất cả thành phần ở
                cùng một mức độ cao.
              </li>
              <li>
                <strong>Timing là chìa khóa:</strong> Công đoạn Lọc có các thử thách nhịp điệu — hãy luyện tập
                để nắm bắt chính xác.
              </li>
            </ul>
          </motion.section>

          <motion.section variants={itemVariants} className="flex gap-4">
            <button
              onClick={() => navigate('/game/final-extraction/play')}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              ▶️ Bắt đầu chơi
            </button>
            <Link
              to="/craft-selection?openName=M%C4%82m%20Nam%20%C3%94"
              className="flex-1 px-6 py-4 border-2 border-amber-300 text-amber-700 rounded-lg font-bold text-lg hover:bg-amber-50 transition-colors text-center"
            >
              ⬅️ Quay lại
            </Link>
          </motion.section>
        </motion.main>
      </div>
    </div>
  )
}
