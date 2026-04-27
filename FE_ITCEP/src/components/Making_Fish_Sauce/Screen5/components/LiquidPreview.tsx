import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface LiquidPreviewProps {
  color: string;
  viscosity: number;
  quality: number;
}

export function LiquidPreview({ color, viscosity, quality }: LiquidPreviewProps) {
  return (
    <div className="relative bg-gradient-to-br from-slate-900/60 to-amber-950/40 rounded-2xl border border-amber-600/20 p-6 backdrop-blur-sm">
      <h3 className="text-amber-100/90 text-center mb-4 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4" />
        <span>Mẫu thử tinh hoa</span>
      </h3>

      {/* Glass Container */}
      <div className="relative mx-auto w-32 h-40 bg-gradient-to-br from-slate-200/10 to-slate-300/5 rounded-lg border-4 border-slate-400/20 overflow-hidden backdrop-blur-xl shadow-2xl">
        {/* Glass Reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

        {/* Liquid */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 rounded-b-md"
          style={{
            background: `linear-gradient(to top, ${color}, ${color}dd)`,
          }}
          initial={{ height: 0 }}
          animate={{ height: '85%' }}
          transition={{ duration: 2, ease: 'easeOut' }}
        >
          {/* Liquid Surface Shimmer */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/30 to-transparent"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Bubbles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/40 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                bottom: '10%',
              }}
              animate={{
                y: [-100, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Viscosity Indicator (slow drips) */}
          <motion.div
            className="absolute top-0 right-4 w-1 h-8 bg-gradient-to-b from-white/20 to-transparent rounded-full"
            animate={{
              height: [0, viscosity / 2, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: viscosity / 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Glass Shine */}
        <div className="absolute top-4 left-4 w-12 h-16 bg-white/10 rounded-full blur-xl pointer-events-none" />
      </div>

      {/* Quality Metrics */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-amber-200/70">Độ nhớt</span>
          <span className="text-amber-100">{viscosity}%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-amber-200/70">Chất lượng</span>
          <span className="text-amber-100 flex items-center gap-1">
            {quality}%
            {quality > 90 && <Sparkles className="w-3 h-3 text-yellow-400" />}
          </span>
        </div>
      </div>

      {/* Quality Badge */}
      {quality > 90 && (
        <motion.div
          className="mt-4 px-4 py-2 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-lg text-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 2 }}
        >
          <p className="text-amber-50 text-xs">🏆 Tinh hoa cao cấp</p>
        </motion.div>
      )}
    </div>
  );
}
