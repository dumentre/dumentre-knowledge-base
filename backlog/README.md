# Backlog Dumentre — decisões e aprovações pendentes

Criado em 08/10/2026 a partir da sessão de [tração comercial](../briefings/2026-10-08-tracao-dumentre.md). Tudo o que está aqui depende do Luan (decisão, login, dinheiro ou ação externa). Ordem = prioridade. Atualizar o status nesta tabela.

Legenda de status: ⏳ aguardando decisão · 🔒 exige ação externa (publicar, enviar, pagar, logar) · ✅ feito

## P0 — destrava faturamento esta semana

| # | Item | Por que importa | O que precisa do Luan | Onde está o material | Status |
|---|---|---|---|---|---|
| 1 | **Aprovar ofertas e preços** (Site 7 dias R$ 2.900 · Atendente IA R$ 3.500 + R$ 390/mês · Campanha R$ 1.490 · Raio-X R$ 390) | Sem preço não há prospecção nem site novo | Confirmar ou ajustar valores, prazos e a regra 50/50 | [ofertas.md](../estrategia/ofertas.md) | ⏳ |
| 2 | **Começar a prospecção** pelos 8 prospects de prioridade A | É o caminho mais rápido e barato para o 1º contrato | Confirmar no Google Maps que estão ativos e disparar os scripts (cada envio é ação externa) | [prospects.md](../estrategia/prospeccao/prospects.md) · [scripts](../estrategia/prospeccao/scripts-abordagem.md) | 🔒 |
| 3 | **Avisar a Clínica Sense** sobre o domínio que hoje abre um site de apostas | Bom gesto, abre porta e é urgente para eles | Aprovar o envio (script 1) | prospects.md #1 | 🔒 |
| 4 | **Escolher a direção visual** (recomendação: A — Ficha Técnica) | Todo o resto (site, posts, anúncios) já foi feito em A | Aprovar A ou pedir ajustes; se aprovar, mudar o status do `design.md` | [identidade/](../estrategia/identidade/README.md) · [design.md](../marca/design.md) | ⏳ |
| 5 | **Aprovar a evolução do logo** (ou ficar com o vetor fiel) | Trocar PNG metálico por SVG resolve favicon, impressão e redes | Escolher: `simbolo.svg` (evolução) ou `simbolo-vetorizado-fiel.svg` | [marca/logo/](../marca/logo/) | ⏳ |
| 21 | **Preço visível no site?** (adicionado em 11/10) | Mostrar o preço diminui a quantidade de contatos e aumenta a qualidade deles; o resultado em negócios fica parecido | Manter visível (recomendado), "a partir de" ou esconder | [pesquisa-preco-visivel.md](../estrategia/pesquisa-preco-visivel.md) | ⏳ |
| 22 | **Campanha Pronta sem amarrar em data comemorativa** (adicionado em 11/10) | A maioria dos clientes compra por lançamento, promoção ou matrícula, não por data | Confirmar o texto novo ("próxima ação: lançamento, promoção, matrícula ou data especial") | [ofertas.md](../estrategia/ofertas.md#2-campanha-pronta-r-1-490-por-campanha-r-3-900-com-kit-de-marca) | ⏳ |
| 23 | **Formato do Raio-X** (adicionado em 11/10) | O "vídeo de 15 minutos" vende minutos, dá trabalho e corre o risco de o cliente não gostar | Recomendado: relatório com prints anotados e as 5 correções em ordem, mais um vídeo de tela curto (até 8 min) com a voz do Luan e garantia de devolução. A IA faz a varredura e o rascunho; o Luan revisa e grava (cerca de 40 min no total) | [ofertas.md](../estrategia/ofertas.md#0-raio-x-digital-r-390-abativel) | ⏳ |
| 24 | **Configurar o Meta Business Suite da Dumentre** (adicionado em 11/10, triagem de abas) | Página, Instagram comercial, WhatsApp, pixel e domínio prontos antes de postar e anunciar | Fazer junto com o Claude esta semana, no navegador, com ok em cada passo (criar/alterar conta é ação externa) | [Meta Business Suite](https://business.facebook.com/latest/home) | ⏳ |
| 25 | **Anúncios no ChatGPT (OpenAI Ads)** (adicionado em 11/10, triagem de abas) | Canal novo, pode ser oportunidade para a Dumentre, a Julinho e outros clientes | Pesquisar: como funciona, custo mínimo, público no Brasil e se dá para configurar por API/CLI/MCP. Criar conta ou gastar é ação externa | [OpenAI Ads](https://ads.openai.com/) | ⏳ |
| 26 | **Apps que preenchem lacunas** (adicionado em 11/10, triagem de abas) | Achar apps ruins ou pouco populares, lançar versão melhor na Play Store, ganhar audiência e monetizar. Primeira ideia: Turn Timer (rodízio de controle para crianças) | Já organizado no Notion da Dumentre (backlog de produtos + trilha de estudo). Próximo: validar a primeira ideia | [ChatGPT: Pesquisar lacunas de apps](https://chatgpt.com/c/6aa5bebc-a3e0-83e9-b548-ed033e82378f) | ⏳ |
| 27 | **Enviar e-mail como luan.cardoso@dumentre.com** (adicionado em 12/10, triagem de sessões) | Hoje o endereço só recebe (Cloudflare Email Routing → Gmail). Responder cliente com @gmail passa menos confiança | Gmail → Configurações → Contas → "Enviar e-mail como", com um SMTP de saída. Opções: SMTP gratuito de um serviço de envio (ex.: Brevo, com SPF/DKIM no DNS da Cloudflare) ou Google Workspace (pago). Escolher e configurar comigo no navegador | [Cloudflare Email Routing](https://dash.cloudflare.com/) | ⏳ |
| 28 | **Horário do Google Perfil da Empresa** (adicionado em 12/10, triagem de sessões) | Ficou "aguardando validação" no Notion desde 03/08 | Conferir se já foi publicado; se não, publicar (no navegador, com ok) | Notion › Central Operacional da Dumentre | ⏳ |
| 29 | **Remover o Deploy Hook temporário do Cloudflare Pages** (adicionado em 12/10, triagem de sessões) | Sessão de 20/07 parou antes de confirmar. Hook esquecido = URL que dispara deploy sem login | Conferir em Pages › dumentre › Settings › Builds › Deploy hooks e remover | [Cloudflare](https://dash.cloudflare.com/) | ⏳ |
| 31 | **WhatsApp Business com a IA da Meta respondendo** (adicionado em 12/10) | Visto na conversa com um amigo (conta comercial): o WhatsApp mostra "AI from Meta receives messages... and generate messages for this business" e "This business is now using a secure service from Meta to manage this chat". É a IA de atendimento da Meta (Business AI) na plataforma oficial: responde clientes 24 h, sem servidor nosso. Serve para a Dumentre e vira serviço para clientes (Julinho: matrícula, horários, aula experimental) | Ativar junto com o #24 (Meta Business Suite), avaliar custo e limites, escrever o roteiro de atendimento, testar com um número. Os clientes passam a ver o aviso de que a Meta lê as mensagens: decidir se isso pesa. Liga com o item "WhatsApp por API" do backlog geral | [#24](#) · [WhatsApp Business](https://business.whatsapp.com/) | ⏳ |
| 30 | **App da Dumentre** (ideia, adicionado em 12/10) | Produto próprio na loja reforça portfólio; liga com o #26 (apps que preenchem lacunas). O emulador Android do Orca fica para essa hora | Definir o app e o escopo quando o #26 tiver a primeira ideia validada | — | 💡 |

## P1 — publicar o site novo e as redes (próximas 2 semanas)

| # | Item | O que precisa do Luan | Onde | Status |
|---|---|---|---|---|
| 6 | **Autorização da Julinho Fundamentos** para usar o case no site e nas redes (projeto pro bono; site e campanha ainda em validação com a escola) | Pedir à escola por escrito. Sem isso, trocar o case por "em breve" antes de publicar | Site: seção #cases · post 4 | 🔒 |
| 7 | **Commitar o rastreamento de WhatsApp** que está não commitado em `main` (`script.js`, `index.html`, testes, backlog do site) | Revisar e commitar; depois fazer merge da branch `redesign/identidade-2026-10` (os CTAs novos já têm `data-service`/`data-cta-position`) | `dumentre-website-v2` (main) e worktree `dumentre-website-v2--redesign` | ⏳ |
| 8 | **Revisar e publicar o site novo** | Rodar local, aprovar, merge e deploy no Cloudflare Pages (ação externa) | [site/README.md](../estrategia/site/README.md) | 🔒 |
| 9 | **Handle oficial do Instagram**: @dumentre.co (no site) ou @dumentre (reservado segundo o vault) | Decidir e alinhar site, bio e JSON-LD | [redes/](../estrategia/redes/README.md) | ⏳ |
| 10 | **Configurar perfis** (bio, foto, destaques, link) e publicar os 9 posts a partir de 13/10 | Login nas contas e publicação (ação externa) | [redes/posts/](../estrategia/redes/posts/) | 🔒 |
| 11 | **E-mail no domínio** `contato@dumentre.com` no lugar do Gmail | Criar conta/serviço (pode ter custo) | site + scripts de abordagem | 🔒 |
| 12 | **Texto de lançamento no LinkedIn**: ok mencionar a experiência em "empresa grande"/"app de mídia nacional" sem nomear o empregador? | Validar o texto | [redes/README.md](../estrategia/redes/README.md) | ⏳ |
| 13 | **Revisar as provas de capacidade do site** (card "App de mídia nacional nas lojas") | Confirmar que pode usar essa descrição publicamente | site, seção #cases | ⏳ |

## P2 — anúncios e operação (depois do site no ar)

| # | Item | O que precisa do Luan | Onde | Status |
|---|---|---|---|---|
| 14 | **Orçamento de teste de anúncios** (sugestão ≈ R$ 945 em 21 dias) | Aprovar verba, criar contas Google Ads/Meta Business, cartão | [plano-anuncios.md](../estrategia/anuncios/plano-anuncios.md) | 🔒 |
| 15 | **GA4/GTM + Pixel da Meta** com evento `whatsapp_click` | Criar propriedades (login) | plano de anúncios | 🔒 |
| 16 | **Planejador de palavras-chave**: anotar volume e CPC reais antes de ativar | Rodar dentro da conta Google Ads | plano de anúncios | 🔒 |
| 17 | **WhatsApp Business**: catálogo com as ofertas e respostas rápidas | Configurar no celular | [scripts-abordagem.md](../estrategia/prospeccao/scripts-abordagem.md) | 🔒 |
| 18 | **Planilha de leads** (data, canal, nicho, oferta, qualificado, proposta, venda) | Escolher onde (Google Sheets/Notion) | plano de anúncios | ⏳ |
| 19 | **Modelo de proposta e contrato** para as ofertas (escopo, 2 rodadas de ajuste, 50/50, propriedade do código) | Validar termos (idealmente com contador/advogado) | — | ⏳ |
| 20 | **Favicon simplificado** para 16 px (o M some no tamanho mínimo) | Aprovar uma versão só com o D ou com o M mais grosso | [design.md](../marca/design.md) | ⏳ |

## P3 — depois dos primeiros clientes

- Fundir "Soluções" e "Comece pequeno" no site, se as ofertas fixas performarem.
- Página dedicada por oferta (landing para anúncio).
- Posicionamento "arquiteto de sistemas" (ticket R$ 10–30 mil) quando houver 3–5 cases.
- Limpar a worktree `dumentre-website-v2--redesign` depois do merge (`git worktree remove`).

## Entrada — varredura de conversas (2026-10-11)

Pendências encontradas nas conversas de Claude Code, Codex, OpenCode e AGY (15/09–11/10) que ainda não estavam acima. Triar: promover para P0–P3 ou descartar.

| Item | Origem | Status |
|---|---|---|
| **Máquina de vendas — escolher o próximo passo**: diagnóstico digital interativo no site (isca de leads), qualificação automática de leads no WhatsApp, CRM único para leads do site e do WhatsApp | AGY "Organização do Backlog e Vendas" (20/09) | ⏳ |
| **Estruturar oferta de desenvolvimento mobile** (React Native + Expo) | AGY "Analyzing Image Resolution Issues" (20/09) | ⏳ |
| **Mover `dumentre-website-v2` e `official-brand-assets`** de `personal/` para `dumentre/` | AGY "Configuração De Projetos Dumentre" (20/09); repos continuam em `personal/` | ⏳ |
| **Snapshots dos `CLAUDE.md`/`AGENTS.md` da Dumentre** em `claude-config/` desta KB | Mesma sessão; `claude-config/` já existe mas não foi conferido | ⏳ |
| **Lembrete para revisar a assinatura Claude** antes da renovação de 08/11 (revisão sugerida 01/11) | Codex "Configure o email do dumentre.com" (08/10); dados em [operations/claude.md](../operations/claude.md). Criar evento no calendário é ação externa | 🔒 |

## Entrada — varredura 2026-10-25

Pendências novas achadas nas sessões de Claude Code da pasta dumentre (22/10 a 25/10 e antigas). Nota: varredura 2026-10-25. Nenhum item acima foi marcado como feito: nenhuma sessão mostrou conclusão dos itens P0–P3.

| Item | Origem | Status |
|---|---|---|
| **Exportar métricas do Instagram da Julinho (2024 a 2026)** para a prestação de contas: export de 2026 pronto mas não baixado; 2024 e 2025 não feitos; série de seguidores sem dados. Varredura 2026-10-25 | Sessão e86b0d44 (parou em 17/10) | ⏳ |
| **Base do robô e git pull diário das referências**: confirmar se o Rakazo é o repo de base (Orca já clonado em `projects/references/`) e aprovar o pull diário no Agendador. Varredura 2026-10-25 | Sessão 1be088dc (21/10) | ⏳ |
| **Escolher referências e sugestões de design para o site**: artifact com referências do Pinterest; site não alterado; um pin sem site de origem confirmado. Varredura 2026-10-25 | Sessão 16cbb621 (22/10) | ⏳ |

## Registro de decisões

- [2026-10-08] Redesign feito em worktree separada para não misturar com o trabalho não commitado em `main`.
- [2026-10-08] O case Julinho entra como "em andamento", com fotos de alunos desfocadas e sem resultados inventados.
- [2026-10-08] Sites-proposta para prospects não usam logo, escudo nem fotos dos negócios; ficam locais e marcados como proposta.

## Decisões de 12/11/2026

- **12/11/2026 (decisão do Luan):** sem preço público; orçamento sob medida por IA (plano + horas + custo de infra do cliente ou do Luan) quando o cliente chamar no WhatsApp/Instagram/outro canal (DUM-01 v2). Prospecção automática aprovada: bots acham empresas, dão nota ao site e preparam a abordagem; envio é do Luan (DUM-13). Lote 1 aprovado, o Luan envia (DUM-04). Fonte: `C:\Users\luanc\projects\projects-knowledge-base\organizacao\decisoes-2026-11-12.md`.
- **12/11/2026 (DUM-01 v2 entregue):** especificação completa do fluxo de orçamento sob medida por IA (roteiro de descoberta, estimativa PERT, valor-hora de referência de R$ 150/h a confirmar pelo Luan em DUM-14, cenários de infra Cliente × Hetzner/Cloudflare, 3 exemplos fictícios e inventário de remoção de preços do site) em [`estrategia/orcamento-sob-medida.md`](../estrategia/orcamento-sob-medida.md) (`C:\Users\luanc\projects\dumentre\dumentre-knowledge-base\estrategia\orcamento-sob-medida.md`) e motor determinístico com testes em `C:\Users\luanc\projects\dumentre\orcamento\gerar_orcamento.py`.
