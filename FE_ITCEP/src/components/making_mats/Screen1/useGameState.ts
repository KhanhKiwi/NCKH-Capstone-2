import { useState, useCallback, useRef } from "react";
import type { GameState, Plant, PlantType } from "./game.types";

function makePlants(): Plant[] {
  const plants: Plant[] = [];

  // Scattered grid positions for phase 3
  const xSlots = [29, 34, 39, 44, 51, 57, 63, 68, 73, 78, 83, 89, 94];
  const ySlots = [36, 42, 48, 54, 60, 66, 72, 78];

  // Shuffle x positions
  const shuffledX = [...xSlots].sort(() => Math.random() - 0.5);

  // Generate 14 plants with scattered positions
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

  for (let i = 0; i < plantTypes.length; i++) {
    const plantDef = plantTypes[i];
    const xPercent = shuffledX[i % shuffledX.length];

    // Alternate y positions across ySlots to spread vertically
    const yPercent = ySlots[i % ySlots.length];

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
  const decoyYSlots = [38, 55, 70];

  return types.map((type, i) => {
    let x = 30 + Math.random() * 62;
    let tries = 0;
    while (usedX.some((u) => Math.abs(u - x) < 7) && tries < 25) {
      x = 30 + Math.random() * 62;
      tries++;
    }
    usedX.push(x);
    return {
      id: `decoy${i}`,
      type,
      state: "cut" as const,
      xPercent: x,
      yPercent: decoyYSlots[i],
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
    "Xin chào! Tôi là Chị Lan.\nChào mừng đến làng nghề chiếu của chúng tôi!",
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
        "Tìm 5 cây CÓI TRƯỞNG THÀNH! 🌿\nCao, thân dày, xanh đậm.\nTránh cây nhỏ nhạt màu!",
    });
  }, []);

  const selectPlant = useCallback(
    (id: string, x: number, y: number) => {
      setState((s: GameState) => {
        if (s.isLocked || s.phase !== 1) return s;
        const plant = s.plants.find((p) => p.id === id);
        if (!plant || plant.state !== "standing") return s;

        if (plant.type === "mature") {
          // CORRECT selection
          const newSelected = [...s.selectedIds, id];
          const updatedPlants = s.plants.map((p) =>
            p.id === id ? { ...p, state: "selected" as const } : p,
          );
          const done = newSelected.length >= 5;

          // Update scoreB1
          let newScoreB1 = Math.min(100, s.scoreB1 + 20);
          let newCombo = s.combo + 1;
          let newScore = newScoreB1 + s.scoreB2 + s.scoreB3;

          // Combo bonus
          if (newCombo >= 3) {
            newScore = Math.min(300, newScore + 10);
            newCombo = 0;
          }

          if (done) {
            setTimeout(() => {
              setState((prev: GameState) => ({
                ...prev,
                phase: 2,
                farmerMood: "talking",
                bubbleText:
                  "Cầm liềm của tôi kéo vào\ncây có vòng xanh để cắt! 🌾",
              }));
            }, 1600);
          }
          addPop("+20 đ ✓", "#00E676", x, y);

          return {
            ...s,
            plants: updatedPlants,
            selectedIds: newSelected,
            score: newScore,
            scoreB1: newScoreB1,
            combo: newCombo,
            farmerMood: done ? "excited" : "happy",
            bubbleText: done
              ? "Chọn đủ 5 rồi! Bây giờ hãy cắt! ✂️"
              : "Đúng rồi! Mắt tinh thật! ✓",
          };
        } else {
          // WRONG selection
          if (lockTimer.current) clearTimeout(lockTimer.current);
          lockTimer.current = setTimeout(() => {
            setState((prev: GameState) => ({ ...prev, isLocked: false }));
          }, 1500);

          let newScoreB1 = Math.max(0, s.scoreB1 - 10);
          let newScore = newScoreB1 + s.scoreB2 + s.scoreB3;

          addPop("-10 đ ⭐", "#EF5350", x, y);
          return {
            ...s,
            score: newScore,
            scoreB1: newScoreB1,
            combo: 0,
            stars: Math.max(1, s.stars - 1),
            penalties: s.penalties + 1,
            isLocked: true,
            farmerMood: "sad",
            bubbleText:
              "Ối không! Cây này chưa đủ tuổi!\nTìm cây cao xanh đậm nhé!",
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
          // CORRECT cut
          const newCuts = [...s.cutIds, id];
          const done = newCuts.length >= 5;

          let newScoreB2 = Math.min(100, s.scoreB2 + 20);
          let newScore = s.scoreB1 + newScoreB2 + s.scoreB3;

          if (done) {
            setTimeout(() => {
              setState((prev: GameState) => ({
                ...prev,
                phase: 3,
                plants: [...prev.plants, ...makeDecoys(prev.plants)],
                farmerMood: "talking",
                bubbleText:
                  "Kéo cây CÓI XANH vào rổ! 🧺\nĐể những cây xấu lại!",
              }));
            }, 1600);
          }
          addPop("+20 đ ✂️", "#FFD54F", x, y);
          return {
            ...s,
            plants: updatedPlants,
            cutIds: newCuts,
            score: newScore,
            scoreB2: newScoreB2,
            farmerMood: "happy",
            bubbleText: "Cắt đẹp lắm! ✂️",
          };
        } else {
          // WRONG cut
          let newScoreB2 = Math.max(0, s.scoreB2 - 10);
          let newScore = s.scoreB1 + newScoreB2 + s.scoreB3;

          addPop("-10 đ ⭐", "#EF5350", x, y);
          return {
            ...s,
            plants: updatedPlants,
            score: newScore,
            scoreB2: newScoreB2,
            stars: Math.max(1, s.stars - 1),
            penalties: s.penalties + 1,
            farmerMood: "sad",
            bubbleText: "Ối! Đó là cây non! Cẩn thận hơn nhé!",
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
          // CORRECT collection
          const updatedPlants = s.plants.map((p) =>
            p.id === id ? { ...p, state: "collected" as const } : p,
          );
          const newCount = s.collectedCount + 1;
          const done = newCount >= 5;

          let newScoreB3 = Math.min(100, s.scoreB3 + 20);
          let newScore = s.scoreB1 + s.scoreB2 + newScoreB3;

          if (done) {
            setTimeout(() => {
              setState((prev: GameState) => ({
                ...prev,
                phase: 4,
                farmerMood: "excited",
                bubbleText:
                  "TUYỆT VỜI! 🎉\nBạn thu hoạch thành công!\nLàng nghề cảm ơn bạn!",
                // Recalculate stars based on penalties
                stars: prev.penalties === 0 ? 3 : prev.penalties <= 3 ? 2 : 1,
              }));
            }, 1200);
          }
          addPop("+20 đ 🧺", "#00E676", x, y);
          return {
            ...s,
            plants: updatedPlants,
            collectedCount: newCount,
            score: newScore,
            scoreB3: newScoreB3,
            farmerMood: "happy",
            bubbleText:
              newCount < 5
                ? `Tốt lắm! Còn ${5 - newCount} cây nữa! 🌿`
                : "Xuất sắc! Hoàn thành bó cói! 🎉",
          };
        } else {
          // WRONG collection
          let newScoreB3 = Math.max(0, s.scoreB3 - 20);
          let newScore = s.scoreB1 + s.scoreB2 + newScoreB3;

          addPop("-20 đ ⭐", "#EF5350", x, y);
          return {
            ...s,
            score: newScore,
            scoreB3: newScoreB3,
            stars: Math.max(1, s.stars - 1),
            penalties: s.penalties + 1,
            farmerMood: "sad",
            bubbleText: "Cây đó không tốt! Chỉ lấy cây xanh đậm!",
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
