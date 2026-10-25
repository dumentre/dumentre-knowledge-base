# Estratégia de tração — outubro/2026

Painel visual com as decisões marcáveis, o status dos prospects e todos estes documentos em HTML (privado, só o Luan abre): https://claude.ai/artifact/Aor9cK49hE2ybS7hazbUaQ

Os .md continuam sendo a fonte. Depois de editar algum, regenerar o painel com `cd scripts/painel && npm install && node build.js <pasta>` e republicar a pasta na mesma URL (ver [`scripts/painel/build.js`](../scripts/painel/build.js)).

Entregáveis do [briefing de 08/10/2026](../briefings/2026-10-08-tracao-dumentre.md). Tudo local: nada foi publicado, enviado, anunciado ou empurrado para remoto. Decisões pendentes: [backlog](../backlog/README.md).

| # | Entregável | Arquivo principal | Visual |
|---|---|---|---|
| 1 | Diagnóstico (site, marca, redes, oferta) | [diagnostico-2026-10.md](diagnostico-2026-10.md) | [site atual](diag-site-atual-desktop.png) |
| 2 | Ofertas para faturar já (4 + combo, com preço e prazo) | [ofertas.md](ofertas.md) · [pesquisa: preço visível?](pesquisa-preco-visivel.md) | — |
| 3 | Identidade visual: 2 direções, recomendação, logo | [identidade/README.md](identidade/README.md) · [design.md](../marca/design.md) · [brand.md](../marca/brand.md) · [voz](../marca/voice_principles.md) | [direcoes.html](identidade/direcoes.html) |
| 4 | Site novo (branch `redesign/identidade-2026-10`, sem push) | [site/README.md](site/README.md) | [desktop](site/desktop-hero.png) · [celular](site/mobile-hero.png) |
| 5 | Redes: pilares, calendário de 30 dias, 9 posts com legenda | [redes/README.md](redes/README.md) | [grade](redes/posts/grade.png) · [posts.html](redes/posts/posts.html) |
| 6 | Plano de anúncios Google + Meta (nada ativado) | [anuncios/plano-anuncios.md](anuncios/plano-anuncios.md) | [criativos.html](anuncios/criativos.html) |
| 7 | Prospecção: 20 prospects, scripts, 2 sites-proposta | [prospeccao/README.md](prospeccao/README.md) | [Leal](prospeccao/mockups/leal-clinic/index.html) · [GDR](prospeccao/mockups/gdr-7-de-setembro/index.html) |
| 8 | Backlog de decisões | [../backlog/README.md](../backlog/README.md) | — |

## Onde mais mexi

- `dumentre-knowledge-base/marca/` — `design.md`, `brand.md`, `voice_principles.md` e `logo/` (SVGs do símbolo).
- `dumentre/dumentre-website-v2--redesign/` — worktree git da branch `redesign/identidade-2026-10` (commit local). O checkout `dumentre-website-v2` em `main` **não foi tocado** (tem trabalho não commitado do Luan).

## Como abrir as prévias

Os HTML abrem direto no navegador (duplo clique). O site novo precisa de servidor local:

```
cd C:\Users\luanc\projects\dumentre\dumentre-website-v2--redesign
npm run build
python -m http.server 8800 -d dist
```

e abrir http://localhost:8800.
