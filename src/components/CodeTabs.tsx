'use client';

import { useState } from 'react';

interface TabItem {
  label: string;
  code: string;
  render?: React.ReactNode;
}

interface CodeTabsProps {
  tabs: TabItem[];
}

export default function CodeTabs({ tabs }: CodeTabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const activeCode = tabs[activeTab].code;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(activeCode).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <div className="cb">
      <div className="cbh">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            type="button"
            className={activeTab === idx ? 'on' : ''}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </button>
        ))}
        <button type="button" className="cp" onClick={handleCopy}>
          {copied ? 'Tersalin ✓' : 'Salin'}
        </button>
      </div>
      {tabs.map((tab, idx) => (
        <pre key={idx} className={activeTab === idx ? '' : 'h'}>
          {tab.render ? tab.render : tab.code}
        </pre>
      ))}
    </div>
  );
}
