import { motion } from 'motion/react';

interface PhaseTimelineProps {
  currentPhase: 'prep' | 'filtration' | 'blend' | 'evaluation' | 'complete';
  timeRemaining: number;
  totalTime: number;
}

export function PhaseTimeline({ currentPhase, timeRemaining, totalTime }: PhaseTimelineProps) {
  const phases = [
    { key: 'prep', label: 'Chuẩn Bị', duration: 15 },
    { key: 'filtration', label: 'Lọc 3 Lớp', duration: 45 },
    { key: 'blend', label: 'Pha Trộn', duration: 25 },
    { key: 'evaluation', label: 'Đánh Giá', duration: 20 }
  ];

  const getPhaseProgress = (phaseKey: string) => {
    if (phaseKey === currentPhase) {
      return { status: 'active', progress: 0 };
    }
    const phaseOrder = ['prep', 'filtration', 'blend', 'evaluation'];
    const currentIndex = phaseOrder.indexOf(currentPhase);
    const phaseIndex = phaseOrder.indexOf(phaseKey);
    
    if (phaseIndex < currentIndex) {
      return { status: 'completed', progress: 100 };
    }
    return { status: 'pending', progress: 0 };
  };

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-900 to-amber-900/30 rounded-lg p-4 border border-amber-700/30 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">⏱️</div>
        <div className="flex-1">
          <div className="text-amber-100 font-semibold text-lg">
            Thời gian còn lại: <span className="text-amber-400">{Math.floor(timeRemaining)}s</span>
          </div>
          <div className="text-amber-200/60 text-sm">Tổng thời gian: {totalTime}s</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex items-center gap-2">
        {phases.map((phase, idx) => {
          const phaseProgress = getPhaseProgress(phase.key);
          return (
            <div key={phase.key} className="flex items-center flex-1">
              <motion.div
                className={`relative flex-1 h-8 rounded-lg border-2 overflow-hidden ${
                  phaseProgress.status === 'active'
                    ? 'border-amber-400 bg-gradient-to-r from-amber-600/20 to-yellow-600/20'
                    : phaseProgress.status === 'completed'
                    ? 'border-green-500/60 bg-green-500/10'
                    : 'border-slate-600/40 bg-slate-700/20'
                }`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {phaseProgress.status === 'active' && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"
                    animate={{ x: [-100, 100] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                
                <div className="relative h-full flex items-center justify-center text-center px-2">
                  <div className="text-xs font-semibold">
                    {phaseProgress.status === 'completed' ? (
                      <span className="text-green-400">✓</span>
                    ) : (
                      <span className={phaseProgress.status === 'active' ? 'text-amber-400' : 'text-slate-400'}>
                        {phase.label}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

              {idx < phases.length - 1 && (
                <div className={`w-2 h-2 rounded-full mx-1 ${
                  phaseProgress.status === 'completed' ? 'bg-green-500' : 'bg-slate-600/40'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
