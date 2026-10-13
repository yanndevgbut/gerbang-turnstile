'use client';

import { useEffect, useState } from 'react';

interface SolvedItem {
  id: string;
  duration: string;
}

export default function Marquee() {
  const [items, setItems] = useState<SolvedItem[]>([]);

  useEffect(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz0123456789';
    const rnd = (n: number) =>
      [...Array(n)]
        .map(() => chars[(Math.random() * chars.length) | 0])
        .join('');

    const initial: SolvedItem[] = Array.from({ length: 14 }, () => ({
      id: `0x4AAA${rnd(6)}…`,
      duration: (0.9 + Math.random() * 1.2).toFixed(2),
    }));

    setItems(initial);
  }, []);

  if (items.length === 0) {
    return (
      <div className="mq mono" aria-hidden="true">
        <div>
          <span>0x4AAAAAA… <b>solved</b> 1.12s</span>
          <span>0x4AAABBB… <b>solved</b> 1.35s</span>
          <span>0x4AAACCC… <b>solved</b> 0.98s</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mq mono" aria-hidden="true">
      <div>
        {items.map((it, idx) => (
          <span key={`a-${idx}`}>
            {it.id} <b>solved</b> {it.duration}s
          </span>
        ))}
        {items.map((it, idx) => (
          <span key={`b-${idx}`}>
            {it.id} <b>solved</b> {it.duration}s
          </span>
        ))}
      </div>
    </div>
  );
}
