import React from "react";
import styles from "./Screen1.module.css";
import type { Plant } from "./game.types";
import { useRef } from "react";

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
  
  // Store cut plant position in ref to prevent re-calculation
  const isCutRef = useRef(false);
  const cutStyleRef = useRef({} as React.CSSProperties);

  if (state === "collected") return null;

  const isCut = state === "cut";
  const isSelected = state === "selected";

  // Freeze cut plant position on first render when cut
  if (isCut && !isCutRef.current) {
    isCutRef.current = true;
    // Calculate bottom position for cut plants - max 22% from bottom
    const cutBottom = `${Math.min(yPercent * 0.3, 22)}%`;
    cutStyleRef.current = {
      position: "absolute" as const,
      left: `${xPercent}%`,
      bottom: cutBottom,
      transform: "translateX(-50%) rotate(90deg)",
      transition: "none",
      willChange: "auto",
      zIndex: 4,
      pointerEvents: "none" as const,
    };
  }

  // Calculate depth-based scaling and opacity from yPercent
  let scale = 1;
  let opacity = 1;
  if (yPercent < 48) {
    scale = 0.68;
    opacity = 0.80;
  } else if (yPercent < 56) {
    scale = 0.85;
    opacity = 0.88;
  } else if (yPercent < 62) {
    scale = 1.00;
    opacity = 1.00;
  } else {
    scale = 1.18;
    opacity = 1.00;
  }

  // Young/wilted plants should always be fully visible (opacity 1.0)
  if (type !== "mature") {
    opacity = 1.0;
  }

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

  // If cut, render with frozen position and no interactions
  if (isCut) {
    return (
      <div
        data-plant-id={plant.id}
        data-plant-type={plant.type}
        data-is-wrong={plant.isWrong ? "true" : "false"}
        style={{
          ...cutStyleRef.current,
          cursor: phase === 3 ? "grab" : "default",
          userSelect: "none",
        }}
        onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
          if (phase === 3) {
            e.preventDefault();
            e.stopPropagation();
            onDragStart?.(plant.id, e);
          }
        }}
      >
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
            willChange: "transform",
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
        {phase === 3 && (
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
        )}

        {/* Ground shadow under fallen plant */}
        <div
          style={{
            position: "absolute",
            bottom: "-4px",
            left: "10%",
            width: "50px",
            height: "8px",
            background: "radial-gradient(rgba(0,0,0,0.3), transparent)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
      </div>
    );
  }

  return (
    <div
      id={`plant-${plant.id}`}
      data-plant-id={plant.id}
      className={cls}
      style={{
        position: "absolute",
        left: `${xPercent}%`,
        bottom: `${100 - yPercent}%`,
        transform: `translateX(-50%) scale(${scale})`,
        transformOrigin: "bottom center",
        opacity: opacity,
        animationDuration: `${swayDuration}ms`,
        cursor: onClick ? "pointer" : "default",
        zIndex: Math.floor(yPercent),
        userSelect: "none",
        pointerEvents: "auto",
        filter: isSelected ? "drop-shadow(0 0 10px #00E676)" : "none",
      }}
      onClick={handleClick}
    >
      {/* MATURE */}
      {type === "mature" && (
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
      {type === "young" && (
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
      {type === "wilted" && (
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

      {/* Selected check badge */}
      {isSelected && (
        <div
          className={styles.checkBadge}
          style={{
            position: "absolute",
            top: "-30px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "26px",
            height: "26px",
            background: "#00C853",
            borderRadius: "50%",
            color: "white",
            fontSize: "15px",
            fontWeight: 800,
            fontFamily: "'Baloo 2', cursive",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
            pointerEvents: "none",
          }}
        >
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
