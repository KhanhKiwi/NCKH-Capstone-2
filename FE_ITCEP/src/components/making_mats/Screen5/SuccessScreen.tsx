import { motion } from 'motion/react';
import { Award } from 'lucide-react';

export default function SuccessScreen() {
  const Confetti = () => {
    const confetti = Array.from({ length: 40 }, (_, i) => i);
    
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {confetti.map(i => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: ['#E8A520', '#C9A66B', '#A8C9A0', '#E8D5A8'][i % 4],
              left: `${Math.random() * 100}%`,
              top: '-10px',
            }}
            animate={{
              y: window.innerHeight + 20,
              x: (Math.random() - 0.5) * 100,
              opacity: [1, 1, 0],
              rotate: Math.random() * 360,
            }}
            transition={{
              duration: 2 + Math.random() * 1,
              delay: (i % 10) * 0.05,
              ease: 'easeIn',
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <Confetti />

      <div className="relative z-10 text-center max-w-3xl px-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="mb-12"
        >
          <Award className="w-32 h-32 mx-auto mb-6 text-amber-600" />
        </motion.div>

        <h2 className="text-5xl font-bold text-amber-800 mb-4">Tuyệt vời!</h2>
        <p className="text-xl text-amber-700">Bạn đã hoàn thành chiếu</p>
      </div>
    </div>
  );
}
