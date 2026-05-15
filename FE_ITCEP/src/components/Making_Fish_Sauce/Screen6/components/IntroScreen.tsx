import { motion } from 'motion/react';

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-neutral-950 relative overflow-hidden p-4">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-amber-900/20 via-transparent to-transparent"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-2xl text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-6xl md:text-7xl font-serif text-amber-100 mb-4">
            Vĩnh Cửu Hương
          </h1>
          <p className="text-amber-300/70 text-xl">
            Nghi Thức Niêm Phong Di Sản Bất Diệt
          </p>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        />

        {/* Description */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-amber-200/80 text-lg leading-relaxed">
            Đây là bài kiểm tra cuối cùng để trở thành một <span className="font-bold text-amber-100">Nghệ Nhân Mắm Nam Ô</span>
          </p>
          <p className="text-amber-300/70">
            Cần khả năng <span className="text-amber-300">ghi nhớ</span>, <span className="text-amber-300">phản xạ nhanh</span>, và <span className="text-amber-300">tập trung cao độ</span>
          </p>
        </motion.div>

        {/* Key Info */}
        <motion.div
          className="grid grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-amber-900/30 backdrop-blur-sm rounded-lg border border-amber-700/50 p-4">
            <div className="text-amber-400 text-sm mb-2">⏱️ THỜI GIAN</div>
            <div className="text-2xl text-amber-200 font-serif">57s</div>
            <div className="text-amber-300/70 text-xs mt-1">Nhịp Thở + Chơi</div>
          </div>

          <div className="bg-amber-900/30 backdrop-blur-sm rounded-lg border border-amber-700/50 p-4">
            <div className="text-amber-400 text-sm mb-2">⌨️ ĐIỀU KHIỂN</div>
            <div className="text-2xl text-amber-200 font-serif">Arrow</div>
            <div className="text-amber-300/70 text-xs mt-1">4 Phím</div>
          </div>

          <div className="bg-amber-900/30 backdrop-blur-sm rounded-lg border border-amber-700/50 p-4">
            <div className="text-amber-400 text-sm mb-2">🎯 ĐIỀU KIỆN</div>
            <div className="text-2xl text-amber-200 font-serif">300+</div>
            <div className="text-amber-300/70 text-xs mt-1">Điểm Để Thắng</div>
          </div>
        </motion.div>

        {/* Warning */}
        <motion.div
          className="bg-amber-900/20 backdrop-blur-sm rounded-xl border border-amber-700/50 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-amber-300 font-semibold mb-2">⚠️ LƯU Ý</div>
          <p className="text-amber-200/70 text-sm">
            Bạn có <span className="text-red-400 font-bold">3 lần sai</span> để thử lại. Sau đó sẽ kết thúc trò chơi.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col gap-4 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={onStart}
            className="px-12 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-lg font-bold text-lg transition-all shadow-2xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 Bắt Đầu Ngay
          </motion.button>

          <p className="text-amber-300/60 text-sm">
            👉 Hãy đảm bảo bạn đang ở một nơi yên tĩnh & tập trung cao độ
          </p>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-10 left-10 text-6xl opacity-20"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        ⚱️
      </motion.div>

      <motion.div
        className="absolute top-20 right-10 text-6xl opacity-20"
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        🎋
      </motion.div>
    </div>
  );
}
