import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { IntroScreen } from './IntroScreen';
import Screen4 from './Screen4';

export default function CloseJarFermentGamePage() {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className={`relative w-full ${gameStarted ? 'min-h-screen overflow-y-auto' : 'min-h-screen overflow-y-auto'}`}>
      {/* Intro or Game */}
      {!gameStarted ? (
        <IntroScreen onStart={() => setGameStarted(true)} />
      ) : (
        <Screen4 />
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
