'use client';

import { useState, useRef } from 'react';

type Status = 'idle' | 'running' | 'ok' | 'error';

export default function TurnstileDemo() {
  const [status, setStatus] = useState<Status>('idle');
  const [label, setLabel] = useState('Verifikasi bahwa Anda manusia');
  const [tokenDisplay, setTokenDisplay] = useState('Menunggu klik…');
  const [isError, setIsError] = useState(false);
  const streamRef = useRef<NodeJS.Timeout | null>(null);
  const resetRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = async () => {
    if (status === 'running') return;

    if (streamRef.current) clearInterval(streamRef.current);
    if (resetRef.current) clearTimeout(resetRef.current);

    setStatus('running');
    setIsError(false);
    setLabel('Menghubungi solver Railway…');
    setTokenDisplay('Memproses tantangan Turnstile…');

    const startTime = performance.now();

    try {
      const res = await fetch('/api/turnstile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sitekey: '1x00000000000000000000AA',
          siteurl: 'https://challenges.cloudflare.com',
          timeout: 45,
        }),
      });

      const data = await res.json().catch(() => null);
      const elapsedSec = ((performance.now() - startTime) / 1000).toFixed(2);

      if (res.ok && data?.success && data?.token) {
        setStatus('ok');
        setLabel('Berhasil');

        const dur = data.duration ? Number(data.duration).toFixed(2) : elapsedSec;
        const fullToken = String(data.token);
        let charIndex = 0;

        streamRef.current = setInterval(() => {
          charIndex += 2;
          if (charIndex >= fullToken.length) {
            charIndex = fullToken.length;
            if (streamRef.current) clearInterval(streamRef.current);
          }
          setTokenDisplay(
            `<b>token · ${dur}s</b><br />${fullToken.slice(0, charIndex)}`
          );
        }, 12);
      } else {
        setStatus('error');
        setIsError(true);
        const errMsg =
          data?.error ||
          data?.reason ||
          `HTTP ${res.status}: Gagal memproses Turnstile`;
        setLabel('Gagal terselesaikan');
        setTokenDisplay(
          `<b>Gagal · ${elapsedSec}s</b><br />${errMsg}`
        );
      }
    } catch (err: unknown) {
      const elapsedSec = ((performance.now() - startTime) / 1000).toFixed(2);
      setStatus('error');
      setIsError(true);
      const errText = err instanceof Error ? err.message : 'Koneksi terputus';
      setLabel('Koneksi gagal');
      setTokenDisplay(
        `<b>Gagal · ${elapsedSec}s</b><br />${errText}`
      );
    } finally {
      resetRef.current = setTimeout(() => {
        setStatus('idle');
        setIsError(false);
        setLabel('Verifikasi bahwa Anda manusia');
      }, 8000);
    }
  };

  const getButtonClass = () => {
    if (status === 'running') return 'ts run';
    if (status === 'ok') return 'ts ok';
    if (status === 'error') return 'ts err';
    return 'ts';
  };

  return (
    <div className="tw rv">
      <button
        type="button"
        className={getButtonClass()}
        id="ts"
        onClick={handleClick}
        disabled={status === 'running'}
      >
        <span className="box">
          <svg viewBox="0 0 26 26">
            <path d="M6 13.5l5 5 9-10" />
          </svg>
        </span>
        <span id="tl">{label}</span>
        <small>Turnstile</small>
      </button>
      <div
        className={`tok mono ${isError ? 'err' : ''}`}
        id="tk"
        dangerouslySetInnerHTML={{ __html: tokenDisplay }}
      />
    </div>
  );
}
