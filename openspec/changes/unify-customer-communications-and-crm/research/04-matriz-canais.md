# 04. Matriz por canal e por capacidade (Rodada 3)

Data da leitura: 2026-11-21. **Nenhuma capacidade abaixo está "comprovada" contra conta real**: não houve acesso autorizado a conta Meta nem envio. As provas locais (P0, P1) mostram o que **o nosso código** faz com fixtures, não o que a Meta entrega. Rótulos usados:

- **doc** documentada em fonte oficial lida hoje (URL em `10-fontes.md`)
- **cod** confirmada no código do Chatwoot v4.20.1 (tag fixa), não em execução
- **conta** depende de permissão, revisão, elegibilidade ou configuração da conta Dumentre
- **mock** exercitada contra fixture local nossa (P0/P1): prova nosso comportamento diante do contrato, não o provedor
- **indisp** indisponível
- **s/e** sem evidência suficiente

## 1. Mensagens

| Capacidade | WhatsApp (Cloud API) | Instagram Direct | Messenger | E-mail | Site (chat) | Telegram | TikTok |
|---|---|---|---|---|---|---|---|
| Receber DM | doc (`messages`, até 3 MB, retry 7 dias); **mock** | doc (`messages`) + conta | doc (`messages`) + conta | canal de e-mail existe no Chatwoot (doc: entrada/saída, 25.000 caracteres; detalhes IMAP/SMTP **não lidos**) + conta; hoje só recebe (Cloudflare Email Routing → Gmail) | doc Chatwoot (widget) | doc Chatwoot | doc Chatwoot; **conta** (aprovação TikTok, região) |
| Responder | doc, texto livre só com janela de 24 h aberta (a cada msg do usuário); depois só template | doc; janela 24 h (7 dias com Human Agent, via Chatwoot) | doc; idem | s/e para enviar como `@dumentre.com` (backlog 27: SMTP de saída não configurado) | doc | doc (bot) | doc Chatwoot; **sem envio após 48 h** |
| Iniciar conversa | doc, **só template** (cobrado) | **indisp** pelo Chatwoot ("primeira mensagem tem que ser do contato"); Private Reply 1 vez a comentário (doc Meta) | **indisp** (Chatwoot) | doc (sem restrição) | doc, só a contatos verificados | **indisp** (usuário precisa dar `/start`) | **indisp** |
| Anexos (saída, via Chatwoot) | doc: áudio aac/amr/mp3/m4a/ogg 16 MB, imagem png/jpeg 5 MB, vídeo 3gp/mp4 16 MB, documento | doc: áudio/imagem/vídeo 25/16/25 MB, **documento não suportado** | doc: imagem 8 MB, áudio/vídeo 25 MB, documento 25 MB | doc | doc | s/e | s/e |
| Áudio recebido | doc (`type=audio` + id de mídia; URL expira); **mock** do tipo; baixar a mídia = tarefa | doc (`is_unsupported` quando não suportado) | s/e | n/a | s/e | s/e | s/e |
| Status de entrega | doc `statuses` sent/delivered/read/failed (até 3 por mensagem); **mock** ordem fora de sequência | doc `messaging_seen`; **Chatwoot não mostra "read" no Instagram** | doc `message_reads`/`message_deliveries` | só "sent" (Chatwoot) | doc | só sent/failed | doc Chatwoot sent/read/delivered/failed |
| Threading | n/a (1 conversa por contato) | n/a | n/a | s/e: threading por `Message-ID`/`In-Reply-To` **não verificado** no Chatwoot | n/a | n/a | n/a |
| Enviadas fora da inbox (app/celular) | doc `smb_message_echoes` **só com coexistência**; **webhook atual ignora** | doc `is_echo=true` no `messages` | doc `message_echoes` | s/e (só se IMAP expõe "Enviados") | n/a | n/a | s/e |
| Histórico antigo | doc coexistência: **6 meses de conversas 1:1** (webhook `history`) + contatos; **grupos não**; conta | doc: Conversations API lista os IDs mas **só detalha as 20 mensagens mais recentes**; conta | doc Conversations API (limites não extraídos) | IMAP (s/e) | n/a | indisp (bot não lê histórico) | s/e |
| Comentários | n/a | doc campo `comments` + `instagram_manage_comments`; **capacidade distinta de DM** | s/e (campo `feed` não lido) | n/a | n/a | n/a | n/a |
| Menções | n/a | doc campo `mentions` (mesma permissão de comentários) | s/e | n/a | n/a | n/a | n/a |
| BSUID / identificador | doc: usuário com username pode vir **sem telefone**; identificar por `user_id`; cod Chatwoot trata; **mock** | IGSID por conta (doc) | PSID por Página (doc) | endereço de e-mail | visitante | chat id | id TikTok (s/e) |
| Custo por mensagem enviada | ver `05-custos-capacidade.md` | nenhuma tarifa encontrada nesta leitura (s/e; limites de taxa não lidos) | idem | custo do SMTP | zero | zero (paid broadcast opt-in) | s/e |

