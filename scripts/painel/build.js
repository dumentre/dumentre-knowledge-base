#!/usr/bin/env node
/**
 * Gera o painel "Tração Dumentre" (artifact do claude.ai) a partir da knowledge base.
 *
 *   cd dumentre-knowledge-base/scripts/painel && npm install && node build.js [pasta-de-saida]
 *
 * O .md continua sendo a fonte de verdade; este script só produz a camada de leitura:
 *   - index.html            ← template painel-decisoes + dados.js (lê DECISIONS/PROSPECTS e os blocos de painel.html)
 *   - img/                  ← miniaturas JPG usadas no painel
 *   - docs/<caminho>.html   ← cada .md convertido, com imagens em JPG leve e links .md → .html
 *   - docs/.../*.html       ← prévias interativas (direções, posts, criativos, sites-proposta)
 *   - site-novo/            ← build do site da branch redesign (dist/)
 * Depois publique a pasta de saída com a ferramenta Artifact (mesma URL do painel).
 */

const fs = require("fs");
const path = require("path");
const { marked } = require("marked");
const { chromium } = require("playwright");

const KB = path.resolve(__dirname, "..", "..");
const SITE_DIST = path.resolve(KB, "..", "dumentre-website-v2--redesign", "dist");
const OUT = path.resolve(process.argv[2] || path.join(__dirname, "out"));

const MD_FILES = [
  "briefings/2026-10-08-tracao-dumentre.md",
  "estrategia/README.md",
  "estrategia/diagnostico-2026-10.md",
  "estrategia/ofertas.md",
  "estrategia/pesquisa-preco-visivel.md",
  "estrategia/identidade/README.md",
  "estrategia/site/README.md",
  "estrategia/redes/README.md",
  "estrategia/anuncios/plano-anuncios.md",
  "estrategia/prospeccao/README.md",
  "estrategia/prospeccao/prospects.md",
  "estrategia/prospeccao/scripts-abordagem.md",
  "marca/design.md",
  "marca/brand.md",
  "marca/voice_principles.md",
  "backlog/README.md",
];

// Prévias HTML copiadas como estão, com as referências de imagem trocadas por JPG leve.
const PREVIEWS = [
  { src: "estrategia/identidade/direcoes.html", rewrite: { "../../../dumentre-website-v2/logo-dumentre-minimalist-d-and-m-letters-blue-white.png": "assets/logo-atual.jpg", "assets/julinho-desktop.png": "assets/julinho-desktop.jpg" } },
  { src: "estrategia/redes/posts/posts.html", rewrite: { "../../identidade/assets/julinho-desktop.png": "../../identidade/assets/julinho-desktop.jpg" } },
  { src: "estrategia/anuncios/criativos.html", rewrite: {} },
  { src: "estrategia/prospeccao/mockups/leal-clinic/index.html", rewrite: {} },
  { src: "estrategia/prospeccao/mockups/gdr-7-de-setembro/index.html", rewrite: {} },
];
const EXTRA_IMAGES = [
  ["../dumentre-website-v2/logo-dumentre-minimalist-d-and-m-letters-blue-white.png", "docs/estrategia/identidade/assets/logo-atual.jpg", 600],
  ["estrategia/identidade/assets/julinho-desktop.png", "docs/estrategia/identidade/assets/julinho-desktop.jpg", 1440],
];

// Miniaturas do painel: [origem na KB, nome em img/, largura]
const THUMBS = [
  ["estrategia/identidade/logo-evolucao.png", "logo", 1200], ["estrategia/identidade/A-board.png", "a-board", 1200],
  ["estrategia/identidade/B-board.png", "b-board", 1200], ["estrategia/identidade/A-site.png", "a-site", 1200],
  ["estrategia/identidade/B-site.png", "b-site", 1200], ["estrategia/site/desktop-hero.png", "site-desktop", 1200],
  ["estrategia/site/desktop-secao-ofertas.png", "site-ofertas", 1200], ["estrategia/site/desktop-secao-cases.png", "site-cases", 1200],
  ["estrategia/diag-site-atual-desktop.png", "site-antigo", 1200], ["estrategia/redes/posts/grade.png", "grade", 1200],
  ["estrategia/prospeccao/mockups/leal-clinic/desktop-hero.png", "leal-desktop", 1200],
  ["estrategia/prospeccao/mockups/gdr-7-de-setembro/desktop-hero.png", "gdr-desktop", 1200],
  ["estrategia/identidade/A-post.png", "a-post", 540], ["estrategia/identidade/B-post.png", "b-post", 540],
  ["estrategia/anuncios/ad-site-story.png", "ad-site", 540], ["estrategia/anuncios/ad-atendente-feed.png", "ad-atendente", 540],
  ["estrategia/anuncios/ad-raiox-story.png", "ad-raiox", 540], ["estrategia/redes/posts/post-03.png", "post-03", 540],
  ["estrategia/redes/posts/post-07.png", "post-07", 540], ["estrategia/site/mobile-hero.png", "site-mobile", 390],
  ["estrategia/prospeccao/mockups/leal-clinic/mobile-hero.png", "leal-mobile", 390],
  ["estrategia/prospeccao/mockups/gdr-7-de-setembro/mobile-hero.png", "gdr-mobile", 390],
  ["estrategia/prospeccao/evidencias/leal.png", "leal-antes", 390], ["estrategia/prospeccao/evidencias/gdr.png", "gdr-antes", 390],
];

