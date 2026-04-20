import { Link, useNavigate } from 'react-router'
import { useEffect } from 'react'

export default function Phase0() {
  const navigate = useNavigate()

  useEffect(()=>{
    document.title = 'Bát Tràng — Level 1: Giới thiệu'
    // intentionally not reading completion state here; gating is handled elsewhere
  }, [])


  // Prevent page scrolling while on this intro page
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
            <h1 className="text-4xl font-extrabold mb-3">Level 1 — Giới thiệu</h1>
            <p className="text-lg text-gray-700 mb-6">Trong level 1 bạn sẽ tìm hiểu các bước chuẩn bị đất và thực hành nhào, làm mịn. Hãy hoàn thành Màn 1 trước khi vào Màn 2.</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Chuẩn bị đất: chọn đất, loại bỏ tạp chất.</li>
              <li>Nhào và làm mịn: tập trung lực đều tay và giữ ẩm hợp lý.</li>
              <li>Các bài tập sẽ gồm kiểm tra kiến thức và các thao tác thực hành.</li>
            </ul>
          </div>
        </header>

        <main className="bg-white rounded-xl shadow border p-6">
          <p className="mb-6 text-gray-700">Dưới đây là hai màn thực hành trong Level 1. Bạn phải hoàn thành Màn 1 trước khi bắt đầu Màn 2.</p>

          <div className="flex gap-4 mb-6">
            <button onClick={() => navigate('/bat-trang/level-1/phase1')} className="px-6 py-3 bg-amber-500 text-white rounded-md font-semibold">Bắt đầu Màn 1</button>
            <Link to="/craft-selection" className="px-6 py-3 border rounded-md text-gray-700 font-semibold">Quay lại chọn nghề</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Màn 1: Chọn đất sét</h3>
              <p className="text-gray-600">Bài kiểm tra kiến thức ngắn (5 câu) về cách chọn và chuẩn bị đất trước khi thực hành.</p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Màn 2: Nhào và làm mịn</h3>
              <p className="text-gray-600">Thao tác tương tác: dùng tay để nhào đất và làm mịn bề mặt và sẽ có người hướng dẫn bạn</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
