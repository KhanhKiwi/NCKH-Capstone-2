import { useState, useCallback, useRef } from "react";
import type { GameState, Plant, PlantType } from "./game.types";

function makePlants(): Plant[] {
  // Fixed x positions spread across entire screen width: 5,12,19,27,35,43,51,59,67,74,81,88,93,97
  const xPositions = [5, 12, 19, 27, 35, 43, 51, 59, 67, 74, 81, 88, 93, 97];
  // Mix of y positions for depth perception
  const yPositions = [50, 55, 58, 62, 65, 68, 72, 75];
  const plants: Plant[] = [];

  // 8 MATURE plants
  for (let i = 0; i < 8; i++) {
    plants.push({
      id: `m${i}`,
      type: "mature",
      state: "standing",
      xPercent: xPositions[i],
      yPercent: yPositions[i % yPositions.length],
      isWrong: false,
      swayDuration: 1600 + Math.random() * 900,
    });
  }
  // 4 YOUNG plants
  for (let i = 0; i < 4; i++) {
    plants.push({
      id: `y${i}`,
      type: "young",
      state: "standing",
      xPercent: xPositions[8 + i],
      yPercent: yPositions[(i + 1) % yPositions.length],
      isWrong: false,
      swayDuration: 1400 + Math.random() * 700,
    });
  }
  // 2 WILTED plants
  for (let i = 0; i < 2; i++) {
    plants.push({
      id: `w${i}`,
      type: "wilted",
      state: "standing",
      xPercent: xPositions[12 + i],
      yPercent: yPositions[(i + 3) % yPositions.length],
      isWrong: false,
      swayDuration: 2000 + Math.random() * 500,
    });
  }
  return plants;
}

function makeDecoys(existing: Plant[]): Plant[] {
  const usedX = existing.map((p) => p.xPercent);
  const types: PlantType[] = ["young", "wilted", "young"];
  return types.map((type, i) => {
    let x = 5 + Math.random() * 82;
    let tries = 0;
    while (usedX.some((u) => Math.abs(u - x) < 7) && tries < 30) {
      x = 5 + Math.random() * 82;
      tries++;
    }
    return {
      id: `decoy${i}`,
      type,
      state: "cut" as const,
      xPercent: x,
      yPercent: 70 + Math.random() * 8,
      isWrong: true,
      swayDuration: 1800,
    };
  });
}

const INIT: GameState = {
  phase: 0,
  plants: [],
  score: 0,
  stars: 3,
  penalties: 0,
  collectedCount: 0,
  selectedIds: [],
  cutIds: [],
  farmerMood: "idle",
  bubbleText:
    "Hello! I am Chi Lan. Welcome to our village! We weave beautiful mats from sedge grass here.",
  isLocked: false,
  scorePops: [],
  showHint: false,
};

let popId = 0;

