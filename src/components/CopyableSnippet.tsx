'use client';

import { useState } from 'react';

interface CopyableSnippetProps {
  headerLabel?: string;
  code: string;
  children: React.ReactNode;
}

export default function CopyableSnippet({
  headerLabel = 'respons · 200',
  code,
  children,
}: CopyableSnippetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <div className="cb">
      <div className="cbh">
        <span
          className="mono"
          style={{ color: '#a09585', fontSize: '12px', padding: '5px 10px' }}
        >
          {headerLabel}
        </span>
        <button type="button" className="cp" onClick={handleCopy}>
          {copied ? 'Tersalin ✓' : 'Salin'}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  );
}
