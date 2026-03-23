export type PlantType = "mature" | "young" | "wilted";
export type PlantState = "standing" | "selected" | "cut" | "collected";
export type GamePhase = 0 | 1 | 2 | 3 | 4;
export type FarmerMood = "idle" | "talking" | "happy" | "sad" | "excited";

export interface Plant {
  id: string;
  type: PlantType;
  state: PlantState;
  xPercent: number;
  yPercent: number;
  isWrong?: boolean;
  swayDuration: number;
  plantHeight?: number;
}

export interface ScorePopItem {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
}

export interface GameState {
  phase: GamePhase;
  plants: Plant[];
  score: number;
  scoreB1: number;
  scoreB2: number;
  scoreB3: number;
  combo: number;
  stars: number;
  penalties: number;
  collectedCount: number;
  selectedIds: string[];
  cutIds: string[];
  farmerMood: FarmerMood;
  bubbleText: string;
  isLocked: boolean;
  scorePops: ScorePopItem[];
  showHint: boolean;
}
