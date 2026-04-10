import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import Screen1 from './Screen1';

export default function CatchFishGamePage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Game */}
      <Screen1 />

      {/* Back Button - Floating */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-3 transition-all hover:scale-110 shadow-lg"
        title="Quay lại"
      >
        <ChevronLeft size={24} />
      </button>
    </div>
  );
}
