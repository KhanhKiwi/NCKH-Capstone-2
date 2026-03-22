import { BrowserRouter, Routes, Route  } from 'react-router-dom'
import Phase1 from './pages/making mats/Screen3/Phase1'
import Phase2 from './pages/making mats/Screen3/Phase2'
import Phase3 from './pages/making mats/Screen3/Phase3'
import './App.css'
// phase-specific styles are imported inside each page to avoid global leakage

function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <Routes>
          <Route path="/" element={<Phase1 />} />
          <Route path="/phase2" element={<Phase2 />} />
          <Route path="/phase3" element={<Phase3 />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
