import { Droplet, Target } from 'lucide-react';

interface SaltRatioSliderProps {
  saltRatio: number;
  onSaltRatioChange: (ratio: number) => void;
  disabled?: boolean;
  gameStatus?: 'playing' | 'completed' | 'failed';
  targetSaltRatio?: number;
}

export function SaltRatioSlider({
  saltRatio,
  onSaltRatioChange,
  disabled = false,

  targetSaltRatio
}: SaltRatioSliderProps) {
  return (
    <div className="relative w-full px-4 sm:px-6 md:px-4 py-2 sm:py-3 md:py-2 bg-gradient-to-b from-[#e8dcc8]/80 to-[#d9cbb5]/80 backdrop-blur-md border-t-2 border-[#6a5a40] shadow-2xl">
      <label className="block text-xs sm:text-sm md:text-sm text-[#4a3a2a] mb-1.5 sm:mb-2 md:mb-1 tracking-wide font-medium flex items-center gap-2">
        <Droplet className="w-4 h-4 flex-shrink-0 text-[#7a8a98]" />
        <span className="truncate">Tỷ lệ muối : cá</span>
      </label>
      <div className="relative">
        <input
          type="range"
          min="2"
          max="5"
          step="0.1"
          value={saltRatio}
          onChange={(e) => onSaltRatioChange(parseFloat(e.target.value))}
          disabled={disabled}
          className="w-full h-3 bg-gradient-to-r from-[#a0896f] via-[#bba97a] to-[#a0896f] rounded-full appearance-none cursor-pointer border-2 border-[#6a5a40] shadow-inner disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-[#8a7a5f] [&::-webkit-slider-thumb]:to-[#6a5a40] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#4a3a2a] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-[#6a5a40] mt-2 sm:mt-2.5 gap-2 sm:gap-0">
        <span className="bg-[#c07a4a]/25 px-2 py-0.5 rounded border border-[#c07a4a]/50 whitespace-nowrap">
          2.0 Thấp
        </span>
        <div className="flex flex-col items-center gap-1">
          <span className="font-bold text-base sm:text-lg text-[#4a3a2a] bg-[#f5ebe0] px-3 py-1 rounded-md border-2 border-[#6a5a40] shadow-md tabular-nums">
            {saltRatio.toFixed(1)} : 1
          </span>
          {targetSaltRatio !== undefined && (
            <span className="flex items-center gap-1 text-xs font-semibold text-[#8b5a2b] bg-[#ffd700]/30 px-2 py-0.5 rounded border border-[#8b5a2b]/40">
              <Target className="w-3 h-3" />
              Mục tiêu: {targetSaltRatio.toFixed(1)} : 1
            </span>
          )}
        </div>
        <span className="bg-[#c07a4a]/25 px-2 py-0.5 rounded border border-[#c07a4a]/50 whitespace-nowrap">
          5.0 Cao
        </span>
      </div>
    </div>
  );
}
