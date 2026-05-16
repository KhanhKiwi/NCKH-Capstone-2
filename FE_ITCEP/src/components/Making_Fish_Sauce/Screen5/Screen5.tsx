import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { levelsService } from '../../../api/levels/levelsService';
import { progressService } from '../../../api/progress/progressService';
import { getUserId } from '../../../utils/authUtils';
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

export default function Screen5({ challengeMode = false, onChallengeComplete }: { challengeMode?: boolean; onChallengeComplete?: () => void }) {
  const navigate = useNavigate();
  const userId = getUserId();

  // Game state
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('prep');
  const [totalTime] = useState(125); // 15 + 45 + 25 + 20 + 20 buffer
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

  // Timer
  useEffect(() => {
    if (currentPhase === 'complete' || currentPhase === 'failed') return;

    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPhase]);

  // Handle phase completion
  const handlePrepComplete = (qualityBonus: number) => {
    const newQuality = Math.max(0, Math.min(100, quality + qualityBonus));
    if (qualityBonus > 0) {
      setComboCount(1);
    }
    setQuality(newQuality);
    
    // Check for failure - must stay above 30% at all times
    if (newQuality < 30) {
      setFailureReason('Chất lượng quá thấp ở bước Chuẩn Bị! (Dưới 30%)');
      setCurrentPhase('failed');
      return;
    }
    
    setCurrentPhase('filtration');
  };

  const handleFiltrationComplete = (qualityBonus: number, newClarity: number) => {
    const newQuality = Math.max(0, Math.min(100, quality + qualityBonus));
    setQuality(newQuality);
    setClarity(newClarity);
    
    // Check for failure
    if (newQuality < 30) {
      setFailureReason('Chất lượng quá thấp ở bước Lọc! (Dưới 30%)');
      setCurrentPhase('failed');
      return;
    }
    
    // Update flavor profile based on clarity (more realistic improvements)
    setFlavorProfile(prev => ({
      umami: Math.min(prev.umami + 8, 95),
      saltiness: Math.min(prev.saltiness + 6, 92),
      aroma: Math.min(prev.aroma + 10, 93),
      aftertaste: Math.min(prev.aftertaste + 7, 90),
      colorQuality: Math.min(prev.colorQuality + 12, 95)
    }));

    setCurrentPhase('blend');
  };

  const handleBlendingComplete = (qualityBonus: number) => {
    const newQuality = Math.max(0, Math.min(100, quality + qualityBonus));
    setQuality(newQuality);
    
    // Check for failure
    if (newQuality < 30) {
      setFailureReason('Chất lượng quá thấp ở bước Pha Trộn! (Dưới 30%)');
      setCurrentPhase('failed');
      return;
    }
    
    setCurrentPhase('evaluation');
  };

  const handleEvaluationComplete = (qualityBonus: number) => {
    const finalQuality = Math.max(0, Math.min(100, quality + qualityBonus));
    setQuality(finalQuality);
    
    // Check for FINAL PASS threshold: must reach 75% (achievable goal)
    if (finalQuality < 75) {
      setFailureReason(`Chất lượng cuối cùng quá thấp: ${Math.round(finalQuality)}% (Cần đạt 75% trở lên!)`);
      setCurrentPhase('failed');
      return;
    }
    
    setCurrentPhase('complete');

    // Save progress
    saveProgress(finalQuality);
  };

  const saveProgress = async (finalQuality: number) => {
    try {
      if (userId) {
        const levels = await levelsService.getByVillage(2, userId);
        const level5 = levels.find((l: any) => l.level_number === 5);

        if (level5) {
          await progressService.saveProgress({
            user_id: userId,
            level_id: level5.level_id,
            status: 'completed',
            score: Math.round(finalQuality)
          });

          console.log('[Screen5] Level 5 completed with quality:', finalQuality);
        }
      }
    } catch (error) {
      console.error('[Screen5] Error saving progress:', error);
    }
  };

  const getGrade = (score: number) => {
    if (score >= 92) return { grade: 'S+', name: 'Di sản Vàng 🏆', color: 'from-yellow-600 to-amber-600' };
    if (score >= 85) return { grade: 'S', name: 'Di sản Bạc ⭐', color: 'from-blue-600 to-cyan-600' };
    if (score >= 75) return { grade: 'A', name: 'Nghệ nhân Tinh Hoa 🎖️', color: 'from-amber-600 to-orange-600' };
    if (score >= 65) return { grade: 'B', name: 'Học Việc Lành Nghề 📜', color: 'from-green-600 to-emerald-600' };
    return { grade: 'C', name: 'Cần Cố Gắng Hơn', color: 'from-red-600 to-red-500' };
  };

  const gradeInfo = getGrade(quality);
  const timeRemaining = totalTime - elapsedTime;

  return (
    <>
      <Toaster position="top-center" />
      <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1767825468724-d1960e18d6d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Vietnamese fishing village"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-amber-950/50 to-slate-950/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/60" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full" />
          <div className="absolute top-20 left-1/3 w-64 h-64 bg-yellow-600/5 blur-3xl rounded-full" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen w-full flex flex-col">
          {/* Header */}
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

              {/* Timeline */}
              <PhaseTimeline
                currentPhase={currentPhase}
                timeRemaining={timeRemaining}
                totalTime={totalTime}
              />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Game Area - Left/Center */}
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
                      <motion.button
                        onClick={() => {
                          if (!challengeMode) {
                            toast.success('🎉 Level 5 hoàn thành! Mở khóa Level 6!', {
                              description: 'Tiếp tục hành trình di sản mắm Nam Ô',
                              duration: 5000
                            });
                          }
                          setTimeout(() => {
                            if (challengeMode && onChallengeComplete) {
                              onChallengeComplete();
                            } else {
                              navigate('/game/eternal-fragrance');
                            }
                          }, 2000);
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 text-amber-50 rounded-lg font-bold text-lg hover:from-yellow-500 hover:to-amber-500 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Tiếp tục → Level 6: Vĩnh Cửu Hương
                      </motion.button>
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
                      <div className="flex gap-4 justify-center flex-wrap">
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
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Sidebar - Charts */}
              <div className="space-y-6">
                {/* Combo Counter */}
                {comboCount > 0 && (
                  <ComboCounter
                    comboCount={comboCount}
                    maxCombo={5}
                    masterTouch={false}
                  />
                )}

                {/* Liquid Preview */}
                <div className="rounded-xl bg-gradient-to-br from-amber-900/20 to-slate-900/40 border border-amber-600/30 backdrop-blur-sm p-4 overflow-hidden">
                  <LiquidPreview
                    color={`rgba(180, 83, 9, ${clarity / 100})`}
                    viscosity={70 + (quality / 100) * 20}
                    quality={Math.round(quality)}
                  />
                </div>

                {/* Grade Info - Predicted Ranking */}
                <motion.div
                  className={`rounded-xl bg-gradient-to-br ${gradeInfo.color} bg-opacity-20 border-2 border-opacity-60 backdrop-blur-sm p-8 shadow-lg`}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="text-center space-y-4">
                    <p className="text-amber-100 text-base font-bold uppercase tracking-wider">🏆 Xếp Hạng Dự Kiến</p>
                    <div className={`bg-gradient-to-r ${gradeInfo.color} rounded-lg p-4 border border-opacity-70 shadow-md`}>
                      <p className={`text-6xl font-black drop-shadow-lg`} style={{color: '#FCD34D'}}>
                        {gradeInfo.grade}
                      </p>
                    </div>
                    <p className="text-amber-50 text-sm font-semibold">{gradeInfo.name}</p>
                    <p className="text-amber-200/80 text-xs">Chất lượng: {Math.round(quality)}%</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
