import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface BlendingPhaseProps {
  onComplete: (qualityBonus: number) => void;
  timeLimit: number;
}

interface Bottle {
  id: string;
  name: string;
  color: string;
  umami: number;
  saltiness: number;
  aroma: number;
  aftertaste: number;
  colorQuality: number;
  isBad: boolean;
  placed: boolean;
}

export function BlendingPhase({ onComplete, timeLimit }: BlendingPhaseProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [bottles, setBottles] = useState<Bottle[]>([
    {
      id: '1',
      name: 'Lô A',
      color: '#B45309',
      umami: 80,
      saltiness: 70,
      aroma: 85,
      aftertaste: 75,
      colorQuality: 80,
      isBad: false,
      placed: false
    },
    {
      id: '2',
      name: 'Lô B',
      color: '#92400E',
      umami: 75,
      saltiness: 80,
      aroma: 78,
      aftertaste: 82,
      colorQuality: 76,
      isBad: Math.random() < 0.33,
      placed: false
    },
    {
      id: '3',
      name: 'Lô C',
      color: '#A16207',
      umami: 78,
      saltiness: 75,
      aroma: 82,
      aftertaste: 78,
      colorQuality: 79,
      isBad: Math.random() < 0.33,
      placed: false
    },
    {
      id: '4',
      name: 'Lô D',
      color: '#D97706',
      umami: 82,
      saltiness: 72,
      aroma: 88,
      aftertaste: 80,
      colorQuality: 83,
      isBad: false,
      placed: false
    }
  ]);

  const [qualityBonus, setQualityBonus] = useState(0);
  const [blendedProfile, setBlendedProfile] = useState({
    umami: 0,
    saltiness: 0,
    aroma: 0,
    aftertaste: 0,
    colorQuality: 0
  });
  const phaseCompleteRef = useRef(false);

  // Keyboard listener for bottle selection
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const bottleMap: { [key: string]: string } = {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4'
      };
      
      if (bottleMap[e.key]) {
        e.preventDefault();
        handleAddBottle(bottleMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [bottles]);

  // Timer
  useEffect(() => {
    if (phaseCompleteRef.current) return;
    
    if (timeRemaining <= 0) {
      phaseCompleteRef.current = true;
      onComplete(qualityBonus);
      return;
    }

    const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeRemaining]);

  // Click button to add bottle instead of drag
  const handleAddBottle = (bottleId: string) => {
    const bottle = bottles.find(b => b.id === bottleId);
    if (!bottle || bottle.placed) return;

    // Penalty if bad bottle is used
    if (bottle.isBad) {
      setQualityBonus(prev => Math.max(-40, prev - 20));
      toast.error(`⚠️ Lô ${bottle.name} bị lỗi! -20%`, { duration: 2000 });
    } else {
      setQualityBonus(prev => prev + 8);
      toast.success(`✓ Thêm Lô ${bottle.name} +8%`, { duration: 2000 });
    }

    // Update blended profile (average the values)
    setBlendedProfile(prev => {
      const placedCount = bottles.filter(b => b.placed).length;
      return {
        umami: (prev.umami * placedCount + bottle.umami) / (placedCount + 1),
        saltiness: (prev.saltiness * placedCount + bottle.saltiness) / (placedCount + 1),
        aroma: (prev.aroma * placedCount + bottle.aroma) / (placedCount + 1),
        aftertaste: (prev.aftertaste * placedCount + bottle.aftertaste) / (placedCount + 1),
        colorQuality: (prev.colorQuality * placedCount + bottle.colorQuality) / (placedCount + 1)
      };
    });

    // Mark bottle as placed
    setBottles(prev => prev.map(b => b.id === bottleId ? { ...b, placed: true } : b));
  };

  const isBalanced =
    blendedProfile.umami >= 75 &&
    blendedProfile.saltiness >= 75 &&
    blendedProfile.aroma >= 75 &&
    blendedProfile.aftertaste >= 75 &&
    blendedProfile.colorQuality >= 75;

  const placedCount = bottles.filter(b => b.placed).length;

  return (
    <div className="relative w-full rounded-xl bg-gradient-to-br from-purple-900/20 to-slate-900/40 border border-purple-600/30 backdrop-blur-sm p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-amber-100 mb-2">🧪 Bước 3: Pha Trộn</h2>
        <p className="text-amber-200/60 text-sm">Thời gian còn lại: {timeRemaining}s</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Bottles to add */}
        <div>
          <h3 className="text-amber-100 font-semibold mb-4">👇 Bấm hoặc nhấn phím 1-4 để thêm lô vào bình trộn</h3>
          <div className="space-y-3">
            {bottles.map((bottle, index) => (
              <motion.button
                key={bottle.id}
                onClick={() => handleAddBottle(bottle.id)}
                disabled={bottle.placed}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  bottle.placed
                    ? 'opacity-50 border-slate-600 bg-slate-700/20 cursor-not-allowed'
                    : 'border-purple-400 bg-purple-600/20 hover:bg-purple-500/30 hover:border-purple-300 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 rounded-lg border-2 border-amber-400 flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: bottle.color }}
                  >
                    🫙
                  </motion.div>
                  <div className="flex-1">
                    <p className="font-semibold text-amber-100">{bottle.name}</p>
                    <p className="text-xs text-amber-200/60">
                      {bottle.placed ? '✓ Đã dùng' : `Nhấn ${index + 1} hoặc bấm để thêm`}
                    </p>
                  </div>
                  {bottle.isBad && !bottle.placed && (
                    <motion.div
                      className="text-lg flex-shrink-0"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ⚠️
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right: Blending status and profile */}
        <div>
          <h3 className="text-amber-100 font-semibold mb-4">📊 Tình Trạng Pha Trộn</h3>

          {/* Blender status */}
          <motion.div
            className="relative h-32 rounded-lg border-4 border-purple-400 bg-gradient-to-b from-purple-600/10 to-slate-800/30 flex flex-col items-center justify-center mb-6"
            animate={{
              borderColor: placedCount > 0 ? ['#c084fc', '#e879f9', '#c084fc'] : '#a78bfa'
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <div className="text-center">
              <div className="text-5xl mb-2">🫙</div>
              <p className="text-amber-100 font-semibold">{placedCount}/4 lô đã thêm</p>
              <p className="text-xs text-amber-200/60">Cần ít nhất 3 lô</p>
            </div>
          </motion.div>

          {/* Flavor Profile Bars */}
          <div className="space-y-3">
            <p className="text-amber-100 font-semibold text-sm">🎨 Hương Vị Pha Trộn</p>
            {[
              { label: 'Umami', value: blendedProfile.umami },
              { label: 'Mặn', value: blendedProfile.saltiness },
              { label: 'Mùi', value: blendedProfile.aroma },
              { label: 'Vị lâu', value: blendedProfile.aftertaste },
              { label: 'Màu sắc', value: blendedProfile.colorQuality }
            ].map(flavor => (
              <div key={flavor.label}>
                <div className="flex justify-between text-xs text-amber-200 mb-1">
                  <span>{flavor.label}</span>
                  <span className="font-semibold">{Math.round(flavor.value)}%</span>
                </div>
                <div className="h-3 bg-slate-700/40 rounded-full overflow-hidden border border-slate-600/40">
                  <motion.div
                    className={`h-full transition-all ${
                      flavor.value >= 70
                        ? 'bg-gradient-to-r from-green-500 to-green-400'
                        : flavor.value >= 50
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                        : 'bg-gradient-to-r from-red-500 to-red-400'
                    }`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.min(flavor.value, 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Balance status */}
          <AnimatePresence>
            {isBalanced && placedCount >= 3 && (
              <motion.div
                className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-400 text-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <p className="text-green-300 font-bold">✓ Hương vị cân bằng tốt!</p>
                <p className="text-xs text-green-200 mt-1">Bonus: +10% Chất lượng</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Complete Button */}
      <div className="mt-8 text-center">
        <motion.button
          onClick={() => {
            phaseCompleteRef.current = true;
            const finalBonus = qualityBonus + (isBalanced && placedCount >= 3 ? 10 : 0);
            onComplete(finalBonus);
          }}
          disabled={placedCount < 3}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${
            placedCount < 3
              ? 'bg-slate-700/40 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
          }`}
          whileHover={placedCount >= 3 ? { scale: 1.05 } : {}}
          whileTap={placedCount >= 3 ? { scale: 0.95 } : {}}
        >
          Tiếp tục → Đánh Giá ({placedCount}/3)
        </motion.button>
      </div>
    </div>
  );
}
