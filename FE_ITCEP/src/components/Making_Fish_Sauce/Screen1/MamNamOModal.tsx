import { X, Play, Lock } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import type { UserProgressResponse } from '../../../api/services/progressService';
import { progressService } from '../../../api/services/progressService';
import { getUserId } from '../../../utils/authUtils';

interface MamNamOModalProps {
  onClose: () => void;
  isOpen?: boolean;
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
  {
    id: 3,
    name: 'Pha Muối & Ướp Cá',
    description: 'Pha muối với tỷ lệ phù hợp, trộn đều, chuyển vào thùng chượp, nén chặt và đậy nắp. Công đoạn quan trọng để chuẩn bị cho quá trình lên men!',
    icon: '🧂',
    route: '/game/wash-salt'
  },
  {
    id: 4,
    name: 'Đóng lu & Ủ chượp',
    description: 'Đóng nắp lu cẩn thận, niêm phong kín khí, tạo điều kiện lên men tự nhiên. Quá trình lên men kéo dài 12 tháng để tạo ra nước mắm hoàn hảo!',
    icon: '🏺',
    route: '/game/close-jar-ferment'
  },
  {
    id: 5,
    name: 'Di sản Giọt Cuối',
    description: 'Lọc thanh nước mắm qua 4 lớp vật liệu khác nhau, pha blend tinh hoa, và đánh giá chất lượng. Chiết xuất những giọt quý báu từ di sản của cha ông!',
    icon: '✨',
    route: '/game/final-extraction'
  },
  {
    id: 6,
    name: 'Vĩnh Cửu Hương',
    description: 'Nghi thức niêm phong tinh hoa bất diệt - chọn chai quý nhất, rót mắm với lễ nghi truyền thống, và đánh giá hương vị. Hoàn thành di sản Nam Ô qua muôn đời!',
    icon: '🏆',
    route: '/game/eternal-fragrance'
  },
];

export default function MamNamOModal({ onClose, isOpen }: MamNamOModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'game'>('info');
  const [progress, setProgress] = useState<UserProgressResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      if (userId) {
        const userProgress = await progressService.getUserProgress(userId);
        setProgress(userProgress);
      }
    } catch (error) {
      console.error('❌ Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchProgress();
    }
  }, [isOpen, fetchProgress]);

  // Also refetch when switching to 'game' tab
  useEffect(() => {
    if (activeTab === 'game') {
      fetchProgress();
    }
  }, [activeTab, fetchProgress]);

  const getProgressForLevel = (levelId: number): UserProgressResponse | undefined => {
    const result = progress.find((p) => p.level.level_id === levelId);
    return result;
  };

  const isLevelLocked = (levelId: number): boolean => {
    // Check if this level is explicitly locked by admin
    const currentLevel = getProgressForLevel(levelId);
    if (currentLevel && currentLevel.status === 'locked') return true;
    
    // Level 1 doesn't need previous level unlocked
    if (levelId === 1) return false;
    
    // Check if previous level is completed or unlocked by admin
    const previousLevel = getProgressForLevel(levelId - 1);
    return !previousLevel || (previousLevel.status !== 'completed' && previousLevel.status !== 'unlocked');
  };

  const handlePlayGame = async (levelId: number, route: string) => {
    // Re-fetch latest progress before playing to catch admin locks
    try {
      const userId = getUserId();
      if (userId) {
        const latestProgress = await progressService.getUserProgress(userId);
        setProgress(latestProgress);
        
        // Now check with fresh data
        const freshProgressForLevel = latestProgress.find((p) => p.level.level_id === levelId);
        
        // Check if explicitly locked by admin
        if (freshProgressForLevel && freshProgressForLevel.status === 'locked') {
          alert('Màn này đã bị khóa bởi admin. Vui lòng mở khóa trước khi chơi.');
          return;
        }
        
        // For levels 2+, check if previous level is unlocked
        if (levelId > 1) {
          const prevLevel = latestProgress.find((p) => p.level.level_id === levelId - 1);
          if (!prevLevel || (prevLevel.status !== 'completed' && prevLevel.status !== 'unlocked')) {
            alert('Hoàn thành màn trước để mở màn này.');
            return;
          }
        }
        
        onClose();
        navigate(route);
      }
    } catch (error) {
      console.error('Failed to verify level status:', error);
      alert('Lỗi khi kiểm tra trạng thái màn. Vui lòng thử lại.');
    }
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
                    <p><span className="font-semibold">1. Bắt cá:</span> Cá cơm tươi được vợt từ biển vào buổi chiều (🎣 Bắt Cá Cơm)</p>
                    <p><span className="font-semibold">2. Sơ chế:</span> Cá được rửa sạch kỹ lưỡng bằng nước biển tươi (💧 Rửa Cá)</p>
                    <p><span className="font-semibold">3. Pha muối & Ướp cá:</span> Cá được trộn với muối biển theo tỷ lệ phù hợp, nén chặt trong thùng chượp (🧂 Pha Muối)</p>
                    <p><span className="font-semibold">4. Lên men:</span> Hỗn hợp được để lên men từ 3-6 tháng trong môi trường kỵ khí</p>
                    <p><span className="font-semibold">5. Chia cơm:</span> Tách riêng nước mắm và cơm cá</p>
                    <p><span className="font-semibold">6. Đóng chai:</span> Mắm được đóng vào chai và phát hành</p>
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
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-xl text-[#6b5638]">Đang tải dữ liệu...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {gameLevels.map((level) => {
                      const isLocked = isLevelLocked(level.id);
                      const levelProgress = getProgressForLevel(level.id);
                      
                      return (
                        <div
                          key={level.id}
                          className={`border-2 rounded-2xl p-6 transition-all ${
                            isLocked
                              ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-60'
                              : 'border-amber-200 hover:bg-amber-50 hover:border-amber-400 cursor-pointer group'
                          }`}
                          onClick={() => handlePlayGame(level.id, level.route)}
                          title={isLocked ? 'Hoàn thành màn trước để mở' : ''}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl">{level.icon}</span>
                                <div>
                                  <h4 className="text-xl font-bold text-[#4a3f2e]">{level.name}</h4>
                                  {levelProgress && (
                                    <span className={`text-sm font-semibold ${
                                      levelProgress.status === 'completed' ? 'text-green-600' : 'text-amber-600'
                                    }`}>
                                      {levelProgress.status === 'completed' ? '✅ Đã hoàn thành' : '🔓 Đã mở'}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-lg text-[#6b5638] ml-[60px]">{level.description}</p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                              {isLocked ? (
                                <div className="bg-gray-400 text-white rounded-full p-3">
                                  <Lock size={20} />
                                </div>
                              ) : (
                                <button className="bg-amber-600 hover:bg-amber-700 text-white rounded-full p-3 group-hover:scale-110 transition-transform">
                                  <Play size={20} fill="white" />
                                </button>
                              )}
                              {isLocked && (
                                <span className="text-xs text-gray-600 font-semibold text-center">
                                  Bị khóa
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
