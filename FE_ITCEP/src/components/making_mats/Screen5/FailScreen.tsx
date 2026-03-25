import { motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';

export default function FailScreen() {
  return (
    <div className="w-screen h-screen overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      <div className="relative z-10 text-center max-w-3xl px-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="mb-12"
        >
          <AlertCircle className="w-32 h-32 mx-auto mb-6 text-red-500" />
        </motion.div>

        <h2 className="text-5xl font-bold text-red-700 mb-4">Bỏ lỡ!</h2>
        <p className="text-xl text-red-600">Chiếu chưa xong, thử lại nhé!</p>
      </div>
    </div>
  );
}
