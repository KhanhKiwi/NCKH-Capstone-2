import { Play, GraduationCap, Settings } from 'lucide-react';
import { Link } from 'react-router';
import { Logo } from '../components/Game/Logo';
import { PlayButton } from '../components/Game/PlayButton';
import { PlayerInfo } from '../components/Game/PlayerInfo';
import { Achievements } from '../components/Game/Achievements';
import { GameCard } from '../components/Game/GameCard';

export default function GamePage() {
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
      icon: Settings,
      title: "Cài đặt",
      description: "Tùy chỉnh game",
      delay: 0.5
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with Village Scene */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1760939399262-d4d30d78a291?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwdHJhZGl0aW9uYWwlMjBtYXQlMjB3ZWF2aW5nJTIwdmlsbGFnZXxlbnwxfHx8fDE3NzMyNDE0Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
      </div>

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