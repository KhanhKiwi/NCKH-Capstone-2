import { useState } from 'react';
import Screen2 from './index';
import IntroScreen from './IntroScreen';

interface WashFishGamePageProps {
  challengeMode?: boolean;
  onComplete?: () => void;
}

export default function WashFishGamePage({ challengeMode = false, onComplete }: WashFishGamePageProps) {
  const [gameStarted, setGameStarted] = useState(challengeMode);

  return (
    <div className="relative w-full min-h-screen overflow-y-auto">
      {/* Intro or Game */}
      {!gameStarted ? (
        <IntroScreen onStart={() => setGameStarted(true)} />
      ) : (
        <Screen2 challengeMode={challengeMode} onChallengeComplete={onComplete} />
      )}
    </div>
  );
}
