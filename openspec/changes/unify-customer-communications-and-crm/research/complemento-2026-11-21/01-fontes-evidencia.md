# 01. Fontes e evidência (bibliografia do complemento)

Todas lidas em **2026-11-21** por GET público (sem login, sem custo, sem escrita). Cada leitura está em `fontes-log.jsonl` (URL, status, bytes, SHA-256 truncado). Trechos curtos e fiéis ao texto lido. **Lida** = conteúdo extraído e conferido. **Achada, não lida** = a página existe mas o conteúdo útil não foi extraído (dito em cada caso). Rótulos: P = primária oficial; C = código em tag fixa; K = KB local (somente leitura); S = secundária (só levanta hipótese).

## A. Meta (WhatsApp, Instagram, Messenger)
| # | URL exata | Rótulo | Estado | Trecho / o que sustenta |
|---|---|---|---|---|
| A1 | https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing | P | lida (HTML 2,3 MB) | Tabela "Currency / Launched in 2026? / List rates (CSV) …": "BRL \| July 1, 2026"; links dos downloads do CDN |
| A2 | CDN da Meta, arquivo "BRL list rates" (`…/829788045_…_n.csv`, assinada, expira) | P | **lida** (xlsx) | "Cost per message in BRL … effective October 1, 2026"; Brasil: Marketing 0.3217, Utility 0.035, Authentication 0.035, Service 0.035 |
| A3 | CDN da Meta, "BRL volume tiers" (`…/829269450_…_n.csv`) | P | **lida** (xlsx) | Brasil utility "List rate 0.035" até 250.000/mês |
| A4 | CDN da Meta, "BRL rates and volume tiers" (PDF 166 KB) | P | **baixada, não lida** por extração de texto | só confirma existência |
| A5 | https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing.md | P | lida | "Meta provides 1,000 free service messages per month … reset monthly"; FEP "may remain open for up to 7 days"; "Billing localization for Brazil … new Messaging accounts in BRL" |
| A6 | https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages.md | P | lida | "does not have a payment method on file by September 30, 2026, Meta will stop delivering service messages" |
| A7 | https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview.md | P | lida | "Webhook payloads can be up to 3 MB"; "retries delivery with decreasing frequency … for up to 7 days" |
| A8 | https://developers.facebook.com/docs/graph-api/webhooks/getting-started | P | lida (258 KB) | "sent in a batch with a maximum of 1000 updates. However batching cannot be guaranteed"; "over the next 36 hours"; header `X-Hub-Signature-256` |
| A9 | https://developers.facebook.com/documentation/business-messaging/messenger-platform/webhooks.md | P | lida | "continues to fail for 1 hour … unsubscribed from the webhooks for the Page or Instagram Professional account" |
| A10 | https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-instagram-login/messaging-api.md | P | lida | permissões `instagram_business_basic`, `instagram_business_manage_messages`; "up to 7 days from that message" (Click-to-Direct); "Requests folder … 30 days" |
| A11 | https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users.md | P | lida | "You must already be a Solution Partner or Tech Provider"; "version 2.24.17 or higher"; "fixed throughput of 20 mps"; histórico 180 dias; mídia só 14 dias |
| A12 | https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/overview.md | P | lida (parcial) | partner status e passos pós-fluxo |
| A13 | https://developers.facebook.com/docs/marketing-api/reference/adgroup (redireciona para `documentation/ads-commerce/marketing-api/reference/adgroup`) | P | lida | objeto Ad com `campaign_id`, `adset_id`; **`ads_read` não apareceu** (ausência ≠ prova) |
| A14 | https://developers.facebook.com/documentation/instagram-platform/webhooks.md | P | lida (5 KB) | sem informação de retry (não encontrada) |

