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
      { id: 'qs', label: 'Mulai cepat' },
      { id: 'tk', label: 'Kunci uji (Test keys)' },
    ],
  },
  {
    category: 'Endpoint',
    items: [
      { id: 'ts', label: '/api/turnstile' },
      { id: 'tm', label: '/api/turnstile-max' },
      { id: 'gh', label: '/api/health' },
    ],
  },
  {
    category: 'Referensi',
    items: [
      { id: 'er', label: 'Kode error' },
      { id: 'rl', label: 'Batas laju & antrean' },
    ],
  },
];

export default function DocsScrollSpy() {
  const [activeId, setActiveId] = useState('qs');

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
