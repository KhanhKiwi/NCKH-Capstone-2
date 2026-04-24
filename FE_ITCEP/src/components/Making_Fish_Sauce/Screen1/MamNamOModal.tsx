import { X, Play } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface MamNamOModalProps {
  onClose: () => void;
}

interface GameLevel {
  id: number;
  name: string;
  description: string;
  icon: string;
  route: string;
}

const gameLevels: GameLevel[] = [
  {
    id: 1,
    name: 'Bắt Cá Cơm Than Tươi',
    description: 'Bắt những con cá cơm than tươi, bỏ qua những con cá không phù hợp. Giới hạn thời gian 2 phút.',
    icon: '🎣',
    route: '/game/catch-fish'
  },
  {
    id: 2,
    name: 'Rửa & Làm Sạch Cá',
    description: 'Rửa sạch cá cơm bằng nước biển tươi để chuẩn bị cho bước tiếp theo. Hãy rửa kỹ lưỡng để giữ độ tươi và vị ngọt của cá!',
    icon: '💧',
    route: '/game/wash-fish'
  },
];

export default function MamNamOModal({ onClose }: MamNamOModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'game'>('info');
  const navigate = useNavigate();

  const handlePlayGame = (route: string) => {
    onClose();
    navigate(route);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden border border-gray-100 flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white relative flex justify-between items-center">
          <h2 className="text-3xl font-bold">Làng Mắm Nam Ô</h2>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-4 px-6 font-semibold text-center transition-colors ${
              activeTab === 'info'
                ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            📖 Giới Thiệu
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`flex-1 py-4 px-6 font-semibold text-center transition-colors ${
              activeTab === 'game'
                ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            🎮 Màn Chơi
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {activeTab === 'info' && (
            <div className="p-8 md:p-12">
              <div className="max-w-3xl mx-auto">
                {/* Banner Image */}
                <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://dulichvn.org.vn/nhaptin/uploads/images/2023/Thang3/173Can-canh-lang-nghe-nuoc-mam-Nam-O-Da-Nang-6.jpg" 
                    alt="Làng Mắm Nam Ô" 
                    className="w-full h-auto object-contain"
                  />
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-[#4a3f2e] mb-4">Lịch Sử Và Truyền Thống</h3>
                  <p className="text-lg text-[#6b5638] leading-relaxed mb-4">
                    Làng mắm Nam Ô hình thành từ thế kỷ XIX khi ngư dân địa phương phát hiện ra cách chế biến mắm từ cá cơm. Qua hơn 100 năm, làng đã giữ được bí quyết gia truyền và trở thành điểm đến du lịch nổi tiếng.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-[#4a3f2e] mb-4">Về Mắm Nam Ô</h3>
                  <p className="text-lg text-[#6b5638] leading-relaxed mb-4">
                    Nam Ô là một trong những làng mắm nổi tiếng nhất của Việt Nam. Mắm Nam Ô được chế biến từ cá cơm tươi theo công thức truyền thống qua nhiều tháng lên men, tạo ra hương vị đặc trưng, mằn mặn và thơm ngon.
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-[#4a3f2e] mb-4">Quy Trình Chế Biến</h3>
                  <div className="space-y-3 text-lg text-[#6b5638]">
                    <p><span className="font-semibold">1. Thu hoạch cá cơm:</span> Cá cơm tươi được vợt từ biển vào buổi chiều</p>
                    <p><span className="font-semibold">2. Sơ chế:</span> Cá được rửa và làm sạch kỹ lưỡng</p>
                    <p><span className="font-semibold">3. Muối cá:</span> Cá được trộn với muối biển và để lên men từ 3-6 tháng</p>
                    <p><span className="font-semibold">4. Chia cơm:</span> Tách riêng nước mắm và cơm cá</p>
                    <p><span className="font-semibold">5. Đóng chai:</span> Mắm được đóng vào chai và phát hành</p>
                  </div>
                </div>

                {/* Video Section */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-[#4a3f2e] mb-4">Xem Quy Trình Chế Biến Mắm</h3>
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-black">
                    <iframe 
                      width="100%" 
                      height="400" 
                      src="https://www.youtube.com/embed/8RUi3EkHu4s?t=7s" 
                      title="Quy trình chế biến mắm Nam Ô"
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      className="w-full"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'game' && (
            <div className="p-8 md:p-12">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-[#4a3f2e] mb-8">Chọn Màn Chơi</h3>
                <div className="space-y-4">
                  {gameLevels.map((level) => (
                    <div
                      key={level.id}
                      className="border-2 border-amber-200 rounded-2xl p-6 hover:bg-amber-50 hover:border-amber-400 transition-all cursor-pointer group"
                      onClick={() => handlePlayGame(level.route)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl">{level.icon}</span>
                            <h4 className="text-xl font-bold text-[#4a3f2e]">{level.name}</h4>
                          </div>
                          <p className="text-lg text-[#6b5638] ml-[60px]">{level.description}</p>
                        </div>
                        <button className="bg-amber-600 hover:bg-amber-700 text-white rounded-full p-3 group-hover:scale-110 transition-transform">
                          <Play size={20} fill="white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
