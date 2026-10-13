# Gerbang — Cloudflare Turnstile Solver UI

Antarmuka web modern untuk solver **Cloudflare Turnstile**, dibangun menggunakan **Next.js (App Router)** dan siap di-deploy ke **Vercel**, terhubung langsung dengan backend **[CaptchaX](https://github.com/ryuhandev/CaptchaX)** yang berjalan di **Railway**.

## Fitur Utama

- **100% Desain Asli**: Animasi SVG gerbang, live latency meter, ticker running-text, kalkulator harga, dan tipografi editorial tetap persis sama.
- **Tanpa Mock Data**: Widget demo langsung melakukan solve sungguhan via API proxy ke backend Railway.
- **Dokumentasi Lengkap**: Spesifikasi endpoint `/api/turnstile`, `/api/turnstile-max`, kode snippet (curl, Node.js, Python), dan test keys resmi Cloudflare.
- **Proxy Anti-CORS**: Route proxy bawaan (`/api/turnstile`, `/api/turnstile-max`, `/api/health`) untuk mengamankan URL backend dan mencegah pemblokiran CORS dari browser.
- **Vercel Ready**: Bebas konfigurasi rumit, cukup pasang Environment Variable di dashboard Vercel.

---

## Variabel Environment

Salin `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Isi dengan domain publik backend Railway Anda:

```env
RAILWAY_API_URL=https://your-captchax-backend.up.railway.app
```

---

## Menjalankan Secara Lokal

```bash
# Menggunakan Bun / NPM / PNPM
bun install
bun run dev
# atau
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## Deploy ke Vercel

1. Push folder proyek ini ke repository GitHub Anda:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <URL_REPO_GITHUB>
   git push -u origin main
   ```
2. Buka dashboard [Vercel](https://vercel.com/) dan pilih **Add New Project**.
3. Import repository GitHub tersebut.
4. Pada bagian **Environment Variables**, tambahkan:
   - **Key**: `RAILWAY_API_URL`
   - **Value**: `https://<nama-aplikasi-railway>.up.railway.app`
5. Klik **Deploy**.

---

## Struktur Proyek

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/route.ts         # Proxy GET /api/health ke Railway
│   │   │   ├── turnstile/route.ts      # Proxy POST /api/turnstile ke Railway
│   │   │   └── turnstile-max/route.ts  # Proxy POST /api/turnstile-max ke Railway
│   │   ├── dokumentasi/
│   │   │   └── page.tsx                # Halaman dokumentasi API CaptchaX
│   │   ├── globals.css                 # Sistem tema, animasi keyframes, dan styling murni
│   │   ├── layout.tsx                  # Font Bricolage Grotesque, Instrument Sans, JetBrains Mono
│   │   └── page.tsx                    # Landing page dengan demo widget riil
│   └── components/
│       ├── CodeTabs.tsx                # Tab curl / Node / Python + tombol salin
│       ├── CopyableSnippet.tsx         # Blok kode respons JSON responsif
│       ├── DocsScrollSpy.tsx           # Sticky sidebar scrollspy
│       ├── FlowDiagram.tsx             # Diagram alur SVG (desktop & mobile)
│       ├── Footer.tsx                  # Footer konsisten
│       ├── HeroGate.tsx                # Animasi SVG gerbang Turnstile
│       ├── LatencyChart.tsx            # Live bar chart latensi
│       ├── Marquee.tsx                 # Running marquee log penyelesaian
│       ├── Navbar.tsx                  # Navigasi atas dengan active link
│       ├── PriceCalculator.tsx         # Slider estimasi biaya
│       ├── ScrollReveal.tsx            # Observer animasi scroll
│       └── TurnstileDemo.tsx           # Widget solve turnstile live ke Railway
├── next.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```
