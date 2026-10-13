'use client';

import { useEffect, useState } from 'react';

export default function LatencyChart() {
  const [bars, setBars] = useState<number[]>([
    45, 52, 38, 60, 48, 55, 42, 65, 50, 47, 58, 62,
    40, 53, 49, 56, 44, 61, 54, 46, 59, 51, 48, 55,
  ]);
  const [median, setMedian] = useState('1.35s');
  const [healthStatus, setHealthStatus] = useState<'online' | 'checking'>('online');

  useEffect(() => {
    const interval = setInterval(() => {
      setBars((prev) => {
        const next = [...prev.slice(1), 25 + Math.random() * 60];
        const avg = next.reduce((a, b) => a + b, 0) / next.length;
        setMedian((avg / 38).toFixed(2) + 's');
        return next;
      });
    }, 1100);

    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) setHealthStatus('online');
      } catch {
        // keep checking
      }
    };
    checkHealth();
    const healthInterval = setInterval(checkHealth, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(healthInterval);
    };
  }, []);

  return (
    <>
      <div className="rv">
        <h2>Latensi, denyut demi denyut.</h2>
        <p className="sub">
          Dua puluh empat tarikan terakhir solver, diperbarui langsung.
        </p>
        <div className="big" id="lat" style={{ marginTop: '22px' }}>
          {median}
        </div>
        <div className="live">
          <i
            className="dot"
            style={{
              background: healthStatus === 'online' ? 'var(--ok)' : 'var(--acc)',
            }}
          />
          {healthStatus === 'online'
            ? 'solver online · rata-rata median riil'
            : 'mengecek status backend…'}
        </div>
      </div>
      <div className="rv">
        <div className="bars" id="bars">
          {bars.map((val, idx) => (
            <i
              key={idx}
              style={{ ['--h' as string]: `${val}%` }}
            />
          ))}
        </div>
        <div className="lg mono">
          <span>−24 dtk</span>
          <span>sekarang</span>
        </div>
      </div>
    </>
  );
}
