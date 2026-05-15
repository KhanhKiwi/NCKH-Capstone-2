// Game Event Types
export type EventType = 'pressure' | 'water' | 'flies' | 'temperature';
export type EventSeverity = 'critical' | 'high' | 'medium' | 'low';
export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type FeedbackType = 'perfect' | 'good' | 'failed' | 'info';

// Game Event Interface
export interface GameEvent {
  id: string;
  type: EventType;
  severity: EventSeverity;
  jarIndex: number;
  duration: number;
  createdAt: number;
  active: boolean;
}

// Jar State Interface
export interface JarState {
  id: string;
  index: number;
  quality: number;
  pressure: number;
  water: number;
  temperature: number;
  infected: boolean;
  health: number;
  isTreating?: boolean;
  treatTimeLeft?: number;
  infectionDuration?: number;
}

// Game Statistics Interface
export interface GameStats {
  chainCombo: number;
  totalActions: number;
  successActions: number;
  failedActions: number;
  quality: number;
  currentMonth: number;
}

// Feedback Interface
export interface GameFeedback {
  show: boolean;
  type: FeedbackType;
  message: string;
  jarIndex?: number;
  x?: number;
  y?: number;
}

// Export Feedback as alias for backward compatibility
export type Feedback = GameFeedback;
