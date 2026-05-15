import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameHeader } from './components/GameHeader';
import { QualityMeter } from './components/QualityMeter';
import { FishBasket } from './components/FishBasket';
import { CompletionBanner } from './components/CompletionBanner';
import { FailureBanner } from './components/FailureBanner';
import { ExitConfirmDialog } from './components/ExitConfirmDialog';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { levelsService } from '../../../api/levels/levelsService';
import { progressService } from '../../../api/progress/progressService';
import { getUserId } from '../../../utils/authUtils';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  type: 'water' | 'dust' | 'confetti';
}

interface BrushStroke {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export default function Screen2() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);
  
  // Get user ID from authUtils on mount
  useEffect(() => {
    const id = getUserId();
    setUserId(id);
    console.log('[Screen2] User ID loaded:', id);
  }, []);
  
  // Main state
  const [quality, setQuality] = useState(50); // Base quality
  const [currentStage, setCurrentStage] = useState<0 | 1 | 2>(0);
  const [timeRemaining, setTimeRemaining] = useState(90); // 2 minutes
  const [gameStatus, setGameStatus] = useState<'playing' | 'completed' | 'failed'>('playing');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: 'info' | 'success' | 'error';
    visible: boolean;
  }>({
    message: '',
    type: 'info',
    visible: false
  });

  // Stage 0: Selection
  const [removedFish, setRemovedFish] = useState<number[]>([]);
  const [removedDebris, setRemovedDebris] = useState<number[]>([]);
  const [basketShaking, setBasketShaking] = useState(false);
  const [showRemainingDebris, setShowRemainingDebris] = useState(false);
  const totalDebris = 8;
  const debrisRemoved = removedDebris.length;

  // Stage 1: Water Dragging
  const [rinseCount, setRinseCount] = useState(0);
  const [waterDragActive, setWaterDragActive] = useState(false);
  const [waterY, setWaterY] = useState(-100);
  const [comboCount, setComboCount] = useState(0);
  const waterContainerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Stage 2: Brush Drawing
  const fishGridRef = useRef<HTMLDivElement>(null);
  const fishRefsMap = useRef<{ [key: number]: HTMLButtonElement }>({});
  const [fish, setFish] = useState<{ 
    id: number; 
    cleaned: number;
    brushStrokes: BrushStroke[];
  }[]>(
    Array.from({ length: 17 }, (_, i) => ({
      id: i,
      cleaned: 0,
      brushStrokes: []
    }))
  );
  const [isDraggingBrush, setIsDraggingBrush] = useState(false);

  const REQUIRED_RINSES = 2;
  const fishCleaned = fish.filter(f => f.cleaned === 100).length;
  const allFishCleaned = fishCleaned === fish.length;

  // ========== AUTO TRANSITIONS ==========
  useEffect(() => {
    if (currentStage === 0 && debrisRemoved === totalDebris) {
      setShowRemainingDebris(false);
      setTimeout(() => {
        setFeedback({
          message: 'Hoàn tất công đoạn chọn lọc! Chuyển sang gáo nước biển...',
          type: 'success',
          visible: true
        });
        setTimeout(() => {
          setCurrentStage(1);
          setRemovedDebris([]);
          setRemovedFish([]);
        }, 1500);
      }, 500);
    }
  }, [debrisRemoved, currentStage]);

  useEffect(() => {
    if (currentStage === 1 && rinseCount >= REQUIRED_RINSES) {
      const timer = setTimeout(() => {
        setFeedback({
          message: 'Hoàn tất công đoạn gáo nước! Chuyển sang chải cá...',
          type: 'success',
          visible: true
        });
        setTimeout(() => {
          setCurrentStage(2);
        }, 1500);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [rinseCount, currentStage]);

  useEffect(() => {
    if (currentStage === 2 && allFishCleaned) {
      const timer = setTimeout(() => {
        setFeedback({
          message: `🎉 Hoàn hảo! Tất cả cá đã sạch. Chất lượng mắm cuối: ${Math.round(quality)}%!`,
          type: 'success',
          visible: true
        });
        // Create confetti
        const confetti = Array.from({ length: 30 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: -20,
          vx: (Math.random() - 0.5) * 10,
          vy: Math.random() * 8 + 4,
          life: 1,
          type: 'confetti' as const
        }));
        setParticles(confetti);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [allFishCleaned, currentStage]);

  // ========== TIMER COUNTDOWN ==========
  useEffect(() => {
    if (timeRemaining <= 0 || gameStatus !== 'playing') return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setFeedback({
            message: '⏱ Hết giờ! Game over!',
            type: 'error',
            visible: true
          });
          setGameStatus('failed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, gameStatus]);

  // ========== CHECK QUALITY/TIMEOUT CONDITIONS ==========
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    if (quality < 10) {
      setFeedback({
        message: '⚠️ Chất lượng quá thấp! Game over!',
        type: 'error',
        visible: true
      });
      setGameStatus('failed');
    }
  }, [quality, gameStatus]);

  // ========== CHECK COMPLETION ==========
  useEffect(() => {
    if (currentStage === 2 && allFishCleaned && gameStatus === 'playing') {
      setTimeout(() => {
        setGameStatus('completed');
      }, 2000);
    }
  }, [allFishCleaned, currentStage, gameStatus]);

  // ========== STAGE 0: FISH CLICK ==========
  const handleFishClick = (fishId: number, isBad: boolean) => {
    if (removedFish.includes(fishId)) return;

    let feedbackMsg = '';
    let feedbackType: 'success' | 'error' | 'info' = 'success';
    let qualityChange = 0;

    if (isBad) {
      feedbackMsg = '✓ Đúng! Loại bỏ cá xấu. Chất lượng +3%!';
      feedbackType = 'success';
      qualityChange = 3;
    } else {
      feedbackMsg = '✗ Sai! Cá tốt không nên loại. Chất lượng -5%!';
      feedbackType = 'error';
      qualityChange = -5;
    }

    setRemovedFish([...removedFish, fishId]);
    setQuality(Math.max(0, Math.min(100, quality + qualityChange)));
    setFeedback({
      message: feedbackMsg,
      type: feedbackType,
      visible: true
    });
  };

  const handleDebrisClick = (debrisId: number) => {
    if (removedDebris.includes(debrisId)) return;

    setRemovedDebris([...removedDebris, debrisId]);
    setShowRemainingDebris(false);
    setFeedback({
      message: '✓ Tốt! Loại bỏ tạp chất. Chất lượng +1%!',
      type: 'success',
      visible: true
    });
    setQuality(Math.min(100, quality + 1));
  };

  const handleClearBasket = () => {
    const remainingDebris = Array.from({ length: totalDebris }, (_, i) => i).filter(
      id => !removedDebris.includes(id)
    );

    if (remainingDebris.length === 0) return;

    // Shake animation
    setBasketShaking(true);
    setTimeout(() => setBasketShaking(false), 600);

    // Show remaining debris for user to click
    setShowRemainingDebris(true);

    setFeedback({
      message: `🎉 Rổ lắc lư! Tìm và click ${remainingDebris.length} vết bẩn còn lại!`,
      type: 'info',
      visible: true
    });
  };

  // ========== STAGE 1: WATER DRAG ==========
  const handleWaterDragStart = () => {
    if (rinseCount >= REQUIRED_RINSES) return;
    setWaterDragActive(true);
    setComboCount(0);
  };

  const handleWaterDragMove = (e: React.MouseEvent) => {
    if (!waterDragActive || rinseCount >= REQUIRED_RINSES) return;

    const container = waterContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    
    if (relativeY >= 0 && relativeY <= rect.height) {
      setWaterY(relativeY - 50);
      
      setComboCount(prev => Math.min(prev + 1, 10));

      const newParticles = Array.from({ length: 3 }, () => ({
        id: Math.random(),
        x: Math.random() * 80 + 10,
        y: relativeY,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 8 + 4,
        life: 1,
        type: 'water' as const
      }));
      
      setParticles(prev => [...prev, ...newParticles].slice(-50));
    }
  };

  const handleWaterDragEnd = () => {
    if (!waterDragActive) return;
    setWaterDragActive(false);
    setWaterY(-100);

    const newRinseCount = rinseCount + 1;
    setRinseCount(newRinseCount);
    setComboCount(0);

    let msg = '';
    let type: 'info' | 'success' | 'error' = 'info';
    let qualityChange = 5; // Base +5% per rinse
    const comboMultiplier = Math.floor(comboCount / 3);

    // Combo bonus
    if (comboMultiplier >= 4) {
      qualityChange += 2; // x4+ combo: +2% bonus
      msg = `✓ Lần rửa ${newRinseCount}: Combo x${comboMultiplier + 1}! +5% +2% bonus = +7%!`;
      type = 'success';
    } else if (comboMultiplier >= 2) {
      qualityChange += 1; // x2-3 combo: +1% bonus
      msg = `✓ Lần rửa ${newRinseCount}: Combo x${comboMultiplier + 1}! +5% +1% bonus = +6%!`;
      type = 'success';
    } else {
      msg = `✓ Lần rửa ${newRinseCount}: +5%! Thêm combo để bonus!`;
      type = 'info';
    }

    setQuality(Math.max(0, Math.min(100, quality + qualityChange)));
    setFeedback({
      message: msg,
      type,
      visible: true
    });
  };

  // ========== STAGE 2: BRUSH DRAW ==========
  const handleBrushMouseDown = () => {
    setIsDraggingBrush(true);
  };

  const handleBrushMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingBrush) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Check each fish button's position
    setFish(prevFish =>
      prevFish.map(f => {
        const fishButton = fishRefsMap.current[f.id];
        if (!fishButton || f.cleaned === 100) return f;

        const rect = fishButton.getBoundingClientRect();
        const fishCenterX = rect.left + rect.width / 2;
        const fishCenterY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          (mouseX - fishCenterX) ** 2 + (mouseY - fishCenterY) ** 2
        );

        // If cursor is within 80px of fish center
        if (distance < 80) {
          const newCleaned = Math.min(f.cleaned + 0.8, 100);
          
          // Create dust particles
          const dustParticles = Array.from({ length: 3 }, () => ({
            id: Math.random(),
            x: (mouseX / window.innerWidth) * 100,
            y: (mouseY / window.innerHeight) * 100,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10 - 2,
            life: 1,
            type: 'dust' as const
          }));
          setParticles(prev => [...prev, ...dustParticles].slice(-50));

          if (newCleaned === 100) {
            setFeedback({
              message: `✨ Cá #${f.id + 1} sạch sẽ! Chất lượng +0.5%!`,
              type: 'success',
              visible: true
            });
            setQuality(Math.min(100, quality + 0.5));
          }

          return {
            ...f,
            cleaned: newCleaned,
            brushStrokes: [...f.brushStrokes, { id: Date.now(), x: mouseX, y: mouseY, timestamp: Date.now() }]
          };
        }
        return f;
      })
    );
  };

  const handleBrushMouseUp = () => {
    setIsDraggingBrush(false);
  };

  // ========== GAME CONTROL HANDLERS ==========
  const handleContinue = async () => {
    try {
      if (userId) {
        // Get all levels for fish sauce village (village_id = 8)
        const levels = await levelsService.getByVillage(8, userId);
        const level2 = levels.find((l: any) => l.level_number === 2);
        
        if (level2) {
          // Save progress for level 2 (backend auto-unlocks level 3)
          await progressService.saveProgress({
            user_id: userId,
            level_id: level2.level_id,
            status: 'completed',
            score: quality
          });
          
          console.log('[Screen2] Level 2 completed, Level 3 auto-unlocked by backend!');
        }
      }
    } catch (error) {
      console.error('[Screen2] Error saving progress:', error);
    }
    
    // Navigate to next level
    navigate('/game/wash-salt');
  };

  const handleRetry = () => {
    // Reset game
    setQuality(50);
    setCurrentStage(0);
    setTimeRemaining(90);
    setGameStatus('playing');
    setRemovedFish([]);
    setRemovedDebris([]);
    setRinseCount(0);
    setFish(Array.from({ length: 17 }, (_, i) => ({
      id: i,
      cleaned: 0,
      brushStrokes: []
    })));
    setFeedback({ message: '', type: 'info', visible: false });
  };

  const handleBack = () => {
    // Show exit confirmation dialog
    setShowExitConfirm(true);
  };

  const handleConfirmExit = () => {
    // Clear saved state and go back to craft selection page
    localStorage.removeItem('fishSauceGameState');
    navigate('/craft-selection');
  };

  const handleCancelExit = () => {
    // Close dialog and continue playing
    setShowExitConfirm(false);
  };

  // ========== PARTICLE SYSTEM ==========
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.3,
            life: p.life - 0.02
          }))
          .filter(p => p.life > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const animationStyle = `
    @keyframes fishBob {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(2deg); }
    }
    @keyframes fishShake {
      0%, 100% { opacity: 1; }
      25%, 75% { opacity: 0.85; }
    }
    @keyframes basketShake {
      0%, 100% { transform: translateX(0) rotate(0deg); }
      10% { transform: translateX(-8px) rotate(-2deg); }
      20% { transform: translateX(8px) rotate(2deg); }
      30% { transform: translateX(-8px) rotate(-2deg); }
      40% { transform: translateX(8px) rotate(2deg); }
      50% { transform: translateX(0) rotate(0deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    .fish-item {
      animation: fishBob 3s ease-in-out infinite;
    }
    .fish-shake {
      animation: none !important;
      opacity: 0.85;
    }
    .basket-shaking {
      animation: basketShake 0.6s ease-in-out !important;
    }
    .basket-pulse {
      animation: pulse 1s ease-in-out infinite !important;
    }
    .brush-cursor {
      cursor: grab;
    }
    .brush-cursor:active {
      cursor: grabbing;
    }
  `;

  return (
    <div 
      className="w-full min-h-screen overflow-y-auto"
      onMouseMove={currentStage === 2 ? handleBrushMouseMove : undefined}
      onMouseUp={handleBrushMouseUp}
      onMouseLeave={handleBrushMouseUp}
    >
      <style>{animationStyle}</style>
      <div className="relative w-full flex flex-col lg:flex-row">
        {/* Background */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1774434355015-bb547e11b32c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Nam Ô fishing village"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(200,180,160,0.3) 0%, rgba(220,200,180,0.5) 50%, rgba(200,180,160,0.6) 100%)'
            }}
          />
        </div>

        {/* Left Panel */}
        <div className="hidden lg:block relative z-10 lg:w-80 xl:w-96 p-6">
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(245, 230, 211, 0.95)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              border: '2px solid rgba(139, 115, 85, 0.3)',
              maxHeight: 'calc(100vh - 48px)',
              overflowY: 'auto'
            }}
          >
            <div style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#2d2416',
              marginBottom: '16px'
            }}>
              Làng Mắm Nam Ô
            </div>
            <div style={{
              fontSize: '14px',
              color: '#5a4d3d',
              lineHeight: 1.6,
              marginBottom: '24px'
            }}>
              Nghệ thuật làm mắm truyền thống. Công đoạn rửa và làm sạch cá là bước quan trọng.
            </div>

            <div
              className="rounded-lg p-4 mb-4"
              style={{
                background: 'rgba(139, 115, 85, 0.2)',
                border: '1px solid rgba(107, 88, 68, 0.3)'
              }}
            >
              <div style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#4a3f35',
                marginBottom: '12px'
              }}>
                Tiêu chí chất lượng:
              </div>
              <ul style={{
                fontSize: '12px',
                color: '#5a4d3d',
                lineHeight: 1.8,
                listStyle: 'none',
                padding: 0
              }}>
                <li>✓ Loại bỏ cá mắt đục, cá hỏng</li>
                <li>✓ Rửa sạch cát, bùn đất</li>
                <li>✓ Làm sạch từng con</li>
              </ul>
            </div>

            <div
              className="rounded-lg p-4"
              style={{
                background: 'rgba(90, 138, 154, 0.15)',
                border: '1px solid rgba(74, 122, 138, 0.3)'
              }}
            >
              <div style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#4a3f35',
                marginBottom: '12px'
              }}>
                Hướng dẫn:
              </div>
              <ul style={{
                fontSize: '12px',
                color: '#5a4d3d',
                lineHeight: 1.8,
                listStyle: 'none',
                padding: 0
              }}>
                <li style={{
                  opacity: currentStage === 0 ? 1 : 0.6,
                  fontWeight: currentStage === 0 ? 600 : 'normal'
                }}>
                  • <strong>Chọn lọc:</strong> Tách cá tốt/xấu
                </li>
                <li style={{
                  opacity: currentStage === 1 ? 1 : 0.6,
                  fontWeight: currentStage === 1 ? 600 : 'normal'
                }}>
                  • <strong>Kéo nước:</strong> Drag từ trên xuống
                </li>
                <li style={{
                  opacity: currentStage === 2 ? 1 : 0.6,
                  fontWeight: currentStage === 2 ? 600 : 'normal'
                }}>
                  • <strong>Chải cá:</strong> Drag bàn chải qua cá
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="relative z-10 flex-1 flex flex-col max-w-[1200px] mx-auto w-full">
          <GameHeader showTimer={true} timeRemaining={timeRemaining} onBack={handleBack} />
          <QualityMeter value={quality} />

          {feedback.visible && (
            <div className="px-4 md:px-8 lg:px-12 pt-2">
              <div
                className="rounded-lg p-4"
                style={{
                  background:
                    feedback.type === 'success'
                      ? 'rgba(76, 175, 80, 0.15)'
                      : feedback.type === 'error'
                      ? 'rgba(244, 67, 54, 0.15)'
                      : 'rgba(25, 118, 210, 0.15)',
                  border: `2px solid ${
                    feedback.type === 'success'
                      ? '#4caf50'
                      : feedback.type === 'error'
                      ? '#f44336'
                      : '#1976d2'
                  }`,
                  color:
                    feedback.type === 'success'
                      ? '#2e7d32'
                      : feedback.type === 'error'
                      ? '#d32f2f'
                      : '#1565c0'
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{feedback.message}</span>
              </div>
            </div>
          )}

          {/* STAGE 0: SELECTION */}
          {currentStage === 0 && (
            <div className="flex-1 flex items-center justify-center px-4 py-6 md:px-8 lg:px-12 md:py-8">
              <div className="w-full max-w-md md:max-w-lg lg:max-w-2xl">
                <div
                  style={{
                    fontSize: 'clamp(24px, 5vw, 32px)',
                    fontWeight: 700,
                    color: '#2d2416',
                    textAlign: 'center',
                    marginBottom: '24px',
                    textShadow: '0 2px 4px rgba(255,255,255,0.5)'
                  }}
                >
                  🐟 CHỌN LỌC CÁ
                </div>

                <FishBasket
                  onFishClick={handleFishClick}
                  onDebrisClick={handleDebrisClick}
                  removedFish={removedFish}
                  removedDebris={removedDebris}
                  showRemainingDebris={showRemainingDebris}
                />

                <div
                  style={{
                    marginTop: '24px',
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#5a4d3d'
                  }}
                >
                  <strong>Tiến độ:</strong> Loại bỏ {debrisRemoved}/{totalDebris} tạp chất
                </div>

                {debrisRemoved < totalDebris && (
                  <button
                    onClick={handleClearBasket}
                    className={`${basketShaking ? 'basket-shaking' : ''} ${showRemainingDebris ? 'basket-pulse' : ''}`}
                    style={{
                      marginTop: '20px',
                      width: '100%',
                      padding: '12px 20px',
                      background: showRemainingDebris
                        ? 'linear-gradient(135deg, #ff5722 0%, #d84315 100%)'
                        : 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                      border: showRemainingDebris ? '3px solid #bf360c' : '2px solid #e65100',
                      borderRadius: '12px',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: showRemainingDebris
                        ? '0 6px 20px rgba(255, 87, 34, 0.5)'
                        : '0 4px 12px rgba(230, 81, 0, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      if (!showRemainingDebris) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <span>🧺</span>
                    <span>{showRemainingDebris ? 'Tìm vết bẩn!' : 'Làm sạch rổ'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STAGE 1: WATER DRAG */}
          {currentStage === 1 && (
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
              <div className="max-w-2xl w-full">
                <div
                  style={{
                    fontSize: 'clamp(24px, 5vw, 32px)',
                    fontWeight: 700,
                    color: '#2d2416',
                    textAlign: 'center',
                    marginBottom: '24px',
                    textShadow: '0 2px 4px rgba(255,255,255,0.5)'
                  }}
                >
                  🌊 KÉO NƯỚC BIỂN
                </div>

                <div
                  ref={waterContainerRef}
                  onMouseDown={handleWaterDragStart}
                  onMouseMove={handleWaterDragMove}
                  onMouseUp={handleWaterDragEnd}
                  onMouseLeave={handleWaterDragEnd}
                  className="relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(100,150,200,0.3) 0%, rgba(80,120,160,0.2) 100%)',
                    border: '3px dashed rgba(74, 122, 138, 0.4)',
                    borderRadius: '16px',
                    minHeight: '300px',
                    marginBottom: '24px',
                    cursor: waterDragActive ? 'grabbing' : 'grab',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
                    gap: '16px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    overflow: 'hidden',
                    position: 'relative',
                    userSelect: 'none',
                    willChange: waterDragActive ? 'transform' : 'auto'
                  }}
                >
                  {waterDragActive && (
                    <div
                      style={{
                        position: 'absolute',
                        top: waterY,
                        left: 0,
                        right: 0,
                        height: '40px',
                        background: 'linear-gradient(180deg, rgba(100,180,220,0.6) 0%, rgba(100,180,220,0.3) 100%)',
                        borderRadius: '50% 50% 0 0',
                        pointerEvents: 'none',
                        zIndex: 5,
                        transition: 'top 0.05s linear'
                      }}
                    />
                  )}

                  {Array.from({ length: 17 }).map((_, i) => (
                    <div
                      key={`fish-${i}`}
                      className={waterDragActive ? 'fish-shake' : 'fish-item'}
                      style={{
                        width: '60px',
                        height: '60px',
                        background: waterDragActive
                          ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
                          : 'linear-gradient(135deg, #e8a844 0%, #d4944a 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: waterDragActive
                          ? '0 0 20px rgba(255,215,0,0.6)'
                          : '0 4px 8px rgba(0,0,0,0.2)',
                        border: waterDragActive
                          ? '3px solid #ffed4e'
                          : '2px solid #c88a3a',
                        fontSize: '28px',
                        transition: 'all 0.1s ease',
                        animationDelay: `${i * 0.08}s`,
                        cursor: 'inherit',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        WebkitTransform: 'translateZ(0)'
                      }}
                    >
                      🐟
                    </div>
                  ))}

                  {particles.map(p => (
                    p.type === 'water' && (
                      <div
                        key={p.id}
                        style={{
                          position: 'absolute',
                          left: `${p.x}%`,
                          top: `${p.y}px`,
                          width: '8px',
                          height: '8px',
                          background: 'rgba(100,180,220,0.8)',
                          borderRadius: '50%',
                          pointerEvents: 'none',
                          opacity: p.life,
                          zIndex: 10
                        }}
                      />
                    )
                  ))}
                </div>

                <div
                  className="rounded-xl p-6 mb-8"
                  style={{
                    background: rinseCount >= REQUIRED_RINSES
                      ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(56, 142, 60, 0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(255,193,7,0.2) 0%, rgba(251,140,0,0.1) 100%)',
                    border: `2px solid ${rinseCount >= REQUIRED_RINSES ? '#4caf50' : '#ffc107'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    {rinseCount >= REQUIRED_RINSES ? (
                      <CheckCircle style={{ color: '#4caf50', width: '24px', height: '24px' }} />
                    ) : (
                      <AlertCircle style={{ color: '#ffc107', width: '24px', height: '24px' }} />
                    )}
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: rinseCount >= REQUIRED_RINSES ? '#2e7d32' : '#f57f17'
                      }}
                    >
                      {rinseCount >= REQUIRED_RINSES ? '✓ Hoàn tất!' : `Lần kéo: ${rinseCount}/${REQUIRED_RINSES}`}
                    </span>
                  </div>
                  {comboCount > 0 && (
                    <div style={{
                      fontSize: '14px',
                      color: '#ff6b00',
                      marginLeft: '36px',
                      fontWeight: 600
                    }}>
                      🔥 Combo x{Math.floor(comboCount / 3) + 1}!
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'center', fontSize: '13px', color: '#5a4d3d' }}>
                  💡 Kéo nước từ trên xuống nhanh để tạo combo bonus!
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: BRUSH DRAW */}
          {currentStage === 2 && (
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
              <div className="max-w-4xl w-full">
                <div
                  style={{
                    fontSize: 'clamp(24px, 5vw, 32px)',
                    fontWeight: 700,
                    color: '#2d2416',
                    textAlign: 'center',
                    marginBottom: '24px',
                    textShadow: '0 2px 4px rgba(255,255,255,0.5)'
                  }}
                >
                  🪮 CHẢI CÁ SẠCH
                </div>

                <div
                  className="rounded-xl p-4 mb-8"
                  style={{
                    background: 'linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(56,142,60,0.1) 100%)',
                    border: '2px solid #4caf50'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#2e7d32'
                    }}>
                      Tiến độ: {fishCleaned}/{fish.length} cá
                    </span>
                    {allFishCleaned && (
                      <CheckCircle style={{ color: '#4caf50', width: '28px', height: '28px' }} />
                    )}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(0,0,0,0.1)',
                      borderRadius: '4px',
                      marginTop: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${(fishCleaned / fish.length) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #4caf50 0%, #81c784 100%)',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                <div
                  ref={fishGridRef}
                  className="brush-cursor"
                  onMouseDown={handleBrushMouseDown}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px',
                    cursor: 'grab'
                  }}
                >
                  {fish.map(f => (
                    <div 
                      key={f.id} 
                      style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                    >
                      <button
                        ref={(el) => {
                          if (el) fishRefsMap.current[f.id] = el;
                        }}
                        disabled={f.cleaned === 100}
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          background:
                            f.cleaned === 100
                              ? 'linear-gradient(135deg, #ffeb3b 0%, #ffc107 100%)'
                              : `linear-gradient(135deg, hsl(35, 100%, ${60 - f.cleaned * 0.2}%), hsl(35, 100%, ${45 - f.cleaned * 0.2}%))`,
                          border: f.cleaned === 100 ? '3px solid #fbc02d' : '2px solid #c88a3a',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                          boxShadow: isDraggingBrush
                            ? '0 0 20px rgba(0,0,0,0.3)' 
                            : '0 4px 8px rgba(0,0,0,0.15)',
                          transition: 'all 0.2s ease',
                          opacity: f.cleaned === 100 ? 1 : 0.9,
                          cursor: f.cleaned === 100 ? 'default' : 'grab'
                        }}
                      >
                        {f.cleaned === 100 ? '✓' : '🐟'}
                      </button>

                      <div
                        style={{
                          width: '100%',
                          height: '4px',
                          background: 'rgba(0,0,0,0.1)',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          style={{
                            width: `${f.cleaned}%`,
                            height: '100%',
                            background: f.cleaned === 100
                              ? 'linear-gradient(90deg, #4caf50 0%, #81c784 100%)'
                              : 'linear-gradient(90deg, #2196f3 0%, #64b5f6 100%)',
                            transition: 'width 0.1s ease'
                          }}
                        />
                      </div>

                      <div style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#5a4d3d',
                        textAlign: 'center'
                      }}>
                        {Math.round(f.cleaned)}%
                      </div>
                    </div>
                  ))}
                </div>

                {particles.map(p => (
                  p.type === 'dust' && (
                    <div
                      key={p.id}
                      style={{
                        position: 'fixed',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: '6px',
                        height: '6px',
                        background: 'rgba(139,69,19,0.6)',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        opacity: p.life,
                        zIndex: 1
                      }}
                    />
                  )
                ))}

                {particles.map(p => (
                  p.type === 'confetti' && (
                    <div
                      key={p.id}
                      style={{
                        position: 'fixed',
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: '8px',
                        height: '8px',
                        background: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff006e'][Math.floor(Math.random() * 4)],
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        opacity: p.life,
                        zIndex: 100
                      }}
                    />
                  )
                ))}

                <button
                  disabled={!allFishCleaned}
                  className="w-full py-5 px-6 rounded-xl transition-all active:scale-98 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: allFishCleaned
                      ? 'linear-gradient(180deg, #4caf50 0%, #388e3c 100%)'
                      : 'linear-gradient(180deg, #9e9e9e 0%, #757575 100%)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    border: allFishCleaned ? '2px solid #2e7d32' : '2px solid #616161',
                    minHeight: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                  }}
                >
                  <CheckCircle
                    className="w-6 h-6"
                    style={{ color: '#f5f5f5', strokeWidth: 2.5 }}
                  />
                  <span style={{
                    fontSize: 'clamp(16px, 3vw, 18px)',
                    fontWeight: 700,
                    color: '#f5f5f5',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    {allFishCleaned ? '✓ HOÀN THÀNH!' : `HOÀN THÀNH (${fishCleaned}/${fish.length})`}
                  </span>
                </button>

                <div style={{ textAlign: 'center', fontSize: '20px', color: '#0b0804', marginTop: '16px' }}>
                  💡 Kéo bàn chải qua các con cá để làm sạch.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="hidden xl:block relative z-10 w-80 p-6">
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(245, 230, 211, 0.95)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              border: '2px solid rgba(139, 115, 85, 0.3)',
              maxHeight: 'calc(100vh - 48px)',
              overflowY: 'auto'
            }}
          >
            <div style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#2d2416',
              marginBottom: '20px'
            }}>
              📊 Thống kê
            </div>

            <div
              className="rounded-lg p-4 mb-4"
              style={{
                background: 'rgba(90, 138, 154, 0.2)',
                border: '1px solid rgba(74, 122, 138, 0.3)'
              }}
            >
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#4a3f35',
                marginBottom: '8px'
              }}>
                BƯỚC HIỆN TẠI
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#2d2416'
              }}>
                {currentStage === 0 && '1. Chọn lọc'}
                {currentStage === 1 && '2. Kéo nước 🌊'}
                {currentStage === 2 && '3. Chải cá 🪮'}
              </div>
            </div>

            <div
              className="rounded-lg p-4"
              style={{
                background: 'rgba(76, 175, 80, 0.15)',
                border: '1px solid rgba(76, 175, 80, 0.3)'
              }}
            >
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#2e7d32',
                marginBottom: '8px'
              }}>
                CHẤT LƯỢNG
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#2e7d32',
                marginBottom: '8px'
              }}>
                {quality}%
              </div>
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(0,0,0,0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${quality}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #4caf50 0%, #81c784 100%)',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPLETION BANNER */}
      {gameStatus === 'completed' && (
        <CompletionBanner
          quality={quality}
          removedFish={removedFish.length}
          totalFish={25}
          removedDebris={removedDebris.length}
          totalDebris={totalDebris}
          rinseCount={rinseCount}
          cleanedFishCount={fishCleaned}
          onContinue={handleContinue}
          onBack={handleBack}
        />
      )}

      {/* FAILURE BANNER */}
      {gameStatus === 'failed' && (
        <FailureBanner
          reason={timeRemaining === 0 ? 'timeout' : 'low-quality'}
          quality={quality}
          timeRemaining={timeRemaining}
          onRetry={handleRetry}
          onBack={handleBack}
        />
      )}

      {/* EXIT CONFIRMATION DIALOG */}
      {showExitConfirm && (
        <ExitConfirmDialog
          onConfirm={handleConfirmExit}
          onCancel={handleCancelExit}
          currentStage={currentStage}
          quality={quality}
        />
      )}
    </div>
  );
}
