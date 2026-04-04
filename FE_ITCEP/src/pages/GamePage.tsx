import { useState, useEffect } from 'react';
import { Play, GraduationCap, Trophy } from 'lucide-react';
import { Link } from 'react-router';
import { Logo } from '../components/Game/Logo';
import { PlayButton } from '../components/Game/PlayButton';
import { PlayerInfo } from '../components/Game/PlayerInfo';
import { Achievements } from '../components/Game/Achievements';
import { GameCard } from '../components/Game/GameCard';

export default function GamePage() {
  // Danh sách ảnh nền
  const bgImages = [
    '/picture/lamchieu.png',
    '/picture/lamgom.png',
    '/picture/lamhuong.png',
    '/picture/lamlua.png',
    '/picture/lamsonmai.png',
    '/picture/lamtranhdongho.png',
  ];
  
  const [bgIndex, setBgIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set<number>());

  // Preload images
  useEffect(() => {
    bgImages.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, index]));
      };
      img.src = src;
    });
  }, []);

  // Auto update background mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const gameCards = [
    {
      icon: Play,
      title: "Chơi",
      description: "Bắt đầu trò chơi mới",
      delay: 0.3
    },
    {
      icon: GraduationCap,
      title: "Học nghề",
      description: "Tìm hiểu quy trình",
      delay: 0.4
    },
    {
      icon: Trophy,
      title: "Thử thách",
      description: "Tìm thử thách và thi đấu",
      delay: 0.5
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background with Village Scene - Auto rotate */}
      {bgImages.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center pointer-events-none select-none transition-opacity duration-1000 ${
            i === bgIndex && loadedImages.has(i) ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('${src}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
        </div>
      ))}

      {/* Player Info & Achievements */}
      <PlayerInfo />
      <Achievements />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        {/* Logo */}
        <Logo />

        {/* Play Button */}
        <Link to="/craft-selection" className="mb-12">
          <PlayButton />
        </Link>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {gameCards.map((card) => (
            <GameCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              description={card.description}
              delay={card.delay}
            />
          ))}
        </div>
      </div>

      {/* Bottom Decorative Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFB347] via-[#F0D4B0] to-[#E6A75E]"></div>
    </div>
  );
}