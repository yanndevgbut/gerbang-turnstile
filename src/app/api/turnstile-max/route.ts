import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const railwayUrl = process.env.RAILWAY_API_URL?.replace(/\/+$/, '');

  if (!railwayUrl) {
    return NextResponse.json(
      {
        success: false,
        error: 'RAILWAY_API_URL environment variable is not configured on Vercel/server.',
      },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const backendRes = await fetch(`${railwayUrl}/api/turnstile-max`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json().catch(() => null);

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: `Backend Railway returned status ${backendRes.status} with non-JSON response.`,
        },
        { status: backendRes.status || 502 }
      );
    }

    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown proxy error';
    return NextResponse.json(
      {
        success: false,
        error: `Gagal menghubungi backend Railway: ${message}`,
      },
      { status: 502 }
    );
  }
}
