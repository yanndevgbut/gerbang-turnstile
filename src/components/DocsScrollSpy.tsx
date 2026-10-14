'use client';

import { useEffect, useState } from 'react';

interface NavItem {
  id: string;
  label: string;
}

interface NavGroup {
  category: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    category: 'Mulai',
    items: [
      { id: 'ringkasan', label: 'Ringkasan' },
      { id: 'tk', label: 'Kunci uji (Test keys)' },
    ],
  },
  {
    category: 'Endpoint Solver',
    items: [
      { id: 'tm', label: '1. /api/turnstile-max (Otomatis)' },
      { id: 'gs', label: '2. /api/get-sitekey (Detektor)' },
      { id: 'ts', label: '3. /api/turnstile (Cepat)' },
      { id: 'gh', label: '4. /api/health (Status)' },
    ],
  },
  {
    category: 'Referensi',
    items: [
      { id: 'er', label: 'Kode status & error' },
      { id: 'rl', label: 'Antrean & batas kecepatan' },
    ],
  },
];

export default function DocsScrollSpy() {
  const [activeId, setActiveId] = useState('ringkasan');

  useEffect(() => {
    const handleScroll = () => {
      const allItems = NAV_GROUPS.flatMap((g) => g.items);
      let current = allItems[0].id;

      for (const item of allItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < 160) {
            current = item.id;
          }
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <aside className="side" id="sd">
      {NAV_GROUPS.map((group, gIdx) => (
        <div key={gIdx}>
          <h4>{group.category}</h4>
          {group.items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeId === item.id ? 'on' : ''}
            >
              {item.label}
            </a>
          ))}
        </div>
      ))}
    </aside>
  );
}
