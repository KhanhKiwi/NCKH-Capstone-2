interface DataVisualizationProps {
  mixingEvenness: number;
  saltRatio: number;
  currentStep: 'adding' | 'mixing' | 'transferring' | 'pressing' | 'sealing';
}

export function DataVisualization({
  mixingEvenness,
  saltRatio,
  currentStep
}: DataVisualizationProps) {
  const getStepName = () => {
    switch (currentStep) {
      case 'adding':
        return 'Đổ muối';
      case 'mixing':
        return 'Trộn đều';
      case 'transferring':
        return 'Chuyển thùng';
      case 'pressing':
        return 'Nén chặt';
      case 'sealing':
        return 'Đậy nắp';
    }
  };

  return (
    <div className="relative z-10 w-full px-4 sm:px-6 md:px-4 py-2 sm:py-3 md:py-2 bg-gradient-to-b from-[#4a3a2a]/90 to-[#3d2a1f]/95 backdrop-blur-md border-t-2 border-[#5a4830] shadow-2xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-2">
        {/* Mixing Evenness */}
        <div className="bg-gradient-to-br from-[#5a4a38]/70 to-[#4a3a2a]/70 rounded-md p-2 sm:p-3 md:p-2 border border-[#6a5a48] shadow-inner">
          <div className="text-xs sm:text-xs md:text-sm text-[#d9cbb5] mb-1 sm:mb-1.5 tracking-wide uppercase truncate">
            Độ đồng đều
          </div>
          <div className="text-lg sm:text-xl md:text-lg font-bold text-[#f5ebe0] tabular-nums">
            {Math.round(mixingEvenness)}%
          </div>
          <div className="mt-1.5 sm:mt-2 h-1 bg-[#3d2a1f] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#4a7c59] to-[#5a9c69] transition-all duration-300"
              style={{ width: `${mixingEvenness}%` }}
            />
          </div>
        </div>

        {/* Salt Ratio */}
        <div className="bg-gradient-to-br from-[#5a4a38]/70 to-[#4a3a2a]/70 rounded-md p-2 sm:p-3 md:p-2 border border-[#6a5a48] shadow-inner">
          <div className="text-xs sm:text-xs md:text-sm text-[#d9cbb5] mb-1 sm:mb-1.5 tracking-wide uppercase truncate">
            Tỷ lệ muối
          </div>
          <div className="text-lg sm:text-xl md:text-lg font-bold text-[#f5ebe0] tabular-nums">
            {saltRatio.toFixed(1)}:1
          </div>
          <div className="mt-1.5 sm:mt-2 text-xs text-[#9d8877] truncate">
            {saltRatio < 2.5 ? 'Quá thấp' : saltRatio > 4.0 ? 'Quá cao' : 'Lý tưởng'}
          </div>
        </div>

        {/* Current Step */}
        <div className="bg-gradient-to-br from-[#5a4a38]/70 to-[#4a3a2a]/70 rounded-md p-2 sm:p-3 md:p-2 border border-[#6a5a48] shadow-inner col-span-2 sm:col-span-1">
          <div className="text-xs sm:text-xs md:text-sm text-[#d9cbb5] mb-1 sm:mb-1.5 tracking-wide uppercase truncate">
            Giai đoạn
          </div>
          <div className="text-sm sm:text-base md:text-sm font-bold text-[#f5ebe0] capitalize tracking-wide truncate">
            {getStepName()}
          </div>
        </div>
      </div>
    </div>
  );
}