## B. Hetzner
| # | URL | Rótulo | Estado | Trecho |
|---|---|---|---|---|
| B1 | https://www.hetzner.com/cloud/regular-performance/ | P | lida | CPX22 2 vCPU/4 GB/80 GB "€ 16.99 per month, excl. VAT"; CPX32 "€ 30.49" |
| B2 | https://www.hetzner.com/cloud/cost-optimized/ | P | lida | "CX33 not available … € 8.99"; backups "starting at: € 1.0980, excl. VAT" |
| B3 | https://docs.hetzner.com/cloud/billing/faq/ | P | lida | "Backups with a monthly flat price, which is 20% of the price of the server" |
| B4 | https://www.hetzner.com/pressroom/standardization-and-price-adjustment-of-our-server-products/ | P | lida | "Existing server contracts will keep their terms and conditions … changes apply exclusively to new orders and rescales" |
| B5 | https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/ | — | **404** (não lida) | citada pela rodada anterior |

## C. Chatwoot (código na tag `v4.20.1` e docs)
Base: `https://raw.githubusercontent.com/chatwoot/chatwoot/v4.20.1/<caminho>`; API: `https://api.github.com/repos/chatwoot/chatwoot/git/trees/v4.20.1?recursive=1` (árvore completa, `truncated=false`, 10.098 blobs).
| # | Caminho / URL | Estado | O que sustenta |
|---|---|---|---|
| C1 | `app/controllers/webhooks/whatsapp_controller.rb` | lida (98 linhas) | `perform_later` + `head :ok`; `app_secret_pending` aceita sem verificar; checagem de assinatura por canal/global |
| C2 | `app/controllers/concerns/meta_token_verify_concern.rb` | lida (71) | `OpenSSL::HMAC.hexdigest('SHA256', secret, request.raw_post)` |
| C3 | `app/jobs/webhooks/whatsapp_events_job.rb` | lida (185) | usa `entry[0].changes[0]`; mutex 30 s; retry de lock 20× |
| C4 | `app/services/whatsapp/incoming_message_whatsapp_cloud_service.rb` | lida (29) | `params[:entry].first['changes'].first['value']` |
| C5 | `app/services/whatsapp/incoming_message_base_service.rb` | lida (linhas 1-120 de 219) | `messages_data.first`, `statuses.first`, `lock_message_source_id!` |
| C6 | `app/services/whatsapp/message_dedup_lock.rb` | lida (19) | "Redis SET NX EX … DEFAULT_TTL = 1.day.to_i" |
| C7 | `app/services/whatsapp/incoming_message_service_helpers.rb` | lida (parcial) | `find_message_by_source_id`, `lock_message_source_id!`, `referral_attributes` |
| C8 | `app/actions/contact_merge_action.rb` | lida (73) | `@mergee_contact.reload.destroy!` |
| C9 | `app/javascript/dashboard/components/widgets/DashboardApp/Frame.vue` | lida (169) | `postMessage(JSON.stringify(eventData), '*')` com `currentAgent{id,name,email}` |
| C10 | `app/models/dashboard_app.rb`, `app/policies/dashboard_app_policy.rb`, `app/controllers/api/v1/accounts/dashboard_apps_controller.rb` | lidas | URL `^https?://`; criar/editar só administrador; ler: todos |
| C11 | `app/controllers/webhooks/instagram_controller.rb`, `app/jobs/webhooks/instagram_events_job.rb` | lidas (parcial) | segredos IG/FB; eco com `wait: 2.seconds`; `entries.each` |
| C12 | `config/routes.rb` (linhas 745-760) | lida | rotas `/webhooks/*`, `/bot` |
| C13 | `config/sidekiq.yml`, `app/jobs/application_job.rb` | lidas | `:max_retries: 3`; fila `low` |
| C14 | `app/builders/messages/message_builder.rb`, `app/controllers/api/v1/accounts/conversations/messages_controller.rb` | lidas (parcial) | criação de mensagem por API; `source_id` **não** localizado nos parâmetros lidos |
| C15 | `app/mailboxes/imap/imap_mailbox.rb`, `app/services/imap/base_fetch_email_service.rb` | lidas (hits) | `In-Reply-To`, dedupe por `message_id` |
| C16 | `Gemfile.lock`, `.ruby-version`, `.nvmrc` | lidos | PLATFORMS sem Windows; Ruby 3.4.13; Node 24.22.1 |
| C17 | https://developers.chatwoot.com/self-hosted/deployment/requirements.md | lida | "developed for Linux-based operating systems … virtual machine to run Chatwoot on windows" |
| C18 | https://developers.chatwoot.com/self-hosted/configuration/features/integrations/tiktok.md | lida | "unavailable for … EEA, Switzerland, or the United Kingdom"; webhook via console Rails; 48 h |
| C19 | https://developers.chatwoot.com/llms.txt | lida | índice; "Windows Development Setup … using WSL2" |

## D. Outros produtos
| # | URL | Rótulo | Estado | O que sustenta |
|---|---|---|---|---|
| D1 | `https://api.github.com/repos/{frappe/crm,frappe/erpnext,frappe/frappe,douglara/woofed-crm,espocrm/espocrm,freescout-help-desk/freescout,zammad/zammad,twentyhq/twenty,chatwoot/chatwoot}` e `/releases/latest` | P | lidas | versões, licenças SPDX, estrelas, últimos pushes |
| D2 | `frappe/crm@v16.3.0`: `crm/hooks.py`, `pyproject.toml`, `crm/api/whatsapp.py` | C | lidos | `app_license = "AGPLv3"`; `frappe>=16.0.0,<17.0.0`; resolução por telefone |
| D3 | `frappe/erpnext@v16.60.0`: `pyproject.toml`, `erpnext/crm/**` | C | lidos | `requires-python >=3.14`; `whatsapp_no` |
| D4 | `douglara/woofed-crm@main`: `README.md`, commits, tags | C | lidos | "Under development"; sem tags |
| D5 | `espocrm/espocrm@10.1.4`: `LICENSE.txt`; https://www.espocrm.com/pricing/ | C/P | lidos | AGPL-3.0; "All the plans include the Advanced Pack extension" |
| D6 | https://www.espocrm.com/extensions/advanced-pack/ | P | **achada, preço não lido** (942 caracteres de texto; página dinâmica) | |
| D7 | https://freescout.net/modules/ | P | lida | "WhatsApp Integration Module", "Facebook Integration Module" |
| D8 | https://docs.zammad.org/en/latest/prerequisites/hardware.html | P | lida | "2 CPU cores · 6 GB of RAM (+4 GB if you want to run Elasticsearch …)" |
| D9 | https://docs.frappe.io/framework/user/en/installation | P | lida | "MariaDB 11.8 · Python 3.14 · NodeJS 24"; sem RAM |
| D10 | https://business-api.tiktok.com/portal/docs?id=1832183871604753 | P | **achada, não lida** (SPA: só "TikTok API for Business") | |

## E. KB local (somente leitura)
| # | Caminho | Uso |
|---|---|---|
| E1 | `projects-knowledge-base/wiki/central-pesquisas-2026-10-26/hetzner-passo-a-passo.md` (linhas 76-82) | VPS = `openbao-platform-prod-openbao`, CPX22; "Não é da Dumentre" |
| E2 | `…/hetzner-automacao-agentes.md`, `…/hetzner-health-updates-dr.md`, `…/handoff-servidor-hetzner.md` | VPS único; acesso por NetBird; VM local só planejada |
| E3 | `projects-knowledge-base/organizacao/backup-estado-2026-11-18.md` | backup de estado do servidor e do PC (timer, restic, age) |
| E4 | `projects-knowledge-base/backlog/meubot-codex-orca-20261108.md` (linha 38) | hypervisor presente; 68,4 GB de RAM; Windows Sandbox candidato |

## F. Secundárias (WebSearch, só hipóteses; não decidem)
Resultados de busca sobre TikTok Business Messaging (Wati, SleekFlow, Trengo, Infobip, respond.io): "Advanced Access" exigido desde abril/2026 (S, não verificado no portal); Hetzner: títulos de páginas de pressroom (cada uma depois lida diretamente, ver B).
