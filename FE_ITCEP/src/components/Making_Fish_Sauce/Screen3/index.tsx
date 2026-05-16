import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GameHeader } from './components/GameHeader';
import { SaltRatioSlider } from './components/SaltRatioSlider';
import { ActionButtons } from './components/ActionButtons';
import { GameCanvas } from './components/GameCanvas';
import { DataVisualization } from './components/DataVisualization';
import { FeedbackToast } from './components/FeedbackToast';

import { SaltParticles } from './components/SaltParticles';
import { MixingTimingGame } from './components/MixingTimingGame';
import { PressureGauge } from './components/PressureGauge';
import { SealingDragGame } from './components/SealingDragGame';
import { WinScreen } from './components/WinScreen';
import { LossScreen } from './components/LossScreen';
import { getUserId } from '../../../utils/authUtils';
import { useAI } from '../../../contexts/AIContext';

export default function Screen3({ challengeMode = false, onChallengeComplete }: { challengeMode?: boolean; onChallengeComplete?: () => void }) {
  const navigate = useNavigate();
  const { triggerEvent } = useAI();
  const [userId, setUserId] = useState<number | null>(null);
  
  // Get user ID from authUtils on mount
  useEffect(() => {
    const id = getUserId();
    setUserId(id);
    console.log('[Screen3] User ID loaded:', id);
  }, []);

  // Main state
  const [quality, setQuality] = useState(60);
  const [saltRatio, setSaltRatio] = useState(2.0);
  const [mixingEvenness, setMixingEvenness] = useState(0);
  const [currentStep, setCurrentStep] = useState<'adding' | 'mixing' | 'transferring' | 'pressing' | 'sealing'>('adding');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [heatmapData, setHeatmapData] = useState<number[]>(Array(9).fill(0));
  const [targetSaltRatio, setTargetSaltRatio] = useState<number | null>(null);
  const [timingMixCount, setTimingMixCount] = useState(0);
  
  // Timer & Game Status
  const [timeRemaining, setTimeRemaining] = useState(90); // 1.5 minutes
  const [gameStatus, setGameStatus] = useState<'playing' | 'completed' | 'failed'>('playing');
  const [lossReason, setLossReason] = useState<'timeout' | 'low-quality' | null>(null);
  const [saltApplied, setSaltApplied] = useState(false);
  
  // Difficulty & Challenge System
  const [mixClickCount, setMixClickCount] = useState(0);
  const [requiredMixes] = useState(5 + Math.floor(Math.random() * 3)); // 5-7 clicks needed
  const [lastMixTime, setLastMixTime] = useState<number | null>(null);
  const [_activeChallenge, _setActiveChallenge] = useState<string | null>(null);
  const [_buttonPressed, _setButtonPressed] = useState<string | null>(null);

  const qualityDegradationRef = useRef(0);
  const wrongActionCountRef = useRef(0);
  const completionEventRef = useRef(false);
  const failureEventRef = useRef(false);
  const [showSaltParticles, setShowSaltParticles] = useState(false);

  const getAIStep = () => {
    const stepMap = {
      adding: 1,
      mixing: 2,
      transferring: 3,
      pressing: 4,
      sealing: 5,
    } as const;
    return stepMap[currentStep];
  };

  const triggerWrongAction = (step = getAIStep()) => {
    wrongActionCountRef.current += 1;
    const failCount = wrongActionCountRef.current;
    triggerEvent({ event: 'wrong_action', level: 3, step, fail_count: failCount }).catch(() => {});
    if (failCount >= 3) {
      triggerEvent({ event: 'fail_many', level: 3, step, fail_count: failCount }).catch(() => {});
    }
  };


  // ========== INITIALIZE TARGET SALT RATIO ==========
  useEffect(() => {
    // Random target between 3.0 and 4.0
    const target = 3.0 + Math.random() * 1.0;
    setTargetSaltRatio(Math.round(target * 10) / 10);
  }, []);

  // ========== TIMER & QUALITY DEGRADATION ==========
  useEffect(() => {
    if (gameStatus !== 'playing' || timeRemaining <= 0) {
      if (timeRemaining <= 0 && gameStatus === 'playing') {
        setGameStatus('failed');
        setLossReason('timeout');
        setFeedback('⏰ Hết thời gian! Công đoạn ướp cá không hoàn tất.');
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setGameStatus('failed');
          setLossReason('timeout');
          setFeedback('⏰ Hết thời gian! Công đoạn ướp cá không hoàn tất.');
        }
        return Math.max(0, newTime);
      });
      
      // Quality degradation if not progressing
      qualityDegradationRef.current += 0.05;
      if (qualityDegradationRef.current > 1) {
        setQuality(prev => {
          const newQuality = Math.max(0, prev - 0.5);
          // Check if quality drops below 30% (game over)
          if (newQuality < 30 && gameStatus === 'playing') {
            setGameStatus('failed');
            setLossReason('low-quality');
            setFeedback('😢 Chất lượng quá thấp! Công đoạn không thể tiếp tục.');
          }
          return newQuality;
        });
        qualityDegradationRef.current = 0;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStatus]);

  // ========== RANDOM CHALLENGES ==========
  useEffect(() => {
    if (gameStatus !== 'playing' || currentStep === 'adding') return;
    
    const challengeInterval = setInterval(() => {
      const challenges = [
        'Muối đang lắng chuồng - cần trộn lại!',
        'Hỗn hợp dính quá - tăng tốc độ!',
        'Nhiệt độ giảm - tăng lực ấn!'
      ];
      
      if (Math.random() < 0.3) {
        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        _setActiveChallenge(randomChallenge);
        setFeedback(`⚠️ ${randomChallenge}`);
        setQuality(prev => Math.max(0, prev - 2));
        
        setTimeout(() => _setActiveChallenge(null), 3000);
      }
    }, 8000);
    
    return () => clearInterval(challengeInterval);
  }, [gameStatus, currentStep]);

  // ========== AUTO-HIDE FEEDBACK TOAST ==========
  useEffect(() => {
    if (!feedback) return;
    
    const timeout = setTimeout(() => {
      setFeedback(null);
    }, 3500);
    
    return () => clearTimeout(timeout);
  }, [feedback]);

  useEffect(() => {
    if (gameStatus === 'completed' && !completionEventRef.current) {
      completionEventRef.current = true;
      const event = quality >= 90 ? 'excellent' : 'win_fast';
      triggerEvent({ event, level: 3, step: getAIStep() }).catch(() => {});
    }

    if (gameStatus === 'failed' && !failureEventRef.current) {
      failureEventRef.current = true;
      triggerEvent({
        event: 'fail_many',
        level: 3,
        step: getAIStep(),
        fail_count: Math.max(wrongActionCountRef.current, 1),
      }).catch(() => {});
    }
  }, [gameStatus, quality, triggerEvent]);

  // ========== HANDLERS ==========
  const handleAddSalt = () => {
    if (gameStatus !== 'playing' || currentStep !== 'adding' || saltApplied) return;

    let qualityChange = 0;
    let feedbackMsg = '';

    // NEW LOGIC: Check against random target with ±0.1 margin
    if (targetSaltRatio !== null) {
      const minAcceptable = targetSaltRatio - 0.1;
      const maxAcceptable = targetSaltRatio + 0.1;
      
      if (saltRatio >= minAcceptable && saltRatio <= maxAcceptable) {
        // CORRECT! Bonus points
        feedbackMsg = `✨ Tỉ lệ muối hoàn hảo! ${saltRatio.toFixed(1)} = ${targetSaltRatio.toFixed(1)} +10% Bonus!`;
        qualityChange = 10;
      } else {
        // WRONG! Heavy penalty
        feedbackMsg = `😭 Sai tỉ lệ muối! Cần ${targetSaltRatio.toFixed(1)}, bạn cho ${saltRatio.toFixed(1)} -20%`;
        qualityChange = -20;
        triggerWrongAction(1);
      }
    } else {
      // Fallback (shouldn't happen)
      feedbackMsg = '✓ Tỉ lệ muối chấp nhận được! +5%';
      qualityChange = 5;
    }

    setSaltApplied(true);
    setShowSaltParticles(true);
    _setButtonPressed('salt');
    setQuality(prev => Math.max(0, Math.min(100, prev + qualityChange)));
    setFeedback(feedbackMsg);
    qualityDegradationRef.current = 0;
    
    // Auto-advance to mixing after 1.5 seconds
    setTimeout(() => {
      setShowSaltParticles(false);
      setCurrentStep('mixing');
      setMixClickCount(0);
      setFeedback(`🅰️ Bước tiếp theo: Trộn muối đều! Cần ${requiredMixes} lần (còn ${requiredMixes} lần)`);
    }, 1500);
  };

  const handleMix = () => {
    if (gameStatus !== 'playing' || currentStep !== 'mixing') return;

    const newClickCount = mixClickCount + 1;
    setMixClickCount(newClickCount);
    _setButtonPressed('mix');
    
    // HARDER LOGIC: Randomized mixing effectiveness + timing penalties
    const currentTime = Date.now();
    let timePenalty = 0;
    
    if (lastMixTime !== null) {
      const timeDiff = currentTime - lastMixTime;
      if (timeDiff < 500) {
        timePenalty = -3; // Too fast
        setFeedback('⚠️ Trộn quá nhanh! Chất hơi gãy rách -3%');
      } else if (timeDiff > 3000) {
        timePenalty = -2; // Too slow
        setFeedback('⚠️ Trộn quá chậm! Muối lắng chuồng -2%');
      }
    }
    
    setLastMixTime(currentTime);
    
    // Random effectiveness per click (0.8-1.2x)
    const randomEffectiveness = 0.8 + Math.random() * 0.4;
    const baseProgress = 100 / requiredMixes * randomEffectiveness;
    const newEvenness = Math.min(100, mixingEvenness + baseProgress);
    setMixingEvenness(newEvenness);

    // Update heatmap for visualization
    const newHeatmap = heatmapData.map(() => Math.random() * (newEvenness / 100));
    setHeatmapData(newHeatmap);

    let feedbackMsg = '';
    let qualityChange = 2;

    if (newEvenness < 50) {
      feedbackMsg = `Trộn lần ${newClickCount}/${requiredMixes}... Còn ${Math.ceil(requiredMixes - newClickCount)} lần nữa! ${timePenalty !== 0 ? `${timePenalty}%` : ''}`;
      qualityChange = 1 + timePenalty;
    } else if (newEvenness < 80) {
      feedbackMsg = `Trộn lần ${newClickCount}/${requiredMixes}... Gần xong! Cần ${Math.ceil(requiredMixes - newClickCount)} lần ${timePenalty !== 0 ? `(${timePenalty}%)` : ''}`;
      qualityChange = 2 + timePenalty;
    } else if (newEvenness >= 95) {
      feedbackMsg = '🌟 Trộn đều hoàn hảo! Muối phân bố đồng đều! Chuyển sang thương +15%';
      qualityChange = 15 + timePenalty;
      
      // Auto-advance to transferring
      setTimeout(() => {
        setCurrentStep('transferring');
        setFeedback('Bước tiếp theo: Chuyển vào thùng chum!');
        setLastMixTime(null);
        qualityDegradationRef.current = 0;
      }, 1500);
    } else {
      feedbackMsg = `Trộn lần ${newClickCount}/${requiredMixes}... Độ đều ${Math.round(newEvenness)}%! ${timePenalty !== 0 ? `${timePenalty}%` : ''}`;
      qualityChange = 2 + timePenalty;
    }

    setQuality(prev => Math.max(0, Math.min(100, prev + qualityChange)));
    setFeedback(feedbackMsg);
  };

  // NEW: Spacebar timing game for mixing
  const handleTimingResult = (success: boolean) => {
    if (gameStatus !== 'playing' || currentStep !== 'mixing') return;

    const newCount = timingMixCount + 1;
    setTimingMixCount(newCount);

    // Calculate progress
    const progressPerHit = 100 / requiredMixes;
    const newEvenness = Math.min(100, mixingEvenness + progressPerHit);
    setMixingEvenness(newEvenness);

    // Update heatmap
    const newHeatmap = heatmapData.map(() => Math.random() * (newEvenness / 100));
    setHeatmapData(newHeatmap);

    let qualityChange = 0;
    let feedbackMsg = '';

    if (success) {
      // Correct timing: +5%
      qualityChange = 5;
      feedbackMsg = `✓ Lần ${newCount}/${requiredMixes}... Trúng! Độ đều ${Math.round(newEvenness)}% +5%`;
    } else {
      // Missed timing: -6%
      qualityChange = -6;
      triggerWrongAction(2);
      feedbackMsg = `✗ Lần ${newCount}/${requiredMixes}... Sai! Độ đều ${Math.round(newEvenness)}% -6%`;
    }

    const newQuality = Math.max(0, Math.min(100, quality + qualityChange));
    setQuality(newQuality);
    
    // Check if quality drops below 30%
    if (newQuality < 30) {
      setGameStatus('failed');
      setLossReason('low-quality');
      setFeedback('😢 Chất lượng quá thấp! Công đoạn không thể tiếp tục.');
      return;
    }
    
    setFeedback(feedbackMsg);

    // Check if mixing is complete (reached target evenness or max attempts)
    if (newEvenness >= 95 || newCount >= requiredMixes) {
      setTimeout(() => {
        setCurrentStep('transferring');
        setFeedback('✨ Trộn đều hoàn hảo! Bước tiếp theo: Chuyển vào thùng chum!');
        setTimingMixCount(0);
        qualityDegradationRef.current = 0;
      }, 1500);
    }
  };

  const handleTransfer = () => {
    if (gameStatus !== 'playing' || currentStep !== 'transferring') return;
    
    _setButtonPressed('transfer');
    // Random quality check during transfer
    if (Math.random() < 0.3) {
      setFeedback('⚠️ Chuyển không đều - một số muối rơi! -5%');
      setQuality(prev => Math.max(0, prev - 5));
      triggerWrongAction(3);
    } else {
      setFeedback('✓ Chuyển hợn hợp vào thùng chum! +5%');
      setQuality(prev => Math.min(100, prev + 5));
    }
    qualityDegradationRef.current = 0;

    setTimeout(() => {
      setCurrentStep('pressing');
      setFeedback('Bước tiế theo: Nén chặt hẻn hợp!');
    }, 1500);
  };

  // NEW: Pressure gauge for pressing
  const handlePressureResult = (success: boolean) => {
    if (gameStatus !== 'playing' || currentStep !== 'pressing') return;

    let qualityChange = 0;
    let feedbackMsg = '';

    if (success) {
      // Perfect pressure: +8%
      qualityChange = 8;
      feedbackMsg = '✓ Nén chặt hoàn hảo! Môi trường kỵ khí tốt +8%';
    } else {
      // Bad pressure: -5%
      qualityChange = -5;
      triggerWrongAction(4);
      feedbackMsg = '⚠️ Nén chặt không đúng lực! -5%';
    }

    setQuality(prev => Math.max(0, Math.min(100, prev + qualityChange)));
    setFeedback(feedbackMsg);
    qualityDegradationRef.current = 0;

    // Auto-advance to sealing after result
    setTimeout(() => {
      setCurrentStep('sealing');
      setFeedback('Bước cuối: Phủ & Đậy năp!');
    }, 1500);
  };

  const handlePress = () => {
    if (gameStatus !== 'playing' || currentStep !== 'pressing') return;
    
    _setButtonPressed('press');
    // Random quality check during pressing
    if (Math.random() < 0.25) {
      setFeedback('⚠️ Nén không đều - một số về không phẳng! -3%');
      setQuality(prev => Math.max(0, prev - 3));
      triggerWrongAction(4);
    } else {
      setFeedback('✓ Nén chặt mọ trường kị khí! +8%');
      setQuality(prev => Math.min(100, prev + 8));
    }
    qualityDegradationRef.current = 0;

    setTimeout(() => {
      setCurrentStep('sealing');
      setFeedback('Bước cuối: Phủ & Đậy năp!');
    }, 1500);
  };

  // NEW: Sealing drag game handler
  const handleSealingResult = (success: boolean) => {
    if (gameStatus !== 'playing' || currentStep !== 'sealing') return;

    let qualityChange = 0;
    let feedbackMsg = '';

    if (success) {
      // Perfect sealing: +8%
      qualityChange = 8;
      feedbackMsg = '✓ Phủ muối hoàn hảo! Đậy nắp kín! +8%';
    } else {
      // Bad sealing: -5%
      qualityChange = -5;
      triggerWrongAction(5);
      feedbackMsg = '⚠️ Phủ muối không đều! -5%';
    }

    const newQuality = Math.max(0, Math.min(100, quality + qualityChange));
    setQuality(newQuality);

    // Check if quality drops below 30%
    if (newQuality < 30) {
      setGameStatus('failed');
      setLossReason('low-quality');
      setFeedback('😢 Chất lượng quá thấp! Công đoạn không thể tiếp tục.');
      return;
    }

    setFeedback(feedbackMsg);
    qualityDegradationRef.current = 0;

    // Auto-complete game after sealing
    setTimeout(() => {
      setGameStatus('completed');
      const finalQuality = Math.min(100, newQuality);
      setQuality(finalQuality);
    }, 1500);
  };

  const handleSeal = () => {
    if (gameStatus !== 'playing' || currentStep !== 'sealing') return;
    
    _setButtonPressed('seal');
    setGameStatus('completed');
    const finalQuality = Math.min(100, quality + 10);
    setQuality(finalQuality);
    
    let endMessage = '';
    if (finalQuality >= 90) {
      endMessage = `🏆 Tiếp cực kể! Chất lượng: ${Math.round(finalQuality)}% → Lên men 3-6 tháng!`;
    } else if (finalQuality >= 70) {
      endMessage = `🌟 Hành nhý tốt! Chất lượng: ${Math.round(finalQuality)}% → Lên men 3-6 tháng!`;
    } else {
      endMessage = `🌝 Có thể tốt hơn! Chất lượng: ${Math.round(finalQuality)}% → Lên men 3-6 tháng!`;
    }
    
    setFeedback(endMessage);
    qualityDegradationRef.current = 0;
    
    setTimeout(() => {
      navigate('/craft-selection');
    }, 3000);
  };

  const handleBack = () => {
    navigate('/craft-selection');
  };

  // ========== BACKGROUND SETUP ==========
  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage: `url('https://api.sovaba.travel/uploads/lang_nghe_nuoc_mam_nam_o_737ebc4981.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/25 z-0" />
      
      {/* Salt Particles Animation */}
      <SaltParticles show={showSaltParticles} />
      
      <div className="relative w-full min-h-screen flex flex-col bg-gradient-to-b from-[#7a92a3]/80 via-[#9faab5]/80 to-[#b5a88f]/80 z-10 overflow-y-auto">
        {/* Background - distant sea and fishing boats */}
        <div className="absolute top-0 left-0 right-0 h-20 sm:h-32 md:h-40 bg-gradient-to-b from-[#5d7a8c]/40 to-transparent z-0">
          <div
            className="absolute top-4 sm:top-8 left-[15%] w-12 sm:w-16 h-8 sm:h-10 bg-[#3d4d5c]/60 rounded-sm shadow-lg"
            style={{ clipPath: 'polygon(20% 100%, 80% 100%, 90% 50%, 50% 0%, 10% 50%)' }}
          />
          <div
            className="absolute top-8 sm:top-12 right-[20%] w-10 sm:w-12 h-6 sm:h-8 bg-[#3d4d5c]/50 rounded-sm shadow-md"
            style={{ clipPath: 'polygon(15% 100%, 85% 100%, 75% 60%, 50% 20%, 25% 60%)' }}
          />
        </div>

        {/* Header */}
        <GameHeader onBack={handleBack} quality={quality} timeRemaining={timeRemaining} />

        {/* Game Canvas - Responsive */}
        <GameCanvas
          mixingEvenness={mixingEvenness}
          currentStep={currentStep}
          heatmapData={heatmapData}
        />

        {/* Salt Ratio Slider */}
        <SaltRatioSlider
          saltRatio={saltRatio}
          onSaltRatioChange={setSaltRatio}
          disabled={gameStatus !== 'playing' || currentStep !== 'adding'}
          gameStatus={gameStatus}
          targetSaltRatio={targetSaltRatio ?? undefined}
        />

        {/* Mixing Timing Game / Pressure Gauge / Sealing Drag Game / Action Buttons */}
        {currentStep === 'mixing' ? (
          <div className="w-full px-4 sm:px-6 md:px-4 py-2 sm:py-3 md:py-2">
            <MixingTimingGame 
              isActive={gameStatus === 'playing'} 
              onTimingResult={handleTimingResult}
            />
          </div>
        ) : currentStep === 'pressing' ? (
          <div className="w-full px-4 sm:px-6 md:px-4 py-2 sm:py-3 md:py-2">
            <PressureGauge
              isActive={gameStatus === 'playing'}
              onPressureResult={handlePressureResult}
            />
          </div>
        ) : currentStep === 'sealing' ? (
          <div className="w-full px-4 sm:px-6 md:px-4 py-2 sm:py-3 md:py-2">
            <SealingDragGame
              isActive={gameStatus === 'playing'}
              onSealingResult={handleSealingResult}
            />
          </div>
        ) : (
          <ActionButtons
            currentStep={currentStep}
            mixingEvenness={mixingEvenness}
            gameStatus={gameStatus}
            onAddSalt={handleAddSalt}
            onMix={handleMix}
            onTransfer={handleTransfer}
            onPress={handlePress}
            onSeal={handleSeal}
          />
        )}

        {/* Data Visualization */}
        <DataVisualization
          mixingEvenness={mixingEvenness}
          saltRatio={saltRatio}
          currentStep={currentStep}
        />

        {/* Feedback Toast */}
        <FeedbackToast message={feedback} />
      </div>

      {/* Win Screen */}
      <AnimatePresence>
        {gameStatus === 'completed' && <WinScreen quality={quality} userId={userId} challengeMode={challengeMode} onChallengeComplete={onChallengeComplete} />}
      </AnimatePresence>

      {/* Loss Screen */}
      <AnimatePresence>
        {gameStatus === 'failed' && lossReason && (
          <LossScreen reason={lossReason} quality={quality} />
        )}
      </AnimatePresence>
    </div>
  );
}
