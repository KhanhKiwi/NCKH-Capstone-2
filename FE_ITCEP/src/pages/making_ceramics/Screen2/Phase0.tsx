import { Link, useNavigate } from 'react-router'
import { useEffect } from 'react'

export default function Phase0() {
  const navigate = useNavigate()

  useEffect(()=>{
    document.title = 'Bát Tràng — Level 2: Giới thiệu'
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
            <h1 className="text-4xl font-extrabold mb-3">Level 2 — Giới thiệu</h1>
            <p className="text-lg text-gray-700 mb-6">Level 2 tập trung vào thao tác tạo hình: kéo, nắn và hoàn thiện bề mặt bằng công cụ kéo. Trước khi vào Màn 1, hãy xem hướng dẫn ngắn dưới đây.</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Kỹ thuật kéo: kéo theo hướng thanh để tạo đường nét mảnh và đều.</li>
              <li>Giữ dụng cụ gần tâm và kéo thẳng theo thanh hướng dẫn.</li>
              <li>Nếu kéo lệch hoặc kéo ngược, tiến độ sẽ chỉ bị trừ 1 lần cho mỗi lần kéo sai.</li>
            </ul>
          </div>
        </header>

        <main className="bg-white rounded-xl shadow border p-6">
          <p className="mb-6 text-gray-700">Dưới đây là màn thực hành trong Level 2. Bắt đầu từ Màn 0 (giới thiệu) để xem hướng dẫn, sau đó sang Màn 1 để thực hành kéo.</p>

          <div className="flex gap-4 mb-6">
            <button onClick={() => navigate('/bat-trang/level-2/phase1')} className="px-6 py-3 bg-amber-500 text-white rounded-md font-semibold">Bắt đầu Màn 1</button>
            <Link to="/craft-selection" className="px-6 py-3 border rounded-md text-gray-700 font-semibold">Quay lại chọn nghề</Link>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Màn 1: Kéo tạo hình</h3>
              <p className="text-gray-600">Học cách kéo theo thanh hướng dẫn để làm mịn và định hình đất.</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
