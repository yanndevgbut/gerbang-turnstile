'use client';

import { useState } from 'react';

export default function PriceCalculator() {
  const [value, setValue] = useState(20);

  const requestCount = (value * 5000).toLocaleString('id-ID');
  const price = '$' + ((value * 5000) / 1000 * 0.55).toFixed(0);

  return (
    <div className="pr rv">
      <div className="mono" style={{ color: 'var(--mut)', fontSize: '13px' }}>
        <span id="rq">{requestCount}</span> permintaan / bulan
      </div>
      <input
        type="range"
        id="rg"
        min="1"
        max="100"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label="Jumlah permintaan"
      />
      <div className="meter">
        <i id="mt" style={{ ['--w' as string]: `${value}%` }} />
      </div>
      <div className="big" style={{ marginTop: '22px' }} id="pc">
        {price}
      </div>
    </div>
  );
}
