import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const railwayUrl = process.env.RAILWAY_API_URL?.replace(/\/+$/, '');

  if (!railwayUrl) {
    return NextResponse.json({
      status: 'healthy',
      service: 'nextjs-frontend',
      railwayConnected: false,
      message: 'RAILWAY_API_URL belum diatur.',
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const backendRes = await fetch(`${railwayUrl}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await backendRes.json().catch(() => null);

    return NextResponse.json({
      status: backendRes.ok ? 'healthy' : 'degraded',
      railwayConnected: true,
      backendStatus: backendRes.status,
      backendData: data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error';
    return NextResponse.json({
      status: 'degraded',
      railwayConnected: false,
      error: `Railway unreachable: ${message}`,
    });
  }
}
