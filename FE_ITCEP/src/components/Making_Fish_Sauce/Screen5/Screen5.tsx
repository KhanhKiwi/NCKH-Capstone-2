import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { levelsService } from '../../../api/levels/levelsService';
import { progressService } from '../../../api/progress/progressService';
import { getUserId } from '../../../utils/authUtils';
import { useAI } from '../../../contexts/AIContext';
import { LiquidPreview } from './components/LiquidPreview';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { Button } from '../../ui/button';
import { Toaster } from '../../ui/sonner';
import { toast } from 'sonner';
import { PhaseTimeline } from './PhaseTimeline';
import { ComboCounter } from './ComboCounter';
import { PrepPhase } from './PrepPhase';
import { FiltrationPhase } from './FiltrationPhase';
import { BlendingPhase } from './BlendingPhase';
import { EvaluationPhase } from './EvaluationPhase';

type GamePhase = 'prep' | 'filtration' | 'blend' | 'evaluation' | 'complete' | 'failed';

export default function Screen5({ challengeMode = false, onComplete }: { challengeMode?: boolean; onComplete?: () => void }) {
  const navigate = useNavigate();
  const { triggerEvent } = useAI();
  const userId = getUserId();
  const wrongActionCountRef = useRef(0);
  const completionEventRef = useRef(false);
  const failureEventRef = useRef(false);

  const triggerWrongAction = () => {
    wrongActionCountRef.current += 1;
    const fail_count = wrongActionCountRef.current;
    triggerEvent({ event: 'wrong_action', level: 5, step: 1, fail_count }).catch(() => {});
    if (fail_count >= 2) {
      triggerEvent({ event: 'fail_many', level: 5, step: 1, fail_count }).catch(() => {});
    }
  };

  const triggerFailureEvent = () => {
    if (failureEventRef.current) return;
    failureEventRef.current = true;
    const fail_count = Math.max(1, wrongActionCountRef.current);
    if (fail_count >= 2) {
      triggerEvent({ event: 'fail_many', level: 5, step: 1, fail_count }).catch(() => {});
    } else {
      triggerEvent({ event: 'wrong_action', level: 5, step: 1, fail_count }).catch(() => {});
    }
  };

  const triggerCompletionAI = (finalQuality: number) => {
    if (completionEventRef.current) return;
    completionEventRef.current = true;
    if (finalQuality >= 90) {
      triggerEvent({ event: 'excellent', level: 5, step: 1 }).catch(() => {});
    } else if (finalQuality >= 80) {
      triggerEvent({ event: 'high_score', level: 5, step: 1 }).catch(() => {});
    }
  };

  // Game state
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('prep');
  const [totalTime] = useState(125);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [quality, setQuality] = useState(55); // Start with 55% (realistic base quality)
  const [clarity, setClarity] = useState(30);
  const [comboCount, setComboCount] = useState(0);
  const [failureReason, setFailureReason] = useState<string>('');

  // Flavor profile - Realistic Nam Ô fish sauce starting values
  const [flavorProfile, setFlavorProfile] = useState({
    umami: 65,        // Strong umami base
    saltiness: 58,    // Moderately salty
    aroma: 52,        // Moderate fishy aroma
    aftertaste: 60,   // Lingering flavor
    colorQuality: 50  // Light amber color
  });

  useEffect(() => {
    if (currentPhase === 'complete' || currentPhase === 'failed') return;

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPhase]);

  const failPhase = (reason: string) => {
    setFailureReason(reason);
    setCurrentPhase('failed');
    triggerFailureEvent();
  };

  const handlePrepComplete = (qualityBonus: number) => {
    const newQuality = Math.max(0, Math.min(100, quality + qualityBonus));
    if (qualityBonus > 0) {
      setComboCount(1);
    }
    setQuality(newQuality);

    if (newQuality < 20) {
      failPhase('Chất lượng quá thấp ở bước Chuẩn Bị! (Dưới 20%)');
      return;
    }

    setCurrentPhase('filtration');
  };

  const handleFiltrationComplete = (qualityBonus: number, newClarity: number) => {
    const newQuality = Math.max(0, Math.min(100, quality + qualityBonus));
    setQuality(newQuality);
    setClarity(newClarity);

    if (newQuality < 20) {
      failPhase('Chất lượng quá thấp ở bước Lọc! (Dưới 20%)');
      return;
    }

    setFlavorProfile((prev) => ({
      umami: Math.min(prev.umami + 10, 98),
      saltiness: Math.min(prev.saltiness + 8, 95),
      aroma: Math.min(prev.aroma + 12, 98),
      aftertaste: Math.min(prev.aftertaste + 9, 96),
      colorQuality: Math.min(prev.colorQuality + 15, 98),
    }));

    setCurrentPhase('blend');
  };

  const handleBlendingComplete = (qualityBonus: number) => {
    const newQuality = Math.max(0, Math.min(100, quality + qualityBonus));
    setQuality(newQuality);

    if (newQuality < 20) {
      failPhase('Chất lượng quá thấp ở bước Pha Trộn! (Dưới 20%)');
      return;
    }

    setCurrentPhase('evaluation');
  };

  const saveProgress = async (finalQuality: number) => {
    triggerCompletionAI(finalQuality);
    try {
      if (userId) {
        const levels = await levelsService.getByVillage(2, userId);
        const level5 = levels.find((l: { level_number?: number }) => l.level_number === 5);

        if (level5) {
          await progressService.saveProgress({
            user_id: userId,
            level_id: level5.level_id,
            status: 'completed',
            score: Math.round(finalQuality),
          });

          console.log('[Screen5] Level 5 completed with quality:', finalQuality);
        }
      }
    } catch (error) {
      console.error('[Screen5] Error saving progress:', error);
    }
  };

  const handleEvaluationComplete = (qualityBonus: number) => {
    const finalQuality = Math.max(0, Math.min(100, quality + qualityBonus));
    setQuality(finalQuality);

    if (finalQuality < 75) {
      triggerWrongAction();
      failPhase(`Chất lượng cuối cùng quá thấp: ${Math.round(finalQuality)}% (Cần đạt 75% trở lên!)`);
      return;
    }

    setCurrentPhase('complete');
    void saveProgress(finalQuality);
    // In challenge mode, notify parent after a short delay
    if (challengeMode && onComplete) {
      setTimeout(() => onComplete(), 2500);
    }
  };

  const getGrade = (score: number) => {
    if (score >= 95) return { grade: 'S+', name: 'Di sản Vàng 🏆', color: 'from-yellow-600 to-amber-600' };
    if (score >= 85) return { grade: 'S', name: 'Di sản Bạc ⭐', color: 'from-blue-600 to-cyan-600' };
    if (score >= 80) return { grade: 'A', name: 'Nghệ nhân Tinh Hoa 🌟', color: 'from-amber-600 to-orange-600' };
    if (score >= 70) return { grade: 'B', name: 'Học Việc Lành Nghề 📜', color: 'from-green-600 to-emerald-600' };
    return { grade: 'F', name: 'Thất Bại', color: 'from-red-600 to-red-500' };
  };

  const gradeInfo = getGrade(quality);
  const timeRemaining = totalTime - elapsedTime;

  return (
    <>
      <Toaster position="top-center" />
      <motion.div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
        <div className="fixed inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1767825468724-d1960e18d6d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Vietnamese fishing village"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-amber-950/50 to-slate-950/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/60" />
          <motion.div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full" />
          <motion.div className="absolute top-20 left-1/3 w-64 h-64 bg-yellow-600/5 blur-3xl rounded-full" />
        </div>

        <motion.div className="relative z-10 min-h-screen w-full flex flex-col">
          <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/60 border-b border-amber-700/20 p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="text-amber-100 hover:text-amber-50 hover:bg-amber-900/20"
                >
                  ← Quay lại
                </Button>

                <div className="text-center flex-1">
                  <h1 className="text-2xl lg:text-3xl text-amber-100 tracking-wide">
                    Công đoạn 5: Di sản Giọt Cuối
                  </h1>
                </div>

                <div className="w-32 text-right">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-900/40 border border-amber-500/50 w-full justify-center">
                      <span className="text-amber-100 text-sm font-bold">{Math.round(quality)}%</span>
                    </div>
                    <motion.div
                      className="h-2.5 rounded-full bg-slate-700/50 border border-amber-500/40 overflow-hidden"
                      animate={{ boxShadow: quality > 75 ? ['0 0 10px rgba(34, 197, 94, 0.3)', '0 0 15px rgba(34, 197, 94, 0.5)'] : 'none' }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <motion.div
                        className={`h-full rounded-full transition-all ${
                          quality < 30
                            ? 'bg-gradient-to-r from-red-600 to-red-500'
                            : quality < 50
                            ? 'bg-gradient-to-r from-orange-600 to-orange-500'
                            : quality < 75
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500'
                        }`}
                        initial={{ width: '0%' }}
                        animate={{ width: `${Math.min(quality, 100)}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>

              <PhaseTimeline
                currentPhase={currentPhase}
                timeRemaining={timeRemaining}
                totalTime={totalTime}
              />
            </div>
          </header>

          <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {currentPhase === 'prep' && (
                    <motion.div
                      key="prep"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <PrepPhase onComplete={handlePrepComplete} timeLimit={15} />
                    </motion.div>
                  )}

                  {currentPhase === 'filtration' && (
                    <motion.div
                      key="filtration"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <FiltrationPhase onComplete={handleFiltrationComplete} timeLimit={45} />
                    </motion.div>
                  )}

                  {currentPhase === 'blend' && (
                    <motion.div
                      key="blend"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <BlendingPhase onComplete={handleBlendingComplete} timeLimit={25} />
                    </motion.div>
                  )}

                  {currentPhase === 'evaluation' && (
                    <motion.div
                      key="evaluation"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <EvaluationPhase onComplete={handleEvaluationComplete} timeLimit={20} />
                    </motion.div>
                  )}

                  {currentPhase === 'complete' && (
                    <motion.div
                      key="complete"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16 px-8 rounded-xl bg-gradient-to-br from-amber-900/30 to-slate-900/40 border border-amber-600/30 backdrop-blur-sm"
                    >
                      <motion.div
                        className="text-8xl mb-6"
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 3 }}
                      >
                        🏆
                      </motion.div>
                      <h2 className="text-4xl font-bold text-amber-100 mb-2">Hoàn Thành!</h2>
                      <p className={`text-2xl font-bold bg-gradient-to-r ${gradeInfo.color} bg-clip-text text-transparent mb-4`}>
                        {gradeInfo.name}
                      </p>
                      <p className="text-amber-200/60 mb-8">Chất lượng cuối cùng: {Math.round(quality)}%</p>
                      {!challengeMode && (
                        <motion.button
                          onClick={() => {
                            toast.success('🎉 Level 5 hoàn thành! Mở khóa Level 6!', {
                              description: 'Tiếp tục hành trình di sản mắm Nam Ô',
                              duration: 5000,
                            });
                            setTimeout(() => navigate('/game/eternal-fragrance'), 2000);
                          }}
                          className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 text-amber-50 rounded-lg font-bold text-lg hover:from-yellow-500 hover:to-amber-500 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Tiếp tục → Level 6: Vĩnh Cửu Hương
                        </motion.button>
                      )}
                      {challengeMode && (
                        <p className="text-amber-300/80 text-lg animate-pulse">Đang chuyển sang màn tiếp theo...</p>
                      )}
                    </motion.div>
                  )}

                  {currentPhase === 'failed' && (
                    <motion.div
                      key="failed"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16 px-8 rounded-xl bg-gradient-to-br from-red-900/30 to-slate-900/40 border border-red-600/30 backdrop-blur-sm"
                    >
                      <motion.div
                        className="text-8xl mb-6"
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ⚠️
                      </motion.div>
                      <h2 className="text-4xl font-bold text-red-200 mb-2">Thất Bại!</h2>
                      <p className="text-xl text-red-300 mb-2 font-semibold">{failureReason}</p>
                      <p className="text-red-200/60 mb-8">Chất lượng quá thấp. Hãy thử lại và cẩn thận hơn!</p>
                      <motion.div className="flex gap-4 justify-center flex-wrap">
                        <motion.button
                          onClick={() => {
                            window.location.reload();
                          }}
                          className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-bold text-lg hover:from-orange-500 hover:to-red-500 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          🔄 Chơi Lại
                        </motion.button>
                        <motion.button
                          onClick={() => navigate(-1)}
                          className="px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-lg font-bold text-lg hover:from-slate-600 hover:to-slate-500 transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ← Quay Lại
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-6">
                {comboCount > 0 && (
                  <ComboCounter comboCount={comboCount} maxCombo={5} masterTouch={false} />
                )}

                <motion.div className="rounded-xl bg-gradient-to-br from-amber-900/20 to-slate-900/40 border border-amber-600/30 backdrop-blur-sm p-4 overflow-hidden">
                  <LiquidPreview
                    color={`rgba(180, 83, 9, ${clarity / 100})`}
                    viscosity={70 + (quality / 100) * 20}
                    quality={Math.round(quality)}
                  />
                </motion.div>

                <motion.div
                  className={`rounded-xl bg-gradient-to-br ${gradeInfo.color} bg-opacity-10 border border-opacity-30 backdrop-blur-sm p-6`}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="text-center">
                    <p className="text-amber-100 text-sm font-semibold mb-2">Xếp Hạng Dự Kiến</p>
                    <p className={`text-4xl font-bold bg-gradient-to-r ${gradeInfo.color} bg-clip-text text-transparent`}>
                      {gradeInfo.grade}
                    </p>
                    <p className="text-amber-200/60 text-xs mt-2">{gradeInfo.name}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </main>
        </motion.div>
      </motion.div>
    </>
  );
}
