import { useState } from 'react';
import { Lock, CheckCircle, Star, X, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link } from 'react-router';

interface Craft {
  id: string;
  name: string;
  location: string;
  image: string;
  unlocked: boolean;
  comingSoon?: boolean;
}

interface Level {
  id: number;
  name: string;
  unlocked: boolean;
  completed: boolean;
}

export default function CraftSelectionPage() {
  const [selectedCraft, setSelectedCraft] = useState<Craft | null>(null);
  const [showLevelModal, setShowLevelModal] = useState(false);

  const crafts: Craft[] = [
    {
      id: 'bat-trang',
      name: 'Làng gốm Bát Tràng',
      location: 'Hà Nội',
      image: 'https://images.unsplash.com/photo-1734600891288-e762b5128851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYmF0JTIwdHJhbmclMjBwb3R0ZXJ5JTIwY2VyYW1pY3N8ZW58MXx8fHwxNzczMzA4ODc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      unlocked: true,
    },
    {
      id: 'dong-ho',
      name: 'Làng tranh Đông Hồ',
      location: 'Bắc Ninh',
      image: 'https://images.unsplash.com/photo-1671468158321-93fa8aa3fdf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb25nJTIwaG8lMjBmb2xrJTIwcGFpbnRpbmclMjB2aWV0bmFtfGVufDF8fHx8MTc3MzMwODg3NHww&ixlib=rb-4.1.0&q=80&w=1080',
      unlocked: false,
    },
    {
      id: 'van-phuc',
      name: 'Làng lụa Vạn Phúc',
      location: 'Hà Nội',
      image: 'https://images.unsplash.com/photo-1643309053949-99eb896aec0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwc2lsayUyMHdlYXZpbmclMjB0aHJlYWR8ZW58MXx8fHwxNzczMzA4ODc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      unlocked: true,
    },
    {
      id: 'dinh-yen',
      name: 'Làng dệt chiếu Đinh Yên',
      location: 'Đồng Tháp',
      image: 'https://images.unsplash.com/photo-1710559055621-451811ff73ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMG1hdCUyMHdlYXZpbmclMjBzZWRnZXxlbnwxfHx8fDE3NzMzMDg4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      unlocked: false,
    },
    {
      id: 'phu-cau',
      name: 'Làng hương Quảng Phú Cầu',
      location: 'Hà Nội',
      image: 'https://images.unsplash.com/photo-1486056997767-09578eee7de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmNlbnNlJTIwc3RpY2tzJTIwbWFraW5nJTIwdmlldG5hbXxlbnwxfHx8fDE3NzMzMDg4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      unlocked: false,
    },
    {
      id: 'ha-thai',
      name: 'Làng sơn mài Hà Thái',
      location: 'Hà Nội',
      image: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHNpbGslMjB0aHJlYWQlMjB3ZWF2aW5nfGVufDF8fHx8MTc3MDkwMDAxOXww&ixlib=rb-4.1.0&q=80&w=1080',
      unlocked: false,
    },
    {
      id: 'coming-soon',
      name: 'Sắp ra mắt',
      location: '???',
      image: '',
      unlocked: false,
      comingSoon: true,
    },
  ];

  const levels: Level[] = [
    { id: 1, name: 'Thu hoạch cây cói', unlocked: true, completed: false },
    { id: 2, name: 'Phơi cói', unlocked: false, completed: false },
    { id: 3, name: 'Chẻ tơ và nhuộm màu', unlocked: false, completed: false },
    { id: 4, name: 'Lắp khung dệt', unlocked: false, completed: false },
    { id: 5, name: 'Dệt chiếu', unlocked: false, completed: false },
    { id: 6, name: 'Hoàn thiện chiếu', unlocked: false, completed: false },
  ];

  const handleCraftClick = (craft: Craft) => {
    if (craft.comingSoon) return;
    setSelectedCraft(craft);
    setShowLevelModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f0e8] via-[#fef3c7] to-[#fed7aa] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#f59e0b]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="relative z-10 pt-12 pb-8">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-[#8b6f47] via-[#d4c4a8] to-[#8b6f47] h-1 w-32 mx-auto mb-6 rounded-full"></div>
          </div>
          <h1 
            className="text-6xl text-[#4a3f2e] mb-3"
            style={{ fontFamily: 'serif' }}
          >
            Chọn làng nghề
          </h1>
          <p className="text-xl text-[#6b5638] max-w-2xl mx-auto">
            Khám phá và trải nghiệm các làng nghề truyền thống Việt Nam
          </p>
        </div>
      </div>

      {/* Crafts Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {crafts.map((craft) => (
            <div
              key={craft.id}
              onClick={() => handleCraftClick(craft)}
              className={`
                relative group rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300
                ${craft.unlocked && !craft.comingSoon
                  ? 'cursor-pointer hover:scale-105 hover:shadow-2xl border-4 border-[#4a7c2f]'
                  : 'opacity-60 border-4 border-gray-400'
                }
                ${craft.comingSoon ? 'cursor-not-allowed' : ''}
              `}
            >
              {/* Card Image */}
              <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                {!craft.comingSoon ? (
                  <ImageWithFallback
                    src={craft.image}
                    alt={craft.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                    <Star className="w-24 h-24 text-gray-500" />
                  </div>
                )}
                
                {/* Overlay for locked/unlocked state */}
                <div className={`absolute inset-0 ${craft.unlocked && !craft.comingSoon ? 'bg-gradient-to-t from-black/60 to-transparent' : 'bg-black/50'}`}>
                  {!craft.unlocked && !craft.comingSoon && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-6 shadow-2xl">
                        <Lock className="w-12 h-12 text-gray-600" />
                      </div>
                    </div>
                  )}
                  {craft.unlocked && !craft.comingSoon && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-[#4a7c2f] rounded-full p-2 shadow-lg">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="bg-white p-5">
                <h3 className="text-xl font-bold text-[#4a3f2e] mb-2" style={{ fontFamily: 'serif' }}>
                  {craft.name}
                </h3>
                <p className="text-sm text-[#6b5638] flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {craft.location}
                </p>
                {craft.unlocked && !craft.comingSoon && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-[#4a7c2f] font-semibold">Đã mở khóa</span>
                    <ChevronRight className="w-5 h-5 text-[#4a7c2f]" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Level Selection Modal */}
      {showLevelModal && selectedCraft && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#4a7c2f] to-[#5d9e3a] p-6 relative">
              <button
                onClick={() => setShowLevelModal(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'serif' }}>
                {selectedCraft.name}
              </h2>
              <p className="text-white/90">Chọn cấp độ để bắt đầu</p>
            </div>

            {/* Modal Body - Levels */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-8 top-8 bottom-8 w-1 bg-gradient-to-b from-[#4a7c2f] via-[#f59e0b] to-gray-300 rounded-full"></div>

                {/* Levels */}
                <div className="space-y-6">
                  {levels.map((level) => (
                    <div
                      key={level.id}
                      className={`
                        relative flex items-center gap-6 p-4 rounded-2xl transition-all duration-300
                        ${level.unlocked
                          ? 'bg-gradient-to-r from-[#fef3c7] to-[#fed7aa] border-4 border-[#f59e0b] cursor-pointer hover:scale-102 hover:shadow-lg'
                          : 'bg-gray-100 border-4 border-gray-300 opacity-60'
                        }
                      `}
                    >
                      {/* Level Number Badge */}
                      <div className={`
                        relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center shadow-lg
                        ${level.unlocked
                          ? 'bg-gradient-to-br from-[#4a7c2f] to-[#5d9e3a]'
                          : 'bg-gray-400'
                        }
                      `}>
                        {level.unlocked ? (
                          <span className="text-white text-2xl font-bold">{level.id}</span>
                        ) : (
                          <Lock className="w-6 h-6 text-white" />
                        )}
                      </div>

                      {/* Level Info */}
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-1 ${level.unlocked ? 'text-[#4a3f2e]' : 'text-gray-500'}`}>
                          Cấp {level.id}
                        </h3>
                        <p className={`text-base ${level.unlocked ? 'text-[#6b5638]' : 'text-gray-400'}`}>
                          {level.name}
                        </p>
                      </div>

                      {/* Status Badge / Action Buttons */}
                      <div className="flex-shrink-0 flex gap-2">
                        {level.unlocked ? (
                          <div className="bg-[#4a7c2f] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                            Sẵn sàng
                          </div>
                        ) : (
                          <>
                            <div className="bg-gray-400 text-white px-4 py-2 rounded-full text-sm font-semibold">
                              Đã khóa
                            </div>
                            {level.id === 4 && (
                              <Link to="/level-4">
                                <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-colors">
                                  Try
                                </button>
                              </Link>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-6 border-t-2 border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Hoàn thành mỗi cấp độ để mở khóa cấp độ tiếp theo
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}