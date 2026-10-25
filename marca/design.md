# design.md — Dumentre

> Fonte de verdade visual da Dumentre (site, redes, propostas, anúncios). Direção **A — Ficha Técnica**, recomendada em 08/10/2026 ([comparativo](../estrategia/identidade/README.md)). **Status: proposta, aguardando aprovação do Luan.** Toda correção visual vira regra na seção "Regras acumuladas", na mesma sessão.

## Estratégia (resumo)
- Posicionamento: tecnologia de empresa grande para pequeno negócio, com escopo, prazo e preço fechados ([brand.md](brand.md)).
- Emoção: alívio e confiança, "aqui não tem surpresa".
- Território próprio: papel + tinta + cobalto + marca-texto, linguagem de ficha técnica. Por quê: a categoria está saturada de azul-marinho com gradiente; o comércio local, de arte colorida de template. A sobriedade editorial é o vazio.

## Cor (tokens semânticos)
| Token | Hex | Uso |
|---|---|---|
| `paper` (surface) | `#F4F1EA` | fundo padrão |
| `paper-raised` | `#FBFAF6` | cartões, fichas, tabelas |
| `ink` (text) | `#15140F` | texto, bordas, sombra dura, seções escuras |
| `cobalt` (primary) | `#2236F5` | botão principal, links, números e marcadores de destaque, símbolo sobre papel em peças de campanha |
| `cobalt-soft` | `#E4E7FE` | fundo de status positivo ("no ar") |
| `highlighter` (accent) | `#EAF05A` | **só** marca-texto atrás de 2–6 palavras por peça. Nunca fundo de seção, nunca texto |
| `graphite` (muted) | `#6B675E` | texto secundário, rótulos mono |
| `rule` | `#D9D4C7` | linhas finas, grid de fundo |
| `alert-soft` / `alert` | `#F6D9D2` / `#8A2412` | status negativo ("sem resposta", "perdido") |

Contraste conferido (WCAG): ink/paper 16,4:1; cobalt/paper 6,4:1; graphite/paper 5,0:1; branco/cobalt 7,2:1; ink/highlighter 15:1; cobalt/cobalt-soft 5,9:1; alert/alert-soft 6,7:1. **Dark:** seções escuras usam `ink` como fundo, `paper` como texto e o marca-texto como acento (cobalto sobre ink dá 2,6:1 e não passa AA; nunca usar cobalto como texto ou ícone sobre fundo escuro).

## Tipografia
| Papel | Família | Peso | Tamanho / line-height / tracking |
|---|---|---|---|
| Display / H1 | Schibsted Grotesk | 800 | site 56–64 px (mobile 38–42) / 1.0 / −0,04 em |
| H2 | Schibsted Grotesk | 800 | 40–48 px (mobile 30–34) / 1.05 / −0,035 em |
| H3 | Schibsted Grotesk | 700 | 20–24 px / 1.2 / −0,015 em |
| Body | Schibsted Grotesk | 400 (500 para ênfase) | 17–20 px / 1.5 / 0 |
| Rótulo, eyebrow, preço pequeno, status | IBM Plex Mono | 500 | 12–14 px / 1.3 / +0,04 em, caixa alta para eyebrow |
| Wordmark | Schibsted Grotesk | 800 | caixa baixa "dumentre", −0,05 em |

Google Fonts: `Schibsted+Grotesk:wght@400..900` e `IBM+Plex+Mono:wght@400;500;600`. Proibido: Inter, Outfit, Montserrat, Poppins na marca Dumentre.

## Forma e espaço
- **Cantos retos** (raio 0) em botões, cartões e fichas. Exceção: avatar circular e pílulas de status com raio 2 px.
- **Borda** 1,5 px `ink` em componentes interativos e fichas; 1 px `rule` em divisões internas.
- **Sombra dura** deslocada: botões `4px 4px 0 ink`; fichas de destaque `8px 8px 0 ink`. Nada de sombra difusa ou glow.
- **Grid de fundo** (papel milimetrado) 40 px, linhas `rule` a 35–45% de opacidade, só em hero e posts. Nunca atrás de parágrafo longo.
- Base de espaçamento 8 px; seções 96–120 px no desktop, 64–72 px no celular; container 1200 px com margens de 64 px (20 px no celular).

