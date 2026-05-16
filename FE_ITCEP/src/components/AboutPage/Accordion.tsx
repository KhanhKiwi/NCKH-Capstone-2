import React, { useState } from 'react';

type Item = {
  title: string;
  content: React.ReactNode;
};

export default function Accordion({ items }: { items: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {items.map((it, idx) => {
        const open = openIndex === idx;
        return (
          <div key={idx} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(open ? null : idx)}
              className="w-full text-left p-4 flex items-center justify-between bg-white"
            >
              <span className="font-medium">{it.title}</span>
              <span className="text-xl">{open ? '−' : '+'}</span>
            </button>
            {open && <div className="p-4 bg-[#fbf9f5] text-sm text-[#6b5a46]">{it.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
