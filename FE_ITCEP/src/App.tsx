import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GameplayScreen from '../src/components/making_mats/Screen5/GameplayScreen'
import GameplayScreen6 from '../src/components/making_mats/Screen6/GameplayScreen'

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameplayScreen />} />
        <Route path="/level5" element={<GameplayScreen />} />
        <Route path="/level6" element={<GameplayScreen6 />} />
      </Routes>
    </Router>
  )
}

export default App
