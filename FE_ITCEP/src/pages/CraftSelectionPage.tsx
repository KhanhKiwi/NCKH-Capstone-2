import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router'
import { Lock, CheckCircle, Star, X } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link } from 'react-router';
import BatTrangModal from '../components/making_ceramics/Crafts/BatTrangModal';
import  MamNamOModal  from '../components/Making_Fish_Sauce/Screen1/MamNamOModal';
import { villagesService } from '../api/villages/villagesService'

interface Craft {
  id: number;
  name: string;
  location?: string;
  image?: string;
  unlocked: boolean;
  comingSoon?: boolean;
}

interface Level {
  id: number;
  name: string;
  unlocked: boolean;
  completed: boolean;
}

function normalizeText(value: string) {
  return (value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

function isPotteryCraftName(name?: string) {
  const n = normalizeText(name || '')
  return n.includes('thanh ha') || n.includes('bat trang') || n.includes('gom')
}

function isFishSauceCraftName(name?: string) {
  const n = normalizeText(name || '')
  return n.includes('mam nam o')
}

function getCraftDifficulty(name?: string) {
  const n = normalizeText(name || '');
  if (n.includes('chieu') || n.includes('ban thach') || n.includes('dinh yen')) {
    return { level: 1, label: 'Dễ', color: 'bg-emerald-500/80 text-white border-emerald-400' };
  }
  if (isPotteryCraftName(name)) {
    return { level: 2, label: 'Trung bình', color: 'bg-amber-500/80 text-white border-amber-400' };
  }
  if (isFishSauceCraftName(name)) {
    return { level: 3, label: 'Khó', color: 'bg-red-500/80 text-white border-red-400' };
  }
  return null;
}

function composeText(value?: string) {
  try {
    if (!value) return '';
    // remove zero-width and control chars
    let s = value.replace(/\p{C}/gu, '');
    // remove spaces between a base letter and a combining mark (fix broken sequences like "e ́" or "e <space> ́")
    s = s.replace(/(\p{L})\s+(\p{M})/gu, '$1$2');
    // remove spaces between a combining mark and a following letter (e.g. "é u" -> "éu")
    s = s.replace(/(\p{M})\s+(\p{L})/gu, '$1$2');
    // remove spaces immediately around combining marks
    s = s.replace(/\s*(\p{M})\s*/gu, '$1');
    // also collapse multiple spaces
    s = s.replace(/\s{2,}/g, ' ');
    return s.normalize('NFC');
  } catch (e) {
    return value || '';
  }
}

export default function CraftSelectionPage() {
  // load web fonts once
  useEffect(() => {
    const id = 'fe-itcep-google-fonts';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Playfair+Display:wght@400;700;900&display=swap';
      document.head.appendChild(link);
    }
  }, []);
  const [selectedCraft, setSelectedCraft] = useState<Craft | null>(null);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [crafts, setCrafts] = useState<Craft[]>([])

  useEffect(() => {
    (async () => {
      try {
        const data = await villagesService.getAll()
        const mapped = (data || []).map((v: any) => ({
          id: Number(v.village_id ?? v.id),
          name: composeText(v.name ?? ''),
          location: v.city ?? v.location ?? '',
          image: v.image ?? '',
          unlocked: !!v.is_open,
          comingSoon: false,
        }))
        setCrafts(mapped)
      } catch (e) {
        console.error('Failed to load villages from API', e)
      }
    })()
  }, [])

  const defaultLevels: Level[] = [
    { id: 1, name: 'Thu hoạch cây cói', unlocked: true, completed: false },
    { id: 2, name: 'Phơi cói', unlocked: false, completed: false },
    { id: 3, name: 'Chẻ tơ và nhuộm màu', unlocked: false, completed: false },
    { id: 4, name: 'Lắp khung dệt', unlocked: false, completed: false },
    { id: 5, name: 'Dệt chiếu', unlocked: false, completed: false },
    { id: 6, name: 'Hoàn thiện chiếu', unlocked: false, completed: false },
  ];

  const potteryLevels: Level[] = [
    { id: 1, name: 'Giới thiệu làng và hướng dẫn', unlocked: true, completed: false },
    { id: 2, name: 'Chuẩn bị đất', unlocked: false, completed: false },
    { id: 3, name: 'Tạo hình', unlocked: false, completed: false },
    { id: 4, name: 'Phơi khô', unlocked: false, completed: false },
    { id: 5, name: 'Trang trí & tráng men', unlocked: false, completed: false },
    { id: 6, name: 'Nung & hoàn thiện', unlocked: false, completed: false },
  ]

  // levels UI is driven by backend per-craft progress; default fallback for offline
  const [levels, setLevels] = useState<Level[]>(defaultLevels)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleCraftClick = (craft: Craft) => {
    if (craft.comingSoon) return;
    // Special-case: keep "chiếu" craft always accessible/unlocked (e.g. Làng chiếu Bàn Thạch)
    const craftName = craft.name ?? '';
    const normalizedName = normalizeText(craftName)
    if (!craft.unlocked && (normalizedName.includes('chieu') || normalizedName.includes('ban thach') || normalizedName.includes('chiem') )) {
      // allow opening and treat as unlocked locally
      // continue to set levels below
    } else if (!craft.unlocked) return; // do not open other locked crafts
    // If this is the Làng Dệt Đinh Yên craft, unlock all levels locally
    if (normalizedName.includes('dinh yen') || normalizedName.includes('chieu') || normalizedName.includes('ban thach')) {
      setLevels(defaultLevels.map(l => ({ ...l, unlocked: true })));
    } else if (isPotteryCraftName(craftName)) {
      setLevels(potteryLevels)
    } else {
      // reset to default per-craft fallback
      setLevels(defaultLevels);
    }

    // mark selected craft as unlocked locally so UI shows playable state
    console.log('[Craft] select:', { rawName: craft.name, display: composeText(craft.name) });
    setSelectedCraft({ ...craft, name: composeText(craft.name), unlocked: true });
    setShowLevelModal(true);
  };

  // If URL contains ?openName=..., auto-open that craft modal (useful for deep links)
  const location = useLocation();
  const navigate = useNavigate();
  const handleBack = () => {
    // Always navigate to GamePage
    navigate('/game', { replace: true });
  }
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search || '');
      const nameParam = params.get('openName')?.trim();
      if (!nameParam) return;
      if (!crafts || crafts.length === 0) return;
      const normalizedParam = normalizeText(nameParam)
      let found = crafts.find(c => c.name && normalizeText(c.name).includes(normalizedParam));

      // Backward compatibility: old links still use "Bát Tràng" while DB now stores "Thanh Hà".
      if (!found && (normalizedParam.includes('bat trang') || normalizedParam.includes('gom') || normalizedParam.includes('thanh ha'))) {
        found = crafts.find(c => isPotteryCraftName(c.name));
      }

      if (found) {
        const foundName = found.name ?? '';
        const foundNormalized = normalizeText(foundName);

        // Mirror handleCraftClick behavior for deep links: set levels and mark unlocked locally
        if (foundNormalized.includes('dinh yen') || foundNormalized.includes('chieu') || foundNormalized.includes('ban thach')) {
          setLevels(defaultLevels.map(l => ({ ...l, unlocked: true })));
        } else if (isPotteryCraftName(foundName)) {
          setLevels(potteryLevels);
        } else {
          setLevels(defaultLevels);
        }

        console.log('[Craft] deep-link open:', { rawName: found.name, display: composeText(found.name) });
        setSelectedCraft({ ...found, name: composeText(found.name), unlocked: true });
        setShowLevelModal(true);
      }
    } catch (e) {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crafts, location.search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7ed] via-[#fff1e6] to-[#fff3f0] relative overflow-hidden" style={{ fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
      <svg className="absolute -top-16 -left-16 w-80 opacity-20" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="300" cy="300" r="300" fill="#fef3c7" />
      </svg>

      <div className={`relative z-10 pt-16 pb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="absolute left-6 top-6">
          <button
            onClick={handleBack}
            aria-label="Quay lại"
            title="Quay lại"
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-xl hover:translate-x-0.5 hover:shadow-2xl transform transition-all ring-0 focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold">Quay lại</span>
          </button>
        </div>
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="h-1 w-36 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#b7843b] to-[#e6d7b3]"></div>
          </div>
          <h1 className="text-5xl md:text-6xl text-[#2b2b2b] mb-3 tracking-wide font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Chọn làng nghề
          </h1>
          <p className="text-lg md:text-xl text-[#4b4336] max-w-3xl mx-auto">
            Khám phá và trải nghiệm các làng nghề truyền thống Việt Nam — học, chơi, và ghi điểm!
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {crafts.map((craft, idx) => {
            const difficulty = getCraftDifficulty(craft.name);
            return (
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
                    alt={composeText(craft.name)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <Star className="w-20 h-20 text-gray-400" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />

                {/* Difficulty Badge */}
                {difficulty && (
                  <div className="absolute top-4 left-4 z-20">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-lg border border-white/20 transition-all duration-300 group-hover:scale-105 ${difficulty.color}`}>
                      <span className="text-xs font-bold tracking-wider">{`Cấp ${difficulty.level} • ${difficulty.label}`}</span>
                    </div>
                  </div>
                )}

                <div className="absolute left-5 bottom-5 right-5 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30">
                  <h3 className="text-lg md:text-xl font-semibold text-[#27221b] truncate">{composeText(craft.name)}</h3>
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
          )})}
        </div>
      </div>

      {showLevelModal && selectedCraft && isPotteryCraftName(selectedCraft.name) && (
        <BatTrangModal onClose={() => setShowLevelModal(false)} />
      )}

      {showLevelModal && selectedCraft && isFishSauceCraftName(selectedCraft.name) && (
        <MamNamOModal onClose={() => setShowLevelModal(false)} isOpen={showLevelModal} />
      )}

      {showLevelModal && selectedCraft && !isPotteryCraftName(selectedCraft.name) && !isFishSauceCraftName(selectedCraft.name) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-6 transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-100 transform transition-transform duration-300">
            <div className="p-6 bg-gradient-to-r from-amber-600 to-emerald-600 text-white relative rounded-t-2xl">
              <button
                onClick={() => setShowLevelModal(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              <h2 className="text-3xl font-extrabold mb-1 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {composeText(selectedCraft.name)}
              </h2>
              <p className="text-sm text-white/95">Chọn cấp độ để bắt đầu</p>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
              <div className="space-y-4">
                {levels.map((level) => (
                  <div
                    key={level.id}
                    className={`group flex items-center gap-4 p-4 rounded-xl border ${level.unlocked ? 'bg-gradient-to-r from-yellow-50 to-white border-amber-200' : 'bg-white/60 border-gray-200'} shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${level.unlocked ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-500'} text-lg font-semibold`}> 
                      {level.unlocked ? <span className="text-lg font-bold">{level.id}</span> : <Lock className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className={`text-lg font-semibold ${level.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>Cấp {level.id}</div>
                      <div className={`text-sm ${level.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>{level.name}</div>
                    </div>
                    <div>
                      {level.unlocked ? (
                        <Link to={`/level-${level.id}`}>
                          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors shadow">Chơi ngay</button>
                        </Link>
                      ) : (
                        <div className="text-sm text-gray-500 px-4 py-2 rounded-full border border-gray-200 bg-white/50">Đã khóa</div>
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