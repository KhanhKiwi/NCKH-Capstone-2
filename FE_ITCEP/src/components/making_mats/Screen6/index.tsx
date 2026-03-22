import { Routes, Route, Navigate } from "react-router-dom";
import GameplayScreen from "./GameplayScreen";
import SuccessScreen from "./SuccessScreen";
import FailScreen from "./FailScreen";

export default function Screen6() {
  return (
    <Routes>
      <Route path="/" element={<GameplayScreen />} />
      <Route path="/success" element={<SuccessScreen />} />
      <Route path="/fail" element={<FailScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export { GameplayScreen, SuccessScreen, FailScreen };
