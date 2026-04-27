import { useState } from 'react';
import Screen2 from './index';
import IntroScreen from './IntroScreen';

export default function WashFishGamePage() {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="relative w-full min-h-screen overflow-y-auto">
      {/* Intro or Game */}
      {!gameStarted ? (
        <IntroScreen onStart={() => setGameStarted(true)} />
      ) : (
        <Screen2 />
      )}
    </div>
  );
}
