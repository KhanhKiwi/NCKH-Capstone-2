import { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { ChoupGenome } from './components/ChoupGenome';
import { FermentationMetrics } from './components/FermentationMetrics';
import { ControlPanel } from './components/ControlPanel';
import { JarDisplay } from './components/JarDisplay';
import { ProcessTimeline } from './components/ProcessTimeline';
import { ActionNotification } from './components/ActionNotification';
import { AmbientParticles } from './components/AmbientParticles';
import { useNavigate } from 'react-router';
import { levelsService } from '../../../api/levels/levelsService';
import { progressService } from '../../../api/progress/progressService';
import { getUserId } from '../../../utils/authUtils';
import { useEffect } from 'react';

export default function Screen4() {
  const navigate = useNavigate();
  const [quality, setQuality] = useState(72);
  const [fillLevel, setFillLevel] = useState(85);
  const [isSealed, setIsSealed] = useState(false);
  const [temperature] = useState(30);
  const [humidity] = useState(78);
  const [month] = useState(1);
  const [notification, setNotification] = useState({ show: false, message: '' });
  const userId = getUserId();

  const actionMessages: Record<string, string> = {
    seal: 'Đã đóng nắp lu thành công',
    compress: 'Đã nén chặt hỗn hợp cá muối',
    protect: 'Đã phủ lớp muối bảo vệ hoàn tất',
    hermetic: 'Lu đã được niêm phong kín khí',
    ferment: 'Bắt đầu quá trình lên men truyền thống'
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'seal':
        setFillLevel(prev => Math.min(prev + 5, 95));
        setQuality(prev => Math.min(prev + 3, 100));
        break;
      case 'compress':
        setFillLevel(prev => Math.min(prev + 8, 98));
        setQuality(prev => Math.min(prev + 5, 100));
        break;
      case 'protect':
        setQuality(prev => Math.min(prev + 7, 100));
        break;
      case 'hermetic':
        setIsSealed(true);
        setQuality(prev => Math.min(prev + 10, 100));
        break;
      case 'ferment':
        if (isSealed) {
          setQuality(prev => Math.min(prev + 5, 100));
          // Save progress and move to next level
          saveProgressAndNavigate();
        }
        break;
    }

    setNotification({ show: true, message: actionMessages[action] || 'Thao tác hoàn tất' });
  };

  const saveProgressAndNavigate = async () => {
    try {
      if (userId && isSealed && quality >= 50) {
        // Get level 4 from fish sauce village (village_id = 8)
        const levels = await levelsService.getByVillage(8, userId);
        const level4 = levels.find((l: any) => l.level_number === 4);
        
        if (level4) {
          // Save progress for level 4
          await progressService.saveProgress({
            level_id: level4.level_id,
            status: 'completed',
            score: quality
          });
          
          // Unlock level 5
          const level5 = levels.find((l: any) => l.level_number === 5);
          if (level5) {
            await progressService.unlockLevel(level5.level_id);
          }
          
          console.log('[Screen4] Level 4 completed, Level 5 unlocked!');
          
          // Navigate to next level after a short delay
          setTimeout(() => {
            navigate('/game/filtration-harvest');
          }, 2000);
        }
      } else if (!isSealed) {
        setNotification({ show: true, message: 'Bạn phải niêm phong lu trước khi lên men!' });
      }
    } catch (error) {
      console.error('[Screen4] Error saving progress:', error);
      setNotification({ show: true, message: 'Lỗi khi lưu tiến trình!' });
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-auto">
      {/* Action Notification */}
      <ActionNotification
        message={notification.message}
        show={notification.show}
        onClose={() => setNotification({ show: false, message: '' })}
      />

      {/* Cinematic background with overlay */}
      <div className="fixed inset-0 -z-10">
        <div
          className="w-full h-full object-cover"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1677128344393-f5b0e778e181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1f17]/60 via-[#2a1f17]/50 to-[#2a1f17]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f5f0e8]/30 via-transparent to-transparent" />
      </div>

      {/* Ambient atmospheric particles */}
      <AmbientParticles />

      {/* Main container with responsive padding */}
      <div className="relative min-h-screen w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Top Navigation */}
        <header className="sticky top-0 z-20 mb-6 sm:mb-8">
          <div className="bg-card/70 backdrop-blur-xl rounded-xl border border-border shadow-lg p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-[#8b7355]/20 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-[#3d2b1f]" />
              </button>

              <div className="flex-1 text-center min-w-0">
                <h1 className="text-base sm:text-lg lg:text-xl text-[#3d2b1f] mb-1 truncate">
                  Công đoạn 4: Đóng lu & Ủ chượp
                </h1>
                <p className="text-xs sm:text-sm opacity-60 truncate">
                  Quản lý quá trình lên men truyền thống
                </p>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-br from-[#5f7c8a]/20 to-[#a0522d]/20 px-3 sm:px-4 py-2 rounded-lg border border-[#5f7c8a]/30">
                <div className="text-right min-w-0">
                  <p className="text-[10px] sm:text-xs opacity-60 whitespace-nowrap">Chất lượng lô</p>
                  <p className="text-sm sm:text-base font-semibold text-[#3d2b1f]">{quality}%</p>
                </div>
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center"
                  style={{
                    background: `conic-gradient(
                      ${quality < 40 ? '#8b4513' : quality < 70 ? '#b87333' : '#5f7c8a'} ${quality * 3.6}deg,
                      rgba(139, 115, 85, 0.2) ${quality * 3.6}deg
                    )`
                  }}
                >
                  <div className="w-7 h-7 sm:w-9 sm:h-9 bg-card rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="space-y-6 sm:space-y-8 pb-8">
          {/* Hero Section - Jar Display & Genome */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Jar Display */}
            <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-[#a0522d] to-[#5c3d2e] rounded-full" />
                <h2 className="text-base sm:text-lg text-[#3d2b1f]">Lu sành Nam Ô truyền thống</h2>
              </div>
              <JarDisplay fillLevel={fillLevel} isSealed={isSealed} />

              <div className="mt-6 p-4 bg-[#5f7c8a]/10 rounded-lg border border-[#5f7c8a]/20">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#5f7c8a] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm text-[#3d2b1f] opacity-80 leading-relaxed">
                      Lu sành được làm từ đất sét nung cao cấp, có khả năng điều hòa nhiệt độ và
                      thấm khí tự nhiên, tạo môi trường lý tưởng cho vi sinh vật lên men.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chượp Genome Visualization */}
            <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-[#5f7c8a] to-[#a0522d] rounded-full" />
                <h2 className="text-base sm:text-lg text-[#3d2b1f]">Phân tích vi sinh học</h2>
              </div>

              <div className="flex flex-col items-center justify-center py-4">
                <ChoupGenome quality={quality} />
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-xs sm:text-sm opacity-70">Lactobacillus</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 sm:w-32 h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-[#5f7c8a]" style={{ width: '85%' }} />
                    </div>
                    <span className="text-xs font-medium w-10 text-right">85%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-xs sm:text-sm opacity-70">Halophiles</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 sm:w-32 h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-[#b87333]" style={{ width: '72%' }} />
                    </div>
                    <span className="text-xs font-medium w-10 text-right">72%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                  <span className="text-xs sm:text-sm opacity-70">Enzyme Activity</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 sm:w-32 h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-[#a0522d]" style={{ width: '68%' }} />
                    </div>
                    <span className="text-xs font-medium w-10 text-right">68%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fermentation Metrics */}
          <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-[#8b7355] to-[#5c3d2e] rounded-full" />
              <h2 className="text-base sm:text-lg text-[#3d2b1f]">Thông số môi trường lên men</h2>
            </div>
            <FermentationMetrics
              temperature={temperature}
              humidity={humidity}
              stage="Giai đoạn khởi đầu"
              month={month}
            />
          </div>

          {/* Process Timeline */}
          <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-[#b87333] to-[#8b4513] rounded-full" />
              <h2 className="text-base sm:text-lg text-[#3d2b1f]">Tiến trình sản xuất</h2>
            </div>
            <ProcessTimeline />
          </div>

          {/* Control Panel */}
          <div className="bg-card/60 backdrop-blur-xl rounded-2xl border border-border shadow-2xl p-6 sm:p-8">
            <ControlPanel onAction={handleAction} />
          </div>

          {/* Traditional Knowledge Footer */}
          <div className="bg-gradient-to-br from-[#3d2b1f]/80 to-[#5c3d2e]/80 backdrop-blur-xl rounded-2xl border border-[#8b7355]/30 shadow-2xl p-6 sm:p-8 text-[#f5f0e8]">
            <h3 className="text-sm sm:text-base mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#b87333] rounded-full" />
              Tri thức truyền thống
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed opacity-90">
              Quy trình ủ chượp Nam Ô đòi hỏi sự kiên nhẫn và tỉ mỉ tuyệt đối. Mỗi lu chượp phải được
              niêm phong hoàn hảo để tạo điều kiện kỵ khí, cho phép vi sinh vật lactic acid lên men
              tự nhiên. Nhiệt độ ổn định 28-32°C và độ ẩm 70-85% là yếu tố then chốt quyết định chất
              lượng mắm thành phẩm sau 12 tháng ủ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
