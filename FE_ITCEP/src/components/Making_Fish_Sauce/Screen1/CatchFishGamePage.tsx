import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
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

      {/* Back Button - Floating */}
      <button
        onClick={() => {
          if (gameStarted) {
            setGameStarted(false);
          } else {
            navigate(-1);
          }
        }}
        className="fixed top-6 left-6 z-50 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-3 transition-all hover:scale-110 shadow-lg"
        title={gameStarted ? "Quay lại giới thiệu" : "Quay lại"}
      >
        <ChevronLeft size={24} />
      </button>
    </div>
  );
}
