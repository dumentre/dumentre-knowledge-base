# Briefing — tração comercial da Dumentre (08/10/2026)

Pedido do Luan (ditado por voz; "mentor" na transcrição = **Dumentre**). Sessão autônoma: pode trabalhar por horas, sem esperar aprovação a cada passo. **Tudo local.**

## Objetivo

A Dumentre precisa **ganhar dinheiro rápido**. O Luan tem ~2 anos de bagagem de projetos e agora tem Claude como aliado de design, código e vendas. Precisamos de: identidade e site melhores, estratégia de redes e de anúncios, ofertas vendáveis e prospecção ativa — com entregáveis prontos, não só estratégia.

## Limites (inegociáveis)

- **Não publicar nada online**: nada de push para remoto, deploy, post em rede social, anúncio ativado, e-mail/WhatsApp enviado, formulário enviado. Commits locais em branch própria são permitidos.
- Não gastar dinheiro nem criar contas/campanhas.
- Seguir `projects/projects-knowledge-base/ai-instructions/global-rules.md` (sem co-autoria de IA em commits, pt-BR, etc.) e as regras da Dumentre em `dumentre-knowledge-base/ai-instructions/global-rules.md`.
- Dados de clientes (fotos de alunos da Julinho etc.) não vão para material público de portfólio sem autorização; use print de layout com fotos borradas ou genéricas se precisar.

## Fontes para estudar antes de produzir

| Fonte | Para quê |
|---|---|
| `dumentre/dumentre-website-v2/` (repo `dumentre/dumentre-website-v2`) e `personal/dumentre-website*/` | Site atual. O Luan acha **os textos bons**; o problema é **identidade visual** |
| `dumentre/official-brand-assets/` | Logo e ativos atuais |
| `dumentre/dumentre-knowledge-base/` | Regras, skills de marketing (image, social, content-strategy), operações |
| `julinho/` (hub + `docs/`) | **Case pronto**: site novo (Next.js + Cloudflare), campanha de Dia das Crianças com direção "revista + figurinhas", análise de comunicação, prévia em `apps/website/public/previa/`. Ver `docs/pesquisas/direcoes-dia-das-criancas-2026-10-08/` |
| `exame/exame-knowledge-base/` | Prova de capacidade técnica do Luan: app mobile, APIs, automações, IA, rotinas, skills. Use como portfólio de "o que sabemos fazer" (sem expor dados da Exame) |
| `personal/brain/` (vault Obsidian em PARA) | Perfil, habilidades, projetos e ideias do Luan. Leia `30 Knowledge`, `10 Projects`, `20 Areas` |
| `soccer/`, `conductor/`, `personal/job-tracker`, `personal/email-hub` | Outros projetos que mostram capacidade (automação, agentes, web) |
| Skill `design-director` (`projects-knowledge-base/skills/design-director/`) | **Obrigatório** para todo trabalho visual: briefing, duas direções opostas, isolar variáveis, loop de crítica ≥ 8, governança no `design.md` |

## Entregáveis (nesta ordem de prioridade)

1. **Diagnóstico curto** (site, marca, presença em Instagram/Facebook/LinkedIn da Dumentre, oferta atual) → `dumentre-knowledge-base/estrategia/diagnostico-2026-10.md`.
2. **Ofertas para faturar já** (2–4 pacotes com escopo, prazo, preço sugerido em R$ e argumento): ex. "site profissional pronto em 7 dias", "kit de marca + campanha de data comemorativa" (o case Julinho), "automação com IA para pequeno negócio". Inclua o que dá para entregar rápido usando Claude.
3. **Identidade visual nova** pela skill `design-director`: 2 direções opostas renderizadas (logo aplicado, paleta, tipografia, 1 tela de site, 1 post), recomendação e `design.md` da Dumentre. Sem redesenhar o logo sem antes propor e justificar; se propor evolução do logo, mostre lado a lado.
4. **Nova versão do site** em branch local (`redesign/identidade-2026-10`) no `dumentre-website-v2`, mantendo os textos atuais, aplicando a direção recomendada, com seção de cases (Julinho como case principal) e oferta clara. Rodar local, tirar screenshots desktop e celular, crítica ≥ 8. **Sem push.**
5. **Estratégia de redes** (Instagram, Facebook, LinkedIn): pilares, calendário de 30 dias, e os **primeiros 9 posts prontos** (arte + legenda) seguindo a identidade nova.
6. **Plano de anúncios** (Google Ads e Meta Ads): público, palavras-chave, criativos, orçamento sugerido de teste, métricas — **sem ativar nada**.
7. **Prospecção**: nichos com dor clara em São Paulo/zona leste (escolinhas esportivas, clínicas, comércio local…), lista de 20 prospects com motivo (site fraco/sem site, Instagram parado), scripts de abordagem (WhatsApp, Instagram, e-mail) e **2 "sites prontos para oferecer"** (mockups locais para prospects reais, sem usar a marca deles de forma enganosa; marcados como proposta).
8. **Backlog** em `dumentre-knowledge-base/backlog/` com tudo que ficou para o Luan decidir/aprovar, priorizado.

## Formato de entrega

- Tudo em arquivos locais, linkados a partir de um índice `dumentre-knowledge-base/estrategia/README.md`.
- Previews visuais em HTML local + PNG.
- Ao final, um resumo curto para o Luan: o que foi feito, onde está, o que precisa da decisão dele (tabela "Comigo / Com você").
