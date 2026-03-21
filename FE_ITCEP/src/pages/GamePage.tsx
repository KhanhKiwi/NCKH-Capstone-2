import { Play, GraduationCap, Trophy, Settings, Star, Award, User } from 'lucide-react';
import { Link } from 'react-router';

export default function GamePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with Village Scene */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1760939399262-d4d30d78a291?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwdHJhZGl0aW9uYWwlMjBtYXQlMjB3ZWF2aW5nJTIwdmlsbGFnZXxlbnwxfHx8fDE3NzMyNDE0Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#4a7c2f]/40 via-[#8b6f47]/50 to-[#4a3f2e]/70"></div>
      </div>

      {/* Top Bar - Player Profile and Stats */}
      <div className="relative z-10 px-8 pt-6">
        <div className="flex justify-between items-start">
          {/* Left - Player Profile */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border-4 border-[#f59e0b]">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center border-4 border-white shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#4a3f2e]">Người chơi</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="bg-gradient-to-r from-[#4a7c2f] to-[#5d9e3a] px-3 py-1 rounded-full">
                    <span className="text-white text-sm font-bold">Cấp 5</span>
                  </div>
                  <Star className="w-5 h-5 text-[#f59e0b] fill-[#f59e0b]" />
                  <span className="text-[#4a3f2e] font-semibold">250 XP</span>
                </div>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-3 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#4a7c2f] to-[#5d9e3a] h-full rounded-full transition-all duration-500"
                style={{ width: '60%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1 text-center">150/250 XP đến cấp tiếp theo</p>
          </div>

          {/* Right - Achievements */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 border-4 border-[#8b5cf6]">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-6 h-6 text-[#f59e0b]" />
              <h3 className="font-bold text-lg text-[#4a3f2e]">Huy hiệu</h3>
            </div>
            <div className="flex gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center border-4 border-white shadow-lg">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center border-4 border-white shadow-lg">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center border-4 border-white shadow-lg">
                <Trophy className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Center Content - Game Title and Menu Buttons */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-8">
        {/* Game Title */}
        <div className="text-center mb-12">
          <h1 
            className="text-8xl mb-4 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]"
            style={{ 
              fontFamily: 'serif',
              textShadow: '4px 4px 0px rgba(139, 111, 71, 0.8), 8px 8px 12px rgba(0,0,0,0.4)'
            }}
          >
            CraftSteps
          </h1>
          <div className="inline-block bg-[#f59e0b]/90 backdrop-blur-sm px-6 py-2 rounded-full border-4 border-white shadow-lg">
            <p className="text-white text-xl font-semibold">Làng nghề truyền thống Việt Nam</p>
          </div>
        </div>

        {/* Menu Buttons Grid */}
        <div className="grid grid-cols-2 gap-6 max-w-2xl w-full">
          {/* Chơi Button */}
          <Link to="/craft-selection">
            <button className="group relative bg-gradient-to-br from-[#4a7c2f] to-[#5d9e3a] hover:from-[#5d9e3a] hover:to-[#4a7c2f] text-white p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white w-full">
              <div className="absolute -top-3 -right-3 bg-[#f59e0b] rounded-full p-3 shadow-lg group-hover:rotate-12 transition-transform">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
              <h2 className="text-4xl font-bold mb-2">Chơi</h2>
              <p className="text-white/90">Bắt đầu trò chơi</p>
            </button>
          </Link>
          {/* Chọn Cấp Độ Button */}
          <button className="group relative bg-gradient-to-br from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#f59e0b] text-white p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white">
            <div className="absolute -top-3 -right-3 bg-[#4a7c2f] rounded-full p-3 shadow-lg group-hover:rotate-12 transition-transform">
              <Star className="w-8 h-8 text-white fill-white" />
            </div>
            <h2 className="text-4xl font-bold mb-2">Chọn cấp độ</h2>
            <p className="text-white/90">Khám phá thử thách</p>
          </button>

          {/* Học Nghề Button */}
          <button className="group relative bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#8b5cf6] text-white p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white">
            <div className="absolute -top-3 -right-3 bg-[#f59e0b] rounded-full p-3 shadow-lg group-hover:rotate-12 transition-transform">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-2">Học nghề</h2>
            <p className="text-white/90">Tìm hiểu quy trình</p>
          </button>

          {/* Cài Đặt Button */}
          <button className="group relative bg-gradient-to-br from-[#64748b] to-[#475569] hover:from-[#475569] hover:to-[#64748b] text-white p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white">
            <div className="absolute -top-3 -right-3 bg-[#8b5cf6] rounded-full p-3 shadow-lg group-hover:rotate-12 transition-transform">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-2">Cài đặt</h2>
            <p className="text-white/90">Tùy chỉnh game</p>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 animate-bounce">
          <div className="w-16 h-16 rounded-full bg-[#f59e0b]/30 backdrop-blur-sm"></div>
        </div>
        <div className="absolute bottom-1/4 right-10 animate-bounce delay-300">
          <div className="w-12 h-12 rounded-full bg-[#8b5cf6]/30 backdrop-blur-sm"></div>
        </div>
      </div>

      {/* Bottom Decorative Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#4a7c2f] via-[#f59e0b] to-[#8b5cf6]"></div>
    </div>
  );
}