# 10. Fontes (URL exata, data, versão, comportamento que sustenta a afirmação)

Todas lidas em **2026-11-21** por GET público (sem login, sem escrita). Cada leitura registrada em `fontes/fetch-log.jsonl` (URL, status, bytes, SHA-256 truncado). Ferramentas: `evidence/tools/fetch_excerpt.py` (páginas) e `evidence/tools/chatwoot_grep.py` (código-fonte numa tag fixa). **Primárias** decidem; **secundárias** (marcadas S) só levantam hipótese.

## Meta (WhatsApp, Instagram, Messenger)

| Afirmação decisiva | URL | Versão/data |
|---|---|---|
| Cobrança por mensagem entregue, só empresa→usuário; categorias; franquia de 1.000 service/mês por número a partir de 01/10/2026; janela de entrada (CTWA) sem cobrança; Business Agent US$ 2,00/1M tokens; rate card BRL existe desde 01/07/2026 | https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing.md | página "efetiva desde 01/10/2026" |
| Sem método de pagamento até 30/09/2026 → Meta para de entregar service; categorias service × Business Agent | https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages.md | idem |
| Cobrança pré-paga só na Índia (não há teto duro no Brasil) | https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/prepaid-billing.md | idem |
| Webhook `messages`/`statuses`, BSUID (`user_id`, `from_user_id`), `wa_id` pode faltar | https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/messages (redirecionado de /docs/whatsapp/cloud-api/webhooks/components) | Graph API v26/27 |
| `referral` do Click-to-WhatsApp (`source_id`, `source_url`, `ctwa_clid`, `headline`…) | https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/reference/messages/text.md | idem |
| Payload até 3 MB; retry até 7 dias; duplicatas possíveis | https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview.md | idem |
| Override do callback por número/WABA; campos suportados | https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/override.md | idem |
| Coexistência: 6 meses de histórico 1:1, contatos, grupos não | https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users.md | idem |
| Índice dos webhooks do WhatsApp (`smb_message_echoes`, `history`, `pricing`…) | https://developers.facebook.com/documentation/business-messaging/whatsapp/llms.txt | idem |
| Messenger `referral` com `ad_id`, `ads_context_data` | https://developers.facebook.com/documentation/business-messaging/messenger-platform/webhooks/webhook-events/messaging_referrals.md | idem |
| Instagram: `referral` no `messages`, `is_echo`, `reply_to`, `is_unsupported` | https://developers.facebook.com/documentation/instagram-platform/webhooks/examples.md | idem |
| Instagram: campos de webhook × permissão | https://developers.facebook.com/documentation/instagram-platform/webhooks/fields.md | idem |
| Instagram: Standard Access sem App Review para negócio próprio; Facebook Login **ou** Instagram Login | https://developers.facebook.com/documentation/instagram-platform/app-review.md | idem |
| Instagram: Conversations API só detalha as 20 mensagens mais recentes | https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/conversations-api.md | API v27.0 |
| Lead Ads: `leadgen{leadgen_id, page_id, form_id, adgroup_id, ad_id}`; permissões `leads_retrieval`, `ads_management` | https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving | idem |

## Chatwoot

| Afirmação | URL | Versão |
|---|---|---|
| Licença MIT fora de `enterprise/` | https://raw.githubusercontent.com/chatwoot/chatwoot/develop/LICENSE | `develop` em 2026-11-21 |
| Release mais recente | https://api.github.com/repos/chatwoot/chatwoot/releases/latest | v4.20.1, 2026-11-20T08:29:49Z |
| Community US$ 0; Captain, voz, branding, capacity, papéis, SSO, SLA **não incluídos** | https://www.chatwoot.com/pricing/self-hosted-plans | 2026-11-21 |
| Requisitos: 4 cores, 4 GB mínimo exigido (10 mil conversas/dia), swap 1 GB, Sidekiq 1 GB+, Postgres, Redis 7 | https://developers.chatwoot.com/self-hosted/deployment/requirements | idem |
| `/deploy`: 8 GB mínimo (16 recomendado), 60 GB, Postgres 16 + pgvector, Redis 7, Node 24, Ruby 3.4 | https://www.chatwoot.com/deploy | idem (**diverge** da doc técnica) |
| Recursos por canal: limites de caracteres, restrições de saída, status, anexos | https://developers.chatwoot.com/self-hosted/supported-features | idem |
| Edição Enterprise proprietária, mesma base de código | https://developers.chatwoot.com/self-hosted/enterprise-edition | idem |
| `referral` só no WhatsApp; ausência de funil; Dashboard Apps; merge de contatos; BSUID; webhooks sem retry; rotas de webhook de entrada | código na tag **v4.20.1** (`app/services/whatsapp/incoming_message_base_service.rb`, `incoming_message_service_helpers.rb`, `incoming_message_identifier_helper.rb`, `lib/webhooks/trigger.rb`, `app/models/webhook.rb`, `app/controllers/webhooks/whatsapp_controller.rb`, `app/jobs/webhooks/whatsapp_events_job.rb`, `config/routes.rb`, `lib/events/types.rb`) em https://raw.githubusercontent.com/chatwoot/chatwoot/v4.20.1/ | v4.20.1 |

## Outros produtos

| Afirmação | URL | Versão / rótulo |
|---|---|---|
| Estrelas, licença SPDX, último push (Frappe CRM AGPL-3.0, ERPNext GPL-3.0, Twenty NOASSERTION, EspoCRM AGPL-3.0, Woofed MIT) | API GitHub `repos/<org>/<repo>` | 2026-11-21 |
| Frappe CRM: Lead Syncing Meta é **beta** | https://docs.frappe.io/crm/lead-syncing/meta | 2026-11-21 |
| Frappe CRM: WhatsApp via app de terceiro; Twenty, Odoo, EspoCRM, SuiteCRM (comparações) | Thread Discord/Hermes de 21/11 (`estrategia/thread-discord-crm-…md`) | **S**, não reverificado |
| Telegram: ~1 mensagem/s por chat, 20/min em grupo, ~30/s em massa; paid broadcast 0,1 Stars | https://core.telegram.org/bots/faq | 2026-11-21 |
| TikTok: aprovação, região, 48 h | WebSearch (Chatwoot docs, respond.io, Wati, Qiscus, TikTok FAQ) | **S**; portal oficial é JS e não foi lido |
| NFS-e SP: adesão ao ADN 2022, emissor próprio mantido, adoção gradual do Emissor Nacional (comunicado 24/06/2026) | WebSearch (prefeitura.sp.gov.br, EY, Machado Meyer, gov.br/nfse) | **S**; cronograma não confirmado |
| Hetzner: preços e reajuste de 15/06/2026 | WebSearch (bitdoze, findstack, whtop) | **S**; página oficial `docs.hetzner.com/.../price-adjustment` devolveu **404** |
| ERPNext: sem requisito oficial único de RAM em produção | WebSearch | **S** |

## Fontes locais
`dumentre-knowledge-base` (HEAD `ec47a64` + arquivos não versionados), `conectores/whatsapp-business-mcp` (HEAD `03584b1`), `dumentre-website-v2` (HEAD `553a5e2` + alterações locais), servidor Hetzner (leitura SSH de 2026-11-21T13:25:46Z). Detalhes em `01-inventario.md`.

## Divergências registradas (docs × código × resultados)
1. Chatwoot `/deploy` (8 GB) × doc técnica (4 GB mínimo) × nota da KB (2 CPU/4 GB): **adotado o mais conservador** e exigida medição.
2. Doc de canais do Chatwoot promete Instagram/Messenger; **o código não preserva `referral`** nesses canais.
3. Decisão de 14/11 ("custo zero") × doc de preços (franquia por número, exige pagamento).
4. Webhook atual: limite 256 KB × Meta 3 MB; ignora `statuses`/ecos/BSUID × doc.
5. Hermes citou "Instagram não importa histórico" de forma geral; a doc diz "lista IDs, detalha 20 mais recentes".
