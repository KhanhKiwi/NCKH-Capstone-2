import { useState, useEffect } from 'react';
import { Thermometer, Zap, AlertCircle } from 'lucide-react';
import { ActionNotification } from './ActionNotification';
import { AmbientParticles } from './AmbientParticles';
import { AdvancedResultScreen } from './AdvancedResultScreen';

interface MonthlyDecision {
  month: number;
  situation: string;
  options: {
    id: string;
    text: string;
    tempEffect: number;
    humidityEffect: number;
    qualityEffect: number;
  }[];
  selected: string | null;
}

interface GameMetrics {
  month: number;
  temperature: number;
  humidity: number;
  quality: number;
  microbes: number;
  fermentationLevel: number;
}

const SITUATIONS = [
  {
    month: 1,
    situation: '🌞 Mùa hè bắt đầu - Nhiệt độ tăng đột ngột',
    options: [
      { id: 'a', text: '📦 Đặt lu ở góc tối mát (Nhiệt -3°, Chất -2)', tempEffect: -3, humidityEffect: 0, qualityEffect: -2 },
      { id: 'b', text: '💨 Tăng thông gió (Ẩm -5%, Chất +1)', tempEffect: 0, humidityEffect: -5, qualityEffect: 1 },
      { id: 'c', text: '⚖️ Giữ nguyên (Chất +2)', tempEffect: 0, humidityEffect: 0, qualityEffect: 2 }
    ]
  },
  {
    month: 2,
    situation: '🔥 Nắng nóng - Cần kiểm soát chặt chẽ',
    options: [
      { id: 'a', text: '🌊 Phun nước quanh lu (Ẩm +8%, Chất +3)', tempEffect: -1, humidityEffect: 8, qualityEffect: 3 },
      { id: 'b', text: '☀️ Để nắng kiểm soát (Chất +4)', tempEffect: 2, humidityEffect: -2, qualityEffect: 4 },
      { id: 'c', text: '🧊 Dùng khăm nước da (Ẩm +3, Chất +1)', tempEffect: -2, humidityEffect: 3, qualityEffect: 1 }
    ]
  },
  {
    month: 3,
    situation: '🌧️ Mưa xuất hiện - Độ ẩm tăng cao',
    options: [
      { id: 'a', text: '🔒 Đóng kín lu (Ẩm +2, Chất +5)', tempEffect: 0, humidityEffect: 2, qualityEffect: 5 },
      { id: 'b', text: '🌬️ Thông gió (Ẩm -6%, Chất -1)', tempEffect: 0, humidityEffect: -6, qualityEffect: -1 },
      { id: 'c', text: '⚖️ Giữ mở nhẹ (Ẩm 0, Chất +2)', tempEffect: 0, humidityEffect: 0, qualityEffect: 2 }
    ]
  },
  {
    month: 4,
    situation: '🍃 Mùa xuân - Nhiệt độ ổn định, tốt cho ủ',
    options: [
      { id: 'a', text: '✅ Để tự nhiên (Chất +6)', tempEffect: 0, humidityEffect: 0, qualityEffect: 6 },
      { id: 'b', text: '🔄 Khuấy đều (Chất +4, Ẩm -1)', tempEffect: 0, humidityEffect: -1, qualityEffect: 4 },
      { id: 'c', text: '📦 Thêm lớp muối (Chất +3)', tempEffect: 0, humidityEffect: 0, qualityEffect: 3 }
    ]
  },
  {
    month: 5,
    situation: '🌡️ Nhiệt độ cao tiếp tục - Vi sinh vật hoạt động tốt',
    options: [
      { id: 'a', text: '🎯 Theo dõi gần (Chất +5)', tempEffect: 0, humidityEffect: 0, qualityEffect: 5 },
      { id: 'b', text: '😴 Để tự phát triển (Chất +7)', tempEffect: 1, humidityEffect: 2, qualityEffect: 7 },
      { id: 'c', text: '⛔ Giảm nhiệt (Nhiệt -2, Chất +2)', tempEffect: -2, humidityEffect: 0, qualityEffect: 2 }
    ]
  },
  {
    month: 6,
    situation: '🌪️ Gió mùa hè - Biến động thời tiết',
    options: [
      { id: 'a', text: '🔐 Bảo vệ lu (Chất +3)', tempEffect: 0, humidityEffect: 0, qualityEffect: 3 },
      { id: 'b', text: '🌊 Thông gió tự nhiên (Ẩm -3%, Chất +2)', tempEffect: 0, humidityEffect: -3, qualityEffect: 2 },
      { id: 'c', text: '❄️ Giảm nhiệt độ (Nhiệt -4, Chất 0)', tempEffect: -4, humidityEffect: 0, qualityEffect: 0 }
    ]
  },
  {
    month: 7,
    situation: '🔥 Cao điểm mùa hè - Kiểm soát khó khăn',
    options: [
      { id: 'a', text: '💪 Tăng kiểm soát (Chất +6)', tempEffect: 0, humidityEffect: 0, qualityEffect: 6 },
      { id: 'b', text: '⚡ Để mạnh mẽ (Chất +8)', tempEffect: 2, humidityEffect: 3, qualityEffect: 8 },
      { id: 'c', text: '🛡️ Bảo vệ tối đa (Chất +4)', tempEffect: -3, humidityEffect: 1, qualityEffect: 4 }
    ]
  },
  {
    month: 8,
    situation: '📉 Mùa hè kết thúc - Vi sinh vật bắt đầu ổn định',
    options: [
      { id: 'a', text: '✨ Để tự phát triển (Chất +7)', tempEffect: 0, humidityEffect: 0, qualityEffect: 7 },
      { id: 'b', text: '🧪 Kiểm tra chất lượng (Chất +5)', tempEffect: 0, humidityEffect: 0, qualityEffect: 5 },
      { id: 'c', text: '⚖️ Cân bằng (Chất +6)', tempEffect: -1, humidityEffect: -1, qualityEffect: 6 }
    ]
  },
  {
    month: 9,
    situation: '🍂 Mùa thu - Nhiệt độ giảm dần',
    options: [
      { id: 'a', text: '🌤️ Giữ ấm (Nhiệt +2, Chất +5)', tempEffect: 2, humidityEffect: 0, qualityEffect: 5 },
      { id: 'b', text: '💨 Để mát tự nhiên (Chất +4)', tempEffect: 0, humidityEffect: 0, qualityEffect: 4 },
      { id: 'c', text: '🔄 Khuấy cuối cùng (Chất +6)', tempEffect: 0, humidityEffect: 0, qualityEffect: 6 }
    ]
  },
  {
    month: 10,
    situation: '🌤️ Thời tiết mát mẻ - Điều kiện hoàn hảo',
    options: [
      { id: 'a', text: '👑 Để hoàn thiện (Chất +8)', tempEffect: 0, humidityEffect: 0, qualityEffect: 8 },
      { id: 'b', text: '🎯 Chạm dứt hoàn (Chất +6)', tempEffect: 0, humidityEffect: 0, qualityEffect: 6 },
      { id: 'c', text: '⚡ Kết thúc sớm (Chất +4)', tempEffect: 0, humidityEffect: 0, qualityEffect: 4 }
    ]
  },
  {
    month: 11,
    situation: '❄️ Mùa đông sắp tới - Chuẩn bị hoàn tất',
    options: [
      { id: 'a', text: '🏆 Hoàn thiện tuyệt vời (Chất +9)', tempEffect: 0, humidityEffect: 0, qualityEffect: 9 },
      { id: 'b', text: '✅ Kết thúc bình thường (Chất +6)', tempEffect: 0, humidityEffect: 0, qualityEffect: 6 },
      { id: 'c', text: '🧊 Bảo quản mùa đông (Chất +7)', tempEffect: -2, humidityEffect: 1, qualityEffect: 7 }
    ]
  },
  {
    month: 12,
    situation: '🎉 Mùa đông cuối - Kết quả cuối cùng',
    options: [
      { id: 'a', text: '🌟 Sản phẩm tuyệt vời (Chất +10)', tempEffect: 0, humidityEffect: 0, qualityEffect: 10 },
      { id: 'b', text: '👍 Đạt tiêu chuẩn (Chất +8)', tempEffect: 0, humidityEffect: 0, qualityEffect: 8 },
      { id: 'c', text: '✓ Hoàn thành (Chất +6)', tempEffect: 0, humidityEffect: 0, qualityEffect: 6 }
    ]
  }
];

