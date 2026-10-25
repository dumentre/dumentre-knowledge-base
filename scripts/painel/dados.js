/**
 * Gera o index.html do painel "Tração Dumentre" a partir do template fixo da skill painel-decisoes.
 * Fonte do conteúdo: painel.html (DECISIONS, PROSPECTS, PRO_STATUS e os blocos "entregas" e "ofertas").
 * Os blocos visuais antigos entram como html de seção, com o CSS antigo prefixado em .legacy para não colidir.
 * Uso: node dados.js <saida/index.html>   (build.js chama montarPainel)
 */
const fs = require("fs");
const path = require("path");

const TEMPLATE = path.resolve(__dirname, "..", "..", "..", "..", "projects-knowledge-base", "skills", "painel-decisoes", "template.html");
const SRC = path.join(__dirname, "painel.html");

function grab(html, name) {
  const m = html.match(new RegExp("const " + name + " = ([\\[{][^\\n]*[\\]}]);\\n")) || html.match(new RegExp("const " + name + " = ([\\[{][\\s\\S]*?\\n[\\]}]);"));
  if (!m) throw new Error("não achei " + name);
  return eval("(" + m[1] + ")");
}
function section(html, id) {
  const m = html.match(new RegExp('<section id="' + id + '"[^>]*>([\\s\\S]*?)\\n  </section>'));
  if (!m) throw new Error("não achei a seção " + id);
  return m[1];
}

// Prefixa cada seletor com .legacy (recursivo em @media). :root e body viram o próprio .legacy.
function prefixCss(css) {
  let out = "", i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open < 0) break;
    const head = css.slice(i, open).trim();
    let depth = 1, j = open + 1;
    while (depth && j < css.length) { if (css[j] === "{") depth++; else if (css[j] === "}") depth--; j++; }
    const body = css.slice(open + 1, j - 1);
    if (head.startsWith("@media") || head.startsWith("@supports")) out += head + "{" + prefixCss(body) + "}\n";
    else if (head.startsWith("@")) out += head + "{" + body + "}\n";
    else {
      const sel = head.replace(/\/\*[\s\S]*?\*\//g, "").split(",").map(s => s.trim()).filter(Boolean).map(s => {
        if (/^:root\[data-theme="dark"\]/.test(s)) return '[data-theme="dark"] .legacy' + s.replace(/^:root\[data-theme="dark"\]/, "");
        if (/^:root:not\(\[data-theme="light"\]\)/.test(s)) return ':root:not([data-theme="light"]) .legacy' + s.replace(/^:root:not\(\[data-theme="light"\]\)/, "");
        if (/^:root/.test(s)) return ".legacy" + s.replace(/^:root/, "");
        if (/^(html|body)\b/.test(s)) return ".legacy" + s.replace(/^(html|body)/, "");
        if (s === "*") return ".legacy, .legacy *";
        return ".legacy " + s;
      }).join(", ");
      out += sel + "{" + body + "}\n";
    }
    i = j;
  }
  return out;
}

function dados() {
  const html = fs.readFileSync(SRC, "utf8");
  const DECISIONS = grab(html, "DECISIONS");
  const PROSPECTS = grab(html, "PROSPECTS");
  const PRO_STATUS = grab(html, "PRO_STATUS");
  const P_LABEL = grab(html, "P_LABEL");
  const legacyCss = prefixCss(html.match(/<style>([\s\S]*?)<\/style>/)[1]);
  const block = (inner) => '<style>' + legacyCss + '</style><div class="legacy">' + inner.replace(/<div class="sec-head">[\s\S]*?<\/div><\/div>\s*<\/div>|<div class="sec-head">[\s\S]*?<\/div>\s*<\/div>/, m => m.includes("links") ? '<div class="links">' + (m.match(/<div class="links">([\s\S]*?)<\/div>/) || ["", ""])[1] + '</div>' : "") + "</div>";
  return {
    nome: "Tração Dumentre",
    eyebrow: "Dumentre · briefing de 08/10/2026",
    titulo: DECISIONS.length + " decisões e 20 prospects para a Dumentre faturar",
    intro: "Em cada cartão: escolha uma opção, comente se quiser e aperte \"Marcar como avaliada\". Os botões ao lado de cada decisão abrem o material (site novo, documentos, prévias). Tudo salva sozinho. Quando terminar, me diga \"respondi no painel\".",
    grupos: { P0: ["P0 · " + P_LABEL.P0, 4], P1: ["P1 · " + P_LABEL.P1, 2], P2: ["P2 · " + P_LABEL.P2, 8], A: ["Prioridade A", 1], B: ["Prioridade B", 6], C: ["Prioridade C", 8] },
    rodape: "Tudo local: nada foi publicado, enviado ou anunciado. Fonte: dumentre-knowledge-base/estrategia e backlog.",
    secoes: [
      { colecao: "decisoes", orelha: "1 · Decisões", titulo: "Decisões e aprovações", texto: "Ordenadas por prioridade. P0 destrava faturamento esta semana.",
        itens: DECISIONS.map(d => ({ id: d.id, g: d.p, t: d.id.replace("d", "#") + " · " + d.title, why: d.why, links: d.links, opts: d.opts, meta: d.ext ? "ação externa sua" : undefined })) },
      { colecao: "prospects", orelha: "2 · Prospects", titulo: "20 prospects da zona leste", texto: "Escolha o status atual de cada um. Use \"Editar\" quando o status mudar.",
        opcoes: PRO_STATUS, pedeAcao: [],
        html: '<div class="links"><a class="go" href="docs/estrategia/prospeccao/prospects.html">Detalhes e evidências →</a> <a class="go" href="docs/estrategia/prospeccao/scripts-abordagem.html">Scripts de abordagem →</a></div>',
        itens: PROSPECTS.map(([prio, nome, nicho, achado, oferta, contato], i) => ({ id: "p" + String(i + 1).padStart(2, "0"), g: prio, t: nome, n: achado, meta: nicho + " · " + oferta + " · " + contato, s: PRO_STATUS[0] })) },
      { orelha: "3 · Entregas", titulo: "O que foi entregue", html: block(section(html, "entregas")) },
      { orelha: "4 · Ofertas", titulo: "Ofertas com preço na etiqueta", html: block(section(html, "ofertas")) },
    ],
  };
}

function montarPainel(outFile) {
  const d = dados();
  const tpl = fs.readFileSync(TEMPLATE, "utf8");
  const js = JSON.stringify(d).replace(/<\//g, "<\\/");
  fs.writeFileSync(outFile, tpl.replace("__TITULO__", d.nome).replace("/*__PAINEL__*/null", js));
  return d;
}

module.exports = { montarPainel };
if (require.main === module) { const d = montarPainel(process.argv[2]); console.log("ok", d.secoes.map(s => (s.colecao || "info") + ":" + (s.itens || []).length).join(" ")); }
