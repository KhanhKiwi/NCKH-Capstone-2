import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { villagesService } from '../api/villages/villagesService'

interface VillageItem {
  id: number | string
  name: string
  thumbnail?: string
  city?: string
}

export default function VillagesPage() {
  const navigate = useNavigate()
  const [villages, setVillages] = useState<VillageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    let mounted = true
    villagesService
      .getAll()
      .then((data: any) => {
        if (!mounted) return
        if (!Array.isArray(data)) return setVillages([])
        const normalized = data.map((v: any) => ({
          id: v.id ?? v.village_id ?? v._id ?? v.name,
          name: v.name ?? v.title ?? v.city ?? 'Làng nghề',
          thumbnail: v.thumbnail ?? v.image ?? v.media?.[0]?.url ?? '/picture/default-village.jpg',
          city: v.city ?? v.location ?? '',
          is_open: v.is_open ?? v.isOpen ?? 1,
        }))
        setVillages(normalized)
      })
      .catch((err) => {
        console.warn('VillagesPage: failed to load villages', err)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 30)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-[#fffaf6] to-[#f5efe6]">
      <div className={`max-w-7xl mx-auto px-6 py-12 relative z-10 page-enter ${entered ? 'page-enter--visible' : ''}`}>
        <style>{`
          .page-enter { opacity: 0; transform: translateY(12px); }
          .page-enter--visible { opacity: 1; transform: translateY(0); transition: opacity 420ms cubic-bezier(.2,.9,.2,1), transform 420ms cubic-bezier(.2,.9,.2,1); }
        `}</style>
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

        <header className="mb-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#a67c2a] tracking-wide" style={{ fontFamily: 'serif' }}>
            Khám phá các làng nghề
          </h1>
          <p className="mt-3 text-lg text-[#6b5a46] max-w-2xl mx-auto">Những làng nghề Việt Nam — màu sắc, hình ảnh và câu chuyện truyền thống.</p>
        </header>

        {loading ? (
          <div className="text-center py-20 text-gray-600">Đang tải...</div>
        ) : (
          <div>
            <style>{`
              .enter-card { opacity: 0; transform: translateY(18px) scale(.995); }
              .enter-card--visible { opacity: 1; transform: translateY(0) scale(1); transition: opacity 420ms cubic-bezier(.2,.9,.2,1), transform 420ms cubic-bezier(.2,.9,.2,1); }
            `}</style>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {villages.map((v, idx) => {
              const nameLower = String(v.name ?? '').toLowerCase()
              const idLower = String(v.id ?? '').toLowerCase()
              const isPottery = nameLower.includes('gốm') || nameLower.includes('gom') || idLower.includes('bat-trang')
              const isNamOMam = nameLower.includes('mắm') || nameLower.includes('mam') || nameLower.includes('nam ô') || nameLower.includes('nam o') || idLower.includes('nam-o')
              const isChieu = nameLower.includes('chiếu') || nameLower.includes('chieu') || idLower.includes('chi-eu') || idLower.includes('chieu')
              const isOpen = Number((v as any).is_open ?? 1) !== 0
              const isClickable = (isPottery || isNamOMam || isChieu) && isOpen
              let cardStateClass = ''
              if (!isOpen) cardStateClass = 'opacity-60 cursor-not-allowed'
              else if (isPottery || isNamOMam || isChieu) cardStateClass = 'hover:scale-105 cursor-pointer'
              const handleClick = () => {
                if (!isOpen) return
                if (isPottery) navigate('/studyjob/gom')
                else if (isNamOMam) navigate('/studyjob/mam-nam-o')
                else if (isChieu) navigate('/studyjob/chieu')
              }
              return (
                <div
                  key={String(v.id)}
                  role={isClickable ? 'link' : undefined}
                  tabIndex={isClickable ? 0 : -1}
                  onClick={isClickable ? handleClick : undefined}
                  onKeyDown={(e) => { if (isClickable && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handleClick() } }}
                  className={`group relative rounded-3xl overflow-hidden shadow-2xl transform transition duration-500 ${cardStateClass} enter-card ${entered ? 'enter-card--visible' : ''}`}
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  <div className="relative h-72 sm:h-80 lg:h-72 w-full bg-gray-100">
                    <img
                      src={v.thumbnail}
                      alt={v.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-105"
                    />

                    {/* Dark gradient + soft vignette to make text pop */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute inset-0 rounded-3xl shadow-inner pointer-events-none" />

                    {!isOpen && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-lg font-semibold z-20">
                        🔒 Đang đóng
                      </div>
                    )}

                    <div className="absolute left-6 bottom-6">
                      <h3 className="text-2xl md:text-3xl font-extrabold leading-tight text-white drop-shadow-lg">{v.name}</h3>
                      {v.city && (
                        <p className="mt-2 inline-block bg-black/45 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold tracking-wide text-white shadow-md">
                          {v.city}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
