import type { GameEvent, EventType, EventSeverity, GameDifficulty } from '../types/gameTypes';

type EventConfig = {
  probability: number;
  severity: EventSeverity;
  duration: number;
};

const eventConfigs: Record<GameDifficulty, Record<EventType, EventConfig>> = {
  easy: {
    pressure: { probability: 0.15, severity: 'medium', duration: 8000 },
    water: { probability: 0.12, severity: 'low', duration: 10000 },
    flies: { probability: 0.08, severity: 'low', duration: 5000 },
    temperature: { probability: 0.1, severity: 'low', duration: 12000 }
  },
  medium: {
    pressure: { probability: 0.25, severity: 'high', duration: 6000 },
    water: { probability: 0.2, severity: 'medium', duration: 8000 },
    flies: { probability: 0.15, severity: 'medium', duration: 4000 },
    temperature: { probability: 0.2, severity: 'medium', duration: 10000 }
  },
  hard: {
    pressure: { probability: 0.35, severity: 'critical', duration: 4000 },
    water: { probability: 0.3, severity: 'high', duration: 6000 },
    flies: { probability: 0.25, severity: 'high', duration: 3000 },
    temperature: { probability: 0.3, severity: 'high', duration: 8000 }
  }
};

export class EventSystem {
  private eventIdCounter = 0;
  private difficulty: GameDifficulty = 'medium';

  constructor(difficulty: GameDifficulty = 'medium') {
    this.difficulty = difficulty;
  }

  setDifficulty(difficulty: GameDifficulty) {
    this.difficulty = difficulty;
  }

  generateRandomEvent(jarIndices: number[] = [0, 1, 2]): GameEvent | null {
    const eventTypes: EventType[] = ['pressure', 'water', 'flies', 'temperature'];
    
    for (const eventType of eventTypes) {
      const config = eventConfigs[this.difficulty][eventType];
      
      if (Math.random() < config.probability) {
        const jarIndex = jarIndices[Math.floor(Math.random() * jarIndices.length)];
        
        return {
          id: `event-${this.eventIdCounter++}`,
          type: eventType,
          severity: config.severity,
          jarIndex,
          duration: config.duration + (Math.random() - 0.5) * 2000,
          createdAt: Date.now(),
          active: true
        };
      }
    }
    
    return null;
  }

  getEventConfig(eventType: EventType): EventConfig {
    return eventConfigs[this.difficulty][eventType];
  }

  shouldAllowCombination(event1: GameEvent, event2: GameEvent): boolean {
    // Easy: tidak boleh 2 critical cùng lúc
    if (this.difficulty === 'easy') {
      return !(
        (event1.severity === 'critical' || event2.severity === 'critical') &&
        event1.jarIndex === event2.jarIndex
      );
    }

    // Medium: max 2 non-critical ở same jar
    if (this.difficulty === 'medium') {
      if (event1.jarIndex === event2.jarIndex) {
        return !(event1.severity === 'critical' && event2.severity === 'critical');
      }
    }

    // Hard: all combinations allowed
    return true;
  }
}

export const eventSystem = new EventSystem();
