import { Lock, PackageCheck, Layers, Circle, Play } from 'lucide-react';
import { useState } from 'react';

interface ControlPanelProps {
  onAction: (action: string) => void;
}

export function ControlPanel({ onAction }: ControlPanelProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const actions = [
    { id: 'seal', label: 'Đóng lu', icon: Lock, description: 'Đậy nắp lu chượp cẩn thận' },
    { id: 'compress', label: 'Nén chặt', icon: PackageCheck, description: 'Ép chặt hỗn hợp cá muối' },
    { id: 'protect', label: 'Phủ lớp muối bảo vệ', icon: Layers, description: 'Tạo lớp muối phủ ngăn oxy' },
    { id: 'hermetic', label: 'Niêm phong', icon: Circle, description: 'Niêm phong kín khí lu' },
    { id: 'ferment', label: 'Bắt đầu quá trình ủ', icon: Play, description: 'Khởi động lên men truyền thống', primary: true }
  ];

  const handleAction = (actionId: string) => {
    setCompletedSteps(prev => new Set([...prev, actionId]));
    onAction(actionId);
  };

  return (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <h3 className="text-sm opacity-70 tracking-wide uppercase">Bảng điều khiển công đoạn</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const isCompleted = completedSteps.has(action.id);

          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              disabled={isCompleted}
              className={`
                group relative overflow-hidden rounded-lg p-4 text-left transition-all duration-300
                ${action.primary
                  ? 'bg-gradient-to-br from-[#3d2b1f] to-[#5c3d2e] text-[#f5f0e8] shadow-lg hover:shadow-xl'
                  : 'bg-card/70 backdrop-blur-sm border border-border hover:border-[#8b7355] hover:shadow-md'
                }
                ${isCompleted ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 active:scale-100'}
              `}
            >
              <div className="relative z-10">
                <div className={`flex items-center gap-2 mb-2 ${action.primary ? '' : 'text-[#3d2b1f]'}`}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{action.label}</span>
                </div>
                <p className={`text-xs ${action.primary ? 'opacity-80' : 'opacity-60'} line-clamp-2`}>
                  {action.description}
                </p>
              </div>

              {isCompleted && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 rounded-full bg-[#5f7c8a] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}

              {!action.primary && !isCompleted && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#a0522d]/0 to-[#a0522d]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
