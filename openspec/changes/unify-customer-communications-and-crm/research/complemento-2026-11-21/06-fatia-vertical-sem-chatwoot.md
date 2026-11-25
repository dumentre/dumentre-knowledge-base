# 06. Fatia vertical implementável sem Chatwoot (contingência C1, especificada; viabilidade NÃO afirmada)

Objetivo: ter pronta, caso o Chatwoot não caiba (G-CAP) ou reprove em F-01/F-02/F-05, uma fatia que entregue **entrada → histórico → contato/lead → próxima ação → visibilidade na UI → resposta pelo canal** só com o núcleo e uma UI própria mínima. **Nenhum benchmark foi executado**; tudo abaixo é especificação e gate. Sem Chatwoot, "viável" só será dito depois de **B1 a B6** (§4).

## 1. Escopo da fatia (F1-C1)
Dentro: WhatsApp Cloud (texto, status, `referral`), Instagram Direct (texto, eco, `referral`), canal de teste; identidade por BSUID/IGSID/telefone; vínculo manual com evidência e reversão; negócio/tarefa/política; **UI própria** (lista de conversas por última mensagem recebida, ficha, linha do tempo, caixa de resposta); resposta pelo canal de origem via `send()`.
Fora (declarado, não escondido): anexos/áudio (guardar só metadados e id de mídia; baixar e exibir = tarefa posterior), e-mail, Telegram, TikTok, site/chat, Messenger, templates de WhatsApp (só janela de 24 h; fora da janela a UI mostra "exige template", `send()` recusa), busca em texto completo, notificações push, papéis além de admin/operador.

## 2. Componentes (um processo Node + SQLite; sem Redis, sem Postgres)
| Componente | Responsabilidade | Observação |
|---|---|---|
| Borda | HMAC **por provedor/app**, corpo ≤ 3 MB, `raw_event` + `event` em 1 transação, 200 só depois do commit | evolução do `webhook-service.js` (Buffer cru já usado, `readLimited`) |
| Adaptadores | `extract()` → eventos (`message`, `status`, `echo`) por provedor/versão | **adicionar `echo` e `smb_message_echoes`** (F-08/F-10) |
| Núcleo | identidade, mensagem (conteúdo **aqui**, pois não há Chatwoot), negócio, tarefa, política, atribuição, outbox de envio | muda a premissa de "metadados só": sem Chatwoot, o núcleo guarda o **corpo** da mensagem e a retenção/LGPD passa a valer para ele |
| `send()` | autorização, orçamento, capacidade, idempotência, estado `incerto` | única saída; chama Graph API (mock em teste) |
| UI | páginas servidas pelo mesmo processo; sessão própria do operador | Playwright já usado no site (E2E) |
| Mídia | **desligada** na fatia; só `media_id` e tipo | URL expira; baixar depende de token e de orçamento |

## 3. Cenários de aceite da fatia (IDs do catálogo, sem inventar novos)
AT-01 (1ª mensagem, reentrega, paralelo, reinício), AT-02 (contato conhecido), AT-05 (ficha unificada, reversão), AT-06 (envio/eco/status/incerto, com Graph em **mock**), AT-10.1/10.4 (destino indisponível e reprocessamento: aqui o "destino" é o próprio envio e a UI), AT-12 (permissões/custos), AT-13 (IA off). AT-03 apenas `referral` presente/ausente. Tudo `executado-mock` até existir sandbox.

## 4. Benchmark e critérios de decisão (propostos; "valores de fixture", Luan pode alterar)
Ambiente: **Linux** (VM Hyper-V espelhando CPX22: 2 vCPU/4 GB, ou o servidor de teste), **não** Windows. SQLite em disco local, não em compartilhamento.
| ID | Medição | Como | Limiar proposto para dizer "viável" |
|---|---|---|---|
| B1 | Latência de recepção (HMAC + persistência + 200) | 1.000 POSTs sintéticos assinados, concorrência 1, 8 e 32 | p95 < 300 ms com 8 simultâneos |
| B2 | Vazão de drenagem (evento → ficha) | replay de 10.000 eventos | ≥ 50 eventos/s sustentados |
| B3 | Memória | RSS do processo durante B1/B2 e com a UI aberta | RSS < 200 MiB |
| B4 | Durabilidade | `kill -9` em laço durante a transação (≥ 200 ciclos) | 0 eventos aceitos (200) sem estar no banco; 0 duplicatas |
| B5 | Backup/restauração | `VACUUM INTO` com escrita concorrente; restaurar em outro diretório | contagens e relações idênticas; tempo registrado |
| B6 | Leituras longas × escrita | 3 operadores simulados navegando a lista enquanto B1 roda | p95 da lista < 500 ms; sem `SQLITE_BUSY` para o leitor |
Sem B1 a B6 verdes: **não** afirmar a viabilidade da C1. Se B4 falhar, trocar `node:sqlite` por `better-sqlite3`/PostgreSQL leve (nova decisão).

## 5. Esforço (hipótese; ver errata sobre estimativas)
Sem o Chatwoot, F1 passa de 6–9 para **10–15 dias-pessoa** (UI de conversa e resposta, adaptadores de saída, eco). F3 (canais) sobe por canal extra: e-mail (IMAP/SMTP, threading) ≈ 5–8 dias; Messenger ≈ 3–4; Telegram ≈ 2–3. **Incerteza alta**; nenhuma dessas faixas foi medida.

## 6. Por que não é o padrão
Reescreve recepção **e envio** por canal (contraria "reusar primeiro"), mantém o corpo das mensagens (LGPD) e perde recursos prontos (anexos, equipe, status por canal, e-mail). É **contingência**, não substituição.

## 7. Condição de acionamento (substitui o texto de `../03-alternativas-stack.md` §4 para C1)
Acionar C1 se **qualquer** destes ocorrer: (a) G-CAP vermelho no laboratório **e** Luan não aprovar servidor separado (custo oficial na seção 02); (b) **G-F02** confirmar perda silenciosa não reparável por reinjeção; (c) **G-F01** mostrar que a divisão/re-assinatura de lote não é aceita pelo Chatwoot; (d) Luan decidir que o merge/ficha agregada no painel não atende o operador.
