import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DocsScrollSpy from '@/components/DocsScrollSpy';
import CodeTabs from '@/components/CodeTabs';
import CopyableSnippet from '@/components/CopyableSnippet';
import ScrollReveal from '@/components/ScrollReveal';

export default function DokumentasiPage() {
  // 1. TURNSTILE-MAX
  const tmCurl = `# Cara paling gampang: cukup kirim link website yang mau ditembus
curl -X POST https://gerbang-turnstile.vercel.app/api/turnstile-max \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://target.com/login","timeout":60}'`;

  const tmNode = `// 1. Minta solver selesaikan Turnstile langsung dari URL
const res = await fetch("https://gerbang-turnstile.vercel.app/api/turnstile-max", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: "https://target.com/login",
    timeout: 60
  })
});
const { token } = await res.json();

// 2. Langsung tempelkan token ke form target
await fetch("https://target.com/login", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    username: "user@example.com",
    password: "password123",
    "cf-turnstile-response": token // <-- pasang token di sini
  })
});`;

  const tmPython = `import requests

# 1. Panggil solver cukup dengan link website target
solve = requests.post(
  "https://gerbang-turnstile.vercel.app/api/turnstile-max",
  json={"url": "https://target.com/login", "timeout": 60}
).json()
token = solve.get("token")

# 2. Kirim form login ke target bersama token yang didapat
session = requests.Session()
response = session.post(
  "https://target.com/login",
  data={
    "username": "user@example.com",
    "password": "password123",
    "cf-turnstile-response": token  # <-- pasang token di sini
  }
)
print("Berhasil login:", response.status_code)`;

  const tmAutomation = `// Automasi Browser (Puppeteer / Playwright)
// Setelah dapat token dari /api/turnstile-max, pasang langsung ke halaman browser:
await page.evaluate((token) => {
  const input = document.querySelector('[name="cf-turnstile-response"]');
  if (input) {
    input.value = token;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
}, token);

// Lanjut klik tombol submit di web target
await page.click('#tombol-login');`;

  const tmResponse = `{
  "success": true,
  "token": "0.4AAAAAA8yP1...w9X3",
  "duration": 5.18
}`;

  // 2. GET-SITEKEY
  const gsCurl = `# Deteksi otomatis sitekey & captcha dari sebuah halaman web
curl -X POST https://gerbang-turnstile.vercel.app/api/get-sitekey \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://target.com/login","timeout":30}'`;

  const gsNode = `// 1. Scan website target untuk dapatkan sitekey secara otomatis
const scanRes = await fetch("https://gerbang-turnstile.vercel.app/api/get-sitekey", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://target.com/login", timeout: 30 })
});
const scan = await scanRes.json();
const sitekey = scan.sitekeys[0]?.sitekey; // otomatis dapat '0x4AAAAAA...'

// 2. Selesaikan Turnstile dengan sitekey hasil deteksi (lebih cepat)
const solveRes = await fetch("https://gerbang-turnstile.vercel.app/api/turnstile", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sitekey: sitekey,
    siteurl: "https://target.com/login"
  })
});
const { token } = await solveRes.json();

// 3. Gunakan token untuk request form target
console.log("Token siap dipakai:", token);`;

  const gsPython = `import requests

# 1. Scan website untuk deteksi otomatis sitekey
scan = requests.post(
  "https://gerbang-turnstile.vercel.app/api/get-sitekey",
  json={"url": "https://target.com/login", "timeout": 30}
).json()

sitekey = scan["sitekeys"][0]["sitekey"]
print("Sitekey ditemukan:", sitekey)

# 2. Lempar sitekey ke solver cepat
solve = requests.post(
  "https://gerbang-turnstile.vercel.app/api/turnstile",
  json={"sitekey": sitekey, "siteurl": "https://target.com/login"}
).json()

token = solve.get("token")
print("Token siap dipakai:", token)`;

  const gsResponse = `{
  "success": true,
  "url": "https://target.com/login",
  "detected_providers": ["turnstile"],
  "sitekeys": [
    {
      "type": "turnstile",
      "label": "Cloudflare Turnstile",
      "sitekey": "0x4AAAAAAAJ...",
      "solver": "/api/turnstile",
      "solver_param": "sitekey"
    }
  ],
  "total_keys_found": 1,
  "duration": 4.12
}`;

  // 3. TURNSTILE (Cepat)
  const tsCurl = `# Mode cepat: jika kamu sudah tahu sitekey widget target
curl -X POST https://gerbang-turnstile.vercel.app/api/turnstile \\
  -H "Content-Type: application/json" \\
  -d '{"sitekey":"1x00000000000000000000AA","siteurl":"https://challenges.cloudflare.com","timeout":45}'`;

  const tsHtmlForm = `<!-- Cara pasang di Form HTML: -->
<!-- Cloudflare Turnstile selalu memeriksa input dengan nama "cf-turnstile-response" -->
<form action="https://target.com/login" method="POST">
  <input type="text" name="email" value="user@mail.com" />
  <input type="password" name="password" value="rahasia" />

  <!-- Masukkan token yang didapat dari solver ke sini -->
  <input type="hidden" name="cf-turnstile-response" value="0.4AAAAAA..." />

  <button type="submit">Masuk</button>
</form>`;

  const tsNode = `// 1. Minta token ke solver cepat
const res = await fetch("https://gerbang-turnstile.vercel.app/api/turnstile", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sitekey: "0x4AAAAAA...",
    siteurl: "https://target.com/login",
    timeout: 45
  })
});
const { token } = await res.json();

// 2. Pasang token ke request tujuan
await fetch("https://target.com/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@mail.com",
    password: "password123",
    "cf-turnstile-response": token // <-- pasang di sini
  })
});`;

  const tsPython = `import requests

# 1. Dapatkan token dari solver
solve = requests.post(
  "https://gerbang-turnstile.vercel.app/api/turnstile",
  json={
    "sitekey": "0x4AAAAAA...",
    "siteurl": "https://target.com/login",
    "timeout": 45
  }
).json()
token = solve.get("token")

# 2. Pasang token ke data form login target
res = requests.post(
  "https://target.com/login",
  data={
    "email": "user@mail.com",
    "password": "mypassword",
    "cf-turnstile-response": token  # <-- pasang di sini
  }
)
print("Status login:", res.status_code)`;

  const tsResponse = `{
  "success": true,
  "token": "0.4AAAAAA7xO9...q8V2",
  "duration": 1.42
}`;

  // 4. HEALTH
  const healthCurl = `# Cek apakah backend solver siap menerima antrean
curl -X GET https://gerbang-turnstile.vercel.app/api/health`;

  const healthResponse = `{
  "status": "healthy",
  "railwayConnected": true,
  "backendStatus": 200,
  "backendData": {
    "status": "ok",
    "service": "turnstile-solver-js",
    "ram": { "used": "238MB", "free": "133MB" }
  }
}`;

  return (
    <>
      <Navbar />
      <main id="docs">
        <div className="wrap dg">
          <DocsScrollSpy />
          <article className="doc">
            <div className="live">
              <i className="dot" />
              API v1 · Semua sistem normal · CaptchaX Engine
            </div>

            <h1 style={{ marginTop: '14px' }}>Dokumentasi API Solver</h1>
            <p>
              Panduan lengkap dan praktis untuk menyelesaikan tantangan Cloudflare
              Turnstile. Cukup panggil API, ambil tokennya, dan pasang langsung
              ke form atau skrip bot Anda.
            </p>

            <h2 id="ringkasan">Cara Kerja Singkat</h2>
            <p>Ada 3 cara yang bisa kamu pilih sesuai kebutuhan:</p>
            <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>
                <b>Paling mudah (Otomatis)</b>: Pakai{' '}
                <code>/api/turnstile-max</code>. Cukup kirim URL halaman web,
                solver akan membuka halaman dan mengklik widget sendiri.
              </li>
              <li>
                <b>Deteksi otomatis</b>: Pakai <code>/api/get-sitekey</code> untuk
                mencari tahu nilai <code>sitekey</code> di halaman target tanpa
                perlu inspect element manual.
              </li>
              <li>
                <b>Paling cepat & hemat resource</b>: Pakai{' '}
                <code>/api/turnstile</code> jika kamu sudah tahu nilai sitekey-nya.
              </li>
            </ol>

            <h2 id="tk">Kunci Uji Resmi (Test Keys)</h2>
            <p>
              Gunakan kunci resmi dari Cloudflare ini untuk mengetes integrasi
              tanpa takut diblokir:
            </p>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Sitekey</th>
                  <th>Perilaku</th>
                  <th>Hasil Pengujian</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>1x00000000000000000000AA</code>
                  </td>
                  <td>Selalu lolos (Pass)</td>
                  <td>Mengembalikan token dummy instan</td>
                </tr>
                <tr>
                  <td>
                    <code>2x00000000000000000000AB</code>
                  </td>
                  <td>Selalu gagal (Block)</td>
                  <td>Menolak verifikasi tantangan</td>
                </tr>
                <tr>
                  <td>
                    <code>3x00000000000000000000FF</code>
                  </td>
                  <td>Interactive Challenge</td>
                  <td>Memicu puzzle interaktif</td>
                </tr>
              </tbody>
            </table>

            {/* ENDPOINT 1 */}
            <h2 id="tm">1. Selesaikan Otomatis dari URL Target</h2>
            <p>
              <span className="m p">POST</span>
              <code>/api/turnstile-max</code>
            </p>
            <p>
              <b>Kapan pakai ini?</b> Saat kamu tidak tahu nilai <code>sitekey</code>-nya
              atau Turnstile tersembunyi di dalam form. Solver akan langsung
              membuka URL yang kamu berikan, memuat halaman asli, dan memecahkan
              widget secara otomatis.
            </p>

            <table className="tbl">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Tipe</th>
                  <th>Wajib</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>url</code></td>
                  <td>string</td>
                  <td>Ya</td>
                  <td>Alamat website target yang memuat Turnstile</td>
                </tr>
                <tr>
                  <td><code>timeout</code></td>
                  <td>number</td>
                  <td>Tidak</td>
                  <td>Batas waktu tunggu dalam detik (default: 60)</td>
                </tr>
              </tbody>
            </table>

            <CopyableSnippet
              headerLabel="contoh respons sukses · 200"
              code={tmResponse}
            >
              {`{\n  `}<span className="k">&quot;success&quot;</span>: <span className="s2">true</span>,{`\n  `}<span className="k">&quot;token&quot;</span>: <span className="s2">&quot;0.4AAAAAA8yP1...w9X3&quot;</span>,{`\n  `}<span className="k">&quot;duration&quot;</span>: <span className="s2">5.18</span>{`\n}`}
            </CopyableSnippet>

            <h3 style={{ fontSize: '1.2rem', marginTop: '24px' }}>
              Kode Panggil &amp; Cara Pasang Tokennya:
            </h3>
            <p>
              Pilih bahasa yang kamu pakai. Skrip di bawah langsung mengambil
              token dan menempelkannya ke form target:
            </p>

            <CodeTabs
              tabs={[
                {
                  label: 'cURL',
                  code: tmCurl,
                  render: (
                    <>
                      <span className="c"># Cukup kirim URL halaman target</span>{'\n'}
                      curl -X POST https://gerbang-turnstile.vercel.app/api/turnstile-max \{'\n'}
                      {'  '}-H <span className="s2">&quot;Content-Type: application/json&quot;</span> \{'\n'}
                      {'  '}-d <span className="s2">&apos;{`{"url":"https://target.com/login","timeout":60}`}</span>&apos;
                    </>
                  ),
                },
                {
                  label: 'Node.js (Full Flow)',
                  code: tmNode,
                  render: (
                    <>
                      <span className="c">// 1. Ambil token dari solver via URL</span>{'\n'}
                      <span className="k">const</span> res = <span className="k">await</span> fetch(<span className="s2">&quot;https://gerbang-turnstile.vercel.app/api/turnstile-max&quot;</span>, {'{'}{'\n'}
                      {'  '}method: <span className="s2">&quot;POST&quot;</span>,{'\n'}
                      {'  '}headers: {'{'} <span className="s2">&quot;Content-Type&quot;</span>: <span className="s2">&quot;application/json&quot;</span> {'}'},{'\n'}
                      {'  '}body: JSON.stringify({'{'} url: <span className="s2">&quot;https://target.com/login&quot;</span>, timeout: 60 {'}'}){'\n'}
                      {'}'});{'\n'}
                      <span className="k">const</span> {'{'} token {'}'} = <span className="k">await</span> res.json();{'\n\n'}
                      <span className="c">// 2. Pasang token ke form request target</span>{'\n'}
                      <span className="k">await</span> fetch(<span className="s2">&quot;https://target.com/login&quot;</span>, {'{'}{'\n'}
                      {'  '}method: <span className="s2">&quot;POST&quot;</span>,{'\n'}
                      {'  '}headers: {'{'} <span className="s2">&quot;Content-Type&quot;</span>: <span className="s2">&quot;application/x-www-form-urlencoded&quot;</span> {'}'},{'\n'}
                      {'  '}body: <span className="k">new</span> URLSearchParams({'{'}{'\n'}
                      {'    '}username: <span className="s2">&quot;user@example.com&quot;</span>,{'\n'}
                      {'    '}password: <span className="s2">&quot;password123&quot;</span>,{'\n'}
                      {'    '}<span className="s2">&quot;cf-turnstile-response&quot;</span>: token <span className="c">// &lt;-- pasang di sini</span>{'\n'}
                      {'  '}{'}'}){'\n'}
                      {'}'});
                    </>
                  ),
                },
                {
                  label: 'Python (Full Flow)',
                  code: tmPython,
                  render: (
                    <>
                      <span className="k">import</span> requests{'\n\n'}
                      <span className="c"># 1. Panggil solver cukup dengan URL</span>{'\n'}
                      solve = requests.post({'\n'}
                      {'  '}<span className="s2">&quot;https://gerbang-turnstile.vercel.app/api/turnstile-max&quot;</span>,{'\n'}
                      {'  '}json={'{'}<span className="s2">&quot;url&quot;</span>: <span className="s2">&quot;https://target.com/login&quot;</span>, <span className="s2">&quot;timeout&quot;</span>: 60{'}'}{'\n'}
                      ).json(){'\n'}
                      token = solve.get(<span className="s2">&quot;token&quot;</span>){'\n\n'}
                      <span className="c"># 2. Kirim form login bersama token</span>{'\n'}
                      session = requests.Session(){'\n'}
                      response = session.post({'\n'}
                      {'  '}<span className="s2">&quot;https://target.com/login&quot;</span>,{'\n'}
                      {'  '}data={'{'}{'\n'}
                      {'    '}<span className="s2">&quot;username&quot;</span>: <span className="s2">&quot;user@example.com&quot;</span>,{'\n'}
                      {'    '}<span className="s2">&quot;password&quot;</span>: <span className="s2">&quot;password123&quot;</span>,{'\n'}
                      {'    '}<span className="s2">&quot;cf-turnstile-response&quot;</span>: token  <span className="c"># &lt;-- pasang di sini</span>{'\n'}
                      {'  '}{'}'}{'\n'}
                      ){'\n'}
                      print(<span className="s2">&quot;Status:&quot;</span>, response.status_code)
                    </>
                  ),
                },
                {
                  label: 'Puppeteer / Playwright',
                  code: tmAutomation,
                  render: (
                    <>
                      <span className="c">// Automasi browser: suntik token ke form dan klik submit</span>{'\n'}
                      <span className="k">await</span> page.evaluate((token) =&gt; {'{'}{'\n'}
                      {'  '}<span className="k">const</span> input = document.querySelector(<span className="s2">&apos;[name=&quot;cf-turnstile-response&quot;]&apos;</span>);{'\n'}
                      {'  '}<span className="k">if</span> (input) {'{'}{'\n'}
                      {'    '}input.value = token;{'\n'}
                      {'    '}input.dispatchEvent(<span className="k">new</span> Event(<span className="s2">&apos;input&apos;</span>, {'{'} bubbles: <span className="k">true</span> {'}'}));{'\n'}
                      {'    '}input.dispatchEvent(<span className="k">new</span> Event(<span className="s2">&apos;change&apos;</span>, {'{'} bubbles: <span className="k">true</span> {'}'}));{'\n'}
                      {'  '}{'}'}{'\n'}
                      {'}'}, token);{'\n\n'}
                      <span className="k">await</span> page.click(<span className="s2">&apos;#tombol-login&apos;</span>);
                    </>
                  ),
                },
              ]}
            />

            {/* ENDPOINT 2 */}
            <h2 id="gs">2. Deteksi Otomatis Sitekey dari URL</h2>
            <p>
              <span className="m p">POST</span>
              <code>/api/get-sitekey</code>
            </p>
            <p>
              <b>Kapan pakai ini?</b> Saat kamu ingin mengetahui jenis captcha dan
              mengambil nilai <code>sitekey</code> secara otomatis dari website
              target tanpa perlu membuka DevTools / inspect element secara manual.
            </p>

            <table className="tbl">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Tipe</th>
                  <th>Wajib</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>url</code></td>
                  <td>string</td>
                  <td>Ya</td>
                  <td>Alamat website yang ingin dipindai (discan)</td>
                </tr>
                <tr>
                  <td><code>timeout</code></td>
                  <td>number</td>
                  <td>Tidak</td>
                  <td>Waktu maksimal pemindaian detik (default: 30)</td>
                </tr>
              </tbody>
            </table>

            <CopyableSnippet
              headerLabel="contoh respons deteksi · 200"
              code={gsResponse}
            >
              {`{\n  `}<span className="k">&quot;success&quot;</span>: <span className="s2">true</span>,{`\n  `}<span className="k">&quot;detected_providers&quot;</span>: [<span className="s2">&quot;turnstile&quot;</span>],{`\n  `}<span className="k">&quot;sitekeys&quot;</span>: [{`\n    `}{`{\n      `}<span className="k">&quot;type&quot;</span>: <span className="s2">&quot;turnstile&quot;</span>,{`\n      `}<span className="k">&quot;sitekey&quot;</span>: <span className="s2">&quot;0x4AAAAAAAJ...&quot;</span>,{`\n      `}<span className="k">&quot;solver&quot;</span>: <span className="s2">&quot;/api/turnstile&quot;</span>{`\n    }`}{`\n  `}],{`\n  `}<span className="k">&quot;duration&quot;</span>: <span className="s2">4.12</span>{`\n}`}
            </CopyableSnippet>

            <h3 style={{ fontSize: '1.2rem', marginTop: '24px' }}>
              Alur Otomatis: Scan Dulu &rarr; Lalu Solve Cepat
            </h3>
            <p>
              Gabungkan endpoint ini dengan solver cepat agar bot kamu bisa
              berjalan 100% otomatis di situs apa pun:
            </p>

            <CodeTabs
              tabs={[
                {
                  label: 'cURL',
                  code: gsCurl,
                  render: (
                    <>
                      <span className="c"># Deteksi sitekey otomatis dari link web</span>{'\n'}
                      curl -X POST https://gerbang-turnstile.vercel.app/api/get-sitekey \{'\n'}
                      {'  '}-H <span className="s2">&quot;Content-Type: application/json&quot;</span> \{'\n'}
                      {'  '}-d <span className="s2">&apos;{`{"url":"https://target.com/login","timeout":30}`}</span>&apos;
                    </>
                  ),
                },
                {
                  label: 'Node.js',
                  code: gsNode,
                  render: (
                    <>
                      <span className="c">// 1. Scan dan dapatkan sitekey otomatis</span>{'\n'}
                      <span className="k">const</span> scanRes = <span className="k">await</span> fetch(<span className="s2">&quot;https://gerbang-turnstile.vercel.app/api/get-sitekey&quot;</span>, {'{'}{'\n'}
                      {'  '}method: <span className="s2">&quot;POST&quot;</span>,{'\n'}
                      {'  '}headers: {'{'} <span className="s2">&quot;Content-Type&quot;</span>: <span className="s2">&quot;application/json&quot;</span> {'}'},{'\n'}
                      {'  '}body: JSON.stringify({'{'} url: <span className="s2">&quot;https://target.com/login&quot;</span> {'}'}){'\n'}
                      {'}'});{'\n'}
                      <span className="k">const</span> scan = <span className="k">await</span> scanRes.json();{'\n'}
                      <span className="k">const</span> sitekey = scan.sitekeys[0]?.sitekey;{'\n\n'}
                      <span className="c">// 2. Lempar ke solver cepat</span>{'\n'}
                      <span className="k">const</span> solveRes = <span className="k">await</span> fetch(<span className="s2">&quot;https://gerbang-turnstile.vercel.app/api/turnstile&quot;</span>, {'{'}{'\n'}
                      {'  '}method: <span className="s2">&quot;POST&quot;</span>,{'\n'}
                      {'  '}headers: {'{'} <span className="s2">&quot;Content-Type&quot;</span>: <span className="s2">&quot;application/json&quot;</span> {'}'},{'\n'}
                      {'  '}body: JSON.stringify({'{'} sitekey, siteurl: <span className="s2">&quot;https://target.com/login&quot;</span> {'}'}){'\n'}
                      {'}'});{'\n'}
                      <span className="k">const</span> {'{'} token {'}'} = <span className="k">await</span> solveRes.json();
                    </>
                  ),
                },
                {
                  label: 'Python',
                  code: gsPython,
                  render: (
                    <>
                      <span className="k">import</span> requests{'\n\n'}
                      <span className="c"># 1. Scan website</span>{'\n'}
                      scan = requests.post({'\n'}
                      {'  '}<span className="s2">&quot;https://gerbang-turnstile.vercel.app/api/get-sitekey&quot;</span>,{'\n'}
                      {'  '}json={'{'}<span className="s2">&quot;url&quot;</span>: <span className="s2">&quot;https://target.com/login&quot;</span>{'}'}{'\n'}
                      ).json(){'\n'}
                      sitekey = scan[<span className="s2">&quot;sitekeys&quot;</span>][0][<span className="s2">&quot;sitekey&quot;</span>]{'\n\n'}
                      <span className="c"># 2. Selesaikan dengan sitekey tersebut</span>{'\n'}
                      solve = requests.post({'\n'}
                      {'  '}<span className="s2">&quot;https://gerbang-turnstile.vercel.app/api/turnstile&quot;</span>,{'\n'}
                      {'  '}json={'{'}<span className="s2">&quot;sitekey&quot;</span>: sitekey, <span className="s2">&quot;siteurl&quot;</span>: <span className="s2">&quot;https://target.com/login&quot;</span>{'}'}{'\n'}
                      ).json(){'\n'}
                      token = solve.get(<span className="s2">&quot;token&quot;</span>)
                    </>
                  ),
                },
              ]}
            />

            {/* ENDPOINT 3 */}
            <h2 id="ts">3. Selesaikan Cepat (Sudah Tahu Sitekey)</h2>
            <p>
              <span className="m p">POST</span>
              <code>/api/turnstile</code>
            </p>
            <p>
              <b>Kapan pakai ini?</b> Jika kamu sudah memegang nilai <code>sitekey</code>{' '}
              (misalnya <code>0x4AAAAAA...</code>). Ini adalah metode <b>paling cepat</b>{' '}
              (rata-rata 1-2 detik) karena solver langsung merender widget tanpa
              perlu membuka website target terlebih dahulu.
            </p>

            <table className="tbl">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Tipe</th>
                  <th>Wajib</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>sitekey</code></td>
                  <td>string</td>
                  <td>Ya</td>
                  <td>Sitekey widget Turnstile (awalan <code>0x</code> atau <code>1x</code>)</td>
                </tr>
                <tr>
                  <td><code>siteurl</code></td>
                  <td>string</td>
                  <td>Ya</td>
                  <td>Alamat domain / URL halaman tempat widget terpasang</td>
                </tr>
                <tr>
                  <td><code>timeout</code></td>
                  <td>number</td>
                  <td>Tidak</td>
                  <td>Batas waktu tunggu detik (default: 45)</td>
                </tr>
                <tr>
                  <td><code>action</code></td>
                  <td>string</td>
                  <td>Tidak</td>
                  <td>Nama action kustom bila situs target memakainya (mis: <code>login</code>)</td>
                </tr>
              </tbody>
            </table>

            <CopyableSnippet
              headerLabel="contoh respons sukses · 200"
              code={tsResponse}
            >
              {`{\n  `}<span className="k">&quot;success&quot;</span>: <span className="s2">true</span>,{`\n  `}<span className="k">&quot;token&quot;</span>: <span className="s2">&quot;0.4AAAAAA7xO9...q8V2&quot;</span>,{`\n  `}<span className="k">&quot;duration&quot;</span>: <span className="s2">1.42</span>{`\n}`}
            </CopyableSnippet>

            <h3 style={{ fontSize: '1.2rem', marginTop: '24px' }}>
              Kode Panggil &amp; Cara Pasang Token:
            </h3>

            <CodeTabs
              tabs={[
                {
                  label: 'Form HTML',
                  code: tsHtmlForm,
                  render: (
                    <>
                      <span className="c">&lt;!-- Masukkan token ke input hidden "cf-turnstile-response" --&gt;</span>{'\n'}
                      &lt;<span className="k">form</span> action=<span className="s2">&quot;https://target.com/login&quot;</span> method=<span className="s2">&quot;POST&quot;</span>&gt;{'\n'}
                      {'  '}&lt;<span className="k">input</span> type=<span className="s2">&quot;text&quot;</span> name=<span className="s2">&quot;email&quot;</span> value=<span className="s2">&quot;user@mail.com&quot;</span> /&gt;{'\n'}
                      {'  '}&lt;<span className="k">input</span> type=<span className="s2">&quot;password&quot;</span> name=<span className="s2">&quot;password&quot;</span> value=<span className="s2">&quot;rahasia&quot;</span> /&gt;{'\n\n'}
                      {'  '}&lt;<span className="k">input</span> type=<span className="s2">&quot;hidden&quot;</span> name=<span className="s2">&quot;cf-turnstile-response&quot;</span> value=<span className="s2">&quot;0.4AAAAAA...&quot;</span> /&gt;{'\n\n'}
                      {'  '}&lt;<span className="k">button</span> type=<span className="s2">&quot;submit&quot;</span>&gt;Masuk&lt;/<span className="k">button</span>&gt;{'\n'}
                      &lt;/<span className="k">form</span>&gt;
                    </>
                  ),
                },
                {
                  label: 'Node.js',
                  code: tsNode,
                  render: (
                    <>
                      <span className="c">// 1. Dapatkan token</span>{'\n'}
                      <span className="k">const</span> res = <span className="k">await</span> fetch(<span className="s2">&quot;https://gerbang-turnstile.vercel.app/api/turnstile&quot;</span>, {'{'}{'\n'}
                      {'  '}method: <span className="s2">&quot;POST&quot;</span>,{'\n'}
                      {'  '}headers: {'{'} <span className="s2">&quot;Content-Type&quot;</span>: <span className="s2">&quot;application/json&quot;</span> {'}'},{'\n'}
                      {'  '}body: JSON.stringify({'{'}{'\n'}
                      {'    '}sitekey: <span className="s2">&quot;0x4AAAAAA...&quot;</span>,{'\n'}
                      {'    '}siteurl: <span className="s2">&quot;https://target.com/login&quot;</span>{'\n'}
                      {'  '}{'}'}){'\n'}
                      {'}'});{'\n'}
                      <span className="k">const</span> {'{'} token {'}'} = <span className="k">await</span> res.json();{'\n\n'}
                      <span className="c">// 2. Kirim ke API login target</span>{'\n'}
                      <span className="k">await</span> fetch(<span className="s2">&quot;https://target.com/api/login&quot;</span>, {'{'}{'\n'}
                      {'  '}method: <span className="s2">&quot;POST&quot;</span>,{'\n'}
                      {'  '}headers: {'{'} <span className="s2">&quot;Content-Type&quot;</span>: <span className="s2">&quot;application/json&quot;</span> {'}'},{'\n'}
                      {'  '}body: JSON.stringify({'{'}{'\n'}
                      {'    '}email: <span className="s2">&quot;user@mail.com&quot;</span>,{'\n'}
                      {'    '}<span className="s2">&quot;cf-turnstile-response&quot;</span>: token <span className="c">// &lt;-- pasang di sini</span>{'\n'}
                      {'  '}{'}'}){'\n'}
                      {'}'});
                    </>
                  ),
                },
                {
                  label: 'Python',
                  code: tsPython,
                  render: (
                    <>
                      <span className="k">import</span> requests{'\n\n'}
                      <span className="c"># 1. Dapatkan token solver</span>{'\n'}
                      solve = requests.post({'\n'}
                      {'  '}<span className="s2">&quot;https://gerbang-turnstile.vercel.app/api/turnstile&quot;</span>,{'\n'}
                      {'  '}json={'{'}{'\n'}
                      {'    '}<span className="s2">&quot;sitekey&quot;</span>: <span className="s2">&quot;0x4AAAAAA...&quot;</span>,{'\n'}
                      {'    '}<span className="s2">&quot;siteurl&quot;</span>: <span className="s2">&quot;https://target.com/login&quot;</span>{'\n'}
                      {'  '}{'}'}{'\n'}
                      ).json(){'\n'}
                      token = solve.get(<span className="s2">&quot;token&quot;</span>){'\n\n'}
                      <span className="c"># 2. Kirim login bersama token</span>{'\n'}
                      res = requests.post({'\n'}
                      {'  '}<span className="s2">&quot;https://target.com/login&quot;</span>,{'\n'}
                      {'  '}data={'{'}{'\n'}
                      {'    '}<span className="s2">&quot;email&quot;</span>: <span className="s2">&quot;user@mail.com&quot;</span>,{'\n'}
                      {'    '}<span className="s2">&quot;cf-turnstile-response&quot;</span>: token  <span className="c"># &lt;-- pasang di sini</span>{'\n'}
                      {'  '}{'}'}{'\n'}
                      ){'\n'}
                      print(<span className="s2">&quot;Status:&quot;</span>, res.status_code)
                    </>
                  ),
                },
                {
                  label: 'cURL',
                  code: tsCurl,
                  render: (
                    <>
                      <span className="c"># Kirim sitekey dan siteurl</span>{'\n'}
                      curl -X POST https://gerbang-turnstile.vercel.app/api/turnstile \{'\n'}
                      {'  '}-H <span className="s2">&quot;Content-Type: application/json&quot;</span> \{'\n'}
                      {'  '}-d <span className="s2">&apos;{`{"sitekey":"1x00000000000000000000AA","siteurl":"https://challenges.cloudflare.com","timeout":45}`}</span>&apos;
                    </>
                  ),
                },
              ]}
            />

            {/* ENDPOINT 4 */}
            <h2 id="gh">4. Cek Status Server (Health Check)</h2>
            <p>
              <span className="m">GET</span>
              <code>/api/health</code>
            </p>
            <p>
              Gunakan endpoint ini untuk memastikan koneksi antara Vercel dan
              mesin backend Railway aktif sebelum memulai antrean otomatis.
            </p>

            <CodeTabs
              tabs={[
                {
                  label: 'cURL',
                  code: healthCurl,
                  render: (
                    <>
                      curl -X GET https://gerbang-turnstile.vercel.app/api/health
                    </>
                  ),
                },
              ]}
            />

            <CopyableSnippet
              headerLabel="contoh respons · 200 OK"
              code={healthResponse}
            >
              {`{\n  `}<span className="k">&quot;status&quot;</span>: <span className="s2">&quot;healthy&quot;</span>,{`\n  `}<span className="k">&quot;railwayConnected&quot;</span>: <span className="s2">true</span>,{`\n  `}<span className="k">&quot;backendStatus&quot;</span>: <span className="s2">200</span>{`\n}`}
            </CopyableSnippet>

            {/* REFERENSI */}
            <h2 id="er">Kode Status &amp; Error</h2>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Kode HTTP</th>
                  <th>Arti</th>
                  <th>Solusi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>200 OK</code></td>
                  <td>Berhasil dipecahkan</td>
                  <td>Gunakan nilai <code>token</code> untuk form login target</td>
                </tr>
                <tr>
                  <td><code>400 Bad Request</code></td>
                  <td>Parameter kurang</td>
                  <td>Cek kembali URL target atau sitekey yang dikirim</td>
                </tr>
                <tr>
                  <td><code>429 Too Many Requests</code></td>
                  <td>Antrean sibuk</td>
                  <td>
                    Slot Chrome backend sedang dipakai request lain. Tunggu beberapa
                    detik lalu coba kembali.
                  </td>
                </tr>
                <tr>
                  <td><code>500 / 502 Error</code></td>
                  <td>Batas waktu habis (Timeout)</td>
                  <td>
                    Widget Turnstile tidak merespons dalam batas detik yang ditentukan.
                    Coba naikkan parameter <code>timeout</code>.
                  </td>
                </tr>
              </tbody>
            </table>

            <h2 id="rl">Antrean &amp; Batas Kecepatan</h2>
            <p>
              Backend berjalan dengan sistem antrean pintar untuk memastikan
              penggunaan memori RAM stabil. Setiap request browser diproses
              bergantian agar server tidak kehabisan memori (*out of memory*).
            </p>
            <p>
              Jika ada 2 request bersamaan, request kedua akan menunggu di antrean
              hingga maksimal 45 detik. Jika antrean penuh, server akan menjawab
              dengan pesan <code>Browser busy</code> agar script kamu bisa
              melakukan jeda sebelum mencoba lagi.
            </p>
          </article>
        </div>
        <Footer />
      </main>
      <ScrollReveal />
    </>
  );
}
