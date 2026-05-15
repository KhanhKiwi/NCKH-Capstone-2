import { Link } from 'react-router-dom'
import useRevealOnScroll from '../../hooks/useRevealOnScroll'

const processSteps = [
  {
    title: 'Chuẩn bị nguyên liệu',
    description:
      'Bắt đầu bằng việc lựa chọn cá tươi — ưu tiên các loài nhỏ như cá cơm, cá nục hoặc cá trích tùy truyền thống địa phương. Kiểm tra độ tươi: mắt trong, mang đỏ, không có mùi ôi; loại bỏ cá hư hoặc có ký sinh trùng. Chuẩn bị muối biển chất lượng, dụng cụ sạch (hũ, thớt, dao), và nơi ủ thoáng mát, tránh ánh nắng trực tiếp. Tính toán tỷ lệ muối theo khối lượng cá (thông thường 15–30% tùy công thức) và chuẩn bị các vật liệu bổ sung nếu làm theo công thức gia truyền (gạo, men lá, ớt, tỏi tùy biến).',
  },
  {
    title: 'Rửa & xếp hũ',
    description:
      'Rửa cá kỹ để loại bỏ đất cát và tạp chất — có thể ngâm nhanh rồi rửa sạch nhiều lần, sau đó để ráo hoàn toàn. Xếp cá vào hũ theo lớp: một lớp cá, một lớp muối; đảm bảo muối phủ đều bề mặt để quá trình thẩm thấu diễn ra đều. Dùng vật nén hoặc đá sạch để nén cá, giảm không gian chứa khí, hạn chế oxy tiếp xúc làm hỏng. Cách xếp, chiều dày từng lớp và lực nén ảnh hưởng lớn đến chất lượng mắm cuối cùng.',
  },
  {
    title: 'Phối trộn & niêm phong',
    description:
      'Nếu công thức có gia vị (gạo, men, lá cây, tỏi, ớt), phối trộn chúng theo công thức truyền thống trước khi cho vào hũ. Dùng các dụng cụ sạch để đảm bảo vệ sinh; đóng nắp hoặc đậy vải, niêm phong miệng hũ nếu cần để kiểm soát vi sinh. Ghi ngày bắt đầu ủ trên nắp hoặc nhãn để theo dõi thời gian. Đặt hũ ở nơi có nhiệt độ ổn định, tránh nơi ẩm ướt hoặc quá nóng; điều kiện bảo quản ảnh hưởng tới tốc độ lên men và mùi vị.',
  },
  {
    title: 'Ủ & theo dõi',
    description:
      'Quá trình ủ diễn ra theo nhiều giai đoạn: giai đoạn sơ khởi vài tuần đến vài tháng (lên men lỏng), sau đó là giai đoạn ổn định mùi và hương. Kiểm tra định kỳ: quan sát màu sắc, mùi, hiện tượng nổi bọt, nấm mốc; loại bỏ lớp bề mặt nếu thấy tạp chất. Tuỳ vùng miền, người thợ có thể thêm muối bổ sung hoặc rút bớt phần nước để điều chỉnh nồng độ. Ghi chép thay đổi theo thời gian giúp xác định thời điểm mắm đạt chất lượng mong muốn (thường vài tháng đến 1 năm).',
  },
  {
    title: 'Lọc & đóng chai',
    description:
      'Khi mắm đạt hương vị mong muốn, thực hiện lọc để tách tinh chất khỏi bã: dùng vải lọc, lắng tự nhiên hoặc bộ lọc thô. Xử lý tiếp (nếu cần) bằng lắng, lọc mịn, hoặc đun nhẹ để tiệt trùng tuỳ quy trình bảo quản. Đóng chai trong điều kiện sạch, dán nhãn ngày sản xuất và hướng dẫn bảo quản. Bảo quản nơi mát mẻ, tránh ánh nắng; quy trình đóng gói đúng giúp kéo dài thời hạn sử dụng và giữ ổn định hương vị.',
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
