import { createBrowserRouter } from "react-router";
import CraftSelectionPage from "../pages/CraftSelectionPage";
import GamePage from "../pages/GamePage";
import Screen4 from "../pages/making mats/Screen4/Screen4";
import HomePage from "../pages/web-home/HomePage";
import VillageDetailPage from "../pages/VillageDetailPage";
import Screen1 from "../components/making_mats/Screen1";

export const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/game", Component: GamePage },
  { path: "/craft-selection", Component: CraftSelectionPage },
  { path: "/level-1", Component: Screen1 },
  { path: "/level-4", Component: Screen4 },
  { path: "/village/:id", Component: VillageDetailPage },
]);
