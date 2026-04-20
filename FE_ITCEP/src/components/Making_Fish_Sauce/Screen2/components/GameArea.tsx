import { useState } from 'react';
import { motion } from 'motion/react';
import { Fish } from './Fish';
import type { FishData } from '../Screen2';
import { Droplets, Waves, Droplet } from 'lucide-react';

interface GameAreaProps {
  fish: FishData[];
  onCleanFish: (fishId: number, zoneId: string, isCorrect: boolean) => void;
  isGameActive: boolean;
}

interface WashZone {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  position: { top: string; left: string };
  size: { width: string; height: string };
}

const WASH_ZONES: WashZone[] = [
  {
    id: 'seawater',
    name: 'Nước Biển',
    icon: <Waves className="w-6 h-6" />,
    description: 'Rửa loại bỏ cơm',
    color: 'from-blue-400 to-cyan-400',
    position: { top: '10%', left: '5%' },
    size: { width: '22%', height: '60%' },
  },
  {
    id: 'washboard',
    name: 'Bàn Rửa',
    icon: <Droplets className="w-6 h-6" />,
    description: 'Rửa loại bỏ bẩn',
    color: 'from-orange-300 to-amber-300',
    position: { top: '10%', left: '39%' },
    size: { width: '22%', height: '60%' },
  },
  {
    id: 'freshwater',
    name: 'Nước Ngọt',
    icon: <Droplet className="w-6 h-6" />,
    description: 'Rửa loại bỏ muối (Bonus)',
    color: 'from-green-300 to-emerald-400',
    position: { top: '10%', left: '73%' },
    size: { width: '22%', height: '60%' },
  },
];

export function GameArea({ fish, onCleanFish }: GameAreaProps) {
  const [draggedFishId, setDraggedFishId] = useState<number | null>(null);

  const handleFishDragStart = (fishId: number) => {
    setDraggedFishId(fishId);
  };

  const handleZoneDrop = (zoneId: string) => {
    if (draggedFishId === null) return;
    
    // Random correctness - need to match optimal sequence
    const isCorrect = Math.random() < 0.6;
    
    onCleanFish(draggedFishId, zoneId, isCorrect);
    setDraggedFishId(null);
  };

  return (
    <div className="relative w-full max-w-6xl h-[650px]">
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
      >
        {/* Main container */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-50 rounded-3xl shadow-2xl border-8 border-sky-300/30 overflow-hidden">
          {/* Sky background */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-200/50 to-transparent pointer-events-none" />

          {/* Wash zones */}
          <div className="absolute inset-0 p-4">
            {WASH_ZONES.map((zone) => (
              <motion.div
                key={zone.id}
                className={`absolute rounded-2xl shadow-lg border-4 border-white/50 backdrop-blur-sm flex flex-col items-center justify-center cursor-drop bg-gradient-to-br ${zone.color} opacity-70 transition-all pointer-events-auto`}
                style={{
                  top: zone.position.top,
                  left: zone.position.left,
                  width: zone.size.width,
                  height: zone.size.height,
                }}
                animate={{
                  backgroundImage: draggedFishId !== null ? `linear-gradient(135deg, var(--tw-gradient-stops))` : 'none',
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.opacity = '0.9';
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.opacity = '0.7';
                  handleZoneDrop(zone.id);
                }}
              >
                {/* Zone icon */}
                <div className="text-white/80 mb-2">{zone.icon}</div>

                {/* Zone name */}
                <div className="text-center">
                  <h4 className="font-bold text-white text-sm">{zone.name}</h4>
                  <p className="text-white/70 text-xs mt-1">{zone.description}</p>
                </div>

                {/* Hover effect */}
                {draggedFishId !== null && (
                  <motion.div
                    className="absolute inset-0 border-4 border-dashed border-white/80 rounded-xl"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.div>
            ))}

            {/* Center area for fish */}
            <div className="absolute inset-0 pointer-events-auto">
              {fish.map((f) => (
                <Fish
                  key={f.id}
                  data={f}
                  isDragging={draggedFishId === f.id}
                  onDragStart={() => handleFishDragStart(f.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Instruction hint */}
        <motion.div
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg text-center max-w-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <span className="text-blue-900 font-medium">
            🐟 Kéo cá vào vùng rửa để làm sạch
          </span>
          <span className="text-blue-600 text-sm block mt-1">
            Drag fish to wash zones - Match correct sequence for combo!
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
