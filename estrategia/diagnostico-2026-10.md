# Diagnóstico Dumentre — outubro/2026

Data: 08/10/2026. Fontes: `dumentre.com` (no ar), repo `dumentre-website-v2`, logos no repo, perfis públicos (lidos sem login), notas do vault (`personal/brain/10 Projects/Dumentre - *.md`), case Julinho, KB da Exame. Prints: [desktop](diag-site-atual-desktop.png) · [celular](diag-site-atual-mobile.png).

## Resumo em 5 linhas

1. **O site tem bons textos e uma cara de template.** Azul-marinho, gradiente, janela de "mockup" com bolinhas de semáforo e selos coloridos em cada seção. É o visual padrão de agência de tecnologia; não deixa ninguém lembrar da Dumentre.
2. **Não há prova.** Nenhum case, nenhum print de trabalho, nenhum rosto, nenhum número. O cliente precisa acreditar no texto.
3. **Não há oferta comprável.** São 6 soluções e 8 "produtos de entrada" sem preço, sem prazo e sem pacote. O visitante não consegue decidir sozinho, e cada lead vira uma consultoria do zero.
4. **As redes estão vazias.** Instagram @dumentre.co com 0 posts e 1 seguidor. Facebook e LinkedIn criados, sem conteúdo visível. A busca por "Dumentre" no Google não traz a empresa.
5. **O ativo mais forte está fora do site:** o case Julinho (site Next.js + campanha "revista + figurinhas") e a bagagem técnica do Luan (app Exame+ nas lojas, APIs em AWS, automações, agentes de IA).

## Site (`dumentre.com`)

| O que funciona | O que atrapalha |
|---|---|
| Copy clara, voltada a dor ("WhatsApp bagunçado e lento", "Dependência exclusiva de indicação") | Visual de template SaaS escuro: Outfit + Inter, gradiente azul-roxo, badges coloridos por seção, cards repetidos 3 vezes (problemas, soluções, entrada) |
| CTA de WhatsApp em todo lugar, com mensagem pré-preenchida | O hero ilustra um "funil" com selos ON/UX/UI/ATIVO/MONITORANDO, uma linguagem de painel técnico que o dono de clínica não entende |
| JSON-LD LocalBusiness, canonical, favicon, testes Playwright | 14 cards de serviço sem hierarquia: excesso de escolha. Nada diz "comece por aqui" |
| Diferenciais reais (código é seu, monitoramento, performance) | Nenhum case, portfólio, rosto ou depoimento. "Equipe Dumentre" assina a citação, sem uma pessoa real |
| Página leve (HTML/CSS/JS estático) | E-mail `simplificasoftwares@gmail.com` (Gmail) enfraquece a confiança; o nome "Simplifica" aparece sem explicação |
| | Imagem OG = logo PNG; compartilhar o link no WhatsApp não mostra uma prévia vendedora |

Há trabalho local não commitado em `main` (rastreamento de cliques no WhatsApp com UTM e `dataLayer`). Ele foi **preservado intacto**; o redesign foi feito em worktree separada para não misturar (ver backlog).

## Marca

- **Logo:** monograma "DM" (D que abraça um M). O desenho é bom e defensável: simples, funciona em 16 px. O problema está no acabamento: as versões principais são PNGs de 1,8 a 2,4 MB **com textura metálica e vinheta gerada por IA**. Não existe um vetor mestre. O wordmark ("DUMENTRE" extendido, caixa alta) também só existe em imagem.
- **Cor:** azul-marinho + azul elétrico. É o território mais lotado da categoria (agências, SaaS, bancos digitais).
- **Tipografia:** Outfit, Inter e Montserrat ao mesmo tempo, sem papel definido para cada uma.
- **Significado não usado:** "Dumentre" vem do latim *dum interim*, "enquanto". O vault já tinha o conceito ("Enquanto você escala, nós garantimos a infraestrutura"), mas ele não aparece em lugar nenhum. É o gancho de marca mais barato e mais ownable que existe.
- **Posicionamento dividido:** o vault (abril/2026) descreve "arquitetos de sistemas autônomos", com ticket de R$ 10–30 mil e estética "carvão e ouro". O site vende para clínica, escolinha e comércio local. As duas coisas podem conviver (entrada local → contas maiores), mas hoje a marca não escolhe, e o site fala com os dois de um jeito genérico.

## Presença em redes (leitura pública, sem login, em 08/10/2026)

| Canal | Situação | Observação |
|---|---|---|
| Instagram @dumentre.co | 0 posts, 1 seguidor, 1 seguindo | O site aponta para @dumentre.co; o vault diz que @dumentre foi reservado. **Confirmar qual handle é o oficial** |
| Facebook /dumentre | Página existe ("Dumentre. Tecnologia") | Sem publicações visíveis sem login |
| LinkedIn /company/dumentre | Página existe | Sem descrição nem posts visíveis |
| Google (busca orgânica "Dumentre São Paulo") | Nenhum resultado da empresa | Há um link de Perfil de Empresa no Google Maps no site |
| X, TikTok, Threads, YouTube, GitHub | Reservados (segundo o vault) | Não prioritários agora |

Não consegui ver números de seguidores de FB/LinkedIn nem métricas do Perfil de Empresa sem login. Quando o Luan abrir esses painéis, vale anotar a linha de base no backlog.

## Oferta atual

- **Tudo é "fale conosco".** Sem preço, prazo ou entregável fechado. O próprio backlog do site deixou "tabela de planos" em prioridade baixa. Para faturar rápido, isso precisa virar prioridade alta.
- **O catálogo é largo demais para uma operação de 1 pessoa + IA.** Mobile, e-commerce, CRM, SEO local, chatbots, sistemas: tudo com o mesmo peso.
- **Oferta "de entrada" sem porta clara.** "Diagnóstico Digital Express" é a porta certa, mas fica como um card em 8.

## Ativos que dá para vender amanhã

| Ativo | Como vira venda |
|---|---|
| **Case Julinho** (site Next.js + Cloudflare, prévia de campanha com página de aprovação, análise de comunicação, direções visuais) | Case principal do site e do Instagram. Prova "site + marca + campanha". Fotos de alunos **sempre borradas** ou substituídas por layout |
| **Exame+** (app iOS/Android publicado, APIs serverless em AWS, login social, tracking, SEO/CWV) | Prova de capacidade técnica "de empresa grande", sem nomear telas ou dados internos: "app de mídia nacional publicado nas lojas" |
| **Automação/IA** (Conductor, email-hub, job-tracker, rotinas com agentes) | Prova para a oferta "automação com IA para pequeno negócio" |
| **Velocidade com Claude** | Prazos curtos e fixos (7 dias para site, 5 para campanha) como argumento, sem vender "IA" como buzzword |

## O que fazer (resumo das próximas seções)

1. Fechar **3 ofertas com preço e prazo** e uma porta de entrada paga → [ofertas.md](ofertas.md).
2. **Identidade nova** fora do azul-marinho, com o logo mantido e vetorizado → [identidade/](identidade/README.md).
3. **Site com case Julinho e ofertas visíveis** → branch `redesign/identidade-2026-10` ([site/](site/README.md)).
4. **Ocupar as redes** com 9 posts prontos e calendário de 30 dias → [redes/](redes/README.md).
5. **Prospecção ativa** antes de anúncio pago: 20 prospects, scripts e 2 sites-proposta → [prospeccao/](prospeccao/README.md).
6. **Anúncios** só depois de o site novo estar no ar e o rastreamento de WhatsApp commitado → [anuncios/](anuncios/plano-anuncios.md).