const posix = (p) => p.split(path.sep).join("/");
const mkdirFor = (file) => fs.mkdirSync(path.dirname(file), { recursive: true });
const slug = (html) => html.replace(/<[^>]+>/g, "").replace(/&[a-z]+;|&#\d+;/g, " ").normalize("NFD").replace(/[̀-ͯ]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const escapeHtml =(s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

let browser;
async function toJpg(src, dest, maxWidth) {
  if (!fs.existsSync(src)) return false;
  mkdirFor(dest);
  const page = await browser.newPage({ viewport: { width: 400, height: 300 } });
  await page.goto("file:///" + posix(src));
  const [nw, nh] = await page.evaluate(() => [document.images[0].naturalWidth, document.images[0].naturalHeight]);
  const w = Math.min(maxWidth, nw);
  const h = Math.round(nh * (w / nw));
  await page.setViewportSize({ width: w, height: h });
  await page.addStyleTag({ content: `body{margin:0;background:#fff} img{width:${w}px;height:${h}px;display:block}` });
  await page.screenshot({ path: dest, type: "jpeg", quality: 78 });
  await page.close();
  return true;
}

// Resolve um link de um .md (relativo à KB) para o que existe no painel.
function resolveLink(mdRel, href) {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return { href, external: /^https?:/.test(href) };
  const [raw, hash = ""] = href.split("#");
  const target = posix(path.normalize(path.join(path.dirname(mdRel), raw)));
  const abs = path.join(KB, target);
  let mapped = null;
  if (raw.endsWith(".md")) mapped = MD_FILES.includes(target) ? target.replace(/\.md$/, ".html") : null;
  else if (raw.endsWith("/") || (fs.existsSync(abs) && fs.statSync(abs).isDirectory())) {
    const dir = target.replace(/\/$/, "");
    if (MD_FILES.includes(dir + "/README.md")) mapped = dir + "/README.html";
    else if (PREVIEWS.some((p) => p.src === dir + "/index.html")) mapped = dir + "/index.html";
    else if (PREVIEWS.some((p) => p.src === dir + "/posts.html")) mapped = dir + "/posts.html";
  } else if (raw.endsWith(".html")) mapped = PREVIEWS.some((p) => p.src === target) ? target : null;
  else if (/\.(png|jpe?g|svg)$/i.test(raw)) mapped = target.replace(/\.png$/i, ".jpg");
  if (!mapped) return null;
  const rel = posix(path.relative(path.dirname(mdRel), mapped)) || path.basename(mapped);
  return { href: rel + (hash ? "#" + hash : ""), asset: /\.(png|jpe?g|svg)$/i.test(raw) ? target : null };
}

function page({ title, body, mdRel }) {
  const depth = mdRel.split("/").length; // docs/<...>/arquivo → volta até a raiz do artifact
  const toRoot = "../".repeat(depth - 1);
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Schibsted+Grotesk:wght@400..900&display=swap">
<style>
:root{--paper:#f4f1ea;--raised:#fbfaf6;--ink:#15140f;--cobalt:#2236f5;--hl:#eaf05a;--graphite:#6b675e;--rule:#d9d4c7;--code:#ece8de;
--sans:"Schibsted Grotesk",system-ui,-apple-system,"Segoe UI",sans-serif;--mono:"IBM Plex Mono",ui-monospace,Consolas,monospace;color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--paper:#15140f;--raised:#1e1d17;--ink:#f1ede3;--cobalt:#8d9bff;--graphite:#b3ad9f;--rule:#3a382f;--code:#26241d;color-scheme:dark}}
:root[data-theme="dark"]{--paper:#15140f;--raised:#1e1d17;--ink:#f1ede3;--cobalt:#8d9bff;--graphite:#b3ad9f;--rule:#3a382f;--code:#26241d;color-scheme:dark}
*{box-sizing:border-box}
html{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.6 var(--sans)}
.bar{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;background:var(--paper);border-bottom:1.5px solid var(--ink)}
.bar-in{max-width:880px;margin:0 auto;padding:10px 20px;display:flex;gap:14px;align-items:center;flex-wrap:wrap;font:500 13px var(--mono)}
.bar a{color:var(--ink);text-decoration:none;border:1.5px solid var(--ink);padding:5px 10px;background:var(--raised)}
.bar a:hover{background:var(--ink);color:var(--paper)}
.bar span{color:var(--graphite);overflow-wrap:anywhere}
main{max-width:880px;margin:0 auto;padding:28px 20px 96px}
h1,h2,h3,h4{text-wrap:balance;letter-spacing:-.03em;line-height:1.1}
h1{font-weight:800;font-size:clamp(30px,5vw,46px);margin:8px 0 18px}
h2{font-weight:800;font-size:clamp(23px,3.4vw,30px);margin:44px 0 12px;padding-top:14px;border-top:1.5px solid var(--ink)}
h3{font-weight:700;font-size:20px;margin:28px 0 8px;letter-spacing:-.015em}
p,li{max-width:70ch}
a{color:var(--cobalt);text-underline-offset:3px}
strong{font-weight:700}
blockquote{margin:16px 0;padding:12px 18px;background:var(--raised);border:1.5px solid var(--ink);border-left-width:6px}
blockquote p{margin:6px 0}
code{font:14px var(--mono);background:var(--code);padding:1px 5px;overflow-wrap:anywhere}
pre{background:var(--code);padding:14px;overflow-x:auto;border:1px solid var(--rule)}
pre code{background:none;padding:0}
.tbl{overflow-x:auto;margin:16px 0;border:1.5px solid var(--ink);background:var(--raised)}
table{border-collapse:collapse;width:100%;font-size:15px}
th,td{text-align:left;vertical-align:top;padding:9px 12px;border-bottom:1px solid var(--rule)}
th{font:500 11.5px var(--mono);text-transform:uppercase;letter-spacing:.04em;color:var(--graphite);background:var(--paper)}
td{min-width:64px}
img{max-width:100%;height:auto;display:block;border:1.5px solid var(--ink);background:#fff;margin:10px 0}
td img{margin:0}
hr{border:0;border-top:1.5px dashed var(--rule);margin:36px 0}
ul,ol{padding-left:22px}
li{margin:4px 0}
:focus-visible{outline:3px solid var(--hl);outline-offset:2px}
</style></head><body>
<header class="bar"><div class="bar-in"><a href="${toRoot}index.html">← Painel</a><span>${escapeHtml(mdRel.replace(/^docs\//, "").replace(/\.html$/, ".md"))}</span></div></header>
<main>${body}</main></body></html>`;
}

async function buildDocs() {
  const assets = new Set();
  for (const mdRel of MD_FILES) {
    const md = fs.readFileSync(path.join(KB, mdRel), "utf8");
    let html = marked.parse(md, { gfm: true });
    // âncoras nos títulos, para o painel apontar direto para o trecho certo
    html = html.replace(/<h([1-4])>([\s\S]*?)<\/h\1>/g, (m, n, inner) => `<h${n} id="${slug(inner)}">${inner}</h${n}>`);
    html = html.replace(/<table>/g, '<div class="tbl"><table>').replace(/<\/table>/g, "</table></div>");
    html = html.replace(/(href|src)="([^"]+)"/g, (m, attr, href) => {
      const r = resolveLink(mdRel, href.replace(/&amp;/g, "&"));
      if (!r) return attr === "href" ? 'data-local="' + href + '"' : m;
      if (r.asset) assets.add(r.asset);
      const extra = attr === "href" && r.external ? ' target="_blank" rel="noopener"' : "";
      return `${attr}="${r.href}"${extra}`;
    });
    // links para arquivos que não entram no painel (repo do site, pastas soltas) viram texto
    html = html.replace(/<a data-local="[^"]*"([^>]*)>([\s\S]*?)<\/a>/g, "$2");
    const title = (md.match(/^#\s+(.+)$/m) || [, path.basename(mdRel)])[1].replace(/[*`]/g, "");
    const outRel = "docs/" + mdRel.replace(/\.md$/, ".html");
    const out = path.join(OUT, outRel);
    mkdirFor(out);
    fs.writeFileSync(out, page({ title, body: html, mdRel: outRel }));
  }
  for (const a of assets) {
    const src = path.join(KB, a);
    const dest = path.join(OUT, "docs", a.replace(/\.png$/i, ".jpg"));
    if (/\.png$/i.test(a)) await toJpg(src, dest, 1200);
    else if (fs.existsSync(src)) { mkdirFor(dest); fs.copyFileSync(src, dest); }
  }
  return assets.size;
}

async function buildPreviews() {
  for (const p of PREVIEWS) {
    let html = fs.readFileSync(path.join(KB, p.src), "utf8");
    for (const [from, to] of Object.entries(p.rewrite)) html = html.split(from).join(to);
    const out = path.join(OUT, "docs", p.src);
    mkdirFor(out);
    fs.writeFileSync(out, html);
  }
  for (const [src, dest, w] of EXTRA_IMAGES) await toJpg(path.join(KB, src), path.join(OUT, dest), w);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  browser = await chromium.launch();
  require("./dados").montarPainel(path.join(OUT, "index.html")); // template da skill painel-decisoes + dados de painel.html
  for (const [src, name, w] of THUMBS) await toJpg(path.join(KB, src), path.join(OUT, "img", name + ".jpg"), w);
  const n = await buildDocs();
  await buildPreviews();
  if (fs.existsSync(SITE_DIST)) copyDir(SITE_DIST, path.join(OUT, "site-novo"));
  await browser.close();
  console.log(`[painel] ${MD_FILES.length} documentos, ${n} imagens de documentos, ${PREVIEWS.length} prévias → ${OUT}`);
})().catch((e) => { console.error(e); process.exit(1); });
