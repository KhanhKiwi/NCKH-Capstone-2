import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Phase1 from '../src/pages/making mats/Screen3/Phase1'
import GameplayScreen from '../src/components/making_mats/Screen5/GameplayScreen'
import SuccessScreen from '../src/components/making_mats/Screen5/SuccessScreen'
import FailScreen from '../src/components/making_mats/Screen5/FailScreen'

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Level 5 - Dệt Chiếu - Default Route */}
        <Route path="/" element={<GameplayScreen />} />
        <Route path="/level5" element={<GameplayScreen />} />
        <Route path="/level5/success" element={<SuccessScreen />} />
        <Route path="/level5/fail" element={<FailScreen />} />
        
        {/* Screen 3 - Phase 1 */}
        <Route path="/screen3" element={<Phase1 />} />
      </Routes>
    </Router>
  )
}

export default App
