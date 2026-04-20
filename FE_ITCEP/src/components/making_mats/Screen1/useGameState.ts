import { useState, useCallback, useRef } from "react";
import type { GameState, Plant, PlantType } from "../../../types/making_mats/Screen1/game.types";

function makePlants(): Plant[] {
  const plants: Plant[] = [];

  // Generate 14 plants with random scattered positions
  const plantTypes: Array<{ id: string; type: "mature" | "young" | "wilted" }> =
    [
      // 8 MATURE plants
      ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
        id: `m${i}`,
        type: "mature" as const,
      })),
      // 4 YOUNG plants
      ...[0, 1, 2, 3].map((i) => ({ id: `y${i}`, type: "young" as const })),
      // 2 WILTED plants
      ...[0, 1].map((i) => ({ id: `w${i}`, type: "wilted" as const })),
    ];

  for (const plantDef of plantTypes) {
    let xPercent = 0;
    let yPercent = 0;
    let attempts = 0;
    let valid = false;

    // Generate position with minimum distance check
    while (!valid && attempts < 15) {
      xPercent = 25 + Math.random() * 50; // 25 to 75
      yPercent = 45 + Math.random() * 40; // 45 to 85

      // Check minimum distance from existing plants
      valid = plants.every((p) => {
        const xDist = Math.abs(p.xPercent - xPercent);
        const yDist = Math.abs(p.yPercent - yPercent);
        return !(xDist < 7 && yDist < 5);
      });

      attempts++;
    }

    // Plant sizes for visual variety
    let height = 100;
    let sway = 1600;
    if (plantDef.type === "mature") {
      height = 95 + Math.random() * 20; // 95-115px
      sway = 1600 + Math.random() * 900;
    } else if (plantDef.type === "young") {
      height = 45 + Math.random() * 13; // 45-58px
      sway = 1400 + Math.random() * 700;
    } else {
      // wilted
      height = 55 + Math.random() * 15; // 55-70px
      sway = 2000 + Math.random() * 500;
    }

    plants.push({
      id: plantDef.id,
      type: plantDef.type,
      state: "standing",
      xPercent,
      yPercent,
      isWrong: false,
      swayDuration: sway,
      plantHeight: height,
    });
  }

  return plants;
}

function makeDecoys(existing: Plant[]): Plant[] {
  const usedX = existing.map((p) => p.xPercent);
  const types: PlantType[] = ["young", "wilted", "young"];
  return types.map((type, i) => {
    let x = 30 + Math.random() * 40; // 30 to 70
    let tries = 0;
    while (usedX.some((u) => Math.abs(u - x) < 8) && tries < 20) {
      x = 30 + Math.random() * 40;
      tries++;
    }
    usedX.push(x);
    return {
      id: `decoy${i}`,
      type,
      state: "cut" as const,
      xPercent: x,
      yPercent: 68 + Math.random() * 10,
      isWrong: true,
      swayDuration: 1800,
    };
  });
}

const INIT: GameState = {
  phase: 0,
  plants: [],
  score: 0,
  scoreB1: 0,
  scoreB2: 0,
  scoreB3: 0,
  combo: 0,
  stars: 3,
  penalties: 0,
  collectedCount: 0,
  selectedIds: [],
  cutIds: [],
  farmerMood: "idle",
  bubbleText:
    "Xin chào! Mình là Chi Lan. Chào mừng bạn đến với làng của chúng tôi! Ở đây chúng tôi dệt những tấm chiếu đẹp từ cỏ đót.",
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
        "Tìm 5 cây ĐÃ TRƯỞNG THÀNH! 🌿 Cao, thân dày, xanh đậm. Tránh những cây nhỏ, màu nhạt!",
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
                bubbleText: "Bây giờ nhấp vào những cây có dấu ✓ để cắt chúng! ✂️",
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
              ? "Tuyệt, 5 cây hoàn hảo! Giờ hãy cắt chúng! ✂️"
              : "Tuyệt! Nhìn chuẩn! ✓",
          };
        } else {
          if (lockTimer.current) clearTimeout(lockTimer.current);
          lockTimer.current = setTimeout(() => {
            setState((prev: GameState) => ({ ...prev, isLocked: false }));
          }, 1500);
          addPop("-1 sao", "#EF5350", x, y);
          return {
            ...s,
            stars: Math.max(1, s.stars - 1),
            penalties: s.penalties + 1,
            isLocked: true,
            farmerMood: "sad",
            bubbleText: "Ôi không! Còn non! Tìm cây cao, xanh đậm nhé!",
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

        // Allow cutting ANY standing plant, not just selected ones
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
                bubbleText: "Kéo những cây xanh đã ngã vào giỏ! 🌾",
              }));
            }, 1600);
          }
          addPop("+10 điểm", "#FFD54F", x, y);
          return {
            ...s,
            plants: updatedPlants,
            cutIds: newCuts,
            score: s.score + 10,
            farmerMood: "happy",
            bubbleText: "Cắt đẹp! ✂️",
          };
        } else {
          addPop("-1 sao", "#EF5350", x, y);
          return {
            ...s,
            plants: updatedPlants,
            stars: Math.max(1, s.stars - 1),
            penalties: s.penalties + 1,
            farmerMood: "sad",
            bubbleText: "Nhầm cây! Chỉ cắt những cây đã được đánh dấu! 😬",
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

        // Correct: must be mature, not wrong, and already cut (fallen)
        const isCorrect =
          plant.type === "mature" && !plant.isWrong && plant.state === "cut";

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
                bubbleText: "Tuyệt vời! 🎉 Bạn thu hoạch hoàn hảo!",
              }));
            }, 1200);
          }
          addPop("+15 điểm", "#00E676", x, y);
          return {
            ...s,
            plants: updatedPlants,
            collectedCount: newCount,
            score: s.score + 15,
            farmerMood: "happy",
            bubbleText: "Tuyệt! Tiếp tục nào! 🌿",
          };
        } else {
          addPop("-20 điểm", "#EF5350", x, y);
          return {
            ...s,
            score: Math.max(0, s.score - 20),
            stars: Math.max(1, s.stars - 1),
            penalties: s.penalties + 1,
            farmerMood: "sad",
            bubbleText: "Bó sai! Chỉ chọn cây xanh đậm! ❌",
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
