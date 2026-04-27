import { motion } from 'framer-motion';

interface ActionButtonsProps {
  currentStep: 'adding' | 'mixing' | 'transferring' | 'pressing' | 'sealing';
  mixingEvenness: number;
  gameStatus: 'playing' | 'completed' | 'failed';
  onAddSalt: () => void;
  onMix: () => void;
  onTransfer: () => void;
  onPress: () => void;
  onSeal: () => void;
}

export function ActionButtons({
  currentStep,
  mixingEvenness,
  gameStatus,
  onAddSalt,
  onMix,
  onTransfer,
  onPress,
  onSeal
}: ActionButtonsProps) {
  const isGameActive = gameStatus === 'playing';

  // Animation variants for button press
  const buttonVariants = {
    tap: { scale: 0.92 },
    hover: { scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.3)' },
  };

  // Ripple effect
  const RippleButton = ({ 
    onClick, 
    disabled, 
    className, 
    children 
  }: { 
    onClick: () => void; 
    disabled: boolean; 
    className: string; 
    children: React.ReactNode;
  }) => {
    return (
      <motion.button
        onClick={onClick}
        disabled={disabled}
        className={className}
        variants={buttonVariants}
        whileTap={!disabled ? 'tap' : {}}
        whileHover={!disabled ? 'hover' : {}}
        transition={{ duration: 0.2 }}
      >
        {children}
        {!disabled && (
          <motion.div
            className="absolute inset-0 bg-white rounded-md"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 0.6 }}
            style={{ pointerEvents: 'none' }}
          />
        )}
      </motion.button>
    );
  };
  return (
    <div className="w-full px-4 sm:px-6 md:px-4 py-2 sm:py-3 md:py-2 bg-gradient-to-b from-[#4a3a2a]/90 to-[#3d2a1f]/95 backdrop-blur-md border-t-2 border-[#5a4830] shadow-2xl z-30 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 md:gap-2">
      {/* Đổ muối */}
      <RippleButton
        onClick={onAddSalt}
        disabled={!isGameActive || currentStep !== 'adding'}
        className="relative bg-gradient-to-b from-[#c9d4dc] to-[#a8b8c4] disabled:from-[#8a9aa8]/60 disabled:to-[#7a8a98]/60 disabled:cursor-not-allowed text-[#1a0f08] font-semibold px-2 sm:px-3 py-1.5 sm:py-2 md:py-1.5 rounded-md border-2 border-[#5d7a8c] shadow-lg text-xs sm:text-sm md:text-xs tracking-wide disabled:opacity-60 overflow-hidden"
      >
        Đổ muối
      </RippleButton>

      {/* Trộn đều */}
      <RippleButton
        onClick={onMix}
        disabled={!isGameActive || currentStep !== 'mixing'}
        className="relative bg-gradient-to-b from-[#d4b896] to-[#b89868] disabled:from-[#9d7d4a]/60 disabled:to-[#8b6939]/60 disabled:cursor-not-allowed text-[#1a0f08] font-semibold px-2 sm:px-3 py-1.5 sm:py-2 md:py-1.5 rounded-md border-2 border-[#8b6939] shadow-lg text-xs sm:text-sm md:text-xs tracking-wide disabled:opacity-60 overflow-hidden"
      >
        <span className="hidden sm:inline">Trộn </span>
        <span className="text-[10px] sm:text-xs">({Math.round(mixingEvenness)}%)</span>
      </RippleButton>

      {/* Chuyển vào thùng */}
      <RippleButton
        onClick={onTransfer}
        disabled={!isGameActive || currentStep !== 'transferring'}
        className="relative bg-gradient-to-b from-[#8b6939] to-[#6d533d] disabled:from-[#4a3220]/60 disabled:to-[#3d2817]/60 disabled:cursor-not-allowed text-[#e8dcc8] font-semibold px-2 sm:px-3 py-1.5 sm:py-2 md:py-1.5 rounded-md border-2 border-[#4a3220] shadow-lg text-xs sm:text-sm md:text-xs tracking-wide disabled:opacity-60 overflow-hidden"
      >
        <span className="hidden sm:inline">Chuyển</span>
        <span className="sm:hidden">Chuyển</span>
      </RippleButton>

      {/* Nén chặt */}
      <RippleButton
        onClick={onPress}
        disabled={!isGameActive || currentStep !== 'pressing'}
        className="relative bg-gradient-to-b from-[#c9936d] to-[#a6653d] disabled:from-[#7a5d32]/60 disabled:to-[#6d533d]/60 disabled:cursor-not-allowed text-[#1a0f08] font-semibold px-2 sm:px-3 py-1.5 sm:py-2 md:py-1.5 rounded-md border-2 border-[#8b6939] shadow-lg text-xs sm:text-sm md:text-xs tracking-wide disabled:opacity-60 overflow-hidden"
      >
        Nén chặt
      </RippleButton>

      {/* Phủ muối & Đậy nắp */}
      <RippleButton
        onClick={onSeal}
        disabled={!isGameActive || currentStep !== 'sealing'}
        className="relative bg-gradient-to-b from-[#e8e8e8] to-[#c0c0c0] disabled:from-[#a0a0a0]/60 disabled:to-[#888888]/60 disabled:cursor-not-allowed text-[#1a0f08] font-semibold px-2 sm:px-3 py-1.5 sm:py-2 md:py-1.5 rounded-md border-2 border-[#8a9aa8] shadow-lg col-span-1 sm:col-span-1 text-xs sm:text-sm md:text-xs tracking-wide disabled:opacity-60 overflow-hidden"
      >
        <span className="hidden md:inline">Phủ & Đậy</span>
        <span className="md:hidden">Đậy</span>
      </RippleButton>
    </div>
  );
}
