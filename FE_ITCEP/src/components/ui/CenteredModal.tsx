import { motion } from 'motion/react'

interface CenteredModalProps {
  title?: string
  message: string
  onClose: () => void
}

export default function CenteredModal({ title = 'Thông báo', message, onClose }: CenteredModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="relative max-w-xl w-[92%] bg-gradient-to-br from-white/90 to-white/80 rounded-3xl shadow-2xl p-6 md:p-8 text-center overflow-hidden"
      >
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
          <div className="w-6 h-6 rounded-full bg-rose-400/90 blur-sm opacity-70"></div>
          <div className="w-6 h-6 rounded-full bg-amber-400/90 blur-sm opacity-70"></div>
          <div className="w-6 h-6 rounded-full bg-sky-400/90 blur-sm opacity-70"></div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-gradient-to-r from-rose-500 to-yellow-400 p-3 shadow-lg">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.545 8.727L20 9.636L15.5 13.909L16.545 20L12 16.909L7.455 20L8.5 13.909L4 9.636L10.455 8.727L12 2Z" fill="white"/>
            </svg>
          </div>

          <h3 className="text-2xl font-extrabold text-amber-700">{title}</h3>

          <p className="text-gray-700 text-base md:text-lg max-w-xl">{message}</p>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold shadow-lg hover:brightness-105 transition"
            >
              Đóng
            </button>
          </div>
        </div>

        {/* Decorative confetti dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -left-6 top-8 w-3 h-3 bg-pink-400 rounded-full" />
          <div className="absolute right-8 top-6 w-2 h-2 bg-yellow-300 rounded-full" />
          <div className="absolute left-10 bottom-8 w-3 h-3 bg-sky-400 rounded-full" />
          <div className="absolute right-6 bottom-12 w-2 h-2 bg-violet-400 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  )
}
