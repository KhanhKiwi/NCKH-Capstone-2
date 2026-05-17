import { useState } from 'react';
import Screen1 from './Screen1';
import IntroScreen from './IntroScreen';

interface CatchFishGamePageProps {
  challengeMode?: boolean;
  onComplete?: () => void;
}

export default function CatchFishGamePage({ challengeMode = false, onComplete }: CatchFishGamePageProps) {
  const [gameStarted, setGameStarted] = useState(challengeMode);

  return (
    <div className={`relative w-full ${gameStarted ? 'h-screen overflow-hidden' : 'min-h-screen overflow-y-auto'}`}>
      {/* Intro or Game */}
      {!gameStarted ? (
        <IntroScreen onStart={() => setGameStarted(true)} />
      ) : (
        <Screen1 challengeMode={challengeMode} onChallengeComplete={onComplete} />
      )}
    </div>
  );
}
