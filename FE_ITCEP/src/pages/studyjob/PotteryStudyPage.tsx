import { Link } from 'react-router-dom'

const processSteps = [
  {
    title: 'Chuẩn bị đất',
    description:
      'Lựa chọn đất sét phù hợp: phân loại, loại bỏ tạp chất (sạn, sỏi) bằng sàng lọc hoặc ngâm lắng. Tiếp theo nhào và cán đất để đồng đều kết cấu, điều chỉnh độ ẩm bằng cách thêm/giảm nước cho tới khi đất đạt độ dẻo ổn định — không quá ướt hoặc quá khô. Đôi khi cần ủ đất (lão đất) để loại bỏ khí và tăng độ kết dính trước khi tạo hình.',
  },
  {
    title: 'Tạo hình',
    description:
      'Tạo phôi ban đầu bằng cách nặn hoặc dùng khuôn, sau đó lên bàn xoay để định hình. Giữ tư thế tay ổn định, dùng lực đều và từ tốn để tránh méo vênh; thường thực hiện theo các bước: dựng trục, thu gọn thành thân, kéo thành và tạo các chi tiết. Kiểm tra tỷ lệ, làm mịn và loại bỏ phần đất thừa trước khi để khô nhẹ.',
  },
  {
    title: 'Phơi khô',
    description:
      'Phơi sản phẩm dần dần trong bóng râm hoặc nơi thoáng gió để tránh khô quá nhanh gây nứt. Khi đạt trạng thái bán khô (leather-hard) thực hiện sửa mộc: gọt, mài, làm nhẵn các góc, và cắt bỏ phần nền không mong muốn. Kiểm tra cẩn thận để vá các vết rạn nhỏ bằng bùn đất pha loãng (slip) trước khi để khô hoàn toàn trước khi gia nhiệt.',
  },
  {
    title: 'Trang trí & tráng men',
    description:
      'Chuẩn bị bề mặt bằng cách làm sạch bụi và xử lý tiền men nếu cần (nhám nhẹ, rửa nước). Áp dụng kỹ thuật trang trí: vẽ, khắc, in khuôn hoặc kết hợp màu men, sau đó phủ men bằng cọ, nhúng hoặc phun để đạt lớp phủ đều. Luôn thử men trên mẫu nhỏ để kiểm tra độ co ngót, màu sắc và phản ứng với đất trước khi phủ lên sản phẩm chính.',
  },
  {
    title: 'Nung & hoàn thiện',
    description:
      'Tiến hành nung theo lịch trình nhiệt phù hợp với loại đất và men (gồm gia nhiệt dần, giữ mức nhiệt tối đa và làm nguội từ từ). Kiểm soát nhiệt độ để tránh nứt do sốc nhiệt; tùy mục đích có thể nung hai lần (biscuit rồi glaze). Sau khi nguội, làm sạch, kiểm tra bề mặt, và loại bỏ khuyết tật nhỏ; nếu cần thực hiện đánh bóng hoặc gắn phụ kiện hoàn thiện.',
  },
]
export default function PotteryStudyPage() {
  return (
    <div className="min-h-screen bg-[#f7f2e8] text-[#3f3224]">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
        @keyframes pulseGlow { 0% { box-shadow: 0 0 0 rgba(0,0,0,0); } 50% { box-shadow: 0 18px 40px rgba(168,111,44,0.12); } 100% { box-shadow: 0 0 0 rgba(0,0,0,0); } }
        .hero-appear { opacity: 0; animation: fadeUp 700ms cubic-bezier(.2,.8,.2,1) forwards; }
        .btn-pulse { transition: transform .18s ease, box-shadow .18s ease; }
        .btn-pulse:hover { transform: translateY(-4px) scale(1.02); }
      `}</style>
      <section
        className="relative overflow-hidden border-b border-[#e6d7be] px-4 py-16"
        style={{ backgroundImage: "url('/anhHuongDan/LangGom.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* subtle overlay to preserve readability */}
        <div className="absolute inset-0 bg-black/12" />
        <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-[#d9a75e]/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-[#a86f2c]/14 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center rounded-full border border-[#c38a3f]/40 bg-white/70 px-4 py-2 text-sm font-semibold text-[#6b4a27] shadow-sm">
            Làng nghề gốm
          </div>

          <h1
            className="mt-5 w-full text-4xl font-extrabold leading-tight md:text-6xl hero-appear whitespace-nowrap overflow-x-auto"
            style={{ fontFamily: 'serif' }}
          >
            <span className="inline-block mr-3 transform-gpu" style={{ animation: 'fadeUp 900ms cubic-bezier(.2,.8,.2,1) forwards' }}>🏺</span>
            Làng Nghề Gốm Thanh Hà
          </h1>



          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/villages"
              className="inline-flex items-center gap-2 rounded-full border border-[#6b4a27]/20 bg-white/90 px-5 py-3 font-semibold text-[#6b4a27] shadow-sm transition-colors hover:bg-white btn-pulse"
              style={{ animation: 'fadeUp 700ms cubic-bezier(.2,.8,.2,1) forwards', animationDelay: '240ms' }}
            >
              Quay lại làng nghề
            </Link>
            <Link
              to="/craft-selection?openName=l%C3%A0ng%20g%C3%B3m%20Thanh%20H%C3%A0"
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
              <p className="text-2xl font-bold text-[#4f3a27]">Tạo hình • Men • Nung</p>
            </div>
          </div>
          <div className="w-full max-w-[420px] rounded-2xl border border-[#e6d7be] bg-white p-5 shadow-sm">
            <div className="flex h-full min-h-[96px] flex-col items-center justify-center text-center">
              <p className="text-2xl font-bold text-[#4f3a27]">Cơ bản đến nâng cao</p>
            </div>
          </div>
          <div className="w-full max-w-[420px] rounded-2xl border border-[#e6d7be] bg-white p-5 shadow-sm">
            <div className="flex h-full min-h-[96px] flex-col items-center justify-center text-center">
              <p className="text-2xl font-bold text-[#4f3a27]">Hiểu nghề để giữ nghề</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'serif' }}>
            Quy trình 5 bước làm gốm
          </h2>
          <span className="rounded-full bg-[#f0dfc2] px-3 py-1 text-sm font-semibold text-[#6b4a27]">Bài học cốt lõi</span>
        </div>

        <div className="flex flex-col gap-6">
          {processSteps.map((step, idx) => (
            <article
              key={step.title}
              className="rounded-2xl border border-[#e6d7be] bg-white p-6 shadow-sm hover:shadow-lg"
              style={{
                opacity: 0,
                transform: 'translateY(12px)',
                animation: 'fadeUp 650ms cubic-bezier(.2,.8,.2,1) forwards',
                animationDelay: `${idx * 120}ms`,
              }}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">🏺</div>
                <div>
                  <h3 className="text-xl font-bold text-[#4f3a27]">{step.title}</h3>
                  <p className="mt-3 leading-7 text-[#5e4c3a]">{step.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* artisan tips section removed */}
    </div>
  )
}
