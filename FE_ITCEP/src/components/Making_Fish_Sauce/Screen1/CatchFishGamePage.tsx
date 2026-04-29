import { useNavigate } from 'react-router';
import { useState } from 'react';
import Screen1 from './Screen1';
import IntroScreen from './IntroScreen';

export default function CatchFishGamePage() {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className={`relative w-full ${gameStarted ? 'h-screen overflow-hidden' : 'min-h-screen overflow-y-auto'}`}>
      {/* Intro or Game */}
      {!gameStarted ? (
        <IntroScreen onStart={() => setGameStarted(true)} />
      ) : (
        <Screen1 />
      )}
    </div>
  );
}
