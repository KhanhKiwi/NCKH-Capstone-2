import { Routes, Route, Navigate } from "react-router-dom";
import GameplayScreen from "../../../components/making_mats/Screen5/GameplayScreen";
import SuccessScreen from "../../../components/making_mats/Screen5/SuccessScreen";
import FailScreen from "../../../components/making_mats/Screen5/FailScreen";

export default function Screen5() {
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
