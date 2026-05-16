import React from 'react';

interface Choice {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  effect?: string;
  onClick: () => void;
}

interface ChoiceCardProps {
  choices: Choice[];
  title?: string;
  multiple?: boolean;
}

export function ChoiceCard({ choices, title = 'Chọn hành động' }: ChoiceCardProps) {
  return (
    <div className="space-y-3">
      {title && (
        <div className="text-center mb-4">
          <h3 className="text-sm opacity-70 tracking-wide uppercase">{title}</h3>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {choices.map((choice) => (
          <button
            key={choice.id}
            onClick={choice.onClick}
            className="group relative overflow-hidden rounded-lg p-4 text-left transition-all duration-300 bg-white/80 backdrop-blur-sm border border-amber-200 hover:border-amber-400 hover:shadow-md hover:scale-105 active:scale-95"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-amber-700 mt-1">
                {choice.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-amber-900 mb-1">{choice.title}</p>
                <p className="text-xs text-gray-600 mb-2">{choice.description}</p>
                {choice.effect && (
                  <p className="text-xs text-amber-700 font-medium">
                    ✨ {choice.effect}
                  </p>
                )}
              </div>
              <span className="flex-shrink-0 text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity">›</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
