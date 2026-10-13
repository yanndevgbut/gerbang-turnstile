'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav>
      <Link className="logo" href="/">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          stroke="var(--acc)"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <circle cx="16" cy="16" r="3" fill="var(--acc)" />
          <path d="M16 13V3M18.6 17.5l8.7 5M13.4 17.5l-8.7 5" />
        </svg>
        Gerbang
      </Link>
      <Link
        className={`l ${pathname === '/' ? 'on' : ''}`}
        id="nl"
        href="/"
      >
        Beranda
      </Link>
      <Link
        className={`l ${pathname === '/dokumentasi' ? 'on' : ''}`}
        id="nd"
        href="/dokumentasi"
      >
        Dokumentasi
      </Link>
      <Link
        className="btn"
        href="/dokumentasi"
        style={{ padding: '8px 16px' }}
      >
        Mulai
      </Link>
    </nav>
  );
}
