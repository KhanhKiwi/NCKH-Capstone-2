import { createBrowserRouter } from 'react-router'
import { Navigate } from 'react-router-dom'
import CraftSelectionPage from '../pages/CraftSelectionPage'
import GamePage from '../pages/GamePage'
import Screen4MakingMats from '../pages/making mats/Screen4/Screen4'
import Screen2 from '../components/making_mats/Screen2'
import Screen3MakingMats from '../pages/making mats/Screen3'
import Screen5 from '../pages/making mats/Screen5'
import Screen6 from '../pages/making mats/Screen6'
import HomePage from '../pages/web-home/HomePage'
import AboutPage from '../pages/AboutPage'
import PotteryStudyPage from '../pages/studyjob/PotteryStudyPage'
import NamOMamStudyPage from '../pages/studyjob/NamOMamStudyPage'
import ChieuStudyPage from '../pages/studyjob/ChieuStudyPage'

import BatTrangLevel0 from '../pages/making_ceramics/Screen0/screen0'
import BatTrangLevel1Phase0 from '../pages/making_ceramics/Screen1/Phase0'
import BatTrangLevel1Screen1 from '../pages/making_ceramics/Screen1/Phase1'
import BatTrangLevel1Phase2 from '../pages/making_ceramics/Screen1/Phase2'
import BatTrangLevel2Phase0 from '../pages/making_ceramics/Screen2/Phase0'
import BatTrangLevel3Phase0 from '../pages/making_ceramics/Screen3/Phase0'
import BatTrangLevel3Screen1 from '../pages/making_ceramics/Screen3/Phase1'
import BatTrangLevel2 from '../pages/making_ceramics/Screen2/Phase1'
import Level3 from '../pages/making_ceramics/Screen3/Phase2'
import BatTrangLevel4 from '../pages/making_ceramics/Screen4/Phase1'
import BatTrangLevel4Phase0 from '../pages/making_ceramics/Screen4/Phase0'
import BatTrangLevel5Phase1 from '../pages/making_ceramics/Screen5/Phase1'
import BatTrangLevel5Phase0 from '../pages/making_ceramics/Screen5/Phase0'
import BatTrangLevel5Phase2 from '../pages/making_ceramics/Screen5/Phase2'
import VillageDetailPage from '../pages/VillageDetailPage'
import VillagesPage from '../pages/VillagesPage'
import ChallengePage from '../pages/ChallengePage'
import ChallengeMakingCere from '../pages/challenge_making_cere'
import ChallengeMakingFishSauce from '../pages/challenge_making_fish_sauce'
import LeaderboardPage from '../pages/Leaderboard'
import AdminPage from '../pages/admin/AdminPage'
import Screen1 from '../components/making_mats/Screen1'
import RootLayout from './RootLayout'
import { LoginPage } from '../components/log'
import ResetPasswordPage from '../pages/ResetPasswordPage'
import ProfilePage from '../pages/profile/ProfilePage'
import CatchFishGamePage from '../components/Making_Fish_Sauce/Screen1/CatchFishGamePage'
import WashFishGamePage from '../components/Making_Fish_Sauce/Screen2/WashFishGamePage'
import WashSaltGamePage from '../components/Making_Fish_Sauce/Screen3/WashSaltGamePage'
import CloseJarFermentGamePage from '../components/Making_Fish_Sauce/Screen4/CloseJarFermentGamePage'
import Screen5FinalExtractionPhase0 from '../components/Making_Fish_Sauce/Screen5/Phase0'
import Screen5FinalExtraction from '../components/Making_Fish_Sauce/Screen5/Screen5'
import Screen6EternalFragrance from '../components/Making_Fish_Sauce/Screen6/Screen6'


