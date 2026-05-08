import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Droplets, Layers, FlaskConical, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { levelsService } from '../../../api/levels/levelsService';
import { progressService } from '../../../api/progress/progressService';
import { FlavorRadarChart } from './components/FlavorRadarChart';
import { FiltrationStation } from './components/FiltrationStation';
import { LiquidPreview } from './components/LiquidPreview';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { Button } from '../../ui/button';
import { Toaster } from '../../ui/sonner';
import { toast } from 'sonner';

export default function Screen5() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null;
  const [filteringStage, setFilteringStage] = useState(0);
  const [clarity, setClarity] = useState(45);
  const [harvestComplete, setHarvestComplete] = useState(false);
  const [blendingActive, setBlendingActive] = useState(false);
  const [_finalQuality, _setFinalQuality] = useState(0);

  // Flavor profile state
  const [flavorProfile, setFlavorProfile] = useState({
    umami: 75,
    saltiness: 68,
    aroma: 82,
    aftertaste: 71,
    colorQuality: 65,
  });

  const handleHarvest = () => {
    setHarvestComplete(true);
    setClarity(60);
    toast.success('Đã thu hoạch nước mắm từ lu chượp!', {
      description: 'Giọt đầu tiên của di sản',
    });
  };

  const handleFilterLayer = () => {
    if (filteringStage < 3) {
      const newStage = filteringStage + 1;
      setFilteringStage(newStage);
      setClarity(Math.min(clarity + 15, 95));

      // Update flavor profile as filtering progresses
      setFlavorProfile(prev => ({
        umami: Math.min(prev.umami + 5, 95),
        saltiness: Math.min(prev.saltiness + 3, 90),
        aroma: Math.min(prev.aroma + 4, 98),
        aftertaste: Math.min(prev.aftertaste + 6, 92),
        colorQuality: Math.min(prev.colorQuality + 8, 96),
      }));

      toast.success(`Đã thêm lớp lọc ${newStage}`, {
        description: 'Tinh hoa đang được thanh lọc',
      });
    }
  };

  const handleBlend = () => {
    setBlendingActive(true);
    setTimeout(() => {
      const quality = Math.round((flavorProfile.umami + flavorProfile.aroma + flavorProfile.aftertaste + flavorProfile.colorQuality) / 4);
      _setFinalQuality(quality);
      toast.success('Pha blend hoàn tất!', {
        description: `Chất lượng đạt ${quality}%`,
      });
    }, 1500);
  };

  const handleSensoryEval = () => {
    const avgQuality = Math.round(
      (flavorProfile.umami + flavorProfile.saltiness + flavorProfile.aroma + flavorProfile.aftertaste + flavorProfile.colorQuality) / 5
    );

    if (avgQuality >= 85) {
      toast.success('Xuất sắc! Tinh hoa cao cấp', {
        description: 'Di sản Nam Ô được gìn giữ trọn vẹn',
      });
    } else if (avgQuality >= 70) {
      toast.success('Tốt! Hương vị truyền thống', {
        description: 'Nghệ thuật đang được hoàn thiện',
      });
    } else {
      toast('Cần cải thiện', {
        description: 'Hãy tiếp tục lọc và pha blend',
      });
    }
  };

  const handleComplete = async () => {
    const avgQuality = Math.round(
      (flavorProfile.umami + flavorProfile.saltiness + flavorProfile.aroma + flavorProfile.aftertaste + flavorProfile.colorQuality) / 5
    );

    if (avgQuality >= 80 && filteringStage >= 3) {
      try {
        if (userId) {
          // Get level 5 from fish sauce village (village_id = 6)
          const levels = await levelsService.getByVillage(6, userId);
          const level5 = levels.find((l: any) => l.level_number === 5);
          
          if (level5) {
            // Save progress for level 5
            await progressService.saveProgress({
              level_id: level5.level_id,
              status: 'completed',
              score: avgQuality
            });
            
            // Unlock level 6 (final level)
            const level6 = levels.find((l: any) => l.level_number === 6);
            if (level6) {
              await progressService.unlockLevel(level6.level_id);
            }
            
            console.log('[Screen5] Level 5 completed, Level 6 unlocked!');
          }
        }
      } catch (error) {
        console.error('[Screen5] Error saving progress:', error);
      }
      
      toast.success('🎉 Hoàn thành Di sản Giọt Cuối!', {
        description: 'Bạn đã gìn giữ được tinh hoa của làng mắm Nam Ô',
        duration: 5000,
      });
      
      // Navigate to final level after a short delay
      setTimeout(() => {
        navigate('/game/bottling-heritage');
      }, 2000);
    } else {
      toast.error('Chưa đạt tiêu chuẩn', {
        description: 'Vui lòng hoàn thiện các công đoạn lọc',
      });
    }
  };

  const avgQuality = Math.round(
    (flavorProfile.umami + flavorProfile.saltiness + flavorProfile.aroma + flavorProfile.aftertaste + flavorProfile.colorQuality) / 5
  );

  return (
    <>
      <Toaster position="top-center" />
      <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1767825468724-d1960e18d6d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWaWV0bmFtZXNlJTIwZmlzaGluZyUyMHZpbGxhZ2UlMjBzdW5zZXQlMjBvY2VhbnxlbnwxfHx8fDE3NzcyNjczOTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Vietnamese fishing village at sunset"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays for atmospheric depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-amber-950/50 to-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/60" />

        {/* God rays effect */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full" />
        <div className="absolute top-20 left-1/3 w-64 h-64 bg-yellow-600/5 blur-3xl rounded-full" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen w-full">
        {/* Top HUD */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/60 border-b border-amber-700/20">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-amber-100 hover:text-amber-50 hover:bg-amber-900/20"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Quay lại
              </Button>

              <div className="text-center flex-1 px-4">
                <h1 className="text-2xl lg:text-3xl text-amber-100 tracking-wide mb-1">
                  Công đoạn 5: Di sản Giọt Cuối
                </h1>
                <p className="text-sm text-amber-200/60">
                  Nghệ thuật chiết xuất tinh hoa cuối cùng
                </p>
              </div>

              <div className="w-24 text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-900/30 border border-amber-600/30">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-100 text-sm">{avgQuality}%</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Filtration Station */}
            <div className="lg:col-span-2">
              <FiltrationStation
                filteringStage={filteringStage}
                clarity={clarity}
                onStageChange={setFilteringStage}
              />
            </div>

            {/* Right Column - Charts & Preview */}
            <div className="space-y-6">
              {/* Flavor Radar Chart */}
              <div className="h-80">
                <FlavorRadarChart {...flavorProfile} />
              </div>

              {/* Liquid Preview */}
              <LiquidPreview
                color={`rgba(180, 83, 9, ${clarity / 100})`}
                viscosity={70 + filteringStage * 5}
                quality={avgQuality}
              />
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="mt-8 lg:mt-12">
            <AnimatePresence>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={handleHarvest}
                  disabled={harvestComplete}
                  className="h-16 bg-gradient-to-r from-amber-800 to-amber-700 hover:from-amber-700 hover:to-amber-600 text-amber-50 border border-amber-600/30 shadow-lg disabled:opacity-50"
                  size="lg"
                >
                  <Droplets className="w-5 h-5 mr-2" />
                  <span className="text-sm">Thu hoạch từ lu chượp</span>
                </Button>

                <Button
                  onClick={handleFilterLayer}
                  disabled={!harvestComplete || filteringStage >= 3}
                  className="h-16 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-50 border border-amber-600/30 shadow-lg disabled:opacity-50"
                  size="lg"
                >
                  <Layers className="w-5 h-5 mr-2" />
                  <span className="text-sm">Xếp lớp lọc</span>
                </Button>

                <Button
                  onClick={handleBlend}
                  disabled={!harvestComplete || filteringStage < 2}
                  className="h-16 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-600 text-amber-50 border border-amber-500/30 shadow-lg disabled:opacity-50"
                  size="lg"
                >
                  <FlaskConical className="w-5 h-5 mr-2" />
                  <span className="text-sm">Pha blend tinh hoa</span>
                </Button>

                <Button
                  onClick={handleSensoryEval}
                  disabled={!harvestComplete}
                  className="h-16 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-amber-50 border border-slate-500/30 shadow-lg disabled:opacity-50"
                  size="lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  <span className="text-sm">Đánh giá cảm quan</span>
                </Button>

                <Button
                  onClick={handleComplete}
                  disabled={avgQuality < 80 || filteringStage < 3}
                  className="h-16 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-amber-50 border border-yellow-500/30 shadow-lg disabled:opacity-50 font-semibold"
                  size="lg"
                >
                  <Award className="w-5 h-5 mr-2" />
                  <span className="text-sm">Hoàn tất Di sản</span>
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Blending Animation Overlay */}
          <AnimatePresence>
            {blendingActive && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onAnimationComplete={() => {
                  if (blendingActive) {
                    setTimeout(() => setBlendingActive(false), 1000);
                  }
                }}
              >
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                >
                  <motion.div
                    className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600"
                    animate={{
                      rotate: 360,
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <FlaskConical className="w-16 h-16 text-amber-50" />
                    </div>
                  </motion.div>
                  <h2 className="text-3xl text-amber-100 mb-2">Đang pha blend...</h2>
                  <p className="text-amber-200/60">Kết hợp các lô tinh hoa</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
    </>
  );
}
