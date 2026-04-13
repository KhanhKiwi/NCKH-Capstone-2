import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface HeartsProps {
  hearts: number;
  maxHearts: number;
}

export function Hearts({ hearts, maxHearts }: HeartsProps) {
  return (
    <motion.div
      className="fixed top-24 left-8 z-30 flex gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      {Array.from({ length: maxHearts }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: i < hearts ? 1 : 0.6,
            rotate: 0,
          }}
          transition={{
            delay: i * 0.1,
            type: 'spring',
            stiffness: 200,
          }}
        >
          <Heart
            className={`w-8 h-8 transition-all ${
              i < hearts
                ? 'text-red-500 fill-red-500'
                : 'text-gray-300 fill-gray-300'
            }`}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
