import { Link } from 'react-router-dom'
import useRevealOnScroll from '../../hooks/useRevealOnScroll'

const processSteps = [
  {
    title: 'Tuyển chọn cá cơm than',
    description:
      'Linh hồn của mắm Nam Ô chính là cá cơm than được đánh bắt vào tháng 3 âm lịch, khi cá tích nhiều độ đạm và béo nhất. Cá mang về phải tươi rói, tuyệt đối không rửa bằng nước ngọt để tránh làm cá nhanh ươn và mất đi hương vị biển nguyên bản. Cá chỉ được làm sạch nhẹ nhàng hoặc rửa bằng nước biển sạch để giữ trọn độ tinh khiết.',
  },
  {
    title: 'Phối trộn muối Cà Ná',
    description:
      'Muối dùng để ướp cá không phải là loại muối thông thường mà là muối hạt to từ Cà Ná (Ninh Thuận). Đặc biệt, muối phải được mua về và cất trữ trong bóng râm từ 6 tháng đến 1 năm để "rút bớt" vị chát (chảy hết nước đắng), giúp mắm sau này có vị mặn dịu, ngọt thanh chứ không bị gắt. Tỷ lệ vàng truyền thống thường là 3 cá : 1 muối, được trộn thật đều tay.',
  },
  {
    title: 'Vào chum sành & Đậy vỉ tre',
    description:
      'Hỗn hợp cá và muối được đưa vào những chiếc chum sành lớn hoặc thùng gỗ đặc trưng. Người thợ dùng vỉ tre đan kín mặt chum, có thể dùng thêm chổi đót và đá tảng sạch để chèn ép, nén chặt, tạo môi trường kỵ khí hoàn hảo. Việc nén chặt giúp cá chìm hẳn dưới lớp nước bổi, ngăn chặn vi khuẩn có hại phát triển gây hỏng mắm.',
  },
  {
    title: 'Ủ chượp & Lên men tự nhiên',
    description:
      'Chum mắm được đậy kín và ủ ở nơi khô ráo, thoáng mát, tránh ánh nắng gắt. Quá trình lên men hoàn toàn tự nhiên kéo dài ròng rã từ 12 đến 18 tháng. Trong suốt thời gian này, thịt cá tự phân giải thành các acid amin nhờ enzyme có sẵn trong ruột cá. Khác với một số loại mắm khác, mắm Nam Ô nguyên chất không cho thêm bất kỳ gia vị, chất bảo quản hay men xúc tác nào.',
  },
  {
    title: 'Rút mắm nhĩ & Lọc tinh chất',
    description:
      'Sau hơn một năm, mắm "chín" sẽ có màu đỏ nâu cánh gián và hương thơm lừng đặc trưng. Người thợ sẽ dùng một chiếc phễu tre đan tinh xảo lót vải sạch để lọc từng giọt mắm. Những giọt mắm đầu tiên rỉ ra được gọi là mắm nhĩ - phần tinh túy nhất, chứa độ đạm cao nhất, làm nên danh tiếng của làng nghề Nam Ô hàng trăm năm qua.',
  },
]

