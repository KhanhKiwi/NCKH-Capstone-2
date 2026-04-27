import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GameHeader } from './components/GameHeader';
import { SaltRatioSlider } from './components/SaltRatioSlider';
import { ActionButtons } from './components/ActionButtons';
import { GameCanvas } from './components/GameCanvas';
import { DataVisualization } from './components/DataVisualization';
import { FeedbackToast } from './components/FeedbackToast';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { SaltParticles } from './components/SaltParticles';

export default function Screen3() {
  const navigate = useNavigate();

  // Main state
  const [quality, setQuality] = useState(100);
  const [saltRatio, setSaltRatio] = useState(3.0);
  const [mixingEvenness, setMixingEvenness] = useState(0);
  const [currentStep, setCurrentStep] = useState<'adding' | 'mixing' | 'transferring' | 'pressing' | 'sealing'>('adding');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [heatmapData, setHeatmapData] = useState<number[]>(Array(9).fill(0));
  
  // Timer & Game Status
  const [timeRemaining, setTimeRemaining] = useState(150); // 2.5 minutes
  const [gameStatus, setGameStatus] = useState<'playing' | 'completed' | 'failed'>('playing');
  const [saltApplied, setSaltApplied] = useState(false);
  
  // Difficulty & Challenge System
  const [mixClickCount, setMixClickCount] = useState(0);
  const [requiredMixes, setRequiredMixes] = useState(5 + Math.floor(Math.random() * 3)); // 5-7 clicks needed
  const [lastMixTime, setLastMixTime] = useState<number | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const qualityDegradationRef = useRef(0);
  const [showSaltParticles, setShowSaltParticles] = useState(false);
  const [buttonPressed, setButtonPressed] = useState<string | null>(null);

  // ========== TIMER & QUALITY DEGRADATION ==========
  useEffect(() => {
    if (gameStatus !== 'playing' || timeRemaining <= 0) {
      if (timeRemaining <= 0 && gameStatus === 'playing') {
        setGameStatus('failed');
        setFeedback('⏰ Hết thời gian! Công đoạn ướp cá không hoàn tất.');
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setGameStatus('failed');
          setFeedback('⏰ Hết thời gian! Công đoạn ướp cá không hoàn tất.');
        }
        return Math.max(0, newTime);
      });
      
      // Quality degradation if not progressing
      qualityDegradationRef.current += 0.05;
      if (qualityDegradationRef.current > 1) {
        setQuality(prev => Math.max(0, prev - 0.5));
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
        setActiveChallenge(randomChallenge);
        setFeedback(`⚠️ ${randomChallenge}`);
        setQuality(prev => Math.max(0, prev - 2));
        
        setTimeout(() => setActiveChallenge(null), 3000);
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

  // ========== HANDLERS ==========
  const handleAddSalt = () => {
    if (gameStatus !== 'playing' || currentStep !== 'adding' || saltApplied) return;

    let qualityChange = 0;
    let feedbackMsg = '';

    // HARDER LOGIC: More precise salt ratio (2.8-3.5 ideal, harsh penalties outside)
    if (saltRatio < 2.8) {
      feedbackMsg = '😭 Muối quá thấp! (Đỏ là gây ngoài màu) -20%';
      qualityChange = -20;
    } else if (saltRatio > 3.5) {
      feedbackMsg = '😭 Muối quá cao! (Sản phẩm quá mặn) -15%';
      qualityChange = -15;
    } else if (saltRatio >= 2.9 && saltRatio <= 3.2) {
      feedbackMsg = '✨ Tỉ lệ muối thực sự hoàn hảo! +10% Bonus!';
      qualityChange = 10;
    } else {
      feedbackMsg = '✓ Tỉ lệ muối chấp nhận được! +5%';
      qualityChange = 5;
    }

    setSaltApplied(true);
    setShowSaltParticles(true);
    setButtonPressed('salt');
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
    setButtonPressed('mix');
    
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

  const handleTransfer = () => {
    if (gameStatus !== 'playing' || currentStep !== 'transferring') return;
    
    setButtonPressed('transfer');
    // Random quality check during transfer
    if (Math.random() < 0.3) {
      setFeedback('⚠️ Chuyển không đều - một số muối rơi! -5%');
      setQuality(prev => Math.max(0, prev - 5));
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

  const handlePress = () => {
    if (gameStatus !== 'playing' || currentStep !== 'pressing') return;
    
    setButtonPressed('press');
    // Random quality check during pressing
    if (Math.random() < 0.25) {
      setFeedback('⚠️ Nén không đều - một số về không phẳng! -3%');
      setQuality(prev => Math.max(0, prev - 3));
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

  const handleSeal = () => {
    if (gameStatus !== 'playing' || currentStep !== 'sealing') return;
    
    setButtonPressed('seal');
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
        />

        {/* Action Buttons */}
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

        {/* Data Visualization */}
        <DataVisualization
          mixingEvenness={mixingEvenness}
          saltRatio={saltRatio}
          currentStep={currentStep}
        />

        {/* Feedback Toast */}
        <FeedbackToast message={feedback} />
      </div>
    </div>
  );
}
