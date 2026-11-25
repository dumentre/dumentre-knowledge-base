# 04. Matriz de canais, anúncios e custos: complemento por operação

Leitura em **2026-11-21**. Complementa `../04-matriz-canais.md`; onde divergir, vale este arquivo (errata E-09 a E-14). **Nenhuma linha está "comprovada contra conta real"**: não houve acesso autorizado a conta Meta, TikTok, e-mail ou Telegram. Rótulos de evidência:

- **doc**: fonte oficial lida (URL em `01-fontes-evidencia.md`).
- **cód**: no código do Chatwoot `v4.20.1`, **lido**, não executado.
- **mock**: exercitado contra fixture no protótipo P1 (prova o **nosso** código, não o provedor).
- **conta**: depende de conta, permissão, revisão, região ou elegibilidade da Dumentre.
- **pend**: pendente, precisa de prova com conta (sandbox).
- **desc**: desconhecido (nenhuma evidência).

## 1. Operações, história, ecos, permissões, origem e custo

| Canal | Receber | Responder / janela | Iniciar conversa | Eco (enviado fora da inbox) | Histórico | Permissões / acesso | Origem (anúncio) | Custo |
|---|---|---|---|---|---|---|---|---|
| **WhatsApp Cloud API** | doc `messages` + `statuses`; lote ≤ 1000; payload ≤ 3 MB; mock | texto livre só com janela de 24 h (reabre a cada mensagem do usuário); fora dela só template; doc | só **template** (marketing R$ 0,3217 / utility R$ 0,035 por entregue); doc | `smb_message_echoes` **só com coexistência**; Chatwoot trata (cód); webhook atual ignora; **coexistência exige Tech Provider/Solution Partner (doc)** → conta/pend | coexistência: 180 dias via `history`; ids de mídia só dos últimos 14 dias; grupos não; doc | Token do número; assinatura HMAC com App Secret; inscrição do app na WABA; callback por app/WABA/**número** (override); doc | `referral` CTWA: `source_id`, `source_url`, `ctwa_clid` (omitido em Status), `headline`…; campanha/conjunto **não** vêm: Marketing API + permissão (conta/pend); Chatwoot guarda (cód) | rate card BRL lido; franquia 1.000 service/mês/número; FEP até 7 dias; **sem método de pagamento = sem entrega de service**; teto do fornecedor: não achado |
| **Instagram Direct** | doc `messages`, `messaging_referrals`, `messaging_seen`, `messaging_postbacks`, `messaging_reactions`; Chatwoot itera `entry` (cód); mock só texto | 24 h; **até 7 dias** após 1ª mensagem vinda de anúncio Click-to-Direct (doc); Chatwoot: limite 1000 caracteres, sem status "read" (doc Chatwoot) | **não** via Chatwoot ("primeira mensagem do contato"); Private Reply a comentário: doc Meta, não lido hoje | `is_echo` (doc); Chatwoot deduplica eco com atraso de 2 s (cód); **protótipo descarta** (exec C3) | Conversations API lista ids e **detalha só as 20 mais recentes** (doc, rodada anterior); Requests inativas > 30 dias não retornam (doc) | Instagram Login: `instagram_business_basic` + `instagram_business_manage_messages`; negócio próprio: Standard Access, sem App Review (doc app-review); testador precisa de papel no app; conta profissional (conta) | `referral{ref, ad_id, source=ADS, type, ads_context_data}` (doc); **Chatwoot não guarda** (cód: nenhum hit em 49 arquivos de `app/(services\|builders\|jobs)/(instagram\|messages\|facebook\|webhooks)`) | nenhuma tarifa achada; limites de taxa não lidos (desc) |
| **Messenger** | doc; rota Chatwoot `POST /bot` (cód, gem `facebook-messenger`); mock: não coberto | 24 h; "Human Agent" 7 dias: **não reconfirmado** em fonte primária | não via Chatwoot (doc Chatwoot) | `message_echoes` (doc, rodada anterior) | Conversations API (limites não lidos) | Página + app; Standard Access para negócio próprio (doc) | `referral{ref, ad_id, source=ADS\|SHORTLINK, ads_context_data}` (doc); Chatwoot não guarda (cód) | nenhuma tarifa achada |
| **E-mail** | Chatwoot IMAP: threading por `In-Reply-To`, dedupe por `Message-ID` (cód); hoje só recebe (Cloudflare Email Routing → Gmail, rodada anterior) | SMTP de saída **não configurado** (backlog 27); decisão D11 | livre | pasta Enviados: **não localizei** busca (desc) | IMAP (desc) | credenciais/app password (conta) | `utm` só se o site os enviar no formulário (declarada) | depende do SMTP (desc) |
| **Telegram** | Chatwoot `POST /webhooks/telegram/:bot_token` (cód) | bot; só responde após o usuário iniciar (`/start`) (doc Chatwoot) | não | n/a | bot não lê histórico (doc Telegram, rodada anterior) | token do BotFather | `?start=` deep link (doc) | grátis; broadcast > 30 msg/s só com paid broadcast opt-in (doc rodada anterior) |
| **TikTok Business Messaging** | doc Chatwoot (`tiktok.md`): webhook aponta **direto** para `{Chatwoot}/webhooks/tiktok` (console Rails: `Tiktok::AuthClient.update_webhook_callback`) → **não passa pela borda** | janela de 48 h (doc Chatwoot), texto apenas | não | desc | desc | **aprovação** da API ("a few days"), conta **Business** em região elegível: indisponível em **EEA, Suíça e Reino Unido**; **Brasil não é citado** (conta/pend); "accept DMs from everyone"; token de refresh expira em 30 dias (doc Chatwoot); portal oficial é SPA (só o título lido) | desc | desc |
| **Site (chat/formulário/UTM)** | widget do Chatwoot (doc) ou formulário próprio | — | — | — | — | — | `utm_*` anexado ao texto do `wa.me`: **declarada**, editável pelo cliente (rodada anterior) | zero |
| **Lead Ads** | webhook `leadgen{leadgen_id, page_id, form_id, adgroup_id, ad_id}` (doc, rodada anterior); dados do lead exigem Graph com `leads_retrieval`+`ads_management`+`pages_*` | n/a | n/a | n/a | n/a | permissões com revisão (conta/pend) | identifica anúncio e formulário; sem DM | desc |
| **Marketing API (enriquecimento)** | GET do anúncio devolve `campaign_id`, `adset_id` (campos do objeto Ad, doc `reference/adgroup`); **permissão `ads_read` não confirmada nesta leitura** (a string não apareceu na página; ausência não é prova) | n/a | n/a | n/a | n/a | conta + permissão (conta/pend) | converte `ad_id` em campanha/conjunto/criativo | cobrança desc |

## 2. Webhooks Meta: confiabilidade por produto (impacta o desenho da borda)

| Produto | Retry documentado | Consequência |
|---|---|---|
| WhatsApp | "decreasing frequency ... up to 7 days"; retries também a todos os apps inscritos; duplicatas possíveis (`webhooks/overview.md`) | borda pode ficar fora por horas sem perder |
| Messenger/Instagram | "immediately try a few more times"; alerta aos **15 min**; **após 1 h falhando, o app é desinscrito** da Página/conta Instagram (`messenger-platform/webhooks.md`) | borda fora > 1 h = **perda e reinscrição manual** |
| Graph genérico | "retry ... over the next 36 hours"; "batch ... maximum of 1000 updates" (`graph-api/webhooks/getting-started`) | tratar cada update individualmente |

## 3. O que o Chatwoot guarda de cada superfície
WhatsApp: `referral` em `content_attributes[:referral]` (cód). Instagram/Messenger/TikTok: **nenhum campo de anúncio** (cód, escopo acima). Logo, atribuição de Direct/Messenger **depende da borda** (bruto da Meta), e TikTok não passa pela borda (sem bruto).

## 4. Capacidades por superfície, em classes
- **Comprovado (mock):** texto simples WhatsApp com BSUID/telefone, reentrega, ordem de status, identidade/vínculo/reversão (parcial: ver F-05/F-10), outbox com CRM simulado, canal novo só-recebe.
- **Código lido, não executado:** processamento do Chatwoot (F-01, F-02, F-08), dedupe de e-mail e threading, rotas de entrada.
- **Documentado, não testado:** todas as capacidades de Meta/TikTok/Telegram acima.
- **Depende de conta (pendente):** coexistência (Tech Provider), `ads_read`, TikTok (aprovação/região), Instagram profissional, Lead Ads.
- **Desconhecido:** tarifas TikTok/Marketing API; Enviados do IMAP; tributos do rate card.
