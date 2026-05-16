import { useState } from 'react';
import Screen3 from './index';
import { IntroScreen } from './IntroScreen';

interface WashSaltGamePageProps {
  challengeMode?: boolean;
  onComplete?: () => void;
}

export default function WashSaltGamePage({ challengeMode = false, onComplete }: WashSaltGamePageProps) {
  const [gameStarted, setGameStarted] = useState(challengeMode);

  return (
    <div className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden">
      {/* Intro or Game */}
      {!gameStarted ? (
        <IntroScreen onStart={() => setGameStarted(true)} />
      ) : (
        <Screen3 challengeMode={challengeMode} onChallengeComplete={onComplete} />
      )}
    </div>
  );
}
