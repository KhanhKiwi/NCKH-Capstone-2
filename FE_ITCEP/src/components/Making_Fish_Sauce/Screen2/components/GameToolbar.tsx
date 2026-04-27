import { Hand, Droplets, Brush } from 'lucide-react';

interface GameToolbarProps {
  selectedTool?: string;
  onToolSelect?: (tool: string) => void;
}

export function GameToolbar({ selectedTool, onToolSelect }: GameToolbarProps) {
  const tools = [
    { id: 'select', label: 'Chọn lọc', icon: Hand },
    { id: 'scoop', label: 'Gáo nước biển', icon: Droplets },
    { id: 'brush', label: 'Bàn chải tre', icon: Brush }
  ];

  return (
    <div className="w-full px-4 pb-6 pt-3 md:px-8 md:pb-8 lg:px-12">
      <div className="max-w-2xl mx-auto">
        {/* Tool buttons */}
        <div className="flex gap-2 md:gap-3 lg:gap-4 mb-3 md:mb-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = selectedTool === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => onToolSelect?.(tool.id)}
                className="flex-1 flex flex-col items-center gap-1.5 md:gap-2 py-3 px-2 md:py-4 md:px-3 lg:py-5 lg:px-4 rounded-xl transition-all active:scale-95 hover:scale-105"
                style={{
                  background: isSelected
                    ? 'linear-gradient(180deg, #6b8e9a 0%, #557a85 100%)'
                    : 'linear-gradient(180deg, #f5e6d3 0%, #d4c4b0 100%)',
                  boxShadow: isSelected
                    ? 'inset 0 2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)'
                    : '0 3px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
                  border: isSelected ? '2px solid #4a6a75' : '2px solid #c4b4a0',
                  minHeight: '60px'
                }}
              >
                <Icon
                  className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
                  style={{
                    color: isSelected ? '#f5f5f5' : '#5a4d3d',
                    strokeWidth: 2.5
                  }}
                />
                <span
                  style={{
                    fontSize: 'clamp(10px, 2.2vw, 13px)',
                    fontWeight: 600,
                    color: isSelected ? '#f5f5f5' : '#5a4d3d',
                    textAlign: 'center',
                    lineHeight: 1.2
                  }}
                >
                  {tool.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
