const fs = require("fs");
const path = require("path");
const { BrowserService, parseProxy } = require("./browser");

class BypassService {
  constructor(browserService) {
    this.browserService = browserService;
    this.fakePageContent = null;
    this.loadFakePage();
  }

  loadFakePage() {
    try {
      const candidates = [
        path.join(__dirname, "assets", "fakePage.html"),
        path.join(process.cwd(), "src", "assets", "fakePage.html"),
        path.join(process.cwd(), "assets", "fakePage.html"),
      ];
      let fakePagePath = candidates.find((p) => fs.existsSync(p)) || candidates[0];

      const assetsDir = path.dirname(fakePagePath);
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }

      if (!fs.existsSync(fakePagePath)) {
        this.fakePageContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloudflare Turnstile</title>
    <style>
        body { margin: 0; padding: 20px; background: #fff; }
        .turnstile { min-height: 65px; min-width: 300px; }
    </style>
</head>
<body>
    <div class="turnstile"></div>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback" defer></script>
    <script>
        window.onloadTurnstileCallback = function () {
            try {
                turnstile.render('.turnstile', {
                    sitekey: '<site-key>',
                    callback: function (token) {
                        var c = document.createElement('input');
                        c.type = 'hidden';
                        c.name = 'cf-response';
                        c.value = token;
                        document.body.appendChild(c);
                    },
                    'error-callback': function (code) {
                        var c = document.createElement('input');
                        c.type = 'hidden';
                        c.name = 'cf-error';
                        c.value = code || 'turnstile_error';
                        document.body.appendChild(c);
                    }
                });
            } catch (err) {
                var c = document.createElement('input');
                c.type = 'hidden';
                c.name = 'cf-error';
                c.value = err.message || 'render_exception';
                document.body.appendChild(c);
            }
        };
    </script>
</body>
</html>`;
        fs.writeFileSync(fakePagePath, this.fakePageContent);
      } else {
        this.fakePageContent = fs.readFileSync(fakePagePath, "utf-8");
      }
    } catch (error) {
      this.fakePageContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cloudflare Turnstile</title>
    <style>
        body { margin: 0; padding: 20px; background: #fff; }
        .turnstile { min-height: 65px; min-width: 300px; }
    </style>
</head>
<body>
    <div class="turnstile"></div>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback" defer></script>
    <script>
        window.onloadTurnstileCallback = function () {
            try {
                turnstile.render('.turnstile', {
                    sitekey: '<site-key>',
                    callback: function (token) {
                        var c = document.createElement('input');
                        c.type = 'hidden';
                        c.name = 'cf-response';
                        c.value = token;
                        document.body.appendChild(c);
                    },
                    'error-callback': function (code) {
                        var c = document.createElement('input');
                        c.type = 'hidden';
                        c.name = 'cf-error';
                        c.value = code || 'turnstile_error';
                        document.body.appendChild(c);
                    }
                });
            } catch (err) {
                var c = document.createElement('input');
                c.type = 'hidden';
                c.name = 'cf-error';
                c.value = err.message || 'render_exception';
                document.body.appendChild(c);
            }
        };
    </script>
</body>
</html>`;
    }
  }

  async wafSession(url, proxy, timeout = 60000) {
    const startTime = Date.now();
    try {
      if (!url) {
        throw new Error("Missing url parameter");
      }

      const result = await this.browserService.withBrowserContext(async (context) => {
        const page = await context.newPage();
        await page.setDefaultTimeout(30000);
        await page.setDefaultNavigationTimeout(30000);

        const parsedProxy = parseProxy(proxy);
        if (parsedProxy?.username && parsedProxy?.password) {
          try {
            await page.authenticate({
              username: parsedProxy.username,
              password: parsedProxy.password,
            });
          } catch (e) {}
        }

        const acceptLanguage = await this.findAcceptLanguage(page);
        await page.setRequestInterception(true);

        let resolved = false;
        return new Promise((resolve, reject) => {
          const timeoutHandler = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              reject(new Error("Timeout Error"));
            }
          }, timeout);

          page.on("request", async (request) => {
            try {
              await request.continue();
            } catch (e) {}
          });

          page.on("response", async (res) => {
            try {
              if (!resolved && [200, 302].includes(res.status()) && [url, url + "/"].includes(res.url())) {
                await page.waitForNavigation({ waitUntil: "load", timeout: 5000 }).catch(() => {});
                const cookies = await page.cookies();
                const headers = await res.request().headers();
                delete headers["content-type"];
                delete headers["accept-encoding"];
                delete headers["accept"];
                delete headers["content-length"];
                headers["accept-language"] = acceptLanguage;
                resolved = true;
                clearTimeout(timeoutHandler);
                resolve({ cookies, headers });
              }
            } catch (error) {
              if (!resolved) {
                resolved = true;
                clearTimeout(timeoutHandler);
                reject(error);
              }
            }
          });

          page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 }).catch((error) => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeoutHandler);
              reject(error);
            }
          });
        });
      });

      return {
        success: true,
        data: result,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Unknown error",
        duration: Date.now() - startTime,
      };
    }
  }

  async waitForTurnstileToken(page, timeoutMs = 60000) {
    const deadline = Date.now() + timeoutMs;
    let ticks = 0;

    while (Date.now() < deadline) {
      // 1. Check if token or error is present in DOM
      const result = await page
        .evaluate(() => {
          try {
            const resp = document.querySelector('[name="cf-response"]');
            if (resp && resp.value && resp.value.length > 10) {
              return { type: "token", value: resp.value };
            }
            const err = document.querySelector('[name="cf-error"]');
            if (err && err.value) {
              return { type: "error", value: err.value };
            }
            if (window.turnstile && typeof window.turnstile.getResponse === "function") {
              const t = window.turnstile.getResponse();
              if (t && t.length > 10) return { type: "token", value: t };
            }
          } catch (e) {}
          return null;
        })
        .catch(() => null);

      if (result) {
        if (result.type === "token") {
          return result.value;
        }
        if (result.type === "error") {
          throw new Error(`Turnstile failed: ${result.value}`);
        }
      }

      // 2. Try clicking interactive checkbox if presented
      ticks++;
      if (ticks >= 2) {
        try {
          const frames = page.frames();
          const cfFrame = frames.find((f) => {
            try {
              return f.url().includes("challenges.cloudflare.com");
            } catch (e) {
              return false;
            }
          });

          if (cfFrame) {
            const cb = await cfFrame.$('input[type="checkbox"]').catch(() => null);
            if (cb) {
              const box = await cb.boundingBox().catch(() => null);
              if (box) {
                await cb.click().catch(() => {});
              }
            } else {
              const el = await cfFrame
                .$('label, #challenge-stage, .ctp-checkbox-label, body')
                .catch(() => null);
              if (el) {
                const box = await el.boundingBox().catch(() => null);
                if (box && box.width > 0) {
                  await el.click().catch(() => {});
                }
              }
            }
          }

          // Fallback: click bounding box of the iframe directly on main page
          const iframeEl = await page
            .$('iframe[src*="challenges.cloudflare.com"]')
            .catch(() => null);
          if (iframeEl) {
            const box = await iframeEl.boundingBox().catch(() => null);
            if (box && box.width > 0 && box.height > 0) {
              const clickX = box.x + Math.min(28, Math.floor(box.width / 2));
              const clickY = box.y + Math.floor(box.height / 2);
              await page.mouse.click(clickX, clickY).catch(() => {});
            }
          }
        } catch (e) {
          // ignore click errors during loop
        }
      }

      await new Promise((r) => setTimeout(r, 1000));
    }

    throw new Error(`Timeout waiting for turnstile token (${timeoutMs}ms exceeded)`);
  }

  async solveTurnstileMin(url, siteKey, proxy, timeout = 60000, opts = {}) {
    const startTime = Date.now();
    try {
      if (!url || !siteKey) {
        throw new Error("Missing url or siteKey parameter");
      }

      const action = opts && opts.action
        ? String(opts.action).replace(/[^a-zA-Z0-9 _-]/g, "").slice(0, 64)
        : "";
      let html = this.fakePageContent.replace(/<site-key>/g, siteKey);
      if (action) {
        html = html.replace(
          `sitekey: '${siteKey}',`,
          `sitekey: '${siteKey}',\n                action: '${action}',`
        );
      }

      const token = await this.browserService.withBrowserContext(async (context) => {
        const page = await context.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
        );
        await page.evaluateOnNewDocument(() => {
          Object.defineProperty(navigator, 'platform', { get: () => 'Win32' });
          Object.defineProperty(navigator, 'vendor', { get: () => 'Google Inc.' });
        });

        const parsedProxy = parseProxy(proxy);
        if (parsedProxy?.username && parsedProxy?.password) {
          try {
            await page.authenticate({
              username: parsedProxy.username,
              password: parsedProxy.password,
            });
          } catch (e) {}
        }

        await page.setRequestInterception(true);

        page.on("request", async (request) => {
          if ([url, url + "/"].includes(request.url()) && request.resourceType() === "document") {
            await request.respond({
              status: 200,
              contentType: "text/html",
              body: html,
            });
          } else {
            await request.continue();
          }
        });

        await page.goto(url, {
          waitUntil: "domcontentloaded",
        });

        return await this.waitForTurnstileToken(page, timeout);
      });

      if (!token || token.length < 10) {
        throw new Error("Failed to get token");
      }

      return {
        success: true,
        data: token,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Unknown error",
        duration: Date.now() - startTime,
      };
    }
  }

  async solveTurnstileMax(url, proxy, timeout = 60000) {
    const startTime = Date.now();
    try {
      if (!url) {
        throw new Error("Missing url parameter");
      }

      const token = await this.browserService.withBrowserContext(async (context) => {
        const page = await context.newPage();
        await page.setDefaultTimeout(30000);
        await page.setDefaultNavigationTimeout(30000);
        await page.setViewport({ width: 1280, height: 800 });
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
        );
        await page.evaluateOnNewDocument(() => {
          Object.defineProperty(navigator, 'platform', { get: () => 'Win32' });
          Object.defineProperty(navigator, 'vendor', { get: () => 'Google Inc.' });
        });

        const parsedProxy = parseProxy(proxy);
        if (parsedProxy?.username && parsedProxy?.password) {
          try {
            await page.authenticate({
              username: parsedProxy.username,
              password: parsedProxy.password,
            });
          } catch (e) {}
        }

        await page.evaluateOnNewDocument(() => {
          let token = null;
          async function waitForToken() {
            while (!token) {
              try {
                token = window.turnstile.getResponse();
              } catch (e) {}
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
            const c = document.createElement("input");
            c.type = "hidden";
            c.name = "cf-response";
            c.value = token;
            document.body.appendChild(c);
          }
          waitForToken();
        });

        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });

        return await this.waitForTurnstileToken(page, timeout);
      });

      if (!token || token.length < 10) {
        throw new Error("Failed to get token");
      }

      return {
        success: true,
        data: token,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Unknown error",
        duration: Date.now() - startTime,
      };
    }
  }

  async getSource(url, proxy, timeout = 60000) {
    const startTime = Date.now();
    try {
      if (!url) {
        throw new Error("Missing url parameter");
      }

      const result = await this.browserService.withBrowserContext(async (context) => {
        const page = await context.newPage();
        await page.setDefaultTimeout(30000);
        await page.setDefaultNavigationTimeout(30000);

        const parsedProxy = parseProxy(proxy);
        if (parsedProxy?.username && parsedProxy?.password) {
          try {
            await page.authenticate({
              username: parsedProxy.username,
              password: parsedProxy.password,
            });
          } catch (e) {}
        }

        await page.setRequestInterception(true);

        let resolved = false;
        return new Promise((resolve, reject) => {
          const timeoutHandler = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              reject(new Error("Timeout Error"));
            }
          }, timeout);

          page.on("request", async (request) => {
            try {
              await request.continue();
            } catch (e) {}
          });

          page.on("response", async (res) => {
            try {
              if (!resolved && [200, 302].includes(res.status()) && [url, url + "/"].includes(res.url())) {
                await page.waitForNavigation({ waitUntil: "load", timeout: 5000 }).catch(() => {});
                const html = await page.content();
                resolved = true;
                clearTimeout(timeoutHandler);
                resolve(html);
              }
            } catch (error) {
              if (!resolved) {
                resolved = true;
                clearTimeout(timeoutHandler);
                reject(error);
              }
            }
          });

          page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 }).catch((error) => {
            if (!resolved) {
              resolved = true;
              clearTimeout(timeoutHandler);
              reject(error);
            }
          });
        });
      });

      return {
        success: true,
        data: result,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Unknown error",
        duration: Date.now() - startTime,
      };
    }
  }

  async findAcceptLanguage(page) {
    try {
      return await page.evaluate(async () => {
        const result = await fetch("https://httpbin.org/get")
          .then((res) => res.json())
          .then((res) => res.headers["Accept-Language"] || res.headers["accept-language"])
          .catch(() => null);
        return result;
      });
    } catch (error) {
      return "en-US,en;q=0.9";
    }
  }

  getStats() {
    return this.browserService.getBrowserStats();
  }
}

module.exports = { BypassService };
