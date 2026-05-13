
interface TimelineStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export function ProcessTimeline() {
  const steps: TimelineStep[] = [
    {
      id: '1',
      title: 'Chuẩn bị nguyên liệu',
      description: 'Cá cơm tươi & muối biển',
      completed: true
    },
    {
      id: '2',
      title: 'Ướp muối',
      description: 'Tỷ lệ cá:muối = 3:1',
      completed: true
    },
    {
      id: '3',
      title: 'Trộn đều',
      description: 'Phân bố muối đồng đều',
      completed: true
    },
    {
      id: '4',
      title: 'Đóng lu & Ủ chượp',
      description: 'Niêm phong và lên men',
      completed: false
    },
    {
      id: '5',
      title: 'Chờ đợi',
      description: '12 tháng lên men tự nhiên',
      completed: false
    },
    {
      id: '6',
      title: 'Thu hoạch',
      description: 'Lọc lấy nước mắm trong',
      completed: false
    }
  ];

  return (
    <div className="w-full">
      {/* Desktop/Tablet: Horizontal Timeline */}
      <div className="hidden sm:block">
        <div className="flex items-start justify-between gap-2 relative">
          {/* Connection lines background */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#8b7355]/20 -z-10" />
          
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 flex-shrink-0 relative z-10
                  ${step.completed
                    ? 'bg-[#5f7c8a] border-[#5f7c8a] text-white shadow-lg'
                    : index === 3
                    ? 'bg-[#a0522d] border-[#a0522d] text-white animate-pulse shadow-lg'
                    : 'bg-white border-[#8b7355]/40 text-[#8b7355] shadow-md'
                  }
                `}
              >
                {step.completed ? (
                  <span className="text-lg">✓</span>
                ) : (
                  <span className="text-lg">●</span>
                )}
              </div>

              {/* Step Info */}
              <div className="text-center mt-4">
                <p className="text-sm font-semibold text-[#3d2b1f] mb-1 leading-tight">
                  {step.title}
                </p>
                <p className="text-xs text-[#6b5638] opacity-75 leading-tight">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical Timeline */}
      <div className="sm:hidden">
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex gap-4">
              {/* Left: Circle & Line */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 flex-shrink-0
                    ${step.completed
                      ? 'bg-[#5f7c8a] border-[#5f7c8a] text-white'
                      : index === 3
                      ? 'bg-[#a0522d] border-[#a0522d] text-white animate-pulse'
                      : 'bg-white border-[#8b7355]/40 text-[#8b7355]'
                    }
                  `}
                >
                  {step.completed ? (
                    <span className="text-base">✓</span>
                  ) : (
                    <span className="text-base">●</span>
                  )}
                </div>
                
                {/* Vertical line to next step */}
                {index < steps.length - 1 && (
                  <div className="w-0.5 h-12 bg-[#8b7355]/20 mt-2" />
                )}
              </div>

              {/* Right: Text */}
              <div className="pt-1 pb-4">
                <p className="text-sm font-semibold text-[#3d2b1f]">
                  {step.title}
                </p>
                <p className="text-xs text-[#6b5638] opacity-75 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
