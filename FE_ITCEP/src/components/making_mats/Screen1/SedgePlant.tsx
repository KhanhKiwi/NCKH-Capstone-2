import React from "react";
import styles from "../../../styles/Screen1/Screen1.module.css";
import type { Plant } from "../../../types/making_mats/Screen1/game.types";
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
    // Ensure x position avoids center zone 40-60% and farmer left 0-28%
    let safeX = xPercent;
    if (safeX >= 46 && safeX <= 60) {
      safeX = safeX < 53 ? safeX - 18 : safeX + 18;
    }
    safeX = Math.max(28, safeX);
    
    // Calculate bottom position for cut plants - max 22% from bottom
    const cutBottom = `${Math.min(yPercent * 0.3, 22)}%`;
    cutStyleRef.current = {
      position: "absolute" as const,
      left: `${safeX}%`,
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
    opacity = 0.8;
  } else if (yPercent < 56) {
    scale = 0.85;
    opacity = 0.88;
  } else if (yPercent < 62) {
    scale = 1.0;
    opacity = 1.0;
  } else {
    scale = 1.18;
    opacity = 1.0;
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
          {/* Gradient defs */}
          <defs>
            <linearGradient id="sedgeGradMature" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#2E7D32" stopOpacity={1} />
              <stop offset="40%" stopColor="#43A047" stopOpacity={1} />
              <stop offset="70%" stopColor="#66BB6A" stopOpacity={1} />
              <stop offset="100%" stopColor="#7CB342" stopOpacity={1} />
            </linearGradient>
          </defs>
          
          {/* Main stem with highlight */}
          <path
            d="M-3,-118 Q-2,-80 -2,-40 Q-1.5,0 0,2"
            fill="none"
            stroke="#2E7D32"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M-3,-118 Q-2,-80 -2,-40 Q-1.5,0 0,2"
            fill="none"
            stroke="url(#sedgeGradMature)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M-1,-115 Q-0.5,-75 -0.5,-35 Q0,0 0.5,2"
            fill="none"
            stroke="#A5D6A7"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          
          {/* Left side blades - graceful curves */}
          <path
            d="M-2.5,-110 Q-12,-95 -18,-78 Q-20,-65 -18,-52"
            fill="none"
            stroke="#2E7D32"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M-2.5,-110 Q-12,-95 -18,-78 Q-20,-65 -18,-52"
            fill="none"
            stroke="#66BB6A"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          
          <path
            d="M-2,-85 Q-14,-72 -26,-58 Q-30,-48 -28,-35"
            fill="none"
            stroke="#388E3C"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          <path
            d="M-2,-85 Q-14,-72 -26,-58 Q-30,-48 -28,-35"
            fill="none"
            stroke="#7CB342"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          
          <path
            d="M-1.5,-60 Q-15,-48 -28,-38 Q-32,-28 -30,-15"
            fill="none"
            stroke="#43A047"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M-1.5,-60 Q-15,-48 -28,-38 Q-32,-28 -30,-15"
            fill="none"
            stroke="#A5D6A7"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          <path
            d="M-1,-40 Q-12,-28 -24,-18 Q-28,-8 -26,2"
            fill="none"
            stroke="#2E7D32"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M-1,-40 Q-12,-28 -24,-18 Q-28,-8 -26,2"
            fill="none"
            stroke="#81C784"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          
          {/* Right side blades - mirror with variation */}
          <path
            d="M2.5,-110 Q12,-95 18,-78 Q20,-65 18,-52"
            fill="none"
            stroke="#2E7D32"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M2.5,-110 Q12,-95 18,-78 Q20,-65 18,-52"
            fill="none"
            stroke="#66BB6A"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          
          <path
            d="M2,-85 Q14,-72 26,-58 Q30,-48 28,-35"
            fill="none"
            stroke="#388E3C"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          <path
            d="M2,-85 Q14,-72 26,-58 Q30,-48 28,-35"
            fill="none"
            stroke="#7CB342"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          
          <path
            d="M1.5,-60 Q15,-48 28,-38 Q32,-28 30,-15"
            fill="none"
            stroke="#43A047"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M1.5,-60 Q15,-48 28,-38 Q32,-28 30,-15"
            fill="none"
            stroke="#A5D6A7"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          <path
            d="M1,-40 Q12,-28 24,-18 Q28,-8 26,2"
            fill="none"
            stroke="#2E7D32"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M1,-40 Q12,-28 24,-18 Q28,-8 26,2"
            fill="none"
            stroke="#81C784"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          
          {/* Top tip - grass-like point */}
          <path
            d="M-1,-120 Q0,-122 1,-120"
            fill="none"
            stroke="#1B5E20"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="0" cy="-120" r="2.5" fill="#2E7D32" opacity="0.7" />
        </svg>
      )}

      {/* YOUNG */}
      {type === "young" && (
        <svg width="30" height="65" viewBox="-20 -65 40 68">
          {/* Gradient for young plant */}
          <defs>
            <linearGradient id="sedgeGradYoung" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#66BB6A" stopOpacity={1} />
              <stop offset="70%" stopColor="#81C784" stopOpacity={1} />
              <stop offset="100%" stopColor="#AED581" stopOpacity={1} />
            </linearGradient>
          </defs>
          
          {/* Main stem */}
          <path
            d="M-2,-58 Q-1.5,-35 -1,-15 Q-0.5,0 0,2"
            fill="none"
            stroke="#66BB6A"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M-2,-58 Q-1.5,-35 -1,-15 Q-0.5,0 0,2"
            fill="none"
            stroke="url(#sedgeGradYoung)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M-0.5,-56 Q0,-35 0.5,-15 Q1,0 1,2"
            fill="none"
            stroke="#A5D6A7"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />
          
          {/* Left blades */}
          <path
            d="M-1.5,-50 Q-8,-40 -14,-28 Q-16,-18 -14,-8"
            fill="none"
            stroke="#66BB6A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M-1.5,-50 Q-8,-40 -14,-28 Q-16,-18 -14,-8"
            fill="none"
            stroke="#81C784"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          
          <path
            d="M-1,-32 Q-9,-22 -16,-12 Q-18,-3 -16,5"
            fill="none"
            stroke="#81C784"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M-1,-32 Q-9,-22 -16,-12 Q-18,-3 -16,5"
            fill="none"
            stroke="#A5D6A7"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          
          {/* Right blades */}
          <path
            d="M1.5,-50 Q8,-40 14,-28 Q16,-18 14,-8"
            fill="none"
            stroke="#66BB6A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M1.5,-50 Q8,-40 14,-28 Q16,-18 14,-8"
            fill="none"
            stroke="#81C784"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          
          <path
            d="M1,-32 Q9,-22 16,-12 Q18,-3 16,5"
            fill="none"
            stroke="#81C784"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M1,-32 Q9,-22 16,-12 Q18,-3 16,5"
            fill="none"
            stroke="#A5D6A7"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          
          {/* Tip */}
          <path
            d="M-0.5,-62 Q0,-64 0.5,-62"
            fill="none"
            stroke="#4CAF50"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="0" cy="-62" r="1.5" fill="#66BB6A" opacity="0.8" />
        </svg>
      )}

      {/* WILTED */}
      {type === "wilted" && (
        <svg width="38" height="85" viewBox="-25 -78 50 82">
          {/* Gradient for wilted - brownish, faded */}
          <defs>
            <linearGradient id="sedgeGradWilted" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#8D6E63" stopOpacity={1} />
              <stop offset="50%" stopColor="#9E837A" stopOpacity={1} />
              <stop offset="100%" stopColor="#A89080" stopOpacity={0.95} />
            </linearGradient>
          </defs>
          
          {/* Drooping stem - curved down */}
          <path
            d="M-2,-70 Q-8,-55 -12,-40 Q-14,-20 -12,0"
            fill="none"
            stroke="#8D6E63"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M-2,-70 Q-8,-55 -12,-40 Q-14,-20 -12,0"
            fill="none"
            stroke="url(#sedgeGradWilted)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          
          {/* Left drooping blades */}
          <path
            d="M-1.5,-65 Q-10,-55 -18,-45 Q-22,-35 -20,-22"
            fill="none"
            stroke="#9E837A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M-1.5,-65 Q-10,-55 -18,-45 Q-22,-35 -20,-22"
            fill="none"
            stroke="#C1A898"
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.7"
          />
          
          <path
            d="M-1,-48 Q-10,-42 -18,-35 Q-22,-25 -20,-12"
            fill="none"
            stroke="#8D6E63"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M-1,-48 Q-10,-42 -18,-35 Q-22,-25 -20,-12"
            fill="none"
            stroke="#D7C8B8"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.6"
          />
          
          <path
            d="M-0.5,-32 Q-8,-28 -15,-22 Q-18,-14 -16,-4"
            fill="none"
            stroke="#9E837A"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          
          {/* Right drooping blades - with more droop */}
          <path
            d="M2,-65 Q8,-55 14,-45 Q18,-35 16,-22"
            fill="none"
            stroke="#9E837A"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M2,-65 Q8,-55 14,-45 Q18,-35 16,-22"
            fill="none"
            stroke="#C1A898"
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.7"
          />
          
          <path
            d="M1,-48 Q8,-42 16,-35 Q20,-25 18,-12"
            fill="none"
            stroke="#8D6E63"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M1,-48 Q8,-42 16,-35 Q20,-25 18,-12"
            fill="none"
            stroke="#D7C8B8"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.6"
          />
          
          <path
            d="M0.5,-32 Q6,-28 13,-22 Q16,-14 14,-4"
            fill="none"
            stroke="#9E837A"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          
          {/* Wilted tip - droops significantly */}
          <path
            d="M-1.5,-73 Q0,-75 2,-72"
            fill="none"
            stroke="#6D4C41"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="1" cy="-70" r="1.8" fill="#8D6E63" opacity="0.7" />
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
