import React, { useEffect, useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router'
import { authService } from '../api/services/authService'
import { levelsService } from '../api/levels/levelsService'
import { villagesService } from '../api/villages/villagesService'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { userChallengesService } from '../api/userChallenges/userChallengesService'
import { MapPin, Trophy, Star } from 'lucide-react'
import confetti from 'canvas-confetti'

interface VillageCard {
  id: number
  name: string
  image?: string
  location?: string
}

export default function ChallengePage() {
  const loc: any = useLocation()
  const preselected: number | undefined = loc?.state?.villageId
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [candidates, setCandidates] = useState<VillageCard[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      try {
        let userId: number | undefined
        try {
          const profile = await authService.getProfile()
          userId = Number(profile?.user_id ?? profile?.id ?? profile?.userId)
        } catch {
          try {
            const token = localStorage.getItem('access_token')
            if (token) {
              const parts = token.split('.')
              if (parts.length >= 2) {
                const payload = JSON.parse(atob(parts[1]))
                userId = Number(payload?.user_id ?? payload?.sub ?? payload?.id)
              }
            }
          } catch (e) {}
        }

        const allLevels = await levelsService.getAll(userId)
        if (!Array.isArray(allLevels) || allLevels.length === 0) {
          if (mounted) setCandidates([])
          return
        }

        const vids = new Set<number>()
        for (const l of allLevels) {
          const vid = l?.craft?.village?.village_id ?? l?.craft?.village_id ?? l?.craft?.village?.id
          if (vid != null) vids.add(Number(vid))
          else if (l?.craft_id) vids.add(Number(l.craft_id))
        }

        const okVillages: VillageCard[] = []

        for (const vid of Array.from(vids)) {
          try {
            const vlevels = await levelsService.getByVillage(vid, userId)
            if (!Array.isArray(vlevels) || vlevels.length === 0) continue

            const isCompleted = (lvl: any) => {
              const s = lvl?.progress?.status ?? lvl?.user_progress?.status ?? lvl?.userProgress?.status ?? lvl?.status
              if (s === 'completed') return true
              try {
                const raw = localStorage.getItem('local_progress') || '[]'
                const arr = JSON.parse(raw)
                const lvlId = Number(lvl.level_id ?? lvl.id)
                if (arr.find((e: any) => Number(e.level_id) === lvlId && e.status === 'completed')) return true
              } catch (e) {}
              return false
            }

            const nonIntro = vlevels.filter((x: any) => Number(x.level_id ?? x.id) !== 0)
            if (nonIntro.length === 0) continue
            const allComplete = nonIntro.every(isCompleted)
            if (allComplete) {
              let meta: any = null
              try { meta = await villagesService.getOne(Number(vid)) } catch (e) {
                try { const all = await villagesService.getAll(); meta = (all || []).find((x: any) => Number(x.village_id ?? x.id) === Number(vid)) } catch (ee) {}
              }
              okVillages.push({ id: Number(vid), name: meta?.name ?? `Làng ${vid}`, image: meta?.image ?? meta?.thumbnail ?? '', location: meta?.city ?? meta?.location ?? '' })
            }
          } catch (e) { console.warn('check village failed', vid, e) }
        }

        if (mounted) setCandidates(okVillages)
      } catch (err: any) {
        console.error('challenge load error', err)
        if (mounted) setError(err?.message ?? 'Lỗi khi tải dữ liệu')
      } finally { if (mounted) setLoading(false) }
    })()
    return () => { mounted = false }
  }, [])

  const startChallenge = (v: VillageCard | number) => {
    let vid: number | undefined
    let name: string | undefined
    if (typeof v === 'number') vid = v
    else { vid = v.id; name = v.name }

    try { confetti({ particleCount: 120, spread: 160, origin: { y: 0.6 } }) } catch {}

    // best-effort: create a UserChallenge record when starting (doesn't block nav)
    ;(async () => {
      try {
        const craftId = Number(vid ?? await userChallengesService.inferCraftIdForCeramics())
        await userChallengesService.saveChallenge({ craft_id: craftId })
        console.debug('[ChallengePage] created user-challenge for craft', craftId)
      } catch (e) {
        console.warn('[ChallengePage] failed to create user-challenge', e)
      }
    })()

    // If this is the ceramics village (Bát Tràng) open the challenge runner
    const isCeramics = vid === 1 || (typeof name === 'string' && /b(á|a)t\s*tràng/i.test(name))
    const isFishSauce = vid === 2 || (typeof name === 'string' && /m(ắ|a)m|nam\s*ô/i.test(name))
    setTimeout(() => {
      if (isCeramics) navigate('/challenge-making-cere')
      else if (isFishSauce) navigate('/challenge-making-fish-sauce')
      else if (vid) navigate(`/village/${vid}`)
    }, 420)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf0] to-[#fff0eb] py-12 px-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;600&display=swap');
        :root{--heading:#5b3f2a;--muted:#6b5a4a}
        .page-heading{font-family:'Playfair Display', Georgia, serif;letter-spacing:0.6px;color:var(--heading);font-weight:600}
        .subtitle{font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto; font-weight:300;color:var(--muted)}
        .meta-pill{font-family:'Playfair Display', serif}
        .cta-btn{font-family:Inter, system-ui, sans-serif;font-weight:600}
      `}</style>
      <div className="max-w-screen-xl mx-auto px-4 relative">
            <div className="absolute left-6 top-6">
              <button
                onClick={() => navigate('/game', { replace: true })}
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm mx-auto mb-4 shadow-sm">
            <Trophy className="text-amber-500" />
            <span className="text-amber-700 font-semibold">Thử Thách</span>
          </div>
          <h1 className="text-5xl page-heading">Thử Thách Làng Nghề</h1>
          <p className="mt-2 subtitle">Những làng nghề bạn đã hoàn thành — thử sức và thi đấu để giành vinh quang!</p>
        </div>

        {loading && <div className="text-center py-8">Đang kiểm tra tiến độ...</div>}
        {error && <div className="text-center text-red-600 py-4">{error}</div>}

        {!loading && candidates.length === 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-2">Chưa có làng đủ điều kiện</h2>
            <p className="text-gray-600">Hoàn thành toàn bộ cấp độ cho một làng để mở Thử Thách hấp dẫn.</p>
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {candidates.map((v, i) => (
            <div key={v.id} style={{ animationDelay: `${i * 80}ms` }} className="transform transition-all duration-500 animate-slideUp">
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="relative h-72 overflow-hidden">
                  {v.image ? (
                    <ImageWithFallback src={v.image} alt={v.name} className="w-full h-full object-cover transition-transform duration-700 transform hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">No Image</div>
                  )}

                  <div className="absolute left-6 bottom-6 bg-white/85 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg max-w-[92%]">
                    <div className="text-lg font-bold text-[#2b2b2b]">{v.name}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1"><MapPin className="w-4 h-4" />{v.location}</div>
                  </div>

                  <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-300 to-amber-100 text-amber-800 px-3 py-2 rounded-lg font-semibold shadow-md">Sẵn sàng</div>
                </div>

                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg">★</div>
                    <div>
                      <div className="text-sm text-gray-500">Thử thách</div>
                      <div className="text-base text-gray-800 font-semibold">Chơi & Thi đấu</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link to={`/leaderboard?village=${v.id}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-200 text-amber-700 bg-white/60 hover:bg-amber-50 transition-shadow shadow-sm">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">Xếp hạng</span>
                    </Link>

                    <button onClick={() => startChallenge(v)} className="px-6 py-2 rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-2xl hover:scale-105 transform transition">
                      <span className="inline-flex items-center gap-2"><Trophy className="w-4 h-4" />Vào thử thách</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`\n        @keyframes slideUp { from { opacity: 0; transform: translateY(18px) } to { opacity:1; transform: none } }\n        .animate-slideUp { animation: slideUp .6s cubic-bezier(.2,.9,.2,1) both }\n      `}</style>
    </div>
  )
}