interface AdvancedFermentationGameProps {
  onGameEnd: (passed: boolean, quality: number) => void;
}

export function AdvancedFermentationGame({ onGameEnd }: AdvancedFermentationGameProps) {
  const [month, setMonth] = useState(1);
  const [temperature, setTemperature] = useState(30);
  const [humidity, setHumidity] = useState(75);
  const [quality, setQuality] = useState(50);
  const [microbes, setMicrobes] = useState(50);
  const [fermentationLevel, setFermentationLevel] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [finalQuality, setFinalQuality] = useState(50);
  const [gamePassed, setGamePassed] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const [decisions, setDecisions] = useState<MonthlyDecision[]>([]);
  const [showDecision, setShowDecision] = useState(true);
  const [history, setHistory] = useState<GameMetrics[]>([]);

  useEffect(() => {
    const monthlyDecisions: MonthlyDecision[] = SITUATIONS.map(sit => ({
      month: sit.month,
      situation: sit.situation,
      options: sit.options,
      selected: null
    }));
    setDecisions(monthlyDecisions);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameFinished || !showDecision) return;

      switch (e.key) {
        case 'a':
        case 'A':
          handleDecision('a');
          break;
        case 's':
        case 'S':
          handleDecision('b');
          break;
        case 'd':
        case 'D':
          handleDecision('c');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameFinished, showDecision]);

  const handleDecision = (optionId: string) => {
    if (gameFinished || month > 12 || !showDecision) return;

    const currentMonth = SITUATIONS[month - 1];
    const selectedOption = currentMonth.options.find(opt => opt.id === optionId);

    if (!selectedOption || !decisions[month - 1]) return;

    // Disable input immediately
    setShowDecision(false);

    const newTemp = Math.max(20, Math.min(40, temperature + selectedOption.tempEffect));
    const newHumidity = Math.max(60, Math.min(90, humidity + selectedOption.humidityEffect));
    const newQuality = Math.max(0, Math.min(100, quality + selectedOption.qualityEffect));
    const newMicrobes = Math.max(0, Math.min(100, microbes + (selectedOption.qualityEffect * 0.8)));
    const newFermentation = fermentationLevel + (month * 8.33);

    setTemperature(newTemp);
    setHumidity(newHumidity);
    setQuality(newQuality);
    setMicrobes(newMicrobes);
    setFermentationLevel(newFermentation);

    setHistory([
      ...history,
      {
        month,
        temperature: newTemp,
        humidity: newHumidity,
        quality: newQuality,
        microbes: newMicrobes,
        fermentationLevel: newFermentation
      }
    ]);

    const updatedDecisions = [...decisions];
    if (updatedDecisions[month - 1]) {
      updatedDecisions[month - 1].selected = optionId;
      setDecisions(updatedDecisions);
    }

    setNotification({
      show: true,
      message: `✅ Tháng ${month}: ${selectedOption.text.split('(')[0]}`
    });

    if (month < 12) {
      setTimeout(() => {
        setMonth(month + 1);
        setShowDecision(true);
      }, 800);
    } else {
      setTimeout(() => {
        finishGame(newQuality);
      }, 800);
    }
  };

  const finishGame = (finalQual: number) => {
    const passed = finalQual >= 75;
    setFinalQuality(finalQual);
    setGamePassed(passed);
    setGameFinished(true);
    onGameEnd(passed, finalQual);
  };

  if (gameFinished) {
    return (
      <AdvancedResultScreen
        passed={gamePassed}
        finalQuality={finalQuality}
        history={history}
        temperature={temperature}
        humidity={humidity}
      />
    );
  }

  const currentSituation = SITUATIONS[month - 1];

  return (
    <div className="min-h-screen w-full relative overflow-auto bg-gradient-to-b from-[#f5f0e8] to-[#e8dcc8]">
      <AmbientParticles />
      <ActionNotification
        message={notification.message}
        show={notification.show}
        onClose={() => setNotification({ show: false, message: '' })}
      />

      <div className="relative min-h-screen max-w-[1600px] mx-auto px-4 py-6">
        <header className="mb-8">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-[#d4a574]/30 shadow-lg p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-bold text-[#3d2b1f] mb-2">
                  🏺 Ủ Chượp Truyền Thống
                </h1>
                <p className="text-lg text-[#5f7c8a] font-semibold">
                  Tháng {month}/12 - Quá trình lên men
                </p>
              </div>
              <div className="flex gap-4 flex-wrap">
                <div className="bg-gradient-to-br from-[#b87333]/20 to-[#a0522d]/20 px-6 py-4 rounded-xl border border-[#b87333]/30 text-center">
                  <div className="text-xs opacity-70 mb-1">🎯 Chất Lượng</div>
                  <div className="text-3xl font-bold text-[#3d2b1f]">{quality.toFixed(1)}%</div>
                  <div className="text-xs mt-1 text-[#5f7c8a]">
                    {quality >= 80
                      ? '⭐ Tuyệt vời'
                      : quality >= 60
                      ? '👍 Tốt'
                      : '⚠️ Cần cải thiện'}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#5f7c8a]/20 to-[#8b7355]/20 px-6 py-4 rounded-xl border border-[#5f7c8a]/30 text-center">
                  <div className="text-xs opacity-70 mb-1">🔬 Vi Sinh Vật</div>
                  <div className="text-3xl font-bold text-[#5f7c8a]">{microbes.toFixed(0)}%</div>
                </div>

                <div className="bg-gradient-to-br from-[#5c3d2e]/20 to-[#a0522d]/20 px-6 py-4 rounded-xl border border-[#5c3d2e]/30 text-center">
                  <div className="text-xs opacity-70 mb-1">📊 Lên Men</div>
                  <div className="text-3xl font-bold text-[#5c3d2e]">{fermentationLevel.toFixed(0)}%</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-[#d4a574]/30 shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#3d2b1f] mb-6 flex items-center gap-2">
              <Thermometer className="text-red-500" size={24} />
              Điều Kiện Môi Trường
            </h3>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-[#3d2b1f]">Nhiệt độ</span>
                <span className="text-2xl font-bold text-[#3d2b1f]">{temperature.toFixed(1)}°C</span>
              </div>
              <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 via-orange-400 to-red-500 transition-all duration-300"
                  style={{ width: `${((temperature - 20) / 20) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1 opacity-60">
                <span>20°C</span>
                <span className="text-[#5f7c8a] font-bold">28-32°C (Tối ưu)</span>
                <span>40°C</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-[#3d2b1f]">Độ Ẩm</span>
                <span className="text-2xl font-bold text-[#3d2b1f]">{humidity.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-300 via-blue-400 to-blue-600 transition-all duration-300"
                  style={{ width: `${((humidity - 60) / 30) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1 opacity-60">
                <span>60%</span>
                <span className="text-[#5f7c8a] font-bold">70-85% (Tối ưu)</span>
                <span>90%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-[#d4a574]/30 shadow-lg p-6">
            <h3 className="text-lg font-bold text-[#3d2b1f] mb-6 flex items-center gap-2">
              <Zap className="text-amber-500" size={24} />
              Tiến Trình 12 Tháng
            </h3>

            <div className="space-y-3">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    i + 1 < month
                      ? 'bg-green-100 border border-green-300'
                      : i + 1 === month
                      ? 'bg-blue-100 border border-blue-400 font-bold'
                      : 'bg-gray-100 border border-gray-300 opacity-60'
                  }`}
                >
                  <span className="font-bold w-8 text-center text-[#3d2b1f]">{i + 1}</span>
                  <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#b87333] to-[#5f7c8a]"
                      style={{ width: `${((i + 1) / 12) * 100}%` }}
                    />
                  </div>
                  {decisions[i]?.selected && (
                    <span className="text-lg">
                      {decisions[i].selected === 'a'
                        ? '🅰️'
                        : decisions[i].selected === 'b'
                        ? '🅱️'
                        : '🅲'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {showDecision && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-[#b87333]/50 shadow-2xl p-8 mb-8">
            <div className="mb-6">
              <p className="text-2xl font-bold text-[#3d2b1f] mb-3">{currentSituation.situation}</p>
              <p className="text-sm opacity-70 text-[#5f7c8a]">
                Chọn phương án xử lý tốt nhất. Nhấn: <span className="font-bold">A</span> |{' '}
                <span className="font-bold">S</span> | <span className="font-bold">D</span>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentSituation.options.map((option, idx) => {
                const keys = ['A', 'S', 'D'];
                const isSelected = decisions[month - 1]?.selected === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleDecision(option.id)}
                    className={`relative p-5 rounded-xl border-2 transition-all transform hover:scale-102 active:scale-95 ${
                      isSelected
                        ? 'border-[#5f7c8a] bg-[#5f7c8a]/10 shadow-lg'
                        : 'border-[#d4a574] bg-white hover:border-[#b87333] hover:bg-[#f5f0e8]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-[#3d2b1f] text-white flex items-center justify-center font-bold text-lg">
                          {keys[idx]}
                        </div>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-[#3d2b1f] mb-2 text-lg">{option.text}</p>
                        <div className="flex gap-4 flex-wrap text-xs opacity-70">
                          {option.tempEffect !== 0 && (
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                              🌡️ {option.tempEffect > 0 ? '+' : ''}{option.tempEffect}°C
                            </span>
                          )}
                          {option.humidityEffect !== 0 && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              💧 {option.humidityEffect > 0 ? '+' : ''}{option.humidityEffect}%
                            </span>
                          )}
                          {option.qualityEffect !== 0 && (
                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded">
                              ⭐ {option.qualityEffect > 0 ? '+' : ''}{option.qualityEffect}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-[#5f7c8a]/10 rounded-lg border border-[#5f7c8a]/30 flex items-start gap-3">
              <AlertCircle className="text-[#5f7c8a] flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-[#3d2b1f] opacity-80">
                💡 Mỗi quyết định ảnh hưởng đến nhiệt độ, độ ẩm và chất lượng chượp. Cân bằng tốt để
                đạt kết quả tuyệt vời!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
