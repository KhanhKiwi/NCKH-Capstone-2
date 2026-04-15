import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import GameplayScreen from "../../../components/making_mats/Screen5/GameplayScreen";
import SuccessScreen from "../../../components/making_mats/Screen5/SuccessScreen";
import FailScreen from "../../../components/making_mats/Screen5/FailScreen";
import { useAI } from "../../../contexts/AIContext";
import { useIdleTrigger, useNewPlayerOnce, useSpamClickTrigger } from "../../../hooks/useNpcTriggers";

export default function Screen5() {
  const { triggerEvent } = useAI();
  const { pathname } = useLocation();

  useNewPlayerOnce(triggerEvent, `ai:new_player:${pathname}`, { event: "new_player", level: 5, step: 1 });

  const step = pathname.includes("/success")
    ? 2
    : pathname.includes("/fail")
      ? 3
      : 1;

  useIdleTrigger(triggerEvent, { event: "idle", level: 5, step }, 45_000);
  useSpamClickTrigger(triggerEvent, { event: "spam_click", level: 5, step }, 10_000, 10);

  return (
    <>
      <button
        type="button"
        onClick={() => triggerEvent({ event: "ask_info", level: 5, step }).catch(() => {})}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1400,
          borderRadius: 999,
          padding: "10px 14px",
          background: "rgba(17, 24, 39, 0.75)",
          border: "1px solid rgba(250, 204, 21, 0.4)",
          color: "#fde68a",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Trợ giúp
      </button>

      <Routes>
        <Route index element={<GameplayScreen />} />
        <Route path="success" element={<SuccessScreen />} />
        <Route path="fail" element={<FailScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export { GameplayScreen, SuccessScreen, FailScreen };
