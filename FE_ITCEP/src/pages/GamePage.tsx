import { useState, useEffect } from 'react';
import { ArrowLeft, GraduationCap, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router'
import { motion } from 'motion/react';
import { authService } from '../api/services/authService'
import { levelsService } from '../api/levels/levelsService'
import CenteredModal from '../components/ui/CenteredModal'
import { Link } from 'react-router';
import { Logo } from '../components/Game/Logo';
import { PlayButton } from '../components/Game/PlayButton';
import { PlayerInfo } from '../components/Game/PlayerInfo';
import { Achievements } from '../components/Game/Achievements';
import { GameCard } from '../components/Game/GameCard';

export default function GamePage() {
  // Danh sách ảnh nền
  const bgImages = [
    '/picture/lamchieu.png',
    '/picture/lamgom.png',
    '/picture/lamhuong.png',
    '/picture/lamlua.png',
    '/picture/lamsonmai.png',
    '/picture/lamtranhdongho.png',
  ];
  
  const [bgIndex, setBgIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set<number>());

  // Preload images
  useEffect(() => {
    bgImages.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, index]));
      };
      img.src = src;
    });
  }, []);

  // Auto update background mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const gameCards = [
    {
      icon: GraduationCap,
      title: "Học nghề",
      description: "Tìm hiểu quy trình",
      delay: 0.3
    },
    {
      icon: Trophy,
      title: "Thử thách",
      description: "Tìm thử thách và thi đấu",
      delay: 0.4
    }
  ];

  const navigate = useNavigate()

  const [modalMessage, setModalMessage] = useState<string | null>(null)

  async function handleChallengeClick() {
    try {
      // try get user id from profile or token
      let userId: number | undefined
      try { const profile = await authService.getProfile(); userId = Number(profile?.user_id ?? profile?.id ?? profile?.userId) } catch { userId = undefined }
      if (!userId) {
        try {
          const token = localStorage.getItem('access_token')
          if (token) {
            const parts = token.split('.')
            if (parts.length >= 2) {
              const payload = JSON.parse(atob(parts[1]))
              userId = Number(payload?.user_id ?? payload?.sub ?? payload?.id)
            }
          }
        } catch (e) { }
      }

      const all = await levelsService.getAll(userId)
      if (!Array.isArray(all) || all.length === 0) {
        setModalMessage('Không có dữ liệu level để kiểm tra.')
        return
      }

      // gather candidate village ids from level.craft.village if present
      const vids = new Set<number>()
      for (const l of all) {
        const vid = l?.craft?.village?.village_id ?? l?.craft?.village_id ?? l?.craft?.village?.id
        if (vid != null) vids.add(Number(vid))
      }

      // if no village ids found, try to infer from craft_id -> assume craft_id maps to village id (best-effort)
      if (vids.size === 0) {
        for (const l of all) {
          if (l?.craft_id) vids.add(Number(l.craft_id))
        }
      }

      // check each village: are all levels completed?
      for (const vid of Array.from(vids)) {
        try {
          const vlevels = await levelsService.getByVillage(vid, userId)
          if (!Array.isArray(vlevels) || vlevels.length === 0) continue

          // consider level completed if any of these fields indicate 'completed'
          const isLevelCompleted = (lvl: any) => {
            if (!lvl) return false
            const s = lvl?.progress?.status ?? lvl?.user_progress?.status ?? lvl?.userProgress?.status ?? lvl?.status ?? lvl?.user_status
            if (s === 'completed') return true
            // check local fallback entries
            try {
              const raw = localStorage.getItem('local_progress') || '[]'
              const arr = JSON.parse(raw)
              const lvlId = Number(lvl.level_id ?? lvl.id)
              if (arr.find((e: any) => Number(e.level_id) === lvlId && (e.status === 'completed' || e.status === 'completed'))) return true
            } catch (e) { }
            return false
          }

          // ignore intro level id 0 when deciding full completion
          const nonIntro = vlevels.filter((x:any) => Number(x.level_id ?? x.id) !== 0)
          if (nonIntro.length === 0) continue
          const allComplete = nonIntro.every(isLevelCompleted)
          if (allComplete) {
            // open challenge for this village
            navigate('/challenge', { state: { villageId: vid } })
            return
          }
        } catch (e) {
          console.warn('check village failed', vid, e)
        }
      }

      setModalMessage('Bạn hãy hoàn thành toàn bộ level của một làng bất kỳ để mở Thử thách.')
    } catch (e) {
      console.error('handleChallengeClick error', e)
      setModalMessage('Không thể kiểm tra trạng thái thử thách. Vui lòng thử lại sau.')
    }
  }

  function closeModal() { setModalMessage(null) }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background with Village Scene - Auto rotate */}
      {bgImages.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center pointer-events-none select-none transition-opacity duration-1000 ${
            i === bgIndex && loadedImages.has(i) ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('${src}')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>
        </div>
      ))}

      {/* Player Info & Achievements */}
      <PlayerInfo />
      <Achievements />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        {/* Logo */}
        <Logo />

        {/* Play Button */}
        <Link to="/craft-selection" className="mb-12">
          <PlayButton />
        </Link>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full">
          {gameCards.map((card) => (
            <GameCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              description={card.description}
              delay={card.delay}
              onClick={
                card.title === 'Học nghề'
                  ? () => navigate('/studyjob/gom')
                  : card.title === 'Thử thách'
                    ? handleChallengeClick
                    : undefined
              }
            />
          ))}
          {modalMessage && (
            <CenteredModal message={modalMessage} onClose={closeModal} />
          )}
        </div>
      </div>

      {/* Bottom Decorative Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFB347] via-[#F0D4B0] to-[#E6A75E]"></div>

      <motion.button
        type="button"
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -12, y: 8 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -4, 0],
          boxShadow: [
            '0 10px 24px rgba(0,0,0,0.28)',
            '0 14px 30px rgba(230,167,94,0.42)',
            '0 10px 24px rgba(0,0,0,0.28)',
          ],
        }}
        transition={{
          opacity: { duration: 0.45 },
          x: { duration: 0.45 },
          y: { duration: 2.3, repeat: Infinity, ease: 'easeInOut' },
          boxShadow: { duration: 2.3, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute left-6 top-40 z-30 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-linear-to-r from-[#f7d7a6]/95 to-[#e6a75e]/95 text-[#3d2b1f] border border-[#f7d7a6]/80 backdrop-blur-md font-semibold tracking-wide hover:scale-105 active:scale-95 transition-transform"
      >
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#5d4e37] text-[#f7d7a6]">
          <ArrowLeft className="w-4 h-4" />
        </span>
        Quay lại
      </motion.button>
    </div>
  );
}