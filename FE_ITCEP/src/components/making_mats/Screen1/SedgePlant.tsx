import React from "react";
import styles from "./Screen1.module.css";
import type { Plant } from "./game.types";

interface Props {
  plant: Plant;
  phase: number;
  onClick?: (id: string, x: number, y: number) => void;
  onDragStart?: (id: string, e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function SedgePlant({
  plant,
  phase,
  onClick,
  onDragStart,
}: Props) {
  const { type, state, xPercent, yPercent, isWrong, swayDuration } = plant;
  if (state === "collected") return null;

  const isCut = state === "cut";
  const isSelected = state === "selected";

  const cls = [
    styles.plantWrap,
    isCut ? styles.plant_cut : "",
    isSelected ? styles.plant_selected : "",
    isCut && isWrong ? styles.plant_wrongCut : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCut) return;
    onClick?.(plant.id, e.clientX, e.clientY);
  };

  // Calculate depth-based scaling for perspective effect
  let scale = 1;
  let depthClass = "";
  if (yPercent < 55) {
    scale = 0.7;
    depthClass = styles.plantDepthFar;
  } else if (yPercent < 63) {
    scale = 0.85;
    depthClass = styles.plantDepthMid;
  } else if (yPercent < 70) {
    scale = 1.0;
    depthClass = styles.plantDepthNear;
  } else {
    scale = 1.18;
    depthClass = styles.plantDepthClose;
  }

  // Phase-based opacity: phase 1 = 0.85, phase 2 non-selected = 0.70, phase 2 selected = 1.0, phase 3 visibility varies
  let opacity = 1;
  if (phase === 1 && state === "standing" && type !== "mature") {
    opacity = 0.85;
  } else if (phase === 2 && state === "standing" && type !== "mature") {
    opacity = isSelected ? 1.0 : 0.7;
  } else if (state === "standing" && type !== "mature" && yPercent < 60) {
    opacity = 0.85;
  }

  return (
    <div
      id={`plant-${plant.id}`}
      className={`${cls} ${depthClass}`}
      style={{
        position: "absolute",
        left: `${xPercent}%`,
        bottom: `${100 - yPercent}%`,
        transform: isCut
          ? "translateX(-50%) rotate(90deg)"
          : `translateX(-50%) scale(${scale})`,
        transformOrigin: "bottom center",
        opacity: opacity,
        animationDuration: `${swayDuration}ms`,
        cursor: isCut ? "grab" : onClick ? "pointer" : "default",
        zIndex: Math.floor(yPercent),
        userSelect: "none",
        pointerEvents:
          phase === 2 && state === "standing" && type !== "mature"
            ? "auto"
            : phase === 3 && state === "standing"
              ? "none"
              : "auto",
      }}
      onClick={handleClick}
      onMouseDown={(e: React.MouseEvent<HTMLDivElement>) =>
        isCut && onDragStart?.(plant.id, e)
      }
    >
      {/* MATURE */}
      {type === "mature" && !isCut && (
        <svg width="56" height="140" viewBox="-36 -122 72 128">
          <rect
            x="-4.5"
            y="-118"
            width="9"
            height="118"
            rx="4"
            fill="#2E7D32"
            stroke="#1B5E20"
            strokeWidth="1.5"
          />
          <rect
            x="-1.5"
            y="-115"
            width="3"
            height="104"
            fill="#66BB6A"
            opacity="0.45"
          />
          <path
            d="M-1,-40 C-11,-54 -28,-65 -35,-73 C-26,-63 -9,-51 0,-42"
            fill="#388E3C"
            stroke="#2E7D32"
            strokeWidth="1"
          />
          <path
            d="M1,-40 C11,-54 28,-65 35,-73 C26,-63 9,-51 0,-42"
            fill="#43A047"
            stroke="#388E3C"
            strokeWidth="1"
          />
          <path
            d="M-1,-70 C-9,-83 -24,-95 -30,-103 C-22,-93 -7,-80 0,-72"
            fill="#388E3C"
            stroke="#2E7D32"
            strokeWidth="1"
          />
          <path
            d="M1,-70 C9,-83 24,-95 30,-103 C22,-93 7,-80 0,-72"
            fill="#4CAF50"
            stroke="#388E3C"
            strokeWidth="1"
          />
          <ellipse cx="0" cy="-120" rx="4.5" ry="10" fill="#1B5E20" />
        </svg>
      )}

      {/* YOUNG */}
      {type === "young" && !isCut && (
        <svg width="30" height="65" viewBox="-20 -65 40 68">
          <rect
            x="-3"
            y="-58"
            width="6"
            height="58"
            rx="3"
            fill="#66BB6A"
            stroke="#4CAF50"
            strokeWidth="1"
          />
          <path
            d="M-1,-20 C-6,-30 -14,-38 -18,-44 C-12,-37 -4,-28 0,-22"
            fill="#A5D6A7"
          />
          <path
            d="M1,-20 C6,-30 14,-38 18,-44 C12,-37 4,-28 0,-22"
            fill="#A5D6A7"
          />
        </svg>
      )}

      {/* WILTED */}
      {type === "wilted" && !isCut && (
        <svg width="38" height="85" viewBox="-25 -78 50 82">
          <rect
            x="-3.5"
            y="-70"
            width="7"
            height="70"
            rx="3"
            fill="#8D6E63"
            stroke="#6D4C41"
            strokeWidth="1.5"
            transform="rotate(5)"
          />
          <path
            d="M0,-28 C-5,-37 -16,-41 -22,-39 C-13,-36 -5,-30 0,-26"
            fill="#C8B560"
          />
          <path
            d="M0,-28 C5,-37 16,-41 22,-39 C13,-36 5,-30 0,-26"
            fill="#C8B560"
          />
          <path
            d="M0,-50 C-4,-59 -13,-62 -18,-60 C-10,-56 -3,-51 0,-47"
            fill="#C8B560"
          />
        </svg>
      )}

      {/* CUT (lying flat) */}
      {isCut && (
        <div style={{ position: "relative" }}>
          <svg
            width={type === "mature" ? 56 : type === "young" ? 30 : 38}
            height={type === "mature" ? 140 : type === "young" ? 65 : 85}
            viewBox={
              type === "mature"
                ? "-36 -122 72 128"
                : type === "young"
                  ? "-20 -65 40 68"
                  : "-25 -78 50 82"
            }
            style={{
              filter: isWrong
                ? "saturate(0.25) brightness(0.6) drop-shadow(1px 1px 3px rgba(0,0,0,0.3))"
                : "drop-shadow(1px 2px 3px rgba(0,0,0,0.3))",
            }}
          >
            {type === "mature" && (
              <>
                <rect
                  x="-4.5"
                  y="-118"
                  width="9"
                  height="118"
                  rx="4"
                  fill="#2E7D32"
                  stroke="#1B5E20"
                  strokeWidth="1.5"
                />
                <path
                  d="M-1,-40 C-11,-54 -28,-65 -35,-73 C-26,-63 -9,-51 0,-42"
                  fill="#388E3C"
                />
                <path
                  d="M1,-40 C11,-54 28,-65 35,-73 C26,-63 9,-51 0,-42"
                  fill="#43A047"
                />
                <ellipse cx="0" cy="-120" rx="4.5" ry="10" fill="#1B5E20" />
              </>
            )}
            {type === "young" && (
              <>
                <rect
                  x="-3"
                  y="-58"
                  width="6"
                  height="58"
                  rx="3"
                  fill="#66BB6A"
                />
                <path
                  d="M-1,-20 C-6,-30 -14,-38 -18,-44 C-12,-37 -4,-28 0,-22"
                  fill="#A5D6A7"
                />
              </>
            )}
            {type === "wilted" && (
              <>
                <rect
                  x="-3.5"
                  y="-70"
                  width="7"
                  height="70"
                  rx="3"
                  fill="#8D6E63"
                />
                <path
                  d="M0,-28 C-5,-37 -16,-41 -22,-39 C-13,-36 -5,-30 0,-26"
                  fill="#C8B560"
                />
              </>
            )}
          </svg>
          <span
            style={{
              position: "absolute",
              top: -16,
              left: "50%",
              transform: "translateX(-50%) rotate(-90deg)",
              background: isWrong ? "#EF5350" : "#00C853",
              color: "white",
              borderRadius: 8,
              padding: "1px 6px",
              fontSize: 10,
              fontWeight: 800,
              fontFamily: "'Baloo 2', cursive",
              whiteSpace: "nowrap",
            }}
          >
            {isWrong ? "✗ bad" : "drag me ✓"}
          </span>
        </div>
      )}

      {/* Selected check badge */}
      {isSelected && (
        <div className={styles.checkBadge} style={{ pointerEvents: "none" }}>
          ✓
        </div>
      )}

      {/* Label */}
      <span
        className={styles.plantLabel}
        data-type={type}
        data-selected={isSelected}
        style={{
          background:
            type === "mature"
              ? "#2E7D32"
              : type === "young"
                ? "#795548"
                : "#5D4037",
        }}
      >
        {type === "mature" ? "Mature" : type === "young" ? "Young" : "Wilted"}
      </span>
    </div>
  );
}