## Logo
- Arquivos: [`logo/simbolo.svg`](logo/simbolo.svg) (evolução, `currentColor`) e [`logo/simbolo-vetorizado-fiel.svg`](logo/simbolo-vetorizado-fiel.svg).
- Lockup horizontal: símbolo com altura = altura das ascendentes do wordmark, espaço entre os dois = 0,45 × altura do símbolo.
- Cores permitidas: `ink` sobre `paper`, `paper` sobre `ink`, `paper` sobre `cobalt`, `cobalt` sobre `paper`.
- Clear space: metade da altura do símbolo em todos os lados. Tamanho mínimo do símbolo: 20 px (abaixo disso, favicon simplificado, pendente).
- Não fazer: textura metálica, gradiente, sombra, contorno, rotação, recolorir fora da lista.

## Componentes e famílias de estilo
- **Botão primário:** fundo `cobalt`, texto branco 700, borda 1,5 `ink`, sombra `4px 4px 0 ink`. Hover: desloca `translate(2px,2px)` e a sombra cai para `2px 2px`. Foco: outline 3 px `highlighter` + 2 px offset.
- **Botão secundário:** fundo `paper`, texto `ink`, mesma borda e sombra.
- **Ficha (spec card):** cabeçalho mono em caixa alta com borda inferior; corpo com imagem ou conteúdo; rodapé em colunas (rótulo mono + valor display 800).
- **Linha de log/status:** hora em mono `graphite` · texto · pílula de status (`alert-soft`/`cobalt-soft`).
- **Etiqueta de preço:** valor em display 800 + legenda mono "preço fechado".
- **Marcador numerado:** círculo `cobalt` 22 px com número branco mono + linha de 1,5 px.
- **Ícones:** traço 1,75–2 px, cantos retos, `currentColor`, nunca em quadradinho colorido.

## Fotografia e cases
- Prints reais de trabalho, sempre dentro de uma ficha (moldura com borda e legenda).
- **Crianças e clientes de clientes:** rosto borrado (blur ≥ 14 px) ou recorte sem rosto, até haver autorização expressa para portfólio.
- Nada de banco de imagem com pessoas sorrindo para o notebook.

## Motion
- Princípio: mecânico e curto. Transições 120–180 ms, `cubic-bezier(.2,.7,.2,1)`. Botão "afunda" no clique.
- Revelação em scroll: só translate de 12 px + opacidade, uma vez, e respeitando `prefers-reduced-motion`.

## Peças sociais
- Formato principal 1080×1350 (4:5). Margem 72 px. Topo: "Ficha nº 00X · Tema" em mono à esquerda e `dumentre.com` à direita, com régua de 2 px.
- Título display 800 entre 88 e 110 px, marca-texto em 2–6 palavras.
- Rodapé: lockup à esquerda, CTA mono `cobalt` à direita.

## Proibições (anti-slop deste projeto)
- Gradiente azul/roxo, glow, glassmorphism, mockup de janela com bolinhas de semáforo.
- Ilustração de robô, cérebro, circuito ou "IA" genérica.
- Badges coloridos em cima de cada título de seção.
- Texto centralizado em bloco longo; títulos de seção centralizados (alinhar à esquerda no grid).
- Mais de um marca-texto por bloco de texto.

## Regras acumuladas (governança)
- [2026-10-08] Direção A escolhida como recomendação; aguardando aprovação do Luan. O símbolo DM é mantido; o arquivo-mestre passa a ser SVG.
- [2026-10-08] Mesmo texto ao comparar direções (isolar variável visual).
