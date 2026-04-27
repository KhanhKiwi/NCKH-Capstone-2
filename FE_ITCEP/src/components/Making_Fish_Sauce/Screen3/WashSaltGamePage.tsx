import { useState } from 'react';
import Screen3 from './index';
import { IntroScreen } from './IntroScreen';

export default function WashSaltGamePage() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden">
      {/* Intro or Game */}
      {!gameStarted ? (
        <IntroScreen onStart={() => setGameStarted(true)} />
      ) : (
        <Screen3 />
      )}
    </div>
  );
}
