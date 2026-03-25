<<<<<<< HEAD
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
=======
import { RouterProvider } from "react-router";
import { router } from "./routers";
import "./App.css";
export default function App() {
  return <RouterProvider router={router} />;}
// import Screen1 from "./components/making_mats/Screen1";
// import CraftSelectionPage from "../src/pages/CraftSelectionPage";
// import GamePage from "../src/pages/GamePage";
// import Screen4 from "../src/pages/making mats/Screen4";
// import HomePage from "../src/pages/web-home/HomePage";


// function App() {
//   return (
//     <>
//       <HomePage/>
//     </>
//   );
// }

// export default App;
>>>>>>> Development
