require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const solveRoute = require('./routes/solve');
const healthRoute = require('./routes/health');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;
console.log(`[boot] PORT env=${process.env.PORT} -> listen ${PORT}`);

// Disable strict CSP so Next.js inline scripts & Google Fonts load cleanly
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api', solveRoute);
app.use('/api', healthRoute);

// API Information route (previously at /)
app.get('/api', (req, res) => {
  res.json({
    name: 'Gerbang — Turnstile Solver & CaptchaX API',
    version: '5.1.1',
    browser: require('./services/browserLock').browserSlotStatus(),
    endpoints: {
      'POST /api/turnstile': 'Solve Turnstile (min, fake page, optional action)',
      'POST /api/turnstile-max': 'Solve Turnstile on real page URL',
      'POST /api/captchav3': 'Solve reCAPTCHA v3 (no browser)',
      'POST /api/altcha': 'Solve Altcha PoW (challenge JSON or challengeurl)',
      'POST /api/friendly': 'Solve FriendlyCaptcha PoW (official solver)',
      'POST /api/hcaptcha': 'Solve hCaptcha checkbox (best-effort)',
      'POST /api/aliyun': 'Solve Aliyun Captcha 2.0 (sceneId+prefix, best-effort)',
      'POST /api/aliyun-extract': 'Extract Aliyun sceneId+prefix+region from target page URL',
      'POST /api/cloudflare': 'Bypass Cloudflare challenge (cf_clearance)',
      'POST /api/kasada': 'Capture Kasada PoW headers+cookies (x-kpsdk-ct/cd, best-effort)',
      'POST /api/waf-session': 'Get WAF session cookies + headers',
      'POST /api/source': 'Get rendered page HTML source',
      'POST /api/get-sitekey': 'Detect & classify captcha sitekeys from target URL',
      'GET /api/health': 'Health check'
    }
  });
});

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Serve static frontend files from Next.js export (out/)
const outDir = path.join(process.cwd(), 'out');
app.use(express.static(outDir));

app.get('/dokumentasi', (req, res, next) => {
  const dokPath = path.join(outDir, 'dokumentasi.html');
  if (fs.existsSync(dokPath)) return res.sendFile(dokPath);
  const dokNested = path.join(outDir, 'dokumentasi', 'index.html');
  if (fs.existsSync(dokNested)) return res.sendFile(dokNested);
  next();
});

// Fallback to out/index.html for SPA/frontend routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(outDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

process.on('uncaughtException', (e) => console.error('[fatal] uncaught:', e.message));
process.on('unhandledRejection', (e) => console.error('[fatal] unhandled:', e?.message || e));

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Gerbang Turnstile Solver running on port ${PORT}`);
});
server.on('error', (e) => { console.error('[fatal] listen:', e.message); process.exit(1); });

module.exports = app;
