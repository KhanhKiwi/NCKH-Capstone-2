import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import { villagesData } from '../../../data/villagesData'
import { useAI } from '../../../contexts/AIContext'

export default function BatTrangLevel4Phase0(){
  const navigate = useNavigate()
  const village = villagesData.find(v => v.id === 'bat-trang')
  const { triggerEvent } = useAI()
  const introStepCompletedSentRef = useRef(false)

  const handleStartPlay = () => {
    if (!introStepCompletedSentRef.current) {
      introStepCompletedSentRef.current = true
      triggerEvent({
        event: 'step_completed',
        level: 4,
        step: 1,
        village_name: 'Bát Tràng',
      }).catch(() => {})
    }
    navigate('/bat-trang/level-4/phase1')
  }

  useEffect(()=>{
    document.title = 'Bát Tràng — Level 4: Giới thiệu'
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
            <h1 className="text-4xl font-extrabold mb-3">Level 4 — Giới thiệu</h1>
            <p className="text-lg text-gray-700 mb-6">Level 4 tập trung vào phần trang trí và tráng men — đây là giai đoạn bạn thể hiện tính thẩm mỹ và kỹ thuật hoàn thiện sản phẩm.</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Sử dụng cọ và cọ chấm để trang trí hoa văn trên bình.</li>
              <li>Chọn màu và công cụ phù hợp để thể hiện ý tưởng sáng tạo.</li>
              <li>Giai đoạn tráng men sẽ quyết định độ bóng và màu sắc cuối cùng của sản phẩm.</li>
            </ul>
          </div>
        </header>

        <main className="bg-white rounded-xl shadow border p-6">
          <p className="mb-6 text-gray-700">Phần này không có câu hỏi trắc nghiệm — bạn sẽ thực hành trực tiếp trang trí và tráng men. Khi sẵn sàng, bắt đầu màn để thực hành. Bạn có thể quay lại danh sách nghề nếu muốn.</p>

          <div className="flex gap-4 mb-6">
            <button onClick={handleStartPlay} className="px-6 py-3 bg-amber-500 text-white rounded-md font-semibold">Bắt đầu chơi</button>
            <Link to="/craft-selection?openName=B%C3%A1t%20Tr%C3%A0ng" className="px-6 py-3 border rounded-md text-gray-700 font-semibold">Quay lại chọn nghề</Link>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Màn 1 — Trang trí & Tráng men (Thực hành)</h3>
              <p className="text-gray-600">Thực hành trang trí hoa văn và áp dụng men. Kết thúc màn sẽ lưu tiến trình và mở khóa màn tiếp theo nếu có.</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
