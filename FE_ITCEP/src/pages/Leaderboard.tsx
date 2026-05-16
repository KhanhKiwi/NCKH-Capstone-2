import React from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { userChallengesService } from '../api/userChallenges/userChallengesService'
import { authService } from '../api/services/authService'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'

function initialsFromName(name?: string) {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/).slice(-2)
  return parts.map(p => p[0]?.toUpperCase() ?? '').join('').slice(0,2)
}

export default function LeaderboardPage(){
  const [params] = useSearchParams()
  const village = params.get('village')
  const [craftId, setCraftId] = React.useState<number | null>(null)
  const [rows, setRows] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [currentUserId, setCurrentUserId] = React.useState<number | null>(null)

  React.useEffect(()=>{
    let mounted = true
    ;(async ()=>{
      setLoading(true)
      try{
        let cid: number | null = null
        if (village) {
          const vid = Number(village)
          // Map village_id → craft_id (they are equal in this DB schema)
          // Village 1 = Làng Gốm Bát Tràng, Village 2 = Làng Mắm Nam Ô
          if (vid === 2) {
            cid = 2 // Làng Mắm Nam Ô → craft_id = 2
          } else if (vid === 1) {
            try { cid = await userChallengesService.inferCraftIdForCeramics() } catch { cid = 1 }
          } else {
            cid = vid // fallback: assume craft_id = village_id
          }
        }
        if (!cid) cid = Number(params.get('craft') ?? params.get('craft_id') ?? 0) || null
        setCraftId(cid)

        if (cid) {
          const data = await userChallengesService.getLeaderboard(cid)
          if (mounted) setRows(Array.isArray(data) ? data : [])
        }
        // determine current user id for highlighting
        try {
          const profile = await authService.getProfile()
          if (mounted) setCurrentUserId(Number(profile?.user_id ?? profile?.id ?? profile?.userId))
        } catch (e) {}
      }catch(e){
        console.warn('leaderboard load failed', e)
      }finally{ if (mounted) setLoading(false) }
    })()
    return ()=>{ mounted = false }
  }, [village])

  // when rows change, check if current user is top and celebrate
  React.useEffect(()=>{
    if (!rows || rows.length === 0) return
    if (typeof currentUserId !== 'number') return
    const idx = rows.findIndex(r => Number(r?.user?.user_id) === Number(currentUserId))
    if (idx === 0) {
      // minimal effect: scroll user's row into view
      try {
        const el = document.querySelector('[data-current-user]') as HTMLElement | null
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } catch (e) {}
    }
  }, [rows, currentUserId])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#fff7f2] to-[#fff0eb] p-8">
      {/* subtle decorative background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-14">
          <div className="absolute -left-10 -top-6 w-80 h-80 bg-gradient-to-tr from-amber-50 to-pink-50 rounded-full blur-3xl" />
          <div className="absolute right-[-80px] top-44 w-60 h-60 bg-gradient-to-tr from-teal-50 to-cyan-50 rounded-full blur-2xl" />
        </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="relative mb-8">
          <Link to="/challenge" aria-label="Quay lại" className="absolute left-4 top-4 flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-xl hover:translate-x-0.5 hover:shadow-2xl transform transition-all ring-0 focus:outline-none focus:ring-2 focus:ring-amber-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-semibold">Quay lại</span>
          </Link>
          <div className="text-center py-6">
            <h1 className="text-6xl font-extrabold shimmer" style={{fontFamily:'Playfair Display, Georgia, serif', color:'#3b2416', lineHeight:1}}>
              Bảng Xếp Hạng
            </h1>
            <div className="mx-auto mt-4 h-0.5 w-36 rounded-full bg-gray-200 opacity-80 animate-expand" />
            <p className="mt-3 text-gray-600 animate-fadeIn">Top người chơi theo thời gian hoàn thành — nhanh hơn là chiến thắng.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-transparent">

          <div className="p-6">
            {loading && (
              <div className="space-y-4">
                {Array.from({length:6}).map((_,i)=> (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/60 shadow-sm animate-pulse">
                    <div className="w-14 h-14 rounded-full bg-gray-100" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-100 rounded w-3/5" />
                      <div className="h-3 bg-gray-50 rounded w-1/4 mt-2" />
                    </div>
                    <div className="w-20 h-6 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            )}

            {!loading && rows.length === 0 && <div className="text-gray-500">Chưa có kết quả nào.</div>}

            <ul className="space-y-4">
              {rows.map((r, i) => {
                const delay = i * 80
                const name = r?.user?.displayName ?? r?.user?.name ?? r?.user?.email ?? `User ${r?.user?.user_id ?? ''}`
                const initials = initialsFromName(name)
                const sec = typeof r?.time === 'number' ? r.time : null
                const timeLabel = sec !== null
                  ? `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`
                  : '—'
                const rankEmoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
                const isCurrent = Number(r?.user?.user_id) === Number(currentUserId)
                return (
                  <li data-current-user={isCurrent ? '1' : undefined} key={r?.id ?? i} style={{animationDelay:`${delay}ms`}} className={`flex items-center gap-4 p-4 rounded-xl bg-white/60 shadow-sm transform transition hover:-translate-y-1 hover:shadow-md animate-slideUp border border-transparent ${isCurrent ? 'border-amber-200 bg-amber-50/60' : ''}`}>
                    <div className="relative flex items-center" style={{minWidth:64}}>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold ${'bg-amber-100 text-amber-800'}`}>
                        {r?.user?.avatar ? <img src={r.user.avatar} alt={name} className="w-full h-full object-cover rounded-full" /> : initials}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{rankEmoji ?? <span className="text-gray-400 font-bold text-base">#{i+1}</span>}</span>
                        <div className="font-semibold text-lg" style={{letterSpacing:0.2, color:'#2f2f2f'}}>{name}</div>
                        {isCurrent && <span className="ml-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Bạn</span>}
                      </div>
                    </div>

                    <div className="text-right min-w-[140px]">
                      <div className="text-2xl font-extrabold text-amber-600">{timeLabel}</div>
                      <div className="text-sm text-gray-500">{new Date(r?.updated_at ?? r?.created_at ?? Date.now()).toLocaleString()}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        
        /* subtle decorative animations removed for minimal style */
        @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        .shimmer{ background: linear-gradient(90deg,#3b2416 20%, #b86b3a 40%, #3b2416 60%); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: shimmer 3.2s linear infinite; }
        @keyframes expand { 0% { transform: scaleX(0); opacity: 0 } 60% { transform: scaleX(1.02); opacity: 1 } 100% { transform: scaleX(1); opacity: 1 } }
        .animate-expand{ transform-origin: left center; animation: expand .9s cubic-bezier(.2,.9,.2,1) both }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        .animate-fadeIn{ animation: fadeIn .8s ease both }
        @keyframes slideUp { from { opacity: 0; transform: translateY(18px) } to { opacity:1; transform: none } }
        .animate-slideUp { animation: slideUp .45s cubic-bezier(.2,.9,.2,1) both }
        @keyframes bounceTiny { 0%{transform:translateY(0)}50%{transform:translateY(-6px)}100%{transform:translateY(0)} }
        .animate-bounce{ animation: bounceTiny 1200ms ease-in-out infinite }
      `}</style>
    </div>
  )
}