export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/reset-password',
    Component: ResetPasswordPage,
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // legacy/absolute phase paths redirect to their level-prefixed routes
      { path: 'phase2', element: <Navigate to="/level-3/phase2" replace /> },
      { path: 'phase3', element: <Navigate to="/level-3/phase3" replace /> },
      { path: 'phase4', element: <Navigate to="/level-3/phase4" replace /> },

      { index: true, Component: HomePage },
      { path: 'about', Component: AboutPage },
      { path: 'studyjob/gom', Component: PotteryStudyPage },
      { path: 'studyjob/mam-nam-o', Component: NamOMamStudyPage },
      { path: 'studyjob/chieu', Component: ChieuStudyPage },
      { path: 'game', Component: GamePage },
      { path: 'villages', Component: VillagesPage },
      { path: 'challenge', Component: ChallengePage },
      { path: 'leaderboard', Component: LeaderboardPage },
      { path: 'challenge-making-cere', Component: ChallengeMakingCere },
      { path: 'challenge-making-fish-sauce', Component: ChallengeMakingFishSauce },
      { path: 'game/catch-fish', Component: CatchFishGamePage },
      { path: 'game/wash-fish', Component: WashFishGamePage },
      { path: 'game/wash-salt', Component: WashSaltGamePage },
      { path: 'game/close-jar-ferment', Component: CloseJarFermentGamePage },
      { path: 'game/final-extraction', Component: Screen5FinalExtractionPhase0 },
      { path: 'game/final-extraction/play', Component: Screen5FinalExtraction },
      { path: 'game/eternal-fragrance', Component: Screen6EternalFragrance },
      { path: 'craft-selection', Component: CraftSelectionPage },
      { path: 'level-1', Component: Screen1 },
      { path: 'level-2', Component: Screen2 },
      { path: 'level-3/*', Component: Screen3MakingMats },
      { path: 'level-4', Component: Screen4MakingMats },
      { path: 'level-5/*', Component: Screen5 },
      { path: 'level-6/*', Component: Screen6 },
      { path: 'village/:id', Component: VillageDetailPage },
      // Make Phase0 the default view for /bat-trang/level-1
      { path: 'bat-trang/level-1/phase0', Component: BatTrangLevel1Phase0 },
      { path: 'bat-trang/level-1', Component: BatTrangLevel1Phase0 },
      // Ensure level-0 phase0 path exists to match links
      { path: 'bat-trang/level-0/phase0', Component: BatTrangLevel0 },
      // Bat Trang Level 3
      { path: 'bat-trang/level-3/phase0', Component: BatTrangLevel3Phase0 },
      { path: 'bat-trang/level-3/phase1', Component: BatTrangLevel3Screen1 },
      { path: 'bat-trang/level-3/phase2', Component: Level3 },
      { path: 'bat-trang/level-3', element: <Navigate to="/bat-trang/level-3/phase0" replace /> },
      { path: 'bat-trang/level-4/phase0', Component: BatTrangLevel4Phase0 },
      { path: 'bat-trang/level-4/phase1', Component: BatTrangLevel4 },
      { path: 'bat-trang/level-4', element: <Navigate to="/bat-trang/level-4/phase0" replace /> },
      { path: 'bat-trang/level-5/phase0', Component: BatTrangLevel5Phase0 },
      { path: 'bat-trang/level-5/phase1', Component: BatTrangLevel5Phase1 },
      { path: 'bat-trang/level-5/phase2', Component: BatTrangLevel5Phase2 },
      { path: 'bat-trang/level-5', element: <Navigate to="/bat-trang/level-5/phase0" replace /> },
      { path: 'bat-trang/level-1/phase1', Component: BatTrangLevel1Screen1 },
      { path: 'bat-trang/level-1/phase2', Component: BatTrangLevel1Phase2 },
      { path: 'bat-trang/level-2', Component: BatTrangLevel2Phase0 },
      { path: 'bat-trang/level-2/phase0', Component: BatTrangLevel2Phase0 },
      { path: 'bat-trang/level-2/phase1', Component: BatTrangLevel2 },
      { path: 'bat-trang/level-0', Component: BatTrangLevel0 },
      { path: 'admin', Component: AdminPage },
      { path: 'profile', Component: ProfilePage },
    ],
  },
])

export default router
