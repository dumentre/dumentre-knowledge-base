# 05. Revisão adversarial (complemento de 21/11/2026)

Método: ler o **código da versão fixada** (Chatwoot `v4.20.1`, tag; leitura por `raw.githubusercontent.com`) e a documentação **oficial**, e confrontar com o `design.md`, `tasks.md` e o protótipo P1. **Ausência de resultado de grep não é prova de inexistência**: onde usei grep, o texto diz o escopo lido e marca o limite. Rótulos: **[código]** lido no fonte da tag; **[doc]** fonte oficial lida; **[exec]** executado aqui; **[hipótese]** inferência que pede prova. Severidade: **S1** invalida uma decisão ou perde dado; **S2** exige mudança de desenho; **S3** ajuste.

Ferramentas reproduzíveis: `evidencia/tools/repogrep.py` (código em tag fixa), `evidencia/tools/lerfonte.py` (páginas), `evidencia/prova/caracterizacao-prototipo-p1.test.mjs` (3 verificações executadas). Log de leituras: `fontes-log.jsonl`.

## F-01 [S1] Repasse "fiel" do lote perde mensagens no Chatwoot [código + doc]
- A Meta **agrega até 1000 atualizações por POST** e avisa que o lote "cannot be guaranteed" (https://developers.facebook.com/docs/graph-api/webhooks/getting-started, lido 21/11).
- O Chatwoot lê só o primeiro elemento: `IncomingMessageWhatsappCloudService#processed_params = params[:entry].first['changes'].first['value']` e, depois, `messages_data.first` (`process_messages`, `create_messages`) e `@processed_params[:statuses].first` (`process_statuses`). Também `WhatsappEventsJob` escolhe canal, remetente e eco por `entry[0].changes[0]`.
- Logo, o **repasse byte a byte de um lote** (premissa de `design.md:43` e `tasks.md:34`) cria **apenas a 1ª mensagem**; o Chatwoot responde 200 e as demais somem sem erro. (O protótipo extrai todas: C2 em `evidencia/prova/`, 3/3 verde.)
- **Correção:** a borda divide o lote em **um POST por mensagem/status** e **re-assina** com o App Secret (a borda já o tem para validar). Isso troca "assinatura original" por "assinatura da borda sobre o corpo normalizado", e o Chatwoot aceita se o mesmo segredo estiver no canal (`app_secret`) ou em `WHATSAPP_APP_SECRET` (lido em `meta_token_verify_concern.rb`). Instagram não sofre: `Webhooks::InstagramEventsJob` itera todas as `entry`.
- **Prova que falta:** instalar o Chatwoot e enviar um lote sintético de 2 mensagens (gate G-F01).

## F-02 [S1] "200 do Chatwoot" significa apenas "enfileirado"; falha posterior pode perder a mensagem sem erro [código]
- `Webhooks::WhatsappController#process_payload` faz `perform_later` (Redis) e `head :ok`. Se o Redis estiver fora, o `perform_later` falha e a resposta não será 200 (comportamento esperado, **não executado**); se o job falhar depois, ninguém é avisado (`config/sidekiq.yml` `:max_retries: 3`; fila `low`).
- Pior: `process_messages` faz `return if find_message_by_source_id(id)` e `return unless lock_message_source_id!`. O lock é `Redis SET NX EX 1 dia` em `MESSAGE_SOURCE_KEY::<wamid>` (`message_dedup_lock.rb`), **adquirido antes** de criar contato, conversa e mensagem. Procurei remoção dessa chave nos arquivos `.rb` de `app|lib|config|enterprise` (1731 candidatos; falhas de GET são ignoradas pela ferramenta) e **não achei `delete`**. **[hipótese forte, não executada]:** se `set_contact`, a transação ou a baixa de mídia falharem **depois** do lock, a nova tentativa do Sidekiq encontra o lock, retorna sem criar a mensagem e sem erro, e a mensagem **não existe** no Chatwoot por até 1 dia (e a Meta não reenvia, pois recebeu 200).
- **Correção do desenho:** a outbox da borda passa a ter **dois estados**: `enviado` (200) e `confirmado` (a mensagem existe no Chatwoot, verificado por API: `GET /api/v1/accounts/:id/conversations/:cid/messages` ou busca por `source_id`). Sem confirmação em N minutos: alerta e **reinjeção** (exige remover a chave Redis `MESSAGE_SOURCE_KEY::<wamid>`, operação administrativa, ou criar a mensagem pela API de aplicação: `Messages::MessageBuilder` aceita `message_type`, mas **não li** parâmetro `source_id` na API pública; tratar como pergunta aberta). O conteúdo nunca se perde porque fica em `raw_event`.
- **Prova que falta (gate G-F02):** no Chatwoot real, injetar falha após o lock (ex.: indisponibilizar o download da mídia) e reenviar o mesmo `wamid`; observar se a mensagem aparece.

## F-03 [S1] Instagram e Messenger: 1 h de borda fora desinscreve o app [doc]
- https://developers.facebook.com/documentation/business-messaging/messenger-platform/webhooks.md: "If delivery of a notification continues to fail for 1 hour ... your app will be unsubscribed from the webhooks for the Page or Instagram Professional account. Once you have fixed the issues you will need to subscribe to the Webhooks again." Alerta ao desenvolvedor aos 15 min.
- `design.md:99` e `:149` afirmam que "a Meta retenta por até 7 dias: nada se perde". Isso vale ao WhatsApp (`overview.md`), **não** a Instagram/Messenger.
- **Correção:** disponibilidade da borda vira requisito explícito (monitor externo, alerta aos 5 min, verificação de `subscribed_apps` a cada 10 min por objeto, runbook de reinscrição com autorização). O **corte e a manutenção** da borda precisam de janela < 15 min para IG/Messenger ou de um endpoint sombra.

## F-04 [S1] "Dashboard App autentica o usuário por token assinado" não existe na edição lida [código]
- `Frame.vue#sendContext`: `postMessage(JSON.stringify({event:'appContext', data:{conversation, contact, currentAgent:{id,name,email}, customAttributes, theme}}), '*')`. A URL do iframe é `configItem.url` **fixa** (validada só como `^https?://` em `DashboardApp#validate_content`). Não há token, assinatura ou templating da URL.
- `DashboardAppPolicy`: `index?`/`show?` `true` para todo agente; só administrador cria/edita/apaga.
- Consequência: o servidor do painel **não tem como saber quem é o agente** só pelo iframe; o contexto vem do navegador e pode ser forjado por quem abrir a URL direto. `design.md:124` e `tasks.md` 2.6 ("autenticação assinada do usuário do Chatwoot") estão **sem suporte**.
- **Substituto:** o núcleo tem **sessão própria** (login do operador, pelo menos atrás da NetBird/forward-auth do Traefik); o iframe usa o `contact.id`/`conversation.id` do `postMessage` apenas como **dica de navegação**, nunca como autorização. Servir o painel em domínio do **mesmo site** do Chatwoot (cookies de primeira parte) é pré-requisito prático **[hipótese a testar]**: o `sslip.io` atual não serve para isso.

## F-05 [S1] Merge de contatos do Chatwoot é destrutivo e irreversível [código]
- `ContactMergeAction#perform`: move conversas, mensagens, `contact_inboxes`, notas e **`@mergee_contact.reload.destroy!`**. Atributos do contato absorvido só entram se o base estiver vazio. Não existe "desfazer". O evento `CONTACT_MERGED` aparece no `ActionCableListener`; **não achei** listener de webhook (grep em 1058 arquivos; sem hit ≠ prova).
- O desenho (`design.md:76`, `tasks.md` 2.9) planejou "merge de contatos no Chatwoot" refletindo o vínculo do núcleo, com reversão que "nunca apaga". São incompatíveis: reverter o vínculo no núcleo **não** reverte o merge no Chatwoot.
- **Substituto:** **nunca** fundir no Chatwoot por regra do sistema. Ligação por atributo `dumentre_person_id` (custom attribute) + ficha agregada no painel; merge manual só como ato humano irreversível com snapshot prévio e aviso. Qualquer agente pode abrir a ação de merge (`ContactPolicy`: ações de leitura/atualização `true`; **não li** o controller de merge por completo) → exige treino/procedimento e, se possível, restringir por papel.

## F-06 [S1] Premissa de infraestrutura: o VPS não é "da Dumentre" e é o cofre + acesso [KB local]
- `projects-knowledge-base/wiki/central-pesquisas-2026-10-26/hetzner-passo-a-passo.md` (linhas 76-82): projeto Hetzner `openbao-platform`, servidor `openbao-platform-prod-openbao`, **CPX22**, Nuremberg, "**é o VPS do OpenBao e do NetBird. Não é da Dumentre**". Acesso administrativo **somente via NetBird** (`handoff-servidor-hetzner.md`); `hetzner-health-updates-dr.md`: "Não atualizar diretamente o único VPS produtivo antes de provar backups e recuperação".
- O plano A1 (instalar Chatwoot+PG+Redis nele) tem **raio de explosão** maior do que "RAM insuficiente": um OOM pode derrubar o cofre e o caminho de acesso (NetBird) ao mesmo tempo, impedindo até o diagnóstico remoto.
- **Substituto:** G-CAP **não** no VPS de produção do OpenBao. Ordem proposta: (1) laboratório **local** em VM Linux (Hyper-V) com 2 vCPU/4 GB espelhando o CPX22, com carga sintética; (2) se passar, **projeto/servidor Hetzner separado** para a Dumentre (preço oficial de novo pedido na seção 02: CPX22 €16,99; CPX32 €30,49; backup +20%). Decisão de Luan (D2 revisada, §11).

## F-07 [S2] Coexistência exige ser Tech Provider/Solution Partner [doc]
- `onboarding-business-app-users.md`, "Requirements": app WhatsApp Business ≥ 2.24.17; "**You must already be a Solution Partner or Tech Provider**"; Embedded Signup com *session logging*. Histórico: 180 dias; ids de mídia só das mídias dos **últimos 14 dias**; throughput fixo de 20 mps; grupos não; mensagens temporárias e *view once* desligadas.
- `research/11` D6 tratou como "elegibilidade desconhecida"; é, na verdade, **pré-condição documentada de um nível que a Dumentre não demonstrou ter**. Impacto: o espelhamento do app (eco `smb_message_echoes`) e o histórico podem estar **indisponíveis** para o número da Dumentre. Sem coexistência: ou o número sai do app para só API, ou segue em app e o omnichannel não cobre o WhatsApp. **Decisão e prova (tarefa 0.8) antes de F2.**

## F-08 [S2] Eco e dupla autoria [código]
- O Chatwoot já deduplica ecos (WhatsApp `outgoing_echo`, Instagram `is_echo` com atraso de 2 s para evitar mensagem duplicada quando o eco chega antes do retorno da API de envio, Facebook, TikTok `external_echo`).
- Se o núcleo **também** registrar mensagens de saída (a partir de eco/status) sem chave comum, há **duas cópias do mesmo fato**. Regra proposta: um autor do **conteúdo** (Chatwoot); um autor do **fato observado** (a borda, a partir do bruto) com chave `(provedor, conta, ext_id)`; o núcleo **nunca** cria mensagem no Chatwoot e **nunca** envia por fora da política única.
- O protótipo descarta o eco do Instagram (C3 executado) e não tem caminho de saída; `design.md` §3 diz "metadados no núcleo" para mensagens: falta o adaptador de eco/saída (tarefa nova T-ECO).

## F-09 [S2] Webhooks de saída do Chatwoot sem retry e sem evento de merge [código]
- Confirmado e ampliado: `Webhooks::Trigger` captura o erro e só avisa (já registrado); `CONTACT_MERGED` não está na lista de eventos de webhook (`Webhook::ALLOWED_WEBHOOK_EVENTS` lida antes). A **reconciliação por API** precisa cobrir: mensagens de saída dos agentes, mudança de status da conversa, merges manuais, exclusões. Frequência proposta: 5 min incremental (por `updated_at`/ids) e diária completa; divergência alerta, **não corrige sozinha**.

## F-10 [S2] Segredo HMAC único e protótipo com falhas silenciosas [código + exec]
- `openCore({secret})` usa **um** segredo para todos os provedores; Instagram/Messenger e WhatsApp podem estar em apps Meta diferentes (o Chatwoot lê `INSTAGRAM_APP_SECRET`, `FB_APP_SECRET`, segredo do canal). **Segredo por provedor/app.**
- C1 (executado): payload **assinado e malformado** → HTTP 200, zero eventos, só `raw_event.parse_error`. Para a Meta isso é "entregue"; ninguém é alertado. **Contador + alerta `parse_error > 0`** e reprocessamento após correção.
- Evento que lança exceção vira `failed` **terminal** sem retry automático; distinguir **transitório** (reexecutar com backoff) de **permanente**.
- Adaptador WhatsApp ignora `field != messages` (sem `smb_message_echoes`, `history`).

## F-11 [S2] Chatwoot aceita sem verificar quando o canal está `app_secret_pending` [código]
- `WhatsappController#verify_meta_signature!`: se `app_secret_pending?` (sem segredo no canal) e a assinatura não bate, **aceita** e só loga `[WHATSAPP_APP_SECRET_PENDING] unverified webhook accepted`. Se a rota do Chatwoot estiver na internet, qualquer um injeta mensagens. **Exigir** `WHATSAPP_APP_SECRET`/`app_secret` configurados e **restringir** `/webhooks/*` do Chatwoot à rede interna (só a borda alcança); exceção TikTok (ver §04).

## F-12 [S2] Representatividade do teste SQLite [exec + código]
- Reexecutado: P1+P2 **23/23** verdes (≈1 s, Node 22.21.1, Windows/NTFS).
- Limites: (a) **Windows/NTFS ≠ Linux/ext4 em volume Docker**: semântica de lock de arquivo, `fsync` e WAL/`-shm` diferem; o bug de `database is locked` achado em P1 é justamente dependente de plataforma; (b) "reinício" nos testes = `close()`/`open()` no mesmo processo; **não há teste com `kill -9` no meio de transação**; (c) `crm.upsert` é função síncrona, não HTTP: não representa timeout, resposta 200-sem-efeito, nem 5xx do Chatwoot; (d) `node:sqlite` é módulo **experimental** no Node 22 (executa com `--no-warnings`); a versão de Node do container da borda **não foi verificada**; (e) 8 processos na mesma máquina ≠ carga de vários operadores com leituras longas.
- **Gates:** repetir P1 num Linux (a VM do §07 ou o servidor de teste) com `kill -9` em laço durante a transação e HTTP real entre borda e um Chatwoot de teste; decidir entre `node:sqlite` e `better-sqlite3` (dependência nativa) por estabilidade.

## F-13 [S3] Itens menores
- Rota do Messenger resolvida: `mount Integrations::Facebook::WebhookServer, at: 'bot'` (`POST /bot`).
- Nome do campo: `messaging_referrals` (plural; Instagram Login) vs `messaging_referral` usado em `tasks.md` 3.1.
- Janela do Instagram: 24 h; **até 7 dias** só após a 1ª mensagem vinda de anúncio Click-to-Direct (doc lida). O "7 dias com Human Agent" da rodada anterior **não** foi reconfirmado em fonte primária.
- `requirements.md` do Chatwoot cita Ruby 3.4.4; o código da tag usa **3.4.13** (`.ruby-version`) e Node **24.22.1** (`.nvmrc`): usar o código.
- Frappe/ERPNext v16 exigem Python 3.14 (`erpnext/pyproject.toml: requires-python >=3.14`), MariaDB 11.8, Node 24 (docs.frappe.io).

## Reconsideração: construir CRM/billing próprio × módulos prontos × servidor modesto
Sem recomendar troca. O que as evidências dizem:
- **Nenhum CRM pronto lido resolve o diferencial** (identidade entre canais por BSUID/IGSID/PSID, atribuição bruta+normalizada, política de follow-up): Frappe CRM resolve contato **por número de telefone** (`get_contact_lead_or_deal_from_number`) e só tem inbox de WhatsApp (app de terceiro); ERPNext tem `whatsapp_no` em Lead/Opportunity e **nenhuma** NFS-e no código da tag (só plano de contas BR); Woofed **não tem releases** e se declara "Under development".
- **Billing:** o argumento de "módulo pronto" mais forte é o ERPNext (fatura, pagamento, conciliação), mas exige pilha Frappe (Python 3.14, MariaDB 11.8, Redis, workers) e não cobre NFS-e. Gate **G-BILL** (decidir na F5, não agora): (i) requisitos reais de cobrança da Dumentre (nº de clientes recorrentes, gateway escolhido); (ii) 1 dia de spike só de leitura do doctype `Sales Invoice`/`Payment Entry` na v16 fixada; (iii) custo incremental de um servidor separado (CPX32 €30,49/mês + backup 20%, preço oficial de novo pedido) **versus** 8–12 dias-pessoa do livro interno. Só trocar se (iii) favorecer e a integração for unidirecional (núcleo → ERPNext).
- **Servidor modesto:** a evidência (Zammad 6 GB+, Chatwoot 4 GB mínimo doc / 8 GB `/deploy`, Frappe sem número oficial) indica **8 GB** como piso razoável para Chatwoot ou pilha Frappe sozinhos; dois pesados no mesmo host de 4 GB não é recomendável.

## Resumo de impacto
S1: F-01, F-02, F-03, F-04, F-05, F-06. S2: F-07 a F-12. Todos têm gate de prova (tabela em `10-rastreabilidade-complemento.md`).
