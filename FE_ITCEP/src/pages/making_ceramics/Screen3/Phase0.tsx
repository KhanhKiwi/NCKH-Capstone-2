import { Link, useNavigate } from 'react-router'
import { useEffect } from 'react'

export default function Phase0() {
  const navigate = useNavigate()

  useEffect(()=>{
    document.title = 'Bát Tràng — Level 3: Giới thiệu'
  }, [])

  useEffect(()=>{
    const prevHtml = document.documentElement.style.overflow
    const prevBody = document.body.style.overflow
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    return ()=>{
      document.documentElement.style.overflow = prevHtml
      document.body.style.overflow = prevBody
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12" style={{height: '100vh', overflow: 'hidden'}}>
      <div className="max-w-4xl mx-auto px-6">
        <header className="relative rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-100 mb-8">
          <div className="p-10">
            <h1 className="text-4xl font-extrabold mb-3">Level 3 — Giới thiệu</h1>
            <p className="text-lg text-gray-700 mb-6">Level 3 tập trung vào quá trình phơi khô và quản lý độ ẩm. Trong màn này bạn sẽ học cách đưa gốm vào/ra để điều chỉnh độ khô phù hợp với thời tiết.</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Thời tiết thay đổi: nắng, âm u, mưa — mỗi loại ảnh hưởng khác nhau đến tốc độ khô.</li>
              <li>Sử dụng nút "Đưa gốm ra" để phơi; khi ở ngoài, tiến độ phơi sẽ thay đổi theo thời tiết.</li>
              <li>Theo dõi đồng hồ thời tiết và cảnh báo khi còn ≤5 giây.</li>
            </ul>
          </div>
        </header>

        <main className="bg-white rounded-xl shadow border p-6">
          <p className="mb-6 text-gray-700">Khi sẵn sàng, bắt đầu màn để thực hành việc điều khiển gốm theo thời tiết. Bạn có thể quay lại danh sách nghề nếu muốn.</p>

          <div className="flex gap-4 mb-6">
            <button onClick={() => navigate('/bat-trang/level-3/phase1')} className="px-6 py-3 bg-amber-500 text-white rounded-md font-semibold">Bắt đầu chơi</button>
            <Link to="/craft-selection" className="px-6 py-3 border rounded-md text-gray-700 font-semibold">Quay lại chọn nghề</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Mục tiêu</h3>
              <p className="text-gray-600">Đạt được độ ẩm 100% trước khi hết giờ để hoàn thành màn. Thời gian mức cao hơn cho sao nhiều hơn.</p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Lưu ý</h3>
              <p className="text-gray-600">Nếu độ ẩm giảm xuống 0% gốm sẽ hỏng và bạn cần thử lại.</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
