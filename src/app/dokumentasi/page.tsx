import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DocsScrollSpy from '@/components/DocsScrollSpy';
import CodeTabs from '@/components/CodeTabs';
import CopyableSnippet from '@/components/CopyableSnippet';
import ScrollReveal from '@/components/ScrollReveal';

export default function DokumentasiPage() {
  const curlCode = `# selesaikan turnstile standalone
curl -X POST https://gerbang-turnstile.vercel.app/api/turnstile \\
  -H "Content-Type: application/json" \\
  -d '{"sitekey":"1x00000000000000000000AA","siteurl":"https://challenges.cloudflare.com","timeout":45}'`;

  const nodeCode = `const res = await fetch("https://gerbang-turnstile.vercel.app/api/turnstile", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sitekey: "1x00000000000000000000AA",
    siteurl: "https://challenges.cloudflare.com",
    timeout: 45
  })
});
const data = await res.json();
console.log(data.token);`;

  const pythonCode = `import requests

res = requests.post(
  "https://gerbang-turnstile.vercel.app/api/turnstile",
  json={
    "sitekey": "1x00000000000000000000AA",
    "siteurl": "https://challenges.cloudflare.com",
    "timeout": 45
  }
)
data = res.json()
print(data.get("token"))`;

  const turnstileResponse = `{
  "success": true,
  "token": "0.4AAAAAA7xO9...q8V2",
  "duration": 1.42
}`;

  const turnstileMaxResponse = `{
  "success": true,
  "token": "0.4AAAAAA8yP1...w9X3",
  "duration": 5.18
}`;

  const healthResponse = `{
  "status": "healthy",
  "memory": {
    "rss": "128MB",
    "heapTotal": "48MB"
  },
  "uptime": 3600
}`;

  const htmlInstallCode = `<!-- Sisipkan token hasil solver ke input form target -->
<form action="https://target.com/login" method="POST">
  <input type="text" name="username" value="user@example.com" />
  <input type="password" name="password" value="rahasia123" />

  <!-- Field wajib Cloudflare Turnstile -->
  <input type="hidden" name="cf-turnstile-response" value="0.4AAAAAA..." />

  <button type="submit">Kirim Form</button>
</form>`;

  const nodeFullFlowCode = `// 1. Dapatkan token dari endpoint solver
const solveRes = await fetch("https://gerbang-turnstile.vercel.app/api/turnstile", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sitekey: "0x4AAAAAA...",
    siteurl: "https://target.com"
  })
});
const { token } = await solveRes.json();

// 2. Kirim request ke backend situs target dengan field cf-turnstile-response
const targetRes = await fetch("https://target.com/api/submit", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    username: "user@example.com",
    password: "secretpassword",
    "cf-turnstile-response": token // Pasang token di sini
  })
});

console.log("Status respons target:", targetRes.status);`;

  const pythonFullFlowCode = `import requests

# 1. Panggil solver untuk memecahkan Turnstile
solve = requests.post(
  "https://gerbang-turnstile.vercel.app/api/turnstile",
  json={
    "sitekey": "0x4AAAAAA...",
    "siteurl": "https://target.com"
  }
).json()
token = solve.get("token")

# 2. Kirim formulir ke server target beserta token Turnstile
session = requests.Session()
response = session.post(
  "https://target.com/login",
  data={
    "username": "user@example.com",
    "password": "mypassword",
    "cf-turnstile-response": token # Pasang token di sini
  }
)

print("Status respons target:", response.status_code)`;

  const automationCode = `// Automasi Browser (Puppeteer / Playwright)
// Injeksi token langsung ke elemen form Turnstile dan picu event
await page.evaluate((solvedToken) => {
  // Isi input atau textarea tersembunyi
  const el = document.querySelector('[name="cf-turnstile-response"]') 
    || document.querySelector('#cf-turnstile-response');
  if (el) {
    el.value = solvedToken;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Jika widget memanggil callback onSuccess kustom
  if (window.onTurnstileSuccess) {
    window.onTurnstileSuccess(solvedToken);
  }
}, token);`;

  return (
    <>
      <Navbar />
      <main id="docs">
        <div className="wrap dg">
          <DocsScrollSpy />
          <article className="doc">
            <div className="live">
              <i className="dot" />
              API v1 · semua sistem normal · CaptchaX Engine
            </div>
            <h1 style={{ marginTop: '14px' }}>Dokumentasi API Solver</h1>
            <p>
              Selesaikan tantangan Cloudflare Turnstile melalui REST API yang
              terhubung langsung ke instance CaptchaX Railway Anda.
            </p>

            <h2 id="qs">Mulai cepat</h2>
            <p>
              Kirim permintaan dengan <code>sitekey</code> dan{' '}
              <code>siteurl</code> halaman target. Solver akan memecahkan widget
              dan mengembalikan <code>token</code> valid.
            </p>

            <CodeTabs
              tabs={[
                {
                  label: 'curl',
                  code: curlCode,
                  render: (
                    <>
                      <span className="c"># selesaikan turnstile standalone</span>
                      <br />
                      curl -X POST https://gerbang-turnstile.vercel.app/api/turnstile \{'\n'}
                      {'  '}-H <span className="s2">&quot;Content-Type: application/json&quot;</span> \{'\n'}
                      {'  '}-d <span className="s2">&apos;{`{"sitekey":"1x00000000000000000000AA","siteurl":"https://challenges.cloudflare.com","timeout":45}`}</span>&apos;
                    </>
                  ),
                },
                {
                  label: 'Node',
                  code: nodeCode,
                  render: (
                    <>
                      <span className="k">const</span> res = <span className="k">await</span> fetch(<span className="s2">&quot;https://gerbang-turnstile.vercel.app/api/turnstile&quot;</span>, {'{'}{'\n'}
                      {'  '}method: <span className="s2">&quot;POST&quot;</span>,{'\n'}
                      {'  '}headers: {'{'} <span className="s2">&quot;Content-Type&quot;</span>: <span className="s2">&quot;application/json&quot;</span> {'}'},{'\n'}
                      {'  '}body: JSON.stringify({'{'}{'\n'}
                      {'    '}sitekey: <span className="s2">&quot;1x00000000000000000000AA&quot;</span>,{'\n'}
                      {'    '}siteurl: <span className="s2">&quot;https://challenges.cloudflare.com&quot;</span>,{'\n'}
                      {'    '}timeout: 45{'\n'}
                      {'  '}{'}'}){'\n'}
                      {'}'});{'\n'}
                      <span className="k">const</span> data = <span className="k">await</span> res.json();{'\n'}
                      console.log(data.token);
                    </>
                  ),
                },
                {
                  label: 'Python',
                  code: pythonCode,
                  render: (
                    <>
                      <span className="k">import</span> requests{'\n\n'}
                      res = requests.post({'\n'}
                      {'  '}<span className="s2">&quot;https://gerbang-turnstile.vercel.app/api/turnstile&quot;</span>,{'\n'}
                      {'  '}json={'{'}{'\n'}
                      {'    '}<span className="s2">&quot;sitekey&quot;</span>: <span className="s2">&quot;1x00000000000000000000AA&quot;</span>,{'\n'}
                      {'    '}<span className="s2">&quot;siteurl&quot;</span>: <span className="s2">&quot;https://challenges.cloudflare.com&quot;</span>,{'\n'}
                      {'    '}<span className="s2">&quot;timeout&quot;</span>: 45{'\n'}
                      {'  '}{'}'}{'\n'}
                      ){'\n'}
                      data = res.json(){'\n'}
                      print(data.get(<span className="s2">&quot;token&quot;</span>))
                    </>
                  ),
                },
              ]}
            />

            <h2 id="tk">Kunci uji (Test keys)</h2>
            <p>
              Cloudflare menyediakan test sitekeys resmi untuk memverifikasi
              solver tanpa batas limit:
            </p>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Sitekey</th>
                  <th>Perilaku</th>
                  <th>Hasil</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>1x00000000000000000000AA</code></td>
                  <td>Selalu lolos (Always passes)</td>
                  <td>Mengembalikan token dummy cepat</td>
                </tr>
                <tr>
                  <td><code>2x00000000000000000000AB</code></td>
                  <td>Selalu blokir (Always blocks)</td>
                  <td>Menolak verifikasi</td>
                </tr>
                <tr>
                  <td><code>3x00000000000000000000FF</code></td>
                  <td>Interactive challenge</td>
                  <td>Memicu puzzle interaktif</td>
                </tr>
              </tbody>
            </table>

            <h2 id="cp">Cara pasang token</h2>
            <p>
              Setelah menerima <code>token</code> dari solver, Anda harus
              memasukkannya ke dalam parameter request yang dikirim ke server
              target. Secara standar, Cloudflare Turnstile membaca token dari
              field <code>cf-turnstile-response</code>.
            </p>

            <CodeTabs
              tabs={[
                {
                  label: 'Form HTML',
                  code: htmlInstallCode,
                  render: (
                    <>
                      <span className="c">&lt;!-- Sisipkan token hasil solver ke input form target --&gt;</span>{'\n'}
                      &lt;<span className="k">form</span> action=<span className="s2">&quot;https://target.com/login&quot;</span> method=<span className="s2">&quot;POST&quot;</span>&gt;{'\n'}
                      {'  '}&lt;<span className="k">input</span> type=<span className="s2">&quot;text&quot;</span> name=<span className="s2">&quot;username&quot;</span> value=<span className="s2">&quot;user@example.com&quot;</span> /&gt;{'\n'}
                      {'  '}&lt;<span className="k">input</span> type=<span className="s2">&quot;password&quot;</span> name=<span className="s2">&quot;password&quot;</span> value=<span className="s2">&quot;rahasia123&quot;</span> /&gt;{'\n\n'}
                      {'  '}<span className="c">&lt;!-- Field wajib Cloudflare Turnstile --&gt;</span>{'\n'}
                      {'  '}&lt;<span className="k">input</span> type=<span className="s2">&quot;hidden&quot;</span> name=<span className="s2">&quot;cf-turnstile-response&quot;</span> value=<span className="s2">&quot;0.4AAAAAA...&quot;</span> /&gt;{'\n\n'}
                      {'  '}&lt;<span className="k">button</span> type=<span className="s2">&quot;submit&quot;</span>&gt;Kirim Form&lt;/<span className="k">button</span>&gt;{'\n'}
                      &lt;/<span className="k">form</span>&gt;
                    </>
                  ),
                },
                {
                  label: 'Node (Full Flow)',
                  code: nodeFullFlowCode,
                  render: (
                    <>
                      <span className="c">// 1. Dapatkan token dari endpoint solver</span>{'\n'}
                      <span className="k">const</span> solveRes = <span className="k">await</span> fetch(<span className="s2">&quot;https://gerbang-turnstile.vercel.app/api/turnstile&quot;</span>, {'{'}{'\n'}
                      {'  '}method: <span className="s2">&quot;POST&quot;</span>,{'\n'}
                      {'  '}headers: {'{'} <span className="s2">&quot;Content-Type&quot;</span>: <span className="s2">&quot;application/json&quot;</span> {'}'},{'\n'}
                      {'  '}body: JSON.stringify({'{'}{'\n'}
                      {'    '}sitekey: <span className="s2">&quot;0x4AAAAAA...&quot;</span>,{'\n'}
                      {'    '}siteurl: <span className="s2">&quot;https://target.com&quot;</span>{'\n'}
                      {'  '}{'}'}){'\n'}
                      {'}'});{'\n'}
                      <span className="k">const</span> {'{'} token {'}'} = <span className="k">await</span> solveRes.json();{'\n\n'}
                      <span className="c">// 2. Kirim request ke backend situs target bersama token</span>{'\n'}
                      <span className="k">const</span> targetRes = <span className="k">await</span> fetch(<span className="s2">&quot;https://target.com/api/submit&quot;</span>, {'{'}{'\n'}
                      {'  '}method: <span className="s2">&quot;POST&quot;</span>,{'\n'}
                      {'  '}headers: {'{'} <span className="s2">&quot;Content-Type&quot;</span>: <span className="s2">&quot;application/x-www-form-urlencoded&quot;</span> {'}'},{'\n'}
                      {'  '}body: <span className="k">new</span> URLSearchParams({'{'}{'\n'}
                      {'    '}username: <span className="s2">&quot;user@example.com&quot;</span>,{'\n'}
                      {'    '}password: <span className="s2">&quot;secretpassword&quot;</span>,{'\n'}
                      {'    '}<span className="s2">&quot;cf-turnstile-response&quot;</span>: token <span className="c">// Pasang token di sini</span>{'\n'}
                      {'  '}{'}'}){'\n'}
                      {'}'});{'\n\n'}
                      console.log(<span className="s2">&quot;Status respons target:&quot;</span>, targetRes.status);
                    </>
                  ),
                },
                {
                  label: 'Python (Full Flow)',
                  code: pythonFullFlowCode,
                  render: (
                    <>
                      <span className="k">import</span> requests{'\n\n'}
                      <span className="c"># 1. Panggil solver untuk memecahkan Turnstile</span>{'\n'}
                      solve = requests.post({'\n'}
                      {'  '}<span className="s2">&quot;https://gerbang-turnstile.vercel.app/api/turnstile&quot;</span>,{'\n'}
                      {'  '}json={'{'}{'\n'}
                      {'    '}<span className="s2">&quot;sitekey&quot;</span>: <span className="s2">&quot;0x4AAAAAA...&quot;</span>,{'\n'}
                      {'    '}<span className="s2">&quot;siteurl&quot;</span>: <span className="s2">&quot;https://target.com&quot;</span>{'\n'}
                      {'  '}{'}'}{'\n'}
                      ).json(){'\n'}
                      token = solve.get(<span className="s2">&quot;token&quot;</span>){'\n\n'}
                      <span className="c"># 2. Kirim formulir ke server target beserta token Turnstile</span>{'\n'}
                      session = requests.Session(){'\n'}
                      response = session.post({'\n'}
                      {'  '}<span className="s2">&quot;https://target.com/login&quot;</span>,{'\n'}
                      {'  '}data={'{'}{'\n'}
                      {'    '}<span className="s2">&quot;username&quot;</span>: <span className="s2">&quot;user@example.com&quot;</span>,{'\n'}
                      {'    '}<span className="s2">&quot;password&quot;</span>: <span className="s2">&quot;mypassword&quot;</span>,{'\n'}
                      {'    '}<span className="s2">&quot;cf-turnstile-response&quot;</span>: token <span className="c"># Pasang token di sini</span>{'\n'}
                      {'  '}{'}'}{'\n'}
                      ){'\n\n'}
                      print(<span className="s2">&quot;Status respons target:&quot;</span>, response.status_code)
                    </>
                  ),
                },
                {
                  label: 'Browser Automation',
                  code: automationCode,
                  render: (
                    <>
                      <span className="c">// Automasi Browser (Puppeteer / Playwright)</span>{'\n'}
                      <span className="c">// Injeksi token langsung ke DOM dan picu event</span>{'\n'}
                      <span className="k">await</span> page.evaluate((solvedToken) =&gt; {'{'}{'\n'}
                      {'  '}<span className="k">const</span> el = document.querySelector(<span className="s2">&apos;[name=&quot;cf-turnstile-response&quot;]&apos;</span>){'\n'}
                      {'    '}|| document.querySelector(<span className="s2">&apos;#cf-turnstile-response&apos;</span>);{'\n'}
                      {'  '}<span className="k">if</span> (el) {'{'}{'\n'}
                      {'    '}el.value = solvedToken;{'\n'}
                      {'    '}el.dispatchEvent(<span className="k">new</span> Event(<span className="s2">&apos;input&apos;</span>, {'{'} bubbles: <span className="k">true</span> {'}'}));{'\n'}
                      {'    '}el.dispatchEvent(<span className="k">new</span> Event(<span className="s2">&apos;change&apos;</span>, {'{'} bubbles: <span className="k">true</span> {'}'}));{'\n'}
                      {'  '}{'}'}{'\n\n'}
                      {'  '}<span className="k">if</span> (window.onTurnstileSuccess) {'{'}{'\n'}
                      {'    '}window.onTurnstileSuccess(solvedToken);{'\n'}
                      {'  '}{'}'}{'\n'}
                      {'}'}, token);
                    </>
                  ),
                },
              ]}
            />

            <h2 id="ts">/api/turnstile</h2>
            <p>
              <span className="m p">POST</span>
              <code>/api/turnstile</code>
            </p>
            <p>
              Menyelesaikan Turnstile mandiri via render fake page. Mode paling
              cepat dan efisien.
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
                  <td>URL halaman tempat widget Turnstile dipasang</td>
                </tr>
                <tr>
                  <td><code>timeout</code></td>
                  <td>int</td>
                  <td>Tidak</td>
                  <td>Batas waktu tunggu dalam detik (default: 45)</td>
                </tr>
                <tr>
                  <td><code>action</code></td>
                  <td>string</td>
                  <td>Tidak</td>
                  <td>Parameter custom action Turnstile (misal: <code>login</code>)</td>
                </tr>
              </tbody>
            </table>

            <CopyableSnippet
              headerLabel="respons · 200 OK"
              code={turnstileResponse}
            >
              {`{\n  `}<span className="k">&quot;success&quot;</span>: <span className="s2">true</span>,{`\n  `}<span className="k">&quot;token&quot;</span>: <span className="s2">&quot;0.4AAAAAA7xO9...q8V2&quot;</span>,{`\n  `}<span className="k">&quot;duration&quot;</span>: <span className="s2">1.42</span>{`\n}`}
            </CopyableSnippet>

            <h2 id="tm">/api/turnstile-max</h2>
            <p>
              <span className="m p">POST</span>
              <code>/api/turnstile-max</code>
            </p>
            <p>
              Menyelesaikan Turnstile yang tertanam langsung di halaman asli
              target. Browser mengunjungi URL target dan mengklik widget bila
              diperlukan.
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
                  <td>URL lengkap halaman asli yang memuat Turnstile</td>
                </tr>
                <tr>
                  <td><code>timeout</code></td>
                  <td>int</td>
                  <td>Tidak</td>
                  <td>Batas waktu tunggu dalam detik (default: 60)</td>
                </tr>
              </tbody>
            </table>

            <CopyableSnippet
              headerLabel="respons · 200 OK"
              code={turnstileMaxResponse}
            >
              {`{\n  `}<span className="k">&quot;success&quot;</span>: <span className="s2">true</span>,{`\n  `}<span className="k">&quot;token&quot;</span>: <span className="s2">&quot;0.4AAAAAA8yP1...w9X3&quot;</span>,{`\n  `}<span className="k">&quot;duration&quot;</span>: <span className="s2">5.18</span>{`\n}`}
            </CopyableSnippet>

            <h2 id="gh">/api/health</h2>
            <p>
              <span className="m">GET</span>
              <code>/api/health</code>
            </p>
            <p>
              Mengecek statistik memori RAM, CPU, dan kesiapan antrean browser
              pada instance backend.
            </p>

            <CopyableSnippet
              headerLabel="respons · 200 OK"
              code={healthResponse}
            >
              {`{\n  `}<span className="k">&quot;status&quot;</span>: <span className="s2">&quot;healthy&quot;</span>,{`\n  `}<span className="k">&quot;memory&quot;</span>: {'{'} <span className="k">&quot;rss&quot;</span>: <span className="s2">&quot;128MB&quot;</span> {'}'},{`\n  `}<span className="k">&quot;uptime&quot;</span>: <span className="s2">3600</span>{`\n}`}
            </CopyableSnippet>

            <h2 id="er">Kode error</h2>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Arti</th>
                  <th>Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>200</code></td>
                  <td>Berhasil</td>
                  <td>Token valid siap digunakan pada form target</td>
                </tr>
                <tr>
                  <td><code>400</code></td>
                  <td>Parameter salah</td>
                  <td>Periksa <code>sitekey</code> dan <code>siteurl</code></td>
                </tr>
                <tr>
                  <td><code>429</code></td>
                  <td>Batas laju / Browser sibuk</td>
                  <td>
                    Slot browser sedang penuh (antre 1 proses Chrome) atau melebihi limit per IP
                  </td>
                </tr>
                <tr>
                  <td><code>500 / 502</code></td>
                  <td>Solver timeout / Backend error</td>
                  <td>
                    Tantangan Cloudflare gagal diselesaikan sebelum batas timeout
                  </td>
                </tr>
              </tbody>
            </table>

            <h2 id="rl">Batas laju &amp; antrean</h2>
            <p>
              Secara bawaan di Railway, CaptchaX menerapkan antrean slot browser
              global (hanya 1 proses Chrome dalam satu waktu) untuk menjaga
              stabilitas RAM 1GB dan mencegah crash OOM.
            </p>
            <p>
              Bila ada permintaan bersamaan, request berikutnya menunggu maksimal{' '}
              <code>45 detik</code> hingga slot tersedia sebelum mengembalikan
              status <code>Browser busy</code>.
            </p>
          </article>
        </div>
        <Footer />
      </main>
      <ScrollReveal />
    </>
  );
}
