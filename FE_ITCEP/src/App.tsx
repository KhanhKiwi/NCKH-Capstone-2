import { BrowserRouter, Routes, Route  } from 'react-router-dom'
import Phase1 from './pages/making mats/Screen3/Phase1'
import Phase2 from './pages/making mats/Screen3/Phase2'
import './App.css'
import '../src/styles/Screen3/Phase1/game.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <Routes>
          <Route path="/" element={<Phase1 />} />
          <Route path="/phase2" element={<Phase2 />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
