import React from 'react';

type Props = {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

export default function Callout({ icon, title, children }: Props) {
  return (
    <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-white border-l-4 border-amber-300 mb-4 flex items-start gap-4">
      <div className="text-3xl leading-none">{icon}</div>
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <div className="text-sm text-[#6b5a46]">{children}</div>
      </div>
    </div>
  );
}
