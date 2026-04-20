import { motion } from 'motion/react';
import type { FishData } from '../Screen2';
import { Sparkles } from 'lucide-react';

interface FishProps {
  data: FishData;
  isDragging?: boolean;
  onDragStart?: () => void;
}

export function Fish({ data, isDragging = false, onDragStart }: FishProps) {
  const isClean = data.dirtLevel < 5;
  const rotation = Math.sin(data.id * 0.5) * 15;

  const cleanPercentage = 100 - (data.dirtLevel / data.maxDirtLevel * 100);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(data.id));
    onDragStart?.();
  };

  return (
    <div
      className="absolute cursor-grab active:cursor-grabbing select-none pointer-events-auto"
      style={{
        left: data.x,
        top: data.y,
      }}
      draggable
      onDragStart={handleDragStart}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: isDragging ? 1.2 : data.isBeingCleaned ? 1.15 : 1,
          rotate: isDragging ? 0 : rotation,
          y: isDragging ? -20 : [0, -3, 0],
        }}
        style={{
          zIndex: isDragging ? 50 : 10,
        }}
        transition={{
          scale: { type: 'spring', stiffness: 300, damping: 15 },
          y: {
            duration: 2 + Math.random(),
            repeat: isDragging ? 0 : Infinity,
            ease: 'easeInOut',
          },
        }}
        whileHover={!isDragging ? { scale: 1.1 } : {}}
      >
      {/* Fish body */}
      <div className="relative">
        <svg
          width="80"
          height="40"
          viewBox="0 0 80 40"
          className={`transition-all duration-300 ${
            isClean ? 'drop-shadow-lg' : 'drop-shadow-md'
          }`}
        >
          {/* Fish shape */}
          <ellipse
            cx="40"
            cy="20"
            rx="35"
            ry="15"
            fill={isClean ? '#A8DADC' : '#6B7280'}
            opacity={isClean ? '1' : '0.7'}
          />

          {/* Tail */}
          <path
            d="M 5 20 L 0 10 L 0 30 Z"
            fill={isClean ? '#A8DADC' : '#6B7280'}
            opacity={isClean ? '0.9' : '0.6'}
          />

          {/* Eye */}
          <circle cx="60" cy="18" r="3" fill="#1E3A8A" />
          <circle cx="61" cy="17" r="1" fill="white" />

          {/* Shine/gloss effect when clean */}
          {isClean && (
            <motion.ellipse
              cx="50"
              cy="15"
              rx="15"
              ry="5"
              fill="white"
              opacity="0.6"
              animate={{
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          )}
        </svg>

        {/* Dirt particles */}
        {!isClean && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: Math.ceil(data.dirtLevel / 20) }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-amber-900/60 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 20}%`,
                }}
                animate={{
                  opacity: [0.6, 0.3, 0.6],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}

        {/* Clean sparkle effect */}
        {isClean && (
          <motion.div
            className="absolute -top-2 -right-2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-300" />
          </motion.div>
        )}

        {/* Cleaning feedback animation */}
        {data.isBeingCleaned && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-blue-200/70 rounded-full border border-blue-300/50"
                style={{
                  left: `${20 + i * 15}%`,
                  bottom: '0%',
                }}
                initial={{ y: 0, opacity: 1, scale: 0 }}
                animate={{
                  y: -40,
                  opacity: 0,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        )}

        {/* Difficulty indicator */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            data.difficulty === 'easy' ? 'bg-green-400 text-white' :
            data.difficulty === 'normal' ? 'bg-yellow-400 text-white' :
            'bg-red-400 text-white'
          }`}>
            {data.difficulty === 'easy' ? '★' : data.difficulty === 'normal' ? '★★' : '★★★'}
          </span>
        </div>

        {/* Cleanliness progress indicator */}
        {!isClean && (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-2 bg-gray-300 rounded-full overflow-hidden z-20">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-600 to-green-500"
              style={{ width: `${cleanPercentage}%` }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        )}
      </div>
    </motion.div>
    </div>
  );
}