export default function NamOMamStudyPage() {
  useRevealOnScroll()
  return (
    <div className="min-h-screen bg-[#f7f2e8] text-[#3f3224]">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
        @keyframes pulseGlow { 0% { box-shadow: 0 0 0 rgba(0,0,0,0); } 50% { box-shadow: 0 18px 40px rgba(168,111,44,0.12); } 100% { box-shadow: 0 0 0 rgba(0,0,0,0); } }
        .hero-appear { opacity: 0; animation: fadeUp 700ms cubic-bezier(.2,.8,.2,1) forwards; }
        .btn-pulse { transition: transform .18s ease, box-shadow .18s ease; }
        .btn-pulse:hover { transform: translateY(-4px) scale(1.02); }
        .reveal-on-scroll{ opacity:0; transform: translateY(12px); transition: all 700ms cubic-bezier(.2,.9,.2,1); }
        .reveal-on-scroll.is-revealed{ opacity:1; transform:none; animation: fadeUp 650ms cubic-bezier(.2,.8,.2,1) both; }
      `}</style>

      <section
        className="relative overflow-hidden border-b border-[#e6d7be] px-4 py-16 reveal-on-scroll"
        style={{ backgroundImage: "url('/anhHuongDan/LangMam.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/12" />
        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center rounded-full border border-[#c38a3f]/40 bg-white/70 px-4 py-2 text-sm font-semibold text-[#6b4a27] shadow-sm">
            Làng nghề mắm
          </div>

          <h1
            className="mt-5 w-full text-4xl font-extrabold leading-tight md:text-6xl hero-appear whitespace-nowrap overflow-x-auto reveal-on-scroll"
            style={{ fontFamily: 'serif' }}
          >
            <span className="inline-block mr-3 transform-gpu" style={{ animation: 'fadeUp 900ms cubic-bezier(.2,.8,.2,1) forwards' }}>🫗</span>
            Làng Mắm Nam Ô
          </h1>

          <div className="mt-8 flex flex-wrap gap-4 reveal-on-scroll">
            <Link
              to="/villages"
              className="inline-flex items-center gap-2 rounded-full border border-[#6b4a27]/20 bg-white/90 px-5 py-3 font-semibold text-[#6b4a27] shadow-sm transition-colors hover:bg-white btn-pulse"
              style={{ animation: 'fadeUp 700ms cubic-bezier(.2,.8,.2,1) forwards', animationDelay: '240ms' }}
            >
              Quay lại làng nghề
            </Link>
            <Link
              to="/craft-selection?openName=l%C3%A0ng%20m%E1%BA%A5m%20Nam%20%C3%94"
              className="group inline-flex items-center gap-2 rounded-full bg-[#6b4a27] px-6 py-3 font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#5a3d1f] btn-pulse"
              style={{ animation: 'fadeUp 700ms cubic-bezier(.2,.8,.2,1) forwards', animationDelay: '320ms' }}
            >
              Bắt đầu chơi game
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:justify-center md:items-stretch md:gap-6">
          <div className="w-full max-w-[420px] rounded-2xl border border-[#e6d7be] bg-white p-5 shadow-sm">
            <div className="flex h-full min-h-[96px] flex-col items-center justify-center text-center">
              <p className="text-2xl font-bold text-[#4f3a27]">Lấy cá • Muối • Ủ</p>
            </div>
          </div>
          <div className="w-full max-w-[420px] rounded-2xl border border-[#e6d7be] bg-white p-5 shadow-sm">
            <div className="flex h-full min-h-[96px] flex-col items-center justify-center text-center">
              <p className="text-2xl font-bold text-[#4f3a27]">Truyền thống • An toàn</p>
            </div>
          </div>
          <div className="w-full max-w-[420px] rounded-2xl border border-[#e6d7be] bg-white p-5 shadow-sm">
            <div className="flex h-full min-h-[96px] flex-col items-center justify-center text-center">
              <p className="text-2xl font-bold text-[#4f3a27]">Giữ hương vị làng</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'serif' }}>
            Quy trình 5 bước làm mắm Nam Ô
          </h2>
          <span className="rounded-full bg-[#f0dfc2] px-3 py-1 text-sm font-semibold text-[#6b4a27]">Bài học cốt lõi</span>
        </div>

        <div className="flex flex-col gap-6">
          {processSteps.map((step, idx) => (
            <article
              key={step.title}
              className="rounded-2xl border border-[#e6d7be] bg-white p-6 shadow-sm hover:shadow-lg reveal-on-scroll"
              style={{ animationDelay: `${idx * 120}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">🫗</div>
                <div>
                  <h3 className="text-xl font-bold text-[#4f3a27]">{step.title}</h3>
                  <p className="mt-3 leading-7 text-[#5e4c3a]">{step.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
