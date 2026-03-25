import { Routes, Route, Navigate } from 'react-router-dom'
import Phase1 from './Phase1'
import Phase2 from './Phase2'
import Phase3 from './Phase3'
import Phase4 from './Phase4'

export default function Screen3() {
  return (
    <Routes>
      <Route index element={<Phase1 />} />
      <Route path="phase2" element={<Phase2 />} />
      <Route path="phase3" element={<Phase3 />} />
      <Route path="phase4" element={<Phase4 />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  )
}

export { Phase1, Phase2, Phase3, Phase4 }
