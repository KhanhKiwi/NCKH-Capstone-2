import { createBrowserRouter } from "react-router";
import CraftSelectionPage from "../pages/CraftSelectionPage";
import GamePage from "../pages/GamePage";
import Screen4 from "../pages/making mats/Screen4";
import HomePage from "../pages/web-home/HomePage";

export const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/game", Component: GamePage },
  { path: "/craft-selection", Component: CraftSelectionPage },
  { path: "/level-4", Component: Screen4 },
]);
