import { useState, useEffect } from 'react';
import { Plus, Minus, Info } from 'lucide-react';
import { JarDisplay } from './JarDisplay';
import { ControlPanel } from './ControlPanel';

import { ResultScreen } from './ResultScreen';
import { ActionNotification } from './ActionNotification';
import { AmbientParticles } from './AmbientParticles';
import { ChoupGenome } from './ChoupGenome';

interface FermentationGameProps {
  onGameEnd: (passed: boolean, quality: number) => void;
}

const TEMP_MIN = 28;
const TEMP_MAX = 32;
const HUMIDITY_MIN = 70;
const HUMIDITY_MAX = 85;

export function FermentationGame({ onGameEnd }: FermentationGameProps) {
  const [month, setMonth] = useState(1);
  const [quality, setQuality] = useState(50);
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(70);
  const [fillLevel, setFillLevel] = useState(0.5);
  const [isSealed, setIsSealed] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [finalQuality, setFinalQuality] = useState(50);
  const [gamePassed, setGamePassed] = useState(false);
  const [phase, setPhase] = useState<'preparation' | 'fermentation' | 'finished'>('preparation');
  const [_stage, _setStage] = useState('Chuẩn bị');
  const [timeInRange, setTimeInRange] = useState(0);
  const [notification, setNotification] = useState({ show: false, message: '' });

  const isInOptimalRange = 
    temperature >= TEMP_MIN && temperature <= TEMP_MAX &&
    humidity >= HUMIDITY_MIN && humidity <= HUMIDITY_MAX;

  const handleAction = (action: string) => {
    const messages: Record<string, string> = {
      seal: 'Đã đóng nắp lu thành công',
      compress: 'Đã nén chặt hỗn hợp cá muối',
      protect: 'Đã phủ lớp muối bảo vệ hoàn tất',
      hermetic: 'Lu đã được niêm phong kín khí',
      ferment: 'Bắt đầu quá trình lên men truyền thống'
    };

    switch (action) {
      case 'seal':
        setFillLevel(f => Math.min(1, f + 0.1));
        setQuality(q => Math.min(100, q + 5));
        break;
      case 'compress':
        setFillLevel(f => Math.min(1, f + 0.08));
        setQuality(q => Math.min(100, q + 3));
        break;
      case 'protect':
        setQuality(q => Math.min(100, q + 4));
        break;
      case 'hermetic':
        setIsSealed(true);
        setQuality(q => Math.min(100, q + 3));
        break;
      case 'ferment':
        setIsSealed(true);
        setPhase('fermentation');
        _setStage('Ủ chượp');
        setTemperature(30);
        setHumidity(75);
        break;
    }

    setNotification({ show: true, message: messages[action] || 'Thao tác hoàn tất' });
  };

  // Fermentation simulation
  useEffect(() => {
    if (phase !== 'fermentation') return;

    const interval = setInterval(() => {
      setMonth(m => {
        const nextMonth = m + 1;
        
        if (nextMonth > 12) {
          const percentInRange = (timeInRange / 12) * 100;
          const qualityBoost = (percentInRange / 100) * 30;
          const calculatedQuality = Math.max(0, Math.min(100, quality + qualityBoost));
          const passed = calculatedQuality >= 85;
          
          setFinalQuality(calculatedQuality);
          setGamePassed(passed);
          setGameFinished(true);
          setPhase('finished');
          _setStage('Hoàn thành');
          
          onGameEnd(passed, calculatedQuality);
          return m;
        }
        return nextMonth;
      });

      setTimeInRange(t => isInOptimalRange ? t + 1 : t);

      setTemperature(t => {
        const change = (Math.random() - 0.5) * 3;
        return Math.max(15, Math.min(40, t + change));
      });

      setHumidity(h => {
        const change = (Math.random() - 0.5) * 4;
        return Math.max(30, Math.min(95, h + change));
      });

      setQuality(q => {
        if (isInOptimalRange) {
          return Math.min(100, q + 0.5);
        } else {
          const tempDiff = Math.abs(temperature - 30);
          const humidityDiff = Math.abs(humidity - 77.5);
          const penalty = (tempDiff + humidityDiff) * 0.1;
          return Math.max(0, q - penalty);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, quality, timeInRange, temperature, humidity, isInOptimalRange, onGameEnd]);

  const adjustTemperature = (delta: number) => {
    setTemperature(t => Math.max(15, Math.min(40, t + delta)));
  };

  const adjustHumidity = (delta: number) => {
    setHumidity(h => Math.max(30, Math.min(95, h + delta)));
  };

  if (gameFinished) {
    return (
      <ResultScreen 
        passed={gamePassed} 
        finalQuality={finalQuality}
        history={[]}
        temperature={temperature}
        humidity={humidity}
      />
    );
  }

  if (phase === 'fermentation') {
    return (
      <div className="min-h-screen w-full relative overflow-auto">
        <ActionNotification
          message={notification.message}
          show={notification.show}
          onClose={() => setNotification({ show: false, message: '' })}
        />

        <div className="fixed inset-0 -z-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1677128344393-f5b0e778e181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a1f17]/60 via-[#2a1f17]/50 to-[#2a1f17]/70" />
        </div>

        <AmbientParticles />

        <div className="relative min-h-screen max-w-[1600px] mx-auto px-4 py-6">
          {/* Header */}
          <div className="bg-card/70 backdrop-blur-xl rounded-xl border border-border shadow-lg p-5 mb-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-center">
                <h1 className="text-2xl font-bold text-[#3d2b1f] mb-2">
                  Quá trình Ủ Chượp
                </h1>
                <p className="text-lg text-[#5f7c8a] font-semibold">Tháng {month}/12</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center bg-gradient-to-br from-[#5f7c8a]/20 to-[#a0522d]/20 px-4 py-3 rounded-lg border border-[#5f7c8a]/30">
                  <p className="text-xs opacity-70">Chất lượng</p>
                  <p className="text-2xl font-bold text-[#3d2b1f]">{quality.toFixed(1)}%</p>
                </div>
                <div className="text-center bg-gradient-to-br from-[#5f7c8a]/20 to-[#a0522d]/20 px-4 py-3 rounded-lg border border-[#5f7c8a]/30">
                  <p className="text-xs opacity-70">Trong Range</p>
                  <p className="text-2xl font-bold text-[#5f7c8a]">{timeInRange}s</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Jar Display */}
            <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-8">
              <h2 className="text-lg text-[#3d2b1f] mb-6 font-semibold">Lu sành Truyền Thống</h2>
              <JarDisplay fillLevel={fillLevel} isSealed={isSealed} />
            </div>

            {/* Chượp Genome */}
            <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-8">
              <h2 className="text-lg text-[#3d2b1f] mb-6 font-semibold">Phân tích Vi Sinh</h2>
              <div className="flex flex-col items-center justify-center">
                <ChoupGenome quality={quality} />
              </div>
            </div>

            {/* Control Panel */}
            <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-8">
              <h2 className="text-lg text-[#3d2b1f] mb-6 font-semibold">Điều Chỉnh Môi Trường</h2>
              
              {/* Temperature Control */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-[#3d2b1f]">Nhiệt độ</label>
                  <span className={`text-lg font-bold ${isInOptimalRange && temperature >= TEMP_MIN && temperature <= TEMP_MAX ? 'text-[#5f7c8a]' : 'text-[#b87333]'}`}>
                    {temperature.toFixed(1)}°C
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => adjustTemperature(-1)}
                    className="p-2 bg-[#b87333] hover:bg-[#a0522d] text-white rounded-lg transition"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                    <div className="absolute h-full bg-gradient-to-r from-[#8b4513] via-[#5f7c8a] to-[#8b4513] rounded-full" 
                      style={{
                        left: '0%',
                        width: '100%',
                        opacity: 0.3
                      }}
                    />
                    <div className="absolute h-full bg-[#5f7c8a] rounded-full" 
                      style={{
                        left: `${((TEMP_MIN - 15) / 25) * 100}%`,
                        width: `${((TEMP_MAX - TEMP_MIN) / 25) * 100}%`
                      }}
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#3d2b1f] rounded-full border-2 border-white shadow-lg"
                      style={{
                        left: `calc(${((temperature - 15) / 25) * 100}% - 8px)`
                      }}
                    />
                  </div>
                  <button
                    onClick={() => adjustTemperature(1)}
                    className="p-2 bg-[#b87333] hover:bg-[#a0522d] text-white rounded-lg transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <p className="text-xs opacity-60 text-center">Tối ưu: {TEMP_MIN}-{TEMP_MAX}°C</p>
              </div>

              {/* Humidity Control */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-[#3d2b1f]">Độ Ẩm</label>
                  <span className={`text-lg font-bold ${isInOptimalRange && humidity >= HUMIDITY_MIN && humidity <= HUMIDITY_MAX ? 'text-[#5f7c8a]' : 'text-[#b87333]'}`}>
                    {humidity.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => adjustHumidity(-1)}
                    className="p-2 bg-[#b87333] hover:bg-[#a0522d] text-white rounded-lg transition"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                    <div className="absolute h-full bg-gradient-to-r from-[#8b4513] via-[#5f7c8a] to-[#8b4513] rounded-full"
                      style={{
                        left: '0%',
                        width: '100%',
                        opacity: 0.3
                      }}
                    />
                    <div className="absolute h-full bg-[#5f7c8a] rounded-full"
                      style={{
                        left: `${((HUMIDITY_MIN - 30) / 65) * 100}%`,
                        width: `${((HUMIDITY_MAX - HUMIDITY_MIN) / 65) * 100}%`
                      }}
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#3d2b1f] rounded-full border-2 border-white shadow-lg"
                      style={{
                        left: `calc(${((humidity - 30) / 65) * 100}% - 8px)`
                      }}
                    />
                  </div>
                  <button
                    onClick={() => adjustHumidity(1)}
                    className="p-2 bg-[#b87333] hover:bg-[#a0522d] text-white rounded-lg transition"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <p className="text-xs opacity-60 text-center">Tối ưu: {HUMIDITY_MIN}-{HUMIDITY_MAX}%</p>
              </div>

              {/* Status */}
              <div className={`mt-8 p-4 rounded-lg border-2 ${isInOptimalRange ? 'bg-[rgba(95,124,138,0.1)] border-[#5f7c8a]' : 'bg-[rgba(184,115,51,0.1)] border-[#b87333]'}`}>
                <p className={`text-sm font-semibold text-center ${isInOptimalRange ? 'text-[#5f7c8a]' : 'text-[#b87333]'}`}>
                  {isInOptimalRange ? '✓ Trong Range Tối Ưu' : '✗ Ngoài Range Tối Ưu'}
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-gradient-to-br from-[#3d2b1f]/80 to-[#5c3d2e]/80 backdrop-blur-xl rounded-2xl border border-[#8b7355]/30 shadow-2xl p-8 text-[#f5f0e8]">
            <h3 className="text-lg mb-4 flex items-center gap-3">
              <Info className="w-6 h-6" />
              Hướng Dẫn
            </h3>
            <p className="text-sm leading-relaxed">
              Sử dụng nút +/- để điều chỉnh nhiệt độ và độ ẩm vào range tối ưu. Càng lâu giữ được trong range, chất lượng càng cao. 
              Sau 12 tháng, nếu chất lượng ≥ 85% bạn sẽ thắng!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Preparation phase
  return (
    <div className="min-h-screen w-full relative overflow-auto">
      <div className="fixed inset-0 -z-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1677128344393-f5b0e778e181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1f17]/60 via-[#2a1f17]/50 to-[#2a1f17]/70" />
      </div>

      <AmbientParticles />

      <div className="relative min-h-screen max-w-[1600px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-8">
            <h1 className="text-4xl font-bold text-[#3d2b1f] mb-4">Ủ Chượp</h1>
            <p className="text-xl text-[#6b5638] mb-8">Quá trình lên men truyền thống</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-semibold text-[#3d2b1f]">Chuẩn bị công đoạn</p>
                  <p className="text-sm text-[#6b5638]">Hoàn thành 5 bước chuẩn bị để tăng chất lượng ban đầu</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎮</span>
                <div>
                  <p className="font-semibold text-[#3d2b1f]">Quản lý môi trường</p>
                  <p className="text-sm text-[#6b5638]">Giữ nhiệt độ 28-32°C và độ ẩm 70-85%</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-semibold text-[#3d2b1f]">Đạt chất lượng</p>
                  <p className="text-sm text-[#6b5638]">Sau 12 tháng, cần đạt ≥ 85% để thắng</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-[#3d2b1f] mb-6">Bảng Điều Khiển Công Đoạn</h2>
            <ControlPanel onAction={handleAction} />
          </div>
        </div>
      </div>
    </div>
  );
}
