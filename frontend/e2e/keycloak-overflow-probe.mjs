import { chromium } from 'playwright';
import crypto from 'node:crypto';
import fs from 'node:fs';

function base64url(buffer) {
  return Buffer.from(buffer).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function authUrl() {
  const verifier = base64url(crypto.randomBytes(32));
  const challenge = base64url(crypto.createHash('sha256').update(verifier).digest());
  const url = new URL('https://localhost/auth/realms/loyertracker/protocol/openid-connect/auth');
  url.searchParams.set('client_id', 'loyertracker-spa');
  url.searchParams.set('redirect_uri', 'https://localhost/');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid');
  url.searchParams.set('prompt', 'login');
  url.searchParams.set('state', base64url(crypto.randomBytes(16)));
  url.searchParams.set('nonce', base64url(crypto.randomBytes(16)));
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');
  return url.toString();
}

const viewports = [640, 390];
const outDir = new URL('../../docs/cgpa/evidence/ep17-reserve-overflow/', import.meta.url).pathname;
fs.mkdirSync(outDir, { recursive: true });

const applyLocalThemeCss = process.env.APPLY_LOCAL_THEME_CSS === '1';
const localThemeCssPath = new URL('../../infra/keycloak/themes/loyertracker/login/resources/css/login.css', import.meta.url).pathname;
const localThemeCss = applyLocalThemeCss ? fs.readFileSync(localThemeCssPath, 'utf8') : null;
const mode = applyLocalThemeCss ? 'candidate-css' : 'runtime-current';

const browser = await chromium.launch({ headless: true });
const results = [];
for (const width of viewports) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, ignoreHTTPSErrors: false });
  await page.goto(authUrl(), { waitUntil: 'networkidle' });
  await page.locator('#kc-page-title').waitFor({ state: 'visible', timeout: 15000 });
  if (localThemeCss) {
    await page.addStyleTag({ content: localThemeCss });
  }
  const data = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const vw = root.clientWidth;
    const els = [...document.querySelectorAll('*')].map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(), id: el.id, className: String(el.className || ''),
        left: Math.round(r.left * 100) / 100, right: Math.round(r.right * 100) / 100,
        width: Math.round(r.width * 100) / 100,
        marginLeft: cs.marginLeft, marginRight: cs.marginRight,
        paddingLeft: cs.paddingLeft, paddingRight: cs.paddingRight,
        boxSizing: cs.boxSizing, overflowX: cs.overflowX,
      };
    }).filter((x) => x.width > 0 && (x.right > vw || x.left < 0 || x.width > vw))
      .sort((a, b) => Math.max(b.right - vw, -b.left, b.width - vw) - Math.max(a.right - vw, -a.left, a.width - vw));
    return {
      url: location.href,
      viewport: vw,
      scrollWidth: root.scrollWidth,
      bodyScrollWidth: body.scrollWidth,
      overflowX: root.scrollWidth - vw,
      bodyOverflowX: body.scrollWidth - vw,
      offenders: els.slice(0, 12),
      bodyClass: body.className,
      htmlClass: root.className,
    };
  });
  const screenshot = `${outDir}keycloak-overflow-${mode}-${width}.png`;
  await page.screenshot({ path: screenshot, fullPage: true });
  data.mode = mode;
  data.screenshot = screenshot;
  results.push(data);
  await page.close();
}
await browser.close();
const report = `${outDir}keycloak-overflow-${mode}.json`;
fs.writeFileSync(report, `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify({ report, results }, null, 2));
if (results.some((r) => r.overflowX > 0)) process.exitCode = 2;
