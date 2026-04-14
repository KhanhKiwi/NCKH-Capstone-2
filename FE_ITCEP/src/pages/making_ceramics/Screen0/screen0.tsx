import { Link } from 'react-router'
import { useEffect } from 'react'

export default function BatTrangLevel0() {
  useEffect(() => {
    document.title = 'Bát Tràng — Giới thiệu'

    // reveal on scroll using IntersectionObserver
    const els = Array.from(document.querySelectorAll('.revealable'))
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('is-visible')
        }
      })
    }, { threshold: 0.12 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12">
      <style>{`
        .revealable { opacity: 0; transform: translateY(10px); transition: opacity 600ms ease, transform 600ms ease; }
        .revealable.is-visible { opacity: 1; transform: translateY(0); }
        .kenburns { animation: kenburns 12s ease-in-out infinite alternate; transform-origin: center; }
        @keyframes kenburns { from { transform: scale(1) translateY(0); } to { transform: scale(1.08) translateY(-6px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float 10s ease-in-out infinite; }
        @keyframes float { 0% { transform: translateY(0) } 50% { transform: translateY(-8px) } 100% { transform: translateY(0) } }
      `}</style>
      <div className="max-w-5xl mx-auto px-6">
        <header className="relative rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-100">
          <div className="absolute inset-0 bg-[url('/picture/ceramics/anh2.png')] bg-cover bg-center opacity-30 -z-10 kenburns" />
          {/* decorative floating accents */}
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-amber-200 opacity-30 animate-float -z-0" />
          <div className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full bg-emerald-100 opacity-25 animate-float-slow -z-0" />
          <div className="p-10">
            <h1 className="text-4xl font-extrabold mb-3">Làng gốm Bát Tràng</h1>
            <p className="text-lg text-gray-700 mb-6">Khám phá lịch sử, kỹ thuật và những truyền kỳ gắn với nghề gốm — nơi đất, nước và lửa hòa quyện để tạo nên những sản phẩm nghệ thuật sống động.</p>

            <div className="flex gap-3">
              <Link to="/bat-trang/level-1" className="px-5 py-3 bg-emerald-600 text-white rounded-full shadow hover:scale-105 transition-transform">Bắt đầu thực hành</Link>
              <Link to="/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng" className="px-5 py-3 border rounded-full text-gray-700">Quay lại</Link>
            </div>
          </div>
        </header>

        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <article className="lg:col-span-2 bg-white p-6 rounded-xl shadow border revealable">
            <h2 className="text-2xl font-bold mb-3">Hành trình của đất và lửa</h2>
            <p className="mb-4 text-gray-700">Làng gốm Bát Tràng có lịch sử trải dài nhiều thế kỷ, bắt nguồn từ những nghệ nhân biết tận dụng nguồn đất sét màu mỡ ven sông. Qua thời gian, kỹ thuật tạo hình, trang trí và nung men ngày càng tinh tế, tạo nên phong cách riêng dễ nhận biết của Bát Tràng: đơn giản nhưng thanh lịch, vừa thực dụng vừa nghệ thuật.</p>

            <p className="mb-4 text-gray-700">Trong phần này bạn sẽ đọc về nguồn gốc, quy trình làm gốm truyền thống, các kiểu men tiêu biểu và các câu chuyện dân gian truyền lại trong làng — tất cả được trình bày sinh động, có hình minh họa và các mẹo nhanh để bạn dễ nắm bắt trước khi vào phần thực hành.</p>

            <blockquote className="border-l-4 border-amber-300 pl-4 italic text-gray-700">“Gốm là tiếng nói của đất — mỗi sản phẩm lưu giữ một mảnh ký ức của người thợ.”</blockquote>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-amber-50">
                <h3 className="font-semibold mb-2">Quy trình tóm tắt</h3>
                <ol className="list-decimal list-inside text-sm text-gray-700">
                  <li>Chuẩn bị đất: lắng lọc, trộn và bảo quản.</li>
                  <li>Tạo hình: nặn tay, dùng bàn xoay hoặc khuôn.</li>
                  <li>Sấy & nung lần 1: tạo độ bền thô.</li>
                  <li>Trang trí & tráng men: tạo lớp bề mặt và hoa văn.</li>
                  <li>Nung hoàn thiện: làm kết tinh men và độ bền cuối cùng.</li>
                </ol>
              </div>

              <div className="p-4 rounded-lg bg-amber-50">
                <h3 className="font-semibold mb-2">Điểm nhấn văn hoá</h3>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  <li>Nghề truyền nghề qua dòng họ và làng xóm.</li>
                  <li>Sản phẩm vừa thực dụng vừa mang giá trị thẩm mỹ.</li>
                  <li>Lễ hội, hội chợ và thị trường gốm đóng vai trò quan trọng.</li>
                </ul>
              </div>
            </div>
          </article>

          <aside className="hidden lg:block bg-white p-6 rounded-xl shadow border revealable">
            <h3 className="font-semibold mb-3">Mẹo nhanh</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><strong>Chọn đất:</strong> ưu tiên đất mịn, ít tạp chất.</li>
              <li><strong>Thao tác:</strong> giữ độ ẩm đều tay khi nặn.</li>
              <li><strong>Nhiệt độ lửa:</strong> kiểm soát theo men bạn dùng.</li>
            </ul>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <img src="/picture/ceramics/anh1.png" alt="gốm thủ công 1" className="w-full h-40 object-cover rounded-md shadow-sm transform transition hover:scale-105" />
              <img src="/picture/ceramics/anh2.png" alt="gốm thủ công 2" className="w-full h-40 object-cover rounded-md shadow-sm transform transition hover:scale-105" />
            </div>
          </aside>
        </main>

        <section className="mt-8 bg-white p-6 rounded-xl shadow border revealable">
          <h2 className="text-2xl font-bold mb-3">Truyền kỳ dân gian</h2>
          <p className="text-gray-700">Ngày xưa, trong một gia đình thợ gốm có một người con trai mồ côi khéo léo. Người ấy học nghề từng bước, nghe lời các bậc thầy, và một lần cứu lò nung trong đêm mưa bằng cách dùng đôi tay và kinh nghiệm để điều chỉnh than. Từ đó câu chuyện được truyền miệng về lòng kiên trì, trí tuệ và sự tôn trọng nghề. Những câu chuyện như vậy giúp kết nối thế hệ và trao truyền tinh thần nghề tới hôm nay.</p>
        </section>

        <footer className="mt-8 py-8 revealable">
          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-600 order-2 sm:order-1">Sẵn sàng chưa? Phần tiếp theo là thực hành tay nghề.</div>

            <div className="order-1 sm:order-2 w-full sm:w-auto flex items-center justify-center sm:justify-end gap-4">
              <Link to="/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng" className="text-sm text-gray-600 underline underline-offset-4 decoration-amber-400 decoration-2">Quay lại chọn nghề</Link>
              <Link
                to="/bat-trang/level-1"
                className="px-5 py-3 bg-amber-500 text-white rounded-full shadow-lg transform transition duration-200 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-200"
              >
                Tiếp tục — Cấp 1
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
