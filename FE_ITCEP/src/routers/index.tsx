import { createBrowserRouter } from "react-router";
import CraftSelectionPage from "../pages/CraftSelectionPage";
import GamePage from "../pages/GamePage";
import Screen4 from "../pages/making mats/Screen4/Screen4";
import Screen2 from "../components/making_mats/Screen2";
import Screen3 from "../pages/making mats/Screen3";
import Screen5 from "../pages/making mats/Screen5";
import HomePage from "../pages/web-home/HomePage";
import VillageDetailPage from "../pages/VillageDetailPage";
import Screen1 from "../components/making_mats/Screen1";

export const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/game", Component: GamePage },
  { path: "/craft-selection", Component: CraftSelectionPage },
  { path: "/level-1", Component: Screen1 },
  { path: "/level-2", Component: Screen2 },
  { path: "/level-3", Component: Screen3 },
  { path: "/level-4", Component: Screen4 },
  { path: "/level-5", Component: Screen5 },
  { path: "/village/:id", Component: VillageDetailPage },
]);
