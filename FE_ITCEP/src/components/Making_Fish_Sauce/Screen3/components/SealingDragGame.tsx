import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SealingDragGameProps {
  isActive: boolean;
  onSealingResult: (success: boolean) => void;
}

export function SealingDragGame({ isActive, onSealingResult }: SealingDragGameProps) {
  const [dragProgress, setDragProgress] = useState(0); // 0-100%
  const [isDragging, setIsDragging] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const dragStartXRef = useRef(0);
  const totalDragRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const REQUIRED_DRAG = 800; // Total pixels needed to sweep
  const TARGET_MIN = 70; // 70% progress needed for success
  const TARGET_MAX = 100; // Up to 100% is perfect

  // Handle mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isActive || !isDragging) return;

    const currentX = e.clientX;
    const deltaX = currentX - dragStartXRef.current;

    // Detect drag direction
    if (deltaX > 10) {
      setDragDirection('right');
    } else if (deltaX < -10) {
      setDragDirection('left');
    }

    // Track total horizontal movement
    totalDragRef.current += Math.abs(deltaX);

    // Calculate progress (0-100%)
    const newProgress = Math.min(100, (totalDragRef.current / REQUIRED_DRAG) * 100);
    setDragProgress(newProgress);

    dragStartXRef.current = currentX;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Check if dragging is complete
    if (dragProgress >= TARGET_MIN) {
      const isSuccess = dragProgress >= TARGET_MIN && dragProgress <= TARGET_MAX;
      
      if (isSuccess) {
        setResultMessage(`✓ Phủ muối hoàn hảo! ${Math.round(dragProgress)}% +8%`);
        setDragProgress(100);
      } else {
        setResultMessage(`✗ Phủ muối không đều! ${Math.round(dragProgress)}% -5%`);
      }

      setTimeout(() => {
        onSealingResult(isSuccess);
      }, 1500);
    } else {
      setResultMessage(`⚠️ Chưa phủ đủ! ${Math.round(dragProgress)}% (cần ${TARGET_MIN}%)`);
      setDragProgress(0);
      totalDragRef.current = 0;
    }
  };

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isActive) return;
    setIsDragging(true);
    dragStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isActive || !isDragging) return;

    const currentX = e.touches[0].clientX;
    const deltaX = currentX - dragStartXRef.current;

    if (deltaX > 10) {
      setDragDirection('right');
    } else if (deltaX < -10) {
      setDragDirection('left');
    }

    totalDragRef.current += Math.abs(deltaX);
    const newProgress = Math.min(100, (totalDragRef.current / REQUIRED_DRAG) * 100);
    setDragProgress(newProgress);

    dragStartXRef.current = currentX;
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragProgress >= TARGET_MIN) {
      const isSuccess = dragProgress >= TARGET_MIN && dragProgress <= TARGET_MAX;
      
      if (isSuccess) {
        setResultMessage(`✓ Phủ muối hoàn hảo! ${Math.round(dragProgress)}% +8%`);
        setDragProgress(100);
      } else {
        setResultMessage(`✗ Phủ muối không đều! ${Math.round(dragProgress)}% -5%`);
      }

      setTimeout(() => {
        onSealingResult(isSuccess);
      }, 1500);
    } else {
      setResultMessage(`⚠️ Chưa phủ đủ! ${Math.round(dragProgress)}% (cần ${TARGET_MIN}%)`);
      setDragProgress(0);
      totalDragRef.current = 0;
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-4 py-4 sm:py-6 bg-gradient-to-b from-[#6a5a40]/40 to-[#7a6a50]/40 rounded-lg border-2 border-[#8a7a60]/50">
      {/* Instructions */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-base sm:text-lg font-bold text-[#1a1a1a] mb-4"
      >
        👈👉 Kéo qua lại để phủ muối lên nắp (cần {TARGET_MIN}% trở lên)
      </motion.p>

      {/* Drag Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative h-20 sm:h-24 rounded-lg border-4 cursor-grab active:cursor-grabbing overflow-hidden transition-all ${
          isDragging
            ? 'border-[#d4af37] bg-[#8a7a60]/60 shadow-lg'
            : 'border-[#6a5a40] bg-[#6a5a40]/30'
        }`}
      >
        {/* Progress Bar Background */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-[#3d3d1f] to-[#5a4a30]">
          {/* Salt Sweep Animation */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#d4af37]/0 via-[#d4af37]/80 to-[#d4af37]/0 blur-sm"
            style={{
              width: '30%',
              x: `${(dragProgress / 100) * 70 - 15}%`,
            }}
            animate={{
              opacity: isDragging ? 1 : 0.5,
            }}
          />

          {/* Salt Powder Visual */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `linear-gradient(90deg, transparent, rgba(212, 175, 55, ${dragProgress / 100}), transparent)`,
              backgroundSize: '100% 100%',
              backgroundPosition: `${dragProgress}% center`,
            }}
          />

          {/* Progress Text */}
          <div className="relative z-10 text-center">
            <motion.div
              className="text-2xl sm:text-3xl font-bold text-[#d4af37]"
              animate={{ scale: isDragging ? 1.1 : 1 }}
            >
              {Math.round(dragProgress)}%
            </motion.div>
            <div className="text-xs sm:text-sm text-[#d4af37]/80">
              {dragProgress < 30 && 'Bắt đầu kéo...'}
              {dragProgress >= 30 && dragProgress < TARGET_MIN && `Còn ${Math.round(TARGET_MIN - dragProgress)}%`}
              {dragProgress >= TARGET_MIN && 'Đủ rồi!'}
            </div>
          </div>
        </div>

        {/* Progress Bar Outline */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1a1a1a]/30">
          <motion.div
            className="h-full bg-gradient-to-r from-[#d4af37] to-[#f5c757]"
            style={{ width: `${dragProgress}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
      </div>

      {/* Result Message */}
      {resultMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-4 p-3 rounded-lg bg-[#1a1a1a]/60 border-2 border-[#d4af37]/50 text-center text-sm sm:text-base font-semibold text-[#f5c757]"
        >
          {resultMessage}
        </motion.div>
      )}

      {/* Hint */}
      {!isDragging && dragProgress === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="mt-3 text-center text-xs sm:text-sm text-[#1a1a1a]/70"
        >
          💡 Kéo chuột từ trái sang phải hoặc ngược lại để phủ muối
        </motion.p>
      )}
    </div>
  );
}