## 2. Anúncios, formulários e atribuição

| Superfície | Campos documentados | Onde chega | Lacuna |
|---|---|---|---|
| Click-to-WhatsApp | `referral{source_url, source_id(=ad id), source_type, body, headline, media_type, image/video/thumbnail_url, ctwa_clid, welcome_message}`; `ctwa_clid` omitido no posicionamento Status (doc) | webhook `messages` do WhatsApp | **Campanha e conjunto não vêm**; precisam de consulta à Marketing API com permissão de anúncios (**conta**). Chatwoot guarda o `referral` (cod). Janela gratuita de entrada para anúncios CTWA (doc; duração não extraída). |
| Click-to-Instagram-Direct | `referral{ref, ad_id, source=ADS, type=OPEN_THREAD, ads_context_data{ad_title, photo_url\|video_url}}` (doc) | `messages` do Instagram | **Chatwoot não guarda** (cod: nenhum `referral` em Instagram/Facebook). Só a borda de ingestão preserva. |
| Click-to-Messenger | `referral{ref, ad_id, source=ADS\|SHORTLINK, type, ads_context_data{ad_title, photo_url, video_url, post_id, product_id, flow_id}}` (doc) | `messages`/`messaging_referrals` | idem: borda. |
| Lead Ads (formulário) | webhook `leadgen{leadgen_id, page_id, form_id, adgroup_id, ad_id, created_time}`; dados do lead e campos exigem Graph com `leads_retrieval` + `ads_management` + `pages_*` (doc) | webhook da **Página** (objeto `page`) | **conta + permissão (revisão)**; o webhook não traz dados pessoais. |
| Site com UTM | `utm_*` lido em `script.js` e anexado ao **texto** do `wa.me` (lido) | texto da primeira mensagem | **O cliente pode editar ou apagar o texto**: atribuição "declarada", nunca "verificada". Alternativa de maior confiança (hipótese a provar): enviar a UTM para o núcleo no clique e casar por `ref`/código curto. |
| Visualização/impressão | nenhum dado individual | n/a | Fica **sem atribuição** (AT-03.6). |

## 3. Permissões e revisão (Meta)

- Instagram: negócio próprio com app que serve **só ao próprio negócio** → **Standard Access, App Review não exigido** (doc); Tech Provider exige Advanced Access com revisão. Login: Instagram Login **ou** Facebook Login, não ambos no mesmo app (doc). **conta**: confirmar tipo de conta (profissional) e vínculo com a Página.
- Webhooks Instagram: `messages`, `messaging_referral`, `message_reactions`, `messaging_postbacks`, `messaging_seen` exigem `instagram_manage_messages`; `comments`/`mentions` exigem `instagram_manage_comments` (doc).
- WhatsApp: **override do callback por número comercial ou por WABA** (doc) permite apontar o número de teste para outro endpoint sem mexer no callback do app; templates e `account_*` não aceitam override.

## 4. Capacidade por canal que o plano promete (fase)

| Canal | Fase | Promessa | Condição |
|---|---|---|---|
| WhatsApp | F1 (borda), F2 (inbox) | receber, registrar, responder na janela, status, eco | número de teste + destinatário permitido (pendente-externo) |
| Instagram Direct, Messenger | F3 | receber, responder, atribuição por `referral` | conta, vínculo Página/IG, permissões |
| E-mail | F3 | receber e responder | escolher SMTP de saída (D11) |
| Site/UTM | F3 | origem declarada | deploy do site (fora do escopo) |
| Telegram | F3 (extensão) | receber e responder após `/start` | token de bot |
| TikTok | extensão condicional | só se a API for aprovada | aprovação TikTok, região, 48 h |
| X e novas redes | extensão condicional | **sem evidência**: nenhuma API foi pesquisada; entram só pelo contrato de adaptador (AT-14) | API, permissões e custo |

## 5. Contradição entre docs e código encontrada
O Chatwoot documenta WhatsApp, Instagram e Messenger como suportados, mas **o código da tag v4.20.1 só preserva `referral` no WhatsApp**. Para o requisito de atribuição (AT-03) vale o código: a documentação de canais do Chatwoot não promete atribuição por anúncio.
