import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Phase1 from '../src/pages/making mats/Screen3/Phase1'
import GameplayScreen from '../src/components/making_mats/Screen5/GameplayScreen'
import SuccessScreen from '../src/components/making_mats/Screen5/SuccessScreen'
import FailScreen from '../src/components/making_mats/Screen5/FailScreen'
import GameplayScreen6 from '../src/components/making_mats/Screen6/GameplayScreen'
import SuccessScreen6 from '../src/components/making_mats/Screen6/SuccessScreen'
import FailScreen6 from '../src/components/making_mats/Screen6/FailScreen'

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
        
        {/* Level 6 - Hoàn thiện Chiếu Advanced */}
        <Route path="/level6" element={<GameplayScreen6 />} />
        <Route path="/level6/success" element={<SuccessScreen6 />} />
        <Route path="/level6/fail" element={<FailScreen6 />} />
        
        {/* Screen 3 - Phase 1 */}
        <Route path="/screen3" element={<Phase1 />} />
      </Routes>
    </Router>
  )
}

export default App
