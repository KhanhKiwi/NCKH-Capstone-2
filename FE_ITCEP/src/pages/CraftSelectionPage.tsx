import { useState, useEffect } from 'react';
import { Lock, CheckCircle, Star, X } from 'lucide-react';
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
  const [mounted, setMounted] = useState(false);

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
      unlocked: true,
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

  const defaultLevels: Level[] = [
    { id: 1, name: 'Thu hoạch cây cói', unlocked: true, completed: false },
    { id: 2, name: 'Phơi cói', unlocked: false, completed: false },
    { id: 3, name: 'Chẻ tơ và nhuộm màu', unlocked: false, completed: false },
    { id: 4, name: 'Lắp khung dệt', unlocked: false, completed: false },
    { id: 5, name: 'Dệt chiếu', unlocked: false, completed: false },
    { id: 6, name: 'Hoàn thiện chiếu', unlocked: false, completed: false },
  ];

  const [levels, setLevels] = useState<Level[]>(() => {
    try {
      const all = localStorage.getItem('unlocked_all_levels')
      if (all === '1') return defaultLevels.map(l => ({ ...l, unlocked: true }))
      const saved = localStorage.getItem('unlocked_levels')
      if (saved) return JSON.parse(saved) as Level[]
    } catch (e) { }
    return defaultLevels
  })

  const [unlockedAll, setUnlockedAll] = useState<boolean>(() => {
    try { return localStorage.getItem('unlocked_all_levels') === '1' } catch { return false }
  })

  useEffect(() => {
    try { localStorage.setItem('unlocked_levels', JSON.stringify(levels)) } catch (e) { }
  }, [levels])

  function unlockAllLevels() {
    setLevels(prev => {
      const next = prev.map(l => ({ ...l, unlocked: true }))
      try {
        localStorage.setItem('unlocked_all_levels', '1')
        localStorage.setItem('unlocked_levels', JSON.stringify(next))
      } catch (e) { }
      return next
    })
    setUnlockedAll(true)
  }

  // Auto-unlock immediately so user sees all levels playable
  useEffect(() => {
    if (!unlockedAll) unlockAllLevels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleCraftClick = (craft: Craft) => {
    if (craft.comingSoon) return;
    setSelectedCraft(craft);
    setShowLevelModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7ed] via-[#fff1e6] to-[#fff3f0] relative overflow-hidden">
      <svg className="absolute -top-16 -left-16 w-80 opacity-20" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="300" cy="300" r="300" fill="#fef3c7" />
      </svg>

      <div className={`relative z-10 pt-16 pb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="h-1 w-36 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#b7843b] to-[#e6d7b3]"></div>
          </div>
          <h1 className="text-5xl md:text-6xl text-[#2b2b2b] mb-3 tracking-wide font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
            Chọn làng nghề
          </h1>
          <p className="text-lg md:text-xl text-[#4b4336] max-w-3xl mx-auto">
            Khám phá và trải nghiệm các làng nghề truyền thống Việt Nam — học, chơi, và ghi điểm!
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {crafts.map((craft, idx) => (
            <div
              key={craft.id}
              onClick={() => handleCraftClick(craft)}
              className={`group transform rounded-3xl overflow-hidden ${craft.unlocked && !craft.comingSoon ? 'cursor-pointer hover:scale-105 hover:shadow-2xl' : 'cursor-default'} transition-all duration-700 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              <div className={`relative h-[420px] bg-gray-100 rounded-3xl overflow-hidden shadow-md ${!craft.unlocked && !craft.comingSoon ? 'filter grayscale contrast-90' : ''}`}>
                {craft.image ? (
                  <ImageWithFallback
                    src={craft.image}
                    alt={craft.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <Star className="w-20 h-20 text-gray-400" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />

                <div className="absolute left-5 bottom-5 right-5 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30">
                  <h3 className="text-lg md:text-xl font-semibold text-[#27221b] truncate">{craft.name}</h3>
                  <p className="text-sm text-[#4b4336] mt-1 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {craft.location}
                  </p>
                </div>

                {/* State badges */}
                {!craft.comingSoon && craft.unlocked && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-emerald-600 text-white rounded-full p-2 shadow-lg">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                )}

                {!craft.comingSoon && !craft.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/80 backdrop-blur-sm rounded-full p-5 shadow-xl">
                      <Lock className="w-10 h-10 text-gray-700" />
                    </div>
                  </div>
                )}

                {craft.comingSoon && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/80 backdrop-blur-sm rounded-full p-6 shadow-xl">
                      <Star className="w-12 h-12 text-amber-700" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showLevelModal && selectedCraft && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-100">
            <div className="p-6 bg-gradient-to-r from-amber-600 to-emerald-600 text-white relative">
              <button
                onClick={() => setShowLevelModal(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                {selectedCraft.name}
              </h2>
              <p className="text-sm text-white/90">Chọn cấp độ để bắt đầu</p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="space-y-4">
                {levels.map((level) => (
                  <div key={level.id} className={`flex items-center gap-4 p-4 rounded-xl border ${level.unlocked ? 'bg-gradient-to-r from-yellow-50 to-white border-amber-200' : 'bg-gray-50 border-gray-200 opacity-80'}`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${level.unlocked ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-white'}`}>
                      {level.unlocked ? <span className="text-lg font-bold">{level.id}</span> : <Lock className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className={`text-lg font-semibold ${level.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>Cấp {level.id}</div>
                      <div className={`text-sm ${level.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>{level.name}</div>
                    </div>
                    <div>
                      {level.unlocked ? (
                        <Link to={`/level-${level.id}`}>
                          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors">Chơi ngay</button>
                        </Link>
                      ) : (
                        <div className="text-sm text-gray-500 px-4 py-2 rounded-full">Đã khóa</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">Hoàn thành mỗi cấp độ để mở khóa cấp độ tiếp theo</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}