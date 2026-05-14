import { Link } from 'react-router-dom'

const processSteps = [
  {
    title: 'Thu hoạch cây cối',
    description:
      'Thu hoạch cói, lục bình hoặc tre theo thời vụ và kỹ thuật địa phương; chọn cây đạt độ già vừa đủ để có sợi bền, tránh thu hoạch non gây giảm chất lượng. Loại bỏ phần bị sâu bệnh, cắt thành đoạn phù hợp để tiện xử lý tiếp theo.',
  },
  {
    title: 'Phơi cối',
    description:
      'Phơi vật liệu sau khi thu hoạch để giảm độ ẩm và hạn chế mốc. Phơi đều dưới nắng hoặc trong bóng râm thông thoáng theo truyền thống địa phương; đảo thường xuyên để khô đều, tránh phơi quá lâu gây giòn sợi.',
  },
  {
    title: 'Chẻ tơ và nhuộm màu',
    description:
      'Chẻ sợi từ thân cây, tách sợi thô thành tơ mịn bằng dao hoặc công cụ chuyên dụng; làm sạch và xử lý sơ trước khi nhuộm. Nếu nhuộm, chuẩn bị thuốc nhuộm tự nhiên hoặc công nghiệp, xác định màu và phương pháp nhuộm (ngâm, phun), làm bền màu và rửa sạch trước khi phơi lại.',
  },
  {
    title: 'Lắp khung dệt',
    description:
      'Lắp đặt khung dệt phù hợp kích thước chiếu mong muốn, căng dây cơ sở đều và chắc. Chuẩn bị các công cụ hỗ trợ như kim dệt, chốt, và đảm bảo khung ổn định để giữ mật độ sợi đều trong suốt quá trình dệt.',
  },
  {
    title: 'Dệt chiếu',
    description:
      'Thực hiện dệt theo kỹ thuật truyền thống: luồn, xen kẽ và kết hợp hoa văn nếu cần. Duy trì nhịp điệu đều tay, kiểm soát mật độ và căng sợi; xử lý điểm lỗi ngay lập tức để tránh khuyết tật lớn. Dệt hoàn chỉnh từng khoanh, kiểm tra kích thước và độ phẳng.',
  },
  {
    title: 'Hoàn thiện chiếu',
    description:
      'Cắt tỉa, ghim mép và may viền gia cường; xử lý chống mối mọt, phủ lớp bảo quản nếu cần. Phơi hoặc hong khô hoàn toàn, kiểm tra chất lượng cuối cùng trước khi đóng gói và ghi nhãn hướng dẫn bảo quản.',
  },
]

export default function ChieuStudyPage() {
  return (
    <div className="min-h-screen bg-[#f7f2e8] text-[#3f3224]">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
        .hero-appear { opacity: 0; animation: fadeUp 700ms cubic-bezier(.2,.8,.2,1) forwards; }
        .btn-pulse { transition: transform .18s ease, box-shadow .18s ease; }
        .btn-pulse:hover { transform: translateY(-4px) scale(1.02); }
      `}</style>

      <section
        className="relative overflow-hidden border-b border-[#e6d7be] px-4 py-16"
        style={{ backgroundImage: "url('/anhHuongDan/Langchieu.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center rounded-full border border-[#c38a3f]/40 bg-white/70 px-4 py-2 text-sm font-semibold text-[#6b4a27] shadow-sm">
            Làng nghề chiếu
          </div>

          <h1 className="mt-5 w-full text-4xl font-extrabold leading-tight md:text-6xl hero-appear whitespace-nowrap overflow-x-auto" style={{ fontFamily: 'serif' }}>
            <span className="inline-block mr-3">🧺</span>
            Làng Chiếu Đinh Yên
          </h1>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/villages" className="inline-flex items-center gap-2 rounded-full border border-[#6b4a27]/20 bg-white/90 px-5 py-3 font-semibold text-[#6b4a27] shadow-sm btn-pulse" style={{ animation: 'fadeUp 700ms cubic-bezier(.2,.8,.2,1) forwards', animationDelay: '240ms' }}>
              Quay lại làng nghề
            </Link>
            <Link to="/craft-selection?openName=l%C3%A0ng%20chi%E1%BA%BFu" className="group inline-flex items-center gap-2 rounded-full bg-[#6b4a27] px-6 py-3 font-semibold text-white shadow-lg btn-pulse" style={{ animation: 'fadeUp 700ms cubic-bezier(.2,.8,.2,1) forwards', animationDelay: '320ms' }}>
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
              <p className="text-2xl font-bold text-[#4f3a27]">Nguyên liệu • Dệt • Hoàn thiện</p>
            </div>
          </div>
          <div className="w-full max-w-[420px] rounded-2xl border border-[#e6d7be] bg-white p-5 shadow-sm">
            <div className="flex h-full min-h-[96px] flex-col items-center justify-center text-center">
              <p className="text-2xl font-bold text-[#4f3a27]">Thủ công • Bền vững</p>
            </div>
          </div>
          <div className="w-full max-w-[420px] rounded-2xl border border-[#e6d7be] bg-white p-5 shadow-sm">
            <div className="flex h-full min-h-[96px] flex-col items-center justify-center text-center">
              <p className="text-2xl font-bold text-[#4f3a27]">Giữ truyền thống địa phương</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'serif' }}>
            Quy trình 5 bước làm chiếu
          </h2>
          <span className="rounded-full bg-[#f0dfc2] px-3 py-1 text-sm font-semibold text-[#6b4a27]">Bài học cốt lõi</span>
        </div>

        <div className="flex flex-col gap-6">
          {processSteps.map((step, idx) => (
            <article key={step.title} className="rounded-2xl border border-[#e6d7be] bg-white p-6 shadow-sm hover:shadow-lg" style={{ opacity: 0, transform: 'translateY(12px)', animation: 'fadeUp 650ms cubic-bezier(.2,.8,.2,1) forwards', animationDelay: `${idx * 120}ms` }}>
              <div className="flex items-start gap-3">
                <div className="text-3xl">🧺</div>
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