export function useGameState() {
  const [state, setState] = useState<GameState>({
    ...INIT,
    plants: makePlants(),
  });
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addPop = useCallback(
    (text: string, color: string, x: number, y: number) => {
      const id = `pop${popId++}`;
      setState((s: GameState) => ({
        ...s,
        scorePops: [...s.scorePops, { id, text, color, x, y }],
      }));
      setTimeout(() => {
        setState((s: GameState) => ({
          ...s,
          scorePops: s.scorePops.filter((p) => p.id !== id),
        }));
      }, 950);
    },
    [],
  );

  const startGame = useCallback(() => {
    setState({
      ...INIT,
      plants: makePlants(),
      phase: 1,
      farmerMood: "talking",
      bubbleText:
        "Find 5 MATURE plants! 🌿 Tall, thick, dark green. Avoid small pale ones!",
    });
  }, []);

  const selectPlant = useCallback(
    (id: string, x: number, y: number) => {
      setState((s: GameState) => {
        if (s.isLocked || s.phase !== 1) return s;
        const plant = s.plants.find((p) => p.id === id);
        if (!plant || plant.state !== "standing") return s;

        if (plant.type === "mature") {
          const newSelected = [...s.selectedIds, id];
          const updatedPlants = s.plants.map((p) =>
            p.id === id ? { ...p, state: "selected" as const } : p,
          );
          const done = newSelected.length >= 5;

          if (done) {
            setTimeout(() => {
              setState((prev: GameState) => ({
                ...prev,
                phase: 2,
                farmerMood: "talking",
                bubbleText: "Now click the ✓ marked plants to cut them! ✂️",
              }));
            }, 1600);
          }

          return {
            ...s,
            plants: updatedPlants,
            selectedIds: newSelected,
            score: s.score + 20,
            farmerMood: done ? "excited" : "happy",
            bubbleText: done
              ? "Perfect 5! Now cut them! ✂️"
              : "That's it! Great eye! ✓",
          };
        } else {
          if (lockTimer.current) clearTimeout(lockTimer.current);
          lockTimer.current = setTimeout(() => {
            setState((prev: GameState) => ({ ...prev, isLocked: false }));
          }, 1500);
          addPop("-1 ⭐", "#EF5350", x, y);
          return {
            ...s,
            stars: Math.max(1, s.stars - 1),
            penalties: s.penalties + 1,
            isLocked: true,
            farmerMood: "sad",
            bubbleText: "Oh no! Too young! Find tall dark green ones!",
          };
        }
      });
    },
    [addPop],
  );

  const cutPlant = useCallback(
    (id: string, x: number, y: number) => {
      setState((s: GameState) => {
        if (s.phase !== 2) return s;
        const plant = s.plants.find((p) => p.id === id);
        if (!plant || plant.state === "cut" || plant.state === "collected")
          return s;

        const isCorrect = plant.state === "selected";
        const updatedPlants = s.plants.map((p) =>
          p.id === id
            ? { ...p, state: "cut" as const, isWrong: !isCorrect }
            : p,
        );

        if (isCorrect) {
          const newCuts = [...s.cutIds, id];
          const done = newCuts.length >= 5;
          if (done) {
            setTimeout(() => {
              setState((prev: GameState) => ({
                ...prev,
                phase: 3,
                plants: [...prev.plants, ...makeDecoys(prev.plants)],
                farmerMood: "talking",
                bubbleText:
                  "Now drag the DARK GREEN plants into the basket! 🧺",
              }));
            }, 1600);
          }
          addPop("+10 pts", "#FFD54F", x, y);
          return {
            ...s,
            plants: updatedPlants,
            cutIds: newCuts,
            score: s.score + 10,
            farmerMood: "happy",
            bubbleText: "Nice cut! ✂️",
          };
        } else {
          addPop("-1 ⭐", "#EF5350", x, y);
          return {
            ...s,
            plants: updatedPlants,
            stars: Math.max(1, s.stars - 1),
            penalties: s.penalties + 1,
            farmerMood: "sad",
            bubbleText: "That was a young plant! Be careful! 😬",
          };
        }
      });
    },
    [addPop],
  );

  const collectPlant = useCallback(
    (id: string, x: number, y: number) => {
      setState((s: GameState) => {
        if (s.phase !== 3) return s;
        const plant = s.plants.find((p) => p.id === id);
        if (!plant || plant.state === "collected") return s;

        const isCorrect = plant.type === "mature" && !plant.isWrong;
        if (isCorrect) {
          const updatedPlants = s.plants.map((p) =>
            p.id === id ? { ...p, state: "collected" as const } : p,
          );
          const newCount = s.collectedCount + 1;
          const done = newCount >= 5;
          if (done) {
            setTimeout(() => {
              setState((prev: GameState) => ({
                ...prev,
                phase: 4,
                farmerMood: "excited",
                bubbleText: "WONDERFUL! 🎉 You harvested perfectly!",
              }));
            }, 1200);
          }
          addPop("+15 pts", "#00E676", x, y);
          return {
            ...s,
            plants: updatedPlants,
            collectedCount: newCount,
            score: s.score + 15,
            farmerMood: "happy",
            bubbleText: "Great! Keep going! 🌿",
          };
        } else {
          addPop("-20 pts", "#EF5350", x, y);
          return {
            ...s,
            score: Math.max(0, s.score - 20),
            stars: Math.max(1, s.stars - 1),
            penalties: s.penalties + 1,
            farmerMood: "sad",
            bubbleText: "That one is no good! Only dark green ones! ❌",
          };
        }
      });
    },
    [addPop],
  );

  const toggleHint = useCallback(() => {
    setState((s: GameState) => ({ ...s, showHint: !s.showHint }));
  }, []);

  const resetGame = useCallback(() => {
    setState({ ...INIT, plants: makePlants() });
  }, []);

  return {
    state,
    startGame,
    selectPlant,
    cutPlant,
    collectPlant,
    toggleHint,
    resetGame,
  };
}
