import { useRef, useEffect, useState } from 'react';
import { feedbackService } from '../../api/feedback/feedbackService';

interface Review {
  id: number;
  name: string;
  avatar?: string;
  content: string;
  stars: number;
  date: string;
}

const demoReviews: Review[] = []

export default function RecentReviewList() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data: any = await feedbackService.getAll({ resolved: 'approved' })
        const list: any[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
        const normalized = list.map((f: any) => ({
          id: Number(f.feedback_id ?? f.id ?? f._id ?? 0),
          name: f.name ?? f.user?.name ?? 'Ẩn danh',
          avatar: f.user?.avatar ?? undefined,
          content: f.feedback_text ?? f.content ?? f.message ?? '',
          stars: Number(f.rating ?? f.stars ?? 5),
          date: f.created_at ?? f.createdAt ?? f.date ?? new Date().toISOString(),
          resolved: String(f.resolved ?? ''),
        }))
        if (mounted) setReviews(normalized)
      } catch (err) {
        console.error('Failed to load reviews', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 mb-6 relative" style={{ marginTop: '150px' }}>
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex-1 h-px bg-[#b48a3c] opacity-60"></div>
        <h3 className="text-5xl md:text-6xl font-extrabold text-[#b48a3c] drop-shadow-lg tracking-wide flex items-center gap-3 px-6" style={{ fontFamily: 'serif' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" fill="#ffe9b0"/></svg>
          Những đánh giá gần đây
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#b48a3c"/><path d="M8 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </h3>
        <div className="flex-1 h-px bg-[#b48a3c] opacity-60"></div>
      </div>

      <div className="relative">
        <style>{`
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .review-card { border-radius: 14px; }
          .avatar-ring { box-shadow: 0 6px 18px rgba(0,0,0,0.12); border: 3px solid rgba(255,251,232,0.9); }
          .reviews-deco { position: absolute; left: 4%; right: 4%; top: 18%; height: 140px; background: linear-gradient(90deg, rgba(255,245,220,0.35), rgba(255,246,208,0.2)); border-radius: 20px; filter: blur(18px); pointer-events: none; }
          .star-filled { fill: #ffd166; }
          .star-empty { fill: #e6d7a8; }
        `}</style>
        {/* arrow buttons removed per request */}

        <div className="reviews-deco" />

        <div className="flex justify-center mb-6">
          <a
            href="#footer"
            onClick={(e) => { e.preventDefault(); const el = document.getElementById('footer'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#b48a3c] to-[#ffe9b0] text-[#2c2419] font-bold shadow-lg hover:scale-[1.01] transition"
          >Viết đánh giá của bạn</a>
        </div>

        <div
          ref={containerRef}
          className="grid gap-6 overflow-x-auto scroll-smooth pb-6 px-8 no-scrollbar"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', gridAutoFlow: 'column', gridAutoColumns: 'minmax(260px,360px)', gridTemplateRows: 'repeat(2, auto)', scrollSnapType: 'x mandatory' }}
        >
          {(loading ? demoReviews : reviews).filter(r => (r.resolved ?? '') === 'approved').map((review) => (
            <div
              id={`review-${review.id}`}
              key={review.id}
              className="relative rounded-2xl border-2 border-[#ffe9b0] bg-gradient-to-r from-[#fffbe8]/90 to-[#ffe9b0]/80 shadow-xl p-4 animate-fade-in review-card"
              style={{ boxShadow: '0 4px 18px 0 rgba(180,138,60,0.10)', scrollSnapAlign: 'start' }}
            >
              <div className="flex items-center gap-3 mb-2">
                {review.avatar ? (
                  <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover avatar-ring" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#fffbe8] avatar-ring" />
                )}
                <div className="flex-1">
                  <div className="text-[#b48a3c] font-bold text-sm">{review.name}</div>
                  <div className="text-[#8b6f47] text-xs">{new Date(review.date).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    className={i < review.stars ? 'opacity-100' : 'opacity-60'}
                  >
                    <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" className={i < review.stars ? 'star-filled' : 'star-empty'} />
                  </svg>
                ))}
              </div>
              <div className="text-[#4a3f2e] text-sm font-medium italic break-words whitespace-pre-wrap max-w-full">“{review.content}”</div>
              {/* share buttons removed */}
            </div>
          ))}
        </div>

        {/* arrow buttons removed per request */}
      </div>
    </div>
  );
}
