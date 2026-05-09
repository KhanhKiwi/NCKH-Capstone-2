import { useState } from 'react';
import { ArrowLeft, Droplet, Wine, Sparkles, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { levelsService } from '../../../api/levels/levelsService';
import { progressService } from '../../../api/progress/progressService';import { getUserId } from '../../../utils/authUtils';import { ImageWithFallback } from '../../figma/ImageWithFallback';

export default function Screen6() {
  const navigate = useNavigate();
  const userId = getUserId();
  const [selectedBottle, setSelectedBottle] = useState(2);
  const [isFilling, setIsFilling] = useState(false);
  const [isSealed, setIsSealed] = useState(false);

  const heritageMetrics = [
    { name: 'Purity of Form', score: 96, subtitle: 'Tinh túy hình thái' },
    { name: 'Balance of Essence', score: 94, subtitle: 'Cân bằng tinh chất' },
    { name: 'Harmony of Spirit', score: 98, subtitle: 'Hòa quyện linh hồn' }
  ];

  const finalScore = Math.round(heritageMetrics.reduce((acc, m) => acc + m.score, 0) / heritageMetrics.length);

  const handleFillBottle = () => {
    setIsFilling(true);
    setTimeout(() => {
      setIsFilling(false);
      setIsSealed(true);
    }, 3000);
  };

  const handleCompletion = async () => {
    try {
      if (userId && isSealed) {
        // Get level 6 from fish sauce village (village_id = 8) - FINAL LEVEL
        const levels = await levelsService.getByVillage(8, userId);
        const level6 = levels.find((l: any) => l.level_number === 6);
        
        if (level6) {
          // Save progress for level 6 (final level)
          const finalScore = 96; // Heritage score
          await progressService.saveProgress({
            level_id: level6.level_id,
            status: 'completed',
            score: finalScore
          });
          
          console.log('[Screen6] Level 6 (FINAL) completed! Craft village will be unlocked by backend.');
        }
      }
    } catch (error) {
      console.error('[Screen6] Error saving progress:', error);
    }
    
    // Navigate back to craft selection after completion
    setTimeout(() => {
      navigate('/craft-selection');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-950 via-stone-900 to-neutral-950 relative overflow-hidden">
      {/* Sacred Background with God Rays */}
      <div className="absolute inset-0 opacity-40">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1626652516034-5b59d2f6309a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
          alt="Sacred workshop altar"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Atmospheric Light Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen w-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 py-6 md:py-8 lg:py-12">

        {/* Top Bar */}
        <motion.header
          className="flex items-center justify-between mb-8 md:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <button className="p-3 rounded-full bg-amber-900/20 backdrop-blur-sm border border-amber-700/30 hover:bg-amber-800/30 transition-all duration-300">
            <ArrowLeft className="w-5 h-5 text-amber-200" />
          </button>

          <div className="text-center flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-5xl tracking-wide text-amber-100 font-serif mb-2">
              Vĩnh Cửu Hương
            </h1>
            <p className="text-xs md:text-sm text-amber-300/70 tracking-wider">
              Nghi thức niêm phong tinh hoa bất diệt của làng Nam Ô
            </p>
          </div>

          <div className="w-14" />
        </motion.header>

        {/* Main Sacred Altar Section */}
        <div className="grid lg:grid-cols-[1fr,400px] xl:grid-cols-[1fr,480px] gap-8 lg:gap-12 xl:gap-16">

          {/* Central Altar - Left Side */}
          <motion.div
            className="flex flex-col items-center justify-center space-y-8 lg:space-y-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >

            {/* Ritual Bottle Display */}
            <div className="relative w-full max-w-2xl aspect-[4/3] flex items-center justify-center">

              {/* Background Bottles (Blurred) */}
              <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-40 blur-sm">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1647943746646-11b6cdf51f0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                  alt="Heritage bottle"
                  className="h-48 w-auto object-contain"
                />
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1647943746660-1640133068d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                  alt="Heritage bottle"
                  className="h-48 w-auto object-contain"
                />
              </div>

              {/* Hero Bottle - Center */}
              <motion.div
                className="relative z-10"
                animate={{
                  y: isFilling ? [0, -5, 0] : 0,
                }}
                transition={{ duration: 2, repeat: isFilling ? Infinity : 0 }}
              >
                <div className="relative">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1647943746352-a700b8a69da0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
                    alt="Sacred fish sauce bottle"
                    className="h-64 md:h-80 lg:h-96 w-auto object-contain drop-shadow-2xl"
                  />

                  {/* Liquid Filling Animation */}
                  {isFilling && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-0 bg-gradient-to-t from-amber-600 via-amber-500 to-transparent opacity-70 blur-sm"
                      animate={{
                        height: ['0%', '60%'],
                        opacity: [0.7, 0.9, 0.7]
                      }}
                      transition={{ duration: 3 }}
                    />
                  )}

                  {/* Sacred Glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-radial from-amber-400/20 via-transparent to-transparent blur-2xl"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />

                  {/* Seal Status Indicator */}
                  {isSealed && (
                    <motion.div
                      className="absolute -top-6 left-1/2 -translate-x-1/2"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', duration: 0.8 }}
                    >
                      <div className="bg-amber-600 rounded-full p-3 shadow-2xl border-2 border-amber-400">
                        <Award className="w-8 h-8 text-amber-100" />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Pouring Bamboo Tool */}
                {isFilling && (
                  <motion.div
                    className="absolute -top-20 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Droplet className="w-12 h-12 text-amber-600 drop-shadow-lg" />
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Bottle Selection */}
            <div className="flex items-center gap-4 md:gap-6">
              {[0, 1, 2, 3, 4].map((idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setSelectedBottle(idx)}
                  className={`relative group ${
                    selectedBottle === idx
                      ? 'scale-110'
                      : 'scale-100 opacity-50 hover:opacity-80'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`w-10 h-14 md:w-12 md:h-16 rounded-lg bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 border-2 transition-all duration-300 ${
                    selectedBottle === idx
                      ? 'border-amber-400 shadow-lg shadow-amber-500/50'
                      : 'border-amber-700/50'
                  }`} />
                  {selectedBottle === idx && (
                    <motion.div
                      className="absolute -inset-1 rounded-lg border-2 border-amber-400/50"
                      layoutId="bottle-selection"
                    />
                  )}
                </motion.button>
              ))}
            </div>

          </motion.div>

          {/* Sacred Assessment Panel - Right Side */}
          <motion.div
            className="flex flex-col space-y-6 lg:space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >

            {/* Legacy Emblem */}
            <div className="relative bg-gradient-to-br from-amber-900/40 via-stone-900/40 to-amber-950/40 backdrop-blur-md rounded-3xl border border-amber-700/30 p-8 md:p-10 shadow-2xl">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1MSwgMTkxLCAzNiwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30 rounded-3xl" />

              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="text-amber-300/70 text-sm tracking-widest uppercase mb-2">
                  Di sản Nam Ô
                </div>

                <motion.div
                  className="relative"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center shadow-2xl shadow-amber-900/50 border-4 border-amber-500/30">
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-amber-400/20"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.2, 0.5]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative z-10">
                      <div className="text-6xl md:text-7xl text-amber-100 font-serif">{finalScore}</div>
                      <div className="text-xs text-amber-300/70 tracking-wider mt-1">ĐIỂM</div>
                    </div>
                  </div>
                </motion.div>

                <div className="text-xl md:text-2xl text-amber-200 font-serif tracking-wide">
                  Legacy Emblem
                </div>
                <div className="text-sm text-amber-300/60">
                  Huy hiệu Di sản Bất diệt
                </div>
              </div>
            </div>

            {/* Heritage Metrics - Ancestral Tablets */}
            <div className="space-y-4">
              <div className="text-amber-200 text-lg md:text-xl font-serif tracking-wide mb-4 text-center">
                Di sản Assessment
              </div>

              {heritageMetrics.map((metric, idx) => (
                <motion.div
                  key={metric.name}
                  className="relative bg-gradient-to-r from-stone-900/60 via-amber-950/40 to-stone-900/60 backdrop-blur-sm rounded-2xl border border-amber-800/30 p-5 md:p-6 shadow-xl overflow-hidden group hover:border-amber-600/50 transition-all duration-500"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + idx * 0.15 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600 via-amber-500 to-amber-700" />

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-amber-100 text-base md:text-lg mb-1">
                        {metric.name}
                      </div>
                      <div className="text-amber-400/60 text-xs tracking-wide">
                        {metric.subtitle}
                      </div>
                    </div>

                    <motion.div
                      className="text-3xl md:text-4xl text-amber-300 font-serif"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + idx * 0.15, type: 'spring' }}
                    >
                      {metric.score}
                    </motion.div>
                  </div>

                  {/* Progress Bar */}
                  <motion.div
                    className="mt-3 h-1.5 bg-amber-950/50 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 + idx * 0.15 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 shadow-lg shadow-amber-500/50"
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.score}%` }}
                      transition={{ duration: 1.5, delay: 1.3 + idx * 0.15, ease: 'easeOut' }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </div>

        {/* Ceremonial Controls - Bottom */}
        <motion.div
          className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >

          <motion.button
            className="group relative bg-gradient-to-br from-amber-800/40 via-amber-900/30 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-amber-700/40 p-6 md:p-8 text-left overflow-hidden hover:border-amber-500/60 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-amber-900/30"
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/0 via-amber-600/0 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Droplet className="w-8 h-8 md:w-10 md:h-10 text-amber-400 mb-4 relative z-10" />
            <div className="text-amber-100 text-base md:text-lg font-serif mb-2 relative z-10">
              Lựa chọn Giọt Thiêng
            </div>
            <div className="text-amber-400/60 text-xs md:text-sm relative z-10">
              Chọn tinh hoa quý nhất
            </div>
          </motion.button>

          <motion.button
            onClick={handleFillBottle}
            disabled={isFilling}
            className="group relative bg-gradient-to-br from-amber-700/50 via-amber-800/40 to-amber-900/40 backdrop-blur-sm rounded-2xl border border-amber-600/50 p-6 md:p-8 text-left overflow-hidden hover:border-amber-500/70 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-amber-800/40 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isFilling ? 1 : 1.03, y: isFilling ? 0 : -4 }}
            whileTap={{ scale: isFilling ? 1 : 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/10 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Wine className="w-8 h-8 md:w-10 md:h-10 text-amber-300 mb-4 relative z-10" />
            <div className="text-amber-100 text-base md:text-lg font-serif mb-2 relative z-10">
              {isFilling ? 'Đang rót...' : 'Nghi thức Rót & Niêm Phong'}
            </div>
            <div className="text-amber-400/60 text-xs md:text-sm relative z-10">
              Lễ nghi truyền thống
            </div>
          </motion.button>

          <motion.button
            className="group relative bg-gradient-to-br from-amber-800/40 via-amber-900/30 to-stone-900/40 backdrop-blur-sm rounded-2xl border border-amber-700/40 p-6 md:p-8 text-left overflow-hidden hover:border-amber-500/60 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-amber-900/30"
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/0 via-amber-600/0 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-amber-400 mb-4 relative z-10" />
            <div className="text-amber-100 text-base md:text-lg font-serif mb-2 relative z-10">
              Thẩm định Hương Vị
            </div>
            <div className="text-amber-400/60 text-xs md:text-sm relative z-10">
              Đánh giá phẩm chất
            </div>
          </motion.button>

          <motion.button
            onClick={handleCompletion}
            disabled={!isSealed}
            className="group relative bg-gradient-to-br from-amber-600/50 via-amber-700/40 to-amber-800/50 backdrop-blur-sm rounded-2xl border-2 border-amber-500/60 p-6 md:p-8 text-left overflow-hidden hover:border-amber-400/80 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:shadow-amber-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isSealed ? 1.05 : 1, y: isSealed ? -6 : 0 }}
            whileTap={{ scale: isSealed ? 0.98 : 1 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-amber-600/20"
              animate={{
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <Award className="w-8 h-8 md:w-10 md:h-10 text-amber-200 mb-4 relative z-10" />
            <div className="text-amber-50 text-base md:text-lg font-serif mb-2 relative z-10">
              {isSealed ? 'Hoàn tất Di sản' : 'Chưa niêm phong'}
            </div>
            <div className="text-amber-300/70 text-xs md:text-sm relative z-10">
              Lưu giữ cho muôn đời
            </div>
          </motion.button>

        </motion.div>

      </div>
    </div>
  );
}
