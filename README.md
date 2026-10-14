# Gerbang — Turnstile Solver & CaptchaX (All-in-One)

Aplikasi lengkap solver Cloudflare Turnstile & Captcha:
- **Frontend Modern**: Next.js (App Router), animasi gerbang SVG, live latency chart, kalkulator harga, dan dokumentasi interaktif.
- **Backend Solver**: Express.js + Puppeteer Real Browser bertenaga CaptchaX (mendukung Turnstile, Turnstile Max, reCAPTCHA v3, Altcha, FriendlyCaptcha, Cloudflare Challenge, dll).
- **Arsitektur 1 Wadah (Single Container)**: Frontend Next.js di-export statis dan disajikan langsung oleh Express. API dan Web berjalan di satu domain dan satu port yang sama di Railway.

---

## Fitur Solver

| Proteksi | Endpoint | Keterangan |
| :--- | :--- | :--- |
| **Turnstile (Standalone)** | `POST /api/turnstile` | Render mandiri via fake page bermodal `sitekey` & `siteurl` (paling cepat). |
| **Turnstile (Embedded)** | `POST /api/turnstile-max` | Kunjungi halaman target secara otomatis bermodal `url`. |
| **Detektor Sitekey** | `POST /api/get-sitekey` | Pindai otomatis jenis captcha & sitekey dari link website target. |
| **reCAPTCHA v3** | `POST /api/captchav3` | Anchor/reload tanpa browser (ringan). |
| **Cloudflare WAF** | `POST /api/cloudflare` | Bypass challenge dan ambil `cf_clearance`. |
| **Altcha PoW** | `POST /api/altcha` | Brute force SHA-1/256/384/512 (murni komputasi). |
| **FriendlyCaptcha** | `POST /api/friendly` | Solver WASM resmi `friendly-pow`. |
| **Health Check** | `GET /api/health` | Cek status RAM, CPU, dan antrean browser. |

---

## Deploy ke Railway (1-Click via GitHub)

1. **Push repository ini ke GitHub**:
   ```bash
   git add .
   git commit -m "feat: unified captchax backend and nextjs frontend"
   git push origin main
   ```

2. **Buat Project di Railway**:
   - Buka [Railway](https://railway.app/).
   - Klik **New Project** &rarr; **Deploy from GitHub repo** &rarr; pilih repository `gerbang-turnstile`.
   - Railway otomatis mendeteksi `Dockerfile` dan `railway.json`.

3. **Pengaturan Variabel (Variables)**:
   Tambahkan variabel lingkungan di tab **Variables**:
   - `PORT`: `5000` (atau port default Railway)
   - `NODE_ENV`: `production`
   - `MAX_REQUESTS_PER_MINUTE`: `5` (atau sesuai kebutuhan)
   - `BROWSER_SLOT_WAIT_MS`: `45000`

4. **Public Networking**:
   - Di tab **Networking**, klik **Generate Domain** (misal: `gerbang-turnstile.up.railway.app`).
   - Pastikan **Target Port** sama dengan nilai `PORT` (`5000`).

Selesai! Web UI dan semua endpoint `/api/*` langsung aktif di satu domain yang sama.

---

## Menjalankan Secara Lokal (Docker)

```bash
docker build -t gerbang-turnstile .
docker run --rm -p 5000:5000 gerbang-turnstile
```
Buka `http://localhost:5000` di browser Anda.

---

## Struktur Folder

```
├── Dockerfile                  # Base Debian + Chromium + build Next.js
├── railway.json                # Konfigurasi deploy Railway
├── next.config.mjs             # Next.js static export (output: 'export')
├── package.json                # Dependensi gabungan (Next.js + Express + Puppeteer)
├── assets/                     # Asset fakePage & ilustrasi
└── src/
    ├── app/                    # Next.js UI (Halaman beranda & dokumentasi)
    ├── components/             # Komponen visual (Marquee, Chart, Demo, dll)
    └── server/                 # Express Server CaptchaX
        ├── index.js            # Entry point: melayani /api/* dan static files out/
        ├── routes/             # solve.js, health.js
        └── services/           # turnstile, browser, cloudflare, kasada, dll.
```
