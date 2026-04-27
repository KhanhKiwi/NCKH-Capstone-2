import { useState } from 'react';

interface Fish {
  id: number;
  x: number;
  y: number;
  dirty: boolean;
  bad?: boolean;
  rotation: number;
}

interface FishBasketProps {
  onFishClick?: (fishId: number, isBad: boolean) => void;
  onDebrisClick?: (debrisId: number) => void;
  removedFish?: number[];
  removedDebris?: number[];
  showRemainingDebris?: boolean;
}

export function FishBasket({ onFishClick, onDebrisClick, removedFish = [], removedDebris = [], showRemainingDebris = false }: FishBasketProps) {
  const [fish] = useState<Fish[]>(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      dirty: Math.random() > 0.3,
      bad: Math.random() > 0.85,
      rotation: Math.random() * 360
    }))
  );

  const [debris] = useState(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 50 + 25,
      y: Math.random() * 50 + 25,
      type: Math.random() > 0.5 ? 'leaf' : 'mud'
    }))
  );

  // Add CSS animations
  const animationStyle = `
    @keyframes fishBob {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    
    @keyframes fishRemove {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0.5); }
    }
    
    @keyframes debrisRemove {
      0% { opacity: 1; transform: scale(1) rotate(0deg); }
      100% { opacity: 0; transform: scale(0.3) rotate(360deg); }
    }

    @keyframes debrisGlow {
      0%, 100% { filter: drop-shadow(0 0 8px rgba(255, 152, 0, 0.8)) drop-shadow(0 0 16px rgba(255, 193, 7, 0.6)); transform: scale(1); }
      50% { filter: drop-shadow(0 0 12px rgba(255, 152, 0, 1)) drop-shadow(0 0 24px rgba(255, 193, 7, 0.8)); transform: scale(1.1); }
    }
    
    .fish-item {
      animation: fishBob 3s ease-in-out infinite;
    }
    
    .fish-item.removing {
      animation: fishRemove 0.6s ease-out forwards !important;
    }
    
    .debris-item.removing {
      animation: debrisRemove 0.6s ease-out forwards !important;
    }

    .debris-item.highlight {
      animation: debrisGlow 0.8s ease-in-out infinite !important;
    }
  `;

  return (
    <div className="relative w-full" style={{ position: 'relative' }}>
      <style>{animationStyle}</style>
      <div
        className="relative w-full rounded-full"
        style={{
          aspectRatio: '1',
          background: 'radial-gradient(circle at 30% 30%, #d4b896 0%, #a89168 50%, #8b7355 100%)',
          boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.2), inset 0 4px 8px rgba(255,255,255,0.1), 0 8px 16px rgba(0,0,0,0.2)',
          border: 'clamp(2px, 0.5vw, 4px) solid #6b5844',
          clipPath: 'circle(50%)'
        }}
      >
        {/* Basket weave texture overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(0,0,0,0.3) 6px, rgba(0,0,0,0.3) 7px),
              repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0,0,0,0.3) 6px, rgba(0,0,0,0.3) 7px)
            `
          }}
        />

        {/* Water/moisture layer */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 40% 60%, rgba(100,140,170,0.15) 0%, transparent 60%)'
          }}
        />

        {/* Debris items */}
        {debris
          .filter((item) => !removedDebris.includes(item.id))
          .map((item) => {
            const isRemaining = showRemainingDebris && !removedDebris.includes(item.id);
            return (
              <button
                key={`debris-${item.id}`}
                onClick={() => onDebrisClick?.(item.id)}
                disabled={removedDebris.includes(item.id)}
                className={`debris-item absolute transition-transform active:scale-110 hover:scale-125 ${
                  removedDebris.includes(item.id) ? 'removing' : ''
                } ${isRemaining ? 'highlight' : ''}`}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  width: 'clamp(16px, 4vw, 24px)',
                  height: 'clamp(16px, 4vw, 24px)',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: removedDebris.includes(item.id) ? 'none' : 'auto'
                }}
              >
                {item.type === 'leaf' ? (
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #5a7a4d 0%, #3d5233 100%)',
                      boxShadow: isRemaining
                        ? '0 0 12px rgba(255, 152, 0, 0.8), inset 0 1px 2px rgba(0,0,0,0.3)'
                        : '0 1px 2px rgba(0,0,0,0.3)'
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-full rounded-sm"
                    style={{
                      background: 'linear-gradient(135deg, #6b5d4f 0%, #4a3f35 100%)',
                      boxShadow: isRemaining
                        ? '0 0 12px rgba(255, 152, 0, 0.8), inset 0 1px 2px rgba(0,0,0,0.4)'
                        : '0 1px 2px rgba(0,0,0,0.4)',
                      transform: 'rotate(25deg)'
                    }}
                  />
                )}
              </button>
            );
          })}

        {/* Fish items */}
        {fish
          .filter((f) => !removedFish.includes(f.id))
          .map((f) => (
            <button
              key={f.id}
              onClick={() => onFishClick?.(f.id, f.bad || false)}
              disabled={removedFish.includes(f.id)}
              className={`fish-item absolute transition-all active:scale-110 hover:scale-125 cursor-pointer ${
                removedFish.includes(f.id) ? 'removing' : ''
              }`}
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                width: 'clamp(28px, 6vw, 44px)',
                height: 'clamp(10px, 2.2vw, 16px)',
                transform: `translate(-50%, -50%) rotate(${f.rotation}deg)`,
                animationDelay: `${f.id * 0.1}s`,
                animationDuration: `${2.5 + (f.id % 3) * 0.3}s`,
                pointerEvents: removedFish.includes(f.id) ? 'none' : 'auto'
              }}
            >
            <div
              className="w-full h-full rounded-full relative"
              style={{
                background: f.bad
                  ? 'linear-gradient(90deg, #9a8a7a 0%, #786a5a 50%, #9a8a7a 100%)'
                  : f.dirty
                  ? 'linear-gradient(90deg, #a0b8c8 0%, #7a8a98 50%, #a0b8c8 100%)'
                  : 'linear-gradient(90deg, #c8d8e8 0%, #a0b8c8 50%, #c8d8e8 100%)',
                boxShadow: f.dirty
                  ? '0 1px 2px rgba(0,0,0,0.3), inset 0 -1px 1px rgba(0,0,0,0.2)'
                  : '0 1px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.4)',
                opacity: f.bad ? 0.7 : 1
              }}
            >
              {/* Fish eye */}
              <div
                className="absolute rounded-full"
                style={{
                  width: 'clamp(2px, 0.6vw, 4px)',
                  height: 'clamp(2px, 0.6vw, 4px)',
                  background: f.bad ? '#4a4a4a' : '#2a2a2a',
                  left: '75%',
                  top: '30%',
                  opacity: f.bad ? 0.4 : 0.8
                }}
              />

              {/* Dirt overlay for dirty fish */}
              {f.dirty && !f.bad && (
                <>
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: 'clamp(3px, 0.8vw, 5px)',
                      height: 'clamp(3px, 0.8vw, 5px)',
                      background: 'rgba(80, 70, 60, 0.6)',
                      left: '20%',
                      top: '10%'
                    }}
                  />
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: 'clamp(2px, 0.6vw, 4px)',
                      height: 'clamp(2px, 0.6vw, 4px)',
                      background: 'rgba(80, 70, 60, 0.5)',
                      left: '50%',
                      top: '60%'
                    }}
                  />
                </>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Basket rim highlight */}
      <div
        className="absolute -bottom-1 md:-bottom-2 left-1/2 -translate-x-1/2 w-[95%] rounded-full"
        style={{
          height: 'clamp(12px, 2vw, 20px)',
          background: 'radial-gradient(ellipse at center, rgba(139, 115, 85, 0.4) 0%, transparent 70%)',
          filter: 'blur(4px)'
        }}
      />
    </div>
  );
}
