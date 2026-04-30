import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { villagesData } from '../../../data/villagesData'

export default function BatTrangLevel5Phase0(){
  const navigate = useNavigate()
  const village = villagesData.find(v => v.id === 'bat-trang')

  useEffect(()=>{
    document.title = 'Bát Tràng — Level 5: Giới thiệu'
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
            <h1 className="text-4xl font-extrabold mb-3">Level 5 — Giới thiệu</h1>
            <p className="text-lg text-gray-700 mb-6">Level 5 gồm 2 màn: Màn 1 là bài trắc nghiệm ngắn để ôn kiến thức về nung; Màn 2 là mô phỏng quá trình nung gốm (điều khiển nhiệt độ và thời gian).</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Màn 1 — Trắc nghiệm: trả lời đúng 5/5 để được vào màn nung.</li>
              <li>Màn 2 — Nung gốm: điều chỉnh nhiệt độ trong lò để đạt chất lượng tốt nhất.</li>
              <li>Lưu ý: bạn phải hoàn thành trắc nghiệm với điểm tuyệt đối để tiến hành nung.</li>
            </ul>
          </div>
        </header>

        <main className="bg-white rounded-xl shadow border p-6">
          <p className="mb-6 text-gray-700">Khi sẵn sàng, nhấn "Bắt đầu chơi" để làm Màn 1 (trắc nghiệm). Nếu trả lời đúng 5/5, bạn sẽ được chuyển tới Màn 2 (nung gốm).</p>

          <div className="flex gap-4 mb-6">
            <button onClick={() => navigate('/bat-trang/level-5/phase1')} className="px-6 py-3 bg-amber-500 text-white rounded-md font-semibold">Bắt đầu chơi</button>
            <Link to="/craft-selection" className="px-6 py-3 border rounded-md text-gray-700 font-semibold">Quay lại chọn nghề</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Màn 1 — Trắc nghiệm</h3>
              <p className="text-gray-600">Bộ câu hỏi trắc nghiệm (5 câu) về nung; trả lời đúng 5/5 để mở khóa Màn 2.</p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Màn 2 — Nung gốm (Thực hành)</h3>
              <p className="text-gray-600">Màn mô phỏng: điều chỉnh nhiệt độ và thời gian trong lò để đạt chất lượng cao. Chỉ có thể vào sau khi hoàn thành Màn 1.</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
