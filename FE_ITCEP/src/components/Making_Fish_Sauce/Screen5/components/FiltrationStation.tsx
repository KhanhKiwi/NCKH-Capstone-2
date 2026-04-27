import { motion } from 'motion/react';
import { Droplets, Filter } from 'lucide-react';

interface FiltrationStationProps {
  filteringStage: number;
  clarity: number;
  onStageChange: (stage: number) => void;
}

export function FiltrationStation({ filteringStage, clarity, onStageChange }: FiltrationStationProps) {
  const stages = [
    { name: 'Vải tre thô', icon: '🎋', color: 'from-amber-800 to-amber-700' },
    { name: 'Than & trấu', icon: '⚫', color: 'from-amber-700 to-amber-600' },
    { name: 'Lụa mịn', icon: '✨', color: 'from-amber-600 to-amber-500' },
    { name: 'Pha blend', icon: '💧', color: 'from-amber-500 to-yellow-600' },
  ];

  return (
    <div className="relative bg-gradient-to-br from-slate-900/60 via-amber-950/40 to-slate-900/60 backdrop-blur-md rounded-3xl border border-amber-600/20 p-8 shadow-2xl">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-2xl text-amber-100 tracking-wide mb-2">Bàn thờ lọc thanh</h2>
        <p className="text-amber-200/60 text-sm">Nghệ thuật chiết xuất tinh hoa</p>
      </div>

      {/* Filtration Layers */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stages.map((stage, index) => (
          <motion.button
            key={index}
            onClick={() => onStageChange(index)}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              filteringStage >= index
                ? 'border-amber-400 bg-gradient-to-br ' + stage.color
                : 'border-amber-800/30 bg-slate-900/40'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-3xl mb-2">{stage.icon}</div>
            <div className="text-amber-100 text-xs text-center">{stage.name}</div>
            {filteringStage >= index && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-amber-400/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Liquid Flow Visualization */}
      <div className="relative h-64 bg-gradient-to-b from-amber-950/20 to-slate-900/40 rounded-2xl border border-amber-700/30 overflow-hidden">
        {/* Glass Vessels */}
        <div className="absolute inset-0 flex items-end justify-center gap-4 p-6">
          {[0, 1, 2, 3].map((vessel) => (
            <div key={vessel} className="relative flex-1 h-full flex flex-col justify-end">
              {/* Vessel Container */}
              <div className="relative w-full h-4/5 bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-lg border-2 border-amber-700/30 overflow-hidden backdrop-blur-sm">
                {/* Liquid Level */}
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${stages[vessel].color}`}
                  initial={{ height: 0 }}
                  animate={{
                    height: filteringStage > vessel ? `${60 + clarity / 2}%` : '0%',
                  }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                  {/* Liquid Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      y: [-10, 10, -10],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  {/* Droplets */}
                  {filteringStage > vessel && (
                    <motion.div
                      className="absolute top-2 left-1/2 -translate-x-1/2"
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Droplets className="w-4 h-4 text-amber-200/40" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
              {/* Label */}
              <div className="text-xs text-amber-200/60 text-center mt-2">Lọc {vessel + 1}</div>
            </div>
          ))}
        </div>

        {/* Flow Lines */}
        {filteringStage > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {[0, 1, 2].map((i) => (
              <motion.path
                key={`flow-line-${i}`}
                d={`M ${20 + i * 25}% 30 Q ${25 + i * 25}% 40 ${30 + i * 25}% 50`}
                stroke="#fbbf24"
                strokeWidth="2"
                fill="none"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: filteringStage > i ? 1 : 0 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            ))}
          </svg>
        )}
      </div>

      {/* Clarity Indicator */}
      <div className="mt-6 flex items-center gap-4">
        <Filter className="w-5 h-5 text-amber-400" />
        <div className="flex-1">
          <div className="flex justify-between text-xs text-amber-200/70 mb-1">
            <span>Độ trong</span>
            <span>{clarity}%</span>
          </div>
          <div className="h-2 bg-slate-900/60 rounded-full overflow-hidden border border-amber-700/30">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-600 to-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: `${clarity}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
