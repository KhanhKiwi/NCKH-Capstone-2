import { Link } from 'react-router-dom'

const processSteps = [
  {
    title: 'Chuẩn bị đất',
    description: 'Lựa chọn và xử lý đất sét: lọc sạn, nhào và cân bằng độ ẩm để đạt độ dẻo.',
  },
  {
    title: 'Tạo hình',
    description: 'Tạo dáng bằng tay hoặc trên bàn xoay, điều chỉnh lực tay và tỷ lệ sản phẩm.',
  },
  {
    title: 'Phơi khô',
    description: 'Phơi đến trạng thái bán khô, sau đó sửa mộc, gọt và làm nhẵn bề mặt.',
  },
  {
    title: 'Trang trí & tráng men',
    description: 'Vẽ hoa văn, phủ men lên bề mặt và kiểm tra độ phủ trước khi nung.',
  },
  {
    title: 'Nung & hoàn thiện',
    description: 'Nung ở nhiệt độ phù hợp, làm sạch và kiểm tra chất lượng sản phẩm cuối cùng.',
  },
]

const artisanTips = [
  'Giữ đất luôn đủ ẩm, không quá nhão cũng không quá khô.',
  'Khi vuốt thành gốm, tập trung vào nhịp tay đều thay vì dùng lực mạnh.',
  'Không phơi trực tiếp dưới nắng gắt để tránh nứt chân chim.',
  'Luôn thử mẫu men trên mảnh nhỏ trước khi đưa vào lò chính.',
]

export default function PotteryStudyPage() {
  return (
    <div className="min-h-screen bg-[#f7f2e8] text-[#3f3224]">
      <section className="relative overflow-hidden border-b border-[#e6d7be] bg-linear-to-br from-[#fff7ea] via-[#f7ead2] to-[#edd6ad] px-4 py-16">
        <div className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-[#d9a75e]/25 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-[#a86f2c]/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center rounded-full border border-[#c38a3f]/40 bg-white/70 px-4 py-2 text-sm font-semibold text-[#6b4a27] shadow-sm">
            Làng nghề gốm
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl" style={{ fontFamily: 'serif' }}>
            Học Làng Nghề Gốm Thanh Hà
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5a4734] md:text-xl">
            Trang học này giúp bạn nắm được quy trình làm gốm từ nguyên liệu thô đến sản phẩm hoàn thiện, hiểu tinh thần lao động của nghệ nhân và
            sẵn sàng bước vào phần thực hành trong game.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/craft-selection?openName=l%C3%A0ng%20g%C3%B3m%20Thanh%20H%C3%A0"
              className="group inline-flex items-center gap-2 rounded-full bg-[#6b4a27] px-6 py-3 font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#5a3d1f]"
            >
              Bắt đầu chơi game
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-8 md:grid-cols-3">
        <div className="rounded-2xl border border-[#e6d7be] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7a6349]">Kỹ năng trọng tâm</p>
          <p className="mt-2 text-2xl font-bold text-[#4f3a27]">Tạo hình • Men • Nung</p>
        </div>
        <div className="rounded-2xl border border-[#e6d7be] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7a6349]">Mức độ</p>
          <p className="mt-2 text-2xl font-bold text-[#4f3a27]">Cơ bản đến nâng cao</p>
        </div>
        <div className="rounded-2xl border border-[#e6d7be] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7a6349]">Mục tiêu</p>
          <p className="mt-2 text-2xl font-bold text-[#4f3a27]">Hiểu nghề để giữ nghề</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'serif' }}>
            Quy trình 5 bước làm gốm
          </h2>
          <span className="rounded-full bg-[#f0dfc2] px-3 py-1 text-sm font-semibold text-[#6b4a27]">Bài học cốt lõi</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {processSteps.map((step) => (
            <article
              key={step.title}
              className="rounded-2xl border border-[#e6d7be] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-xl font-bold text-[#4f3a27]">{step.title}</h3>
              <p className="mt-3 leading-7 text-[#5e4c3a]">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl px-4 pb-14">
        <div className="rounded-3xl border border-[#d9bf95] bg-linear-to-r from-[#f8ecd7] to-[#f3dfbe] p-7 shadow-md">
          <h2 className="text-2xl font-bold text-[#4f3a27]" style={{ fontFamily: 'serif' }}>
            Mẹo từ nghệ nhân
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {artisanTips.map((tip) => (
              <div key={tip} className="rounded-xl bg-white/75 px-4 py-3 text-[#5a4734] shadow-sm">
                {tip}
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/game"
              className="rounded-full bg-[#6b4a27] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-[#52361c]"
            >
              Quay lại khu trò chơi
            </Link>
            <Link
              to="/"
              className="rounded-full border border-[#6b4a27]/35 px-5 py-2.5 font-semibold text-[#6b4a27] transition-colors hover:bg-white/70"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
