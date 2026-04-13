import { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TopBar } from './components/TopBar';
import { GameArea } from './components/GameArea';
import { ProgressBar } from './components/ProgressBar';
import { Sidebar } from './components/Sidebar';
import { SuccessModal } from './components/SuccessModal';
import { Background } from './components/Background';
import { Hearts } from './components/Hearts';

export interface FishData {
  id: number;
  x: number;
  y: number;
  dirtLevel: number;
  maxDirtLevel: number;
  difficulty: 'easy' | 'normal' | 'hard';
  isBeingCleaned: boolean;
  gestureCount: number;
  correctGestures: number;
}

export type GestureDirection = 'up' | 'down' | 'left' | 'right';

export default function Screen2() {
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [fish, setFish] = useState<FishData[]>([]);
  const [isGameActive, setIsGameActive] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  // Initialize fish on mount
  useEffect(() => {
    const difficulties: ('easy' | 'normal' | 'hard')[] = ['easy', 'easy', 'normal', 'normal', 'hard', 'easy', 'normal', 'normal', 'easy', 'hard', 'normal', 'easy'];
    
    const initialFish: FishData[] = Array.from({ length: 12 }, (_, i) => {
      const difficulty = difficulties[i];
      const maxDirt = difficulty === 'easy' ? 60 : difficulty === 'normal' ? 80 : 100;
      const dirtLevel = maxDirt * (0.8 + Math.random() * 0.2);
      
      return {
        id: i,
        x: 150 + (i % 4) * 180 + Math.random() * 40,
        y: 200 + Math.floor(i / 4) * 140 + Math.random() * 30,
        dirtLevel,
        maxDirtLevel: maxDirt,
        difficulty,
        isBeingCleaned: false,
        gestureCount: 0,
        correctGestures: 0,
      };
    });
    setFish(initialFish);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isGameActive || timeLeft <= 0 || hearts <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameActive(false);
          checkGameCompletion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, timeLeft, hearts]);

  // Check game over condition
  useEffect(() => {
    if (hearts <= 0) {
      setIsGameActive(false);
      setFeedbackMessage('Game Over! Bạn đã hết lựa chọn. Hãy cố gắng lần sau!');
    }
  }, [hearts]);

  const checkGameCompletion = useCallback(() => {
    const avgCleanliness = fish.reduce((sum, f) => sum + ((f.maxDirtLevel - f.dirtLevel) / f.maxDirtLevel * 100), 0) / fish.length;

    if (avgCleanliness >= 85) {
      setShowSuccess(true);
      setFeedbackMessage('Hoàn thành xuất sắc! Bạn đã rửa cá rất sạch sẽ!');
    } else if (avgCleanliness >= 60) {
      setFeedbackMessage('Khá tốt! Nhưng cần rửa kỹ hơn để giữ độ tươi của cá.');
    } else {
      setFeedbackMessage('Cần cố gắng thêm! Cá cần được rửa sạch bằng nước biển.');
    }
  }, [fish]);

  const cleanFish = useCallback((fishId: number, zoneId: string, isCorrect: boolean) => {
    setFish((prev) =>
      prev.map((f) => {
        if (f.id === fishId) {
          const gestureAmount = f.difficulty === 'easy' ? 8 : f.difficulty === 'normal' ? 12 : 15;
          const newDirtLevel = Math.max(0, f.dirtLevel - gestureAmount);
          const newCorrectGestures = isCorrect ? f.correctGestures + 1 : f.correctGestures;
          
          return {
            ...f,
            dirtLevel: newDirtLevel,
            gestureCount: f.gestureCount + 1,
            correctGestures: newCorrectGestures,
            isBeingCleaned: true,
          };
        }
        return f;
      })
    );

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      
      // Zone-based scoring
      let zoneBonus = 0;
      switch (zoneId) {
        case 'seawater':
          zoneBonus = 10;
          break;
        case 'washboard':
          zoneBonus = 15;
          break;
        case 'freshwater':
          zoneBonus = 25; // Bonus for final stage
          break;
        default:
          zoneBonus = 10;
      }
      
      const bonusScore = zoneBonus + (newCombo * 5);
      setScore((prev) => prev + bonusScore);
    } else {
      setCombo(0);
      setHearts((prev) => Math.max(0, prev - 1));
      setScore((prev) => Math.max(0, prev - 5));
    }

    setTimeout(() => {
      setFish((prev) =>
        prev.map((f) => (f.id === fishId ? { ...f, isBeingCleaned: false } : f))
      );
    }, 300);

    // Check for completion
    const updatedFish = fish.map((f) =>
      f.id === fishId
        ? { ...f, dirtLevel: Math.max(0, f.dirtLevel - (f.difficulty === 'easy' ? 8 : f.difficulty === 'normal' ? 12 : 15)) }
        : f
    );
    const allClean = updatedFish.every((f) => f.dirtLevel < 5);

    if (allClean && isGameActive) {
      setIsGameActive(false);
      setShowSuccess(true);
      setFeedbackMessage('Xuất sắc! Bạn đã hoàn thành sớm!');
    }
  }, [fish, isGameActive, combo, maxCombo]);

  const overallCleanliness = fish.length > 0
    ? fish.reduce((sum, f) => sum + ((f.maxDirtLevel - f.dirtLevel) / f.maxDirtLevel * 100), 0) / fish.length
    : 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-sky-100 to-blue-50">
        <Background />

        <div className="relative z-10 w-full h-full flex flex-col">
          <TopBar
            level={2}
            timeLeft={timeLeft}
            score={score}
            stars={Math.min(3, Math.floor(overallCleanliness / 30))}
            combo={combo}
          />

          <Hearts hearts={hearts} maxHearts={3} />

          <div className="flex-1 flex items-center justify-center relative">
            <GameArea
              fish={fish}
              onCleanFish={cleanFish}
              isGameActive={isGameActive}
            />

            <Sidebar feedbackMessage={feedbackMessage} />
          </div>

          <ProgressBar cleanliness={overallCleanliness} />
        </div>

        {showSuccess && (
          <SuccessModal
            score={score}
            combo={maxCombo}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </div>
    </DndProvider>
  );
}
