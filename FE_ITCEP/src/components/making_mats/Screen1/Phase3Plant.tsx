import type { Plant } from "./game.types";

interface Props {
  plant: Plant;
  onDragStart: (id: string, startX: number, startY: number) => void;
  isDragging: boolean;
}

export default function Phase3Plant({ plant, onDragStart, isDragging }: Props) {
  // Do NOT render collected plants
  if (plant.state === "collected") {
    return null;
  }

  const isStanding = plant.state === "standing" || plant.state === "selected";
  const isCut = plant.state === "cut";
  const isCorrect = isCut && plant.type === "mature" && !plant.isWrong;

  const getSafePosition = () => {
    if (isStanding) {
      // Standing: keep original vertical, but ensure left >= 28% (avoid farmer)
      return {
        left: Math.max(28, plant.xPercent),
        bottom: 100 - plant.yPercent,
      };
    } else if (isCut) {
      // Cut plants: spread across full dirt area, no center gap in phase 3
      let safeX = plant.xPercent;
      // Phase 3 allows center to be filled with plants
      safeX = Math.max(28, safeX);

      // Map yPercent to screen bottom position
      // yPercent 35 → bottom 55%, yPercent 78 → bottom 12%
      const bottomPct = Math.max(8, 100 - plant.yPercent - 10);

      return {
        left: safeX,
        bottom: bottomPct,
      };
    }
    return { left: plant.xPercent, bottom: 100 - plant.yPercent };
  };

  const pos = getSafePosition();
  const leftPct = `${pos.left}%`;
  const bottomPct = `${pos.bottom}%`;

  // Determine visual state and text
  let stemColor: string;
  let labelBg: string;
  let labelText: string;
  let opacity: number;

  if (isCut && isCorrect) {
    // 'cut' + mature + !isWrong → green, draggable, "✓ kéo vào"
    stemColor = "#2E7D32";
    labelBg = "#00C853";
    labelText = "✓ kéo vào";
    opacity = 1;
  } else if (isCut && plant.isWrong) {
    // 'cut' + isWrong → gray, draggable, "✗ xấu"
    stemColor = "#8D6E63";
    labelBg = "#EF5350";
    labelText = "✗ xấu";
    opacity = 0.65;
  } else if (isCut && (plant.type === "young" || plant.type === "wilted")) {
    // 'cut' + young/wilted → pale, draggable, "✗ xấu"
    stemColor = plant.type === "young" ? "#66BB6A" : "#8D6E63";
    labelBg = "#EF5350";
    labelText = "✗ xấu";
    opacity = 0.65;
  } else if (isStanding) {
    // 'standing' or 'selected' → upright, draggable, "đang đứng"
    stemColor = "#8D6E63";
    labelBg = "#795548";
    labelText = "đang đứng";
    opacity = 1;
  } else {
    stemColor = "#8D6E63";
    labelBg = "#795548";
    labelText = "unknown";
    opacity = 1;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: leftPct,
        bottom: bottomPct,
        transform: isStanding
          ? "translateX(-50%)"
          : "translateX(-50%) rotate(90deg)",
        zIndex: 6,
        cursor: "grab",
        userSelect: "none",
        opacity: isDragging ? 0.3 : opacity,
        pointerEvents: "auto",
        touchAction: "none",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDragStart(plant.id, e.clientX, e.clientY);
      }}
    >
      {/* Simple plant SVG */}
      <svg
        width={plant.type === "mature" ? 52 : plant.type === "young" ? 34 : 38}
        height={
          plant.type === "mature" ? 126 : plant.type === "young" ? 70 : 82
        }
        viewBox={
          plant.type === "mature"
            ? "-35 -120 70 125"
            : plant.type === "young"
              ? "-20 -65 40 68"
              : "-22 -75 44 80"
        }
        style={{
          filter: isCorrect
            ? "drop-shadow(0 0 5px rgba(0,200,83,0.4))"
            : "drop-shadow(1px 1px 3px rgba(0,0,0,0.3))",
        }}
      >
        {plant.type === "mature" && (
          <>
            <rect
              x="-4"
              y="-115"
              width="8"
              height="115"
              rx="4"
              fill={stemColor}
              stroke="#1B5E20"
              strokeWidth="1.5"
            />
            <path
              d="M-1,-38 C-10,-52 -26,-62 -33,-70
                   C-25,-61 -8,-49 0,-40"
              fill="#388E3C"
            />
            <path
              d="M1,-38 C10,-52 26,-62 33,-70
                   C25,-61 8,-49 0,-40"
              fill="#43A047"
            />
            <path
              d="M-1,-68 C-8,-80 -22,-92 -28,-100
                   C-21,-91 -6,-78 0,-70"
              fill="#388E3C"
            />
            <path
              d="M1,-68 C8,-80 22,-92 28,-100
                   C21,-91 6,-78 0,-70"
              fill="#4CAF50"
            />
            <ellipse cx="0" cy="-117" rx="4" ry="9" fill="#1B5E20" />
          </>
        )}
        {plant.type === "young" && (
          <>
            <rect
              x="-3"
              y="-58"
              width="6"
              height="58"
              rx="3"
              fill={stemColor}
              stroke="#4CAF50"
              strokeWidth="1"
            />
            <path
              d="M-1,-20 C-6,-30 -14,-38 -18,-44
                   C-12,-37 -4,-28 0,-22"
              fill="#A5D6A7"
            />
            <path
              d="M1,-20 C6,-30 14,-38 18,-44
                   C12,-37 4,-28 0,-22"
              fill="#A5D6A7"
            />
          </>
        )}
        {plant.type === "wilted" && (
          <>
            <rect
              x="-3"
              y="-68"
              width="7"
              height="68"
              rx="3"
              fill={stemColor}
              stroke="#6D4C41"
              strokeWidth="1.5"
            />
            <path
              d="M0,-28 C-5,-37 -16,-41 -22,-39
                   C-13,-36 -5,-30 0,-26"
              fill="#C8B560"
            />
            <path
              d="M0,-28 C5,-37 16,-41 22,-39
                   C13,-36 5,-30 0,-26"
              fill="#C8B560"
            />
          </>
        )}
      </svg>

      {/* Label */}
      <span
        style={{
          display: "block",
          textAlign: "center",
          marginTop: 3,
          background: labelBg,
          color: "white",
          borderRadius: 8,
          padding: "2px 7px",
          fontSize: 10,
          fontWeight: 800,
          fontFamily: "'Baloo 2', cursive",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        {labelText}
      </span>

      {/* Ground shadow for cut plants */}
      {isCut && (
        <div
          style={{
            position: "absolute",
            bottom: -8,
            left: "15%",
            width: "70%",
            height: 10,
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.4), transparent)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
