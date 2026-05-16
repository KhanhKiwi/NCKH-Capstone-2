import React from 'react';

type Props = {
  label: string;
  percent: number;
};

export default function ProgressBar({ label, percent }: Props) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-sm text-[#6b5a46]">{percent}%</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div className="h-3 bg-[#4a7c2f] transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
