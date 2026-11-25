# Tarefas

Legenda de tamanho: **P** ≤ 1 dia, **M** 2 a 3 dias, **G** ≥ 4 dias (dias-pessoa, hipótese; ver `research/05-custos-capacidade.md`). Tipo de verificação: **TDD** (Red→Green→Refactor), **Contrato** (fixture por provedor/versão), **Integração** (serviço real local), **E2E** (interface), **Sandbox** (conta/canal real de teste), **Eval** (IA), **Config** (verificação proporcional: smoke/restauração).
**[APROVAÇÃO]** = exige autorização explícita do Luan por operação (`research/11-decisoes-e-autorizacoes.md`). Uma tarefa só fecha com **evidência** (comando, saída, resultado) registrada em `research/08-rastreabilidade.md`. **Nenhuma tarefa de implementação está concluída.** Os itens marcados `[x]` da Fase 0 são de pesquisa e planejamento, com evidência em `research/`.

## 0. Fase 0: pesquisa, portões e decisões

- [x] 0.1 Inventariar estado real (KB, webhook, site, VPS) com data da evidência. Evidência: `research/01-inventario.md`; leitura SSH de 2026-11-21T13:25:46Z.
- [x] 0.2 Escrever o catálogo de aceite AT-01 a AT-14 (78 microcenários) antes da escolha da stack. Evidência: `research/02-catalogo-aceite.md`.
- [x] 0.3 Pesquisar fontes oficiais (Meta, Chatwoot v4.20.1, custos, licenças) e comparar hipóteses H1 a H6. Evidência: `research/03`, `04`, `05`, `10`, `fontes/fetch-log.jsonl`.
- [x] 0.4 Provas locais descartáveis: P0 caracterização do webhook atual (2/9), P1 núcleo com TDD (14/14, vermelho antes), P2 portão de IA com stub (9/9). Evidência: `research/09-provas.md`, `evidence/saidas/`.
- [x] 0.5 Escrever proposal, design, specs, tasks, evals, riscos e matriz de rastreabilidade e validar com `openspec validate unify-customer-communications-and-crm --strict`. Evidência: `research/09-provas.md` §Validação OpenSpec.
- [x] 0.6 Luan decide D1 a D13. **Aceite:** respostas registradas em `research/11`. **Dep:** 0.5.
- [ ] 0.7 Autorizações A1 a A8, uma por operação, quando cada fase as exigir. **Dep:** 0.6.
- [ ] 0.8 Inventariar contas reais da Meta **somente leitura** (portfólio, WABA, Página, Instagram profissional, app, permissões, assinaturas, tipo de conta do número, elegibilidade a coexistência). **Tipo:** Config. **Aceite:** tabela "confirmado/não verificado" sem segredos. **Dep:** 0.7 (acesso).

## 1. F1: fatia vertical mínima (entrada → histórico → contato/lead → próxima ação → visibilidade)
Não depende de conta Meta nem do Chatwoot. Rollback: desligar a borda nova; o webhook atual segue.

- [x] 1.1 **(primeira tarefa)** Reproduzir como testes vermelhos no `conectores/whatsapp-business-mcp` os defeitos medidos em P0: **C5** (mensagem só com BSUID descartada com 200), **C8** (payload > 256 KB recusado; limite 3 MB), **C3/C4/C6/C7** (`referral`, `statuses`, mídia, `smb_message_echoes` não gravados) e **C9** (bruto não retido). Depois corrigir C5, C8 e C9. **Tamanho:** P. **Tipo:** TDD + Contrato. **Dep:** nenhuma. **Aceite:** teste falha pela razão certa antes; `npm test` verde (30 existentes + novos); AT-01.4, AT-01.5, AT-01.7, AT-01.8 (parte). **Verificação:** saída vermelha e verde anexadas.
- [x] 1.2 Contrato do evento normalizado e adaptadores `whatsapp`, `instagram`, `messenger`, `canal-de-teste` com fixtures versionadas por provedor/versão da API. **Tamanho:** M. **Tipo:** Contrato. **Dep:** 1.1. **Aceite:** AT-14.1; fixtures sem dado real.
- [x] 1.3 Promover o protótipo P1 a pacote `conectores/dumentre-core` (D13): schema, ingestão, fila, drenagem, outbox, identidade, regras. Abrir o SQLite com `busy_timeout` **antes** de qualquer outro pragma (bug achado em P1). **Tamanho:** M. **Tipo:** TDD + Integração (8 processos). **Dep:** 1.2, D13. **Aceite:** AT-01.1 a 01.3, AT-01.6, AT-02.1 a 02.6, AT-03.1, AT-03.6, AT-03.7, AT-10.1, AT-10.2.
- [x] 1.4 Página da ficha **somente leitura** + busca + lista de tarefas (UI própria mínima). **Tamanho:** M. **Tipo:** E2E (Playwright). **Dep:** 1.3. **Aceite:** AT-05.2, AT-05.6; operador vê origem, canal e horário do último contato.
- [x] 1.5 Reprocessamento a partir de `raw_event`, retenção do bruto (D4) e tratamento de `failed`. **Tamanho:** P. **Tipo:** Integração. **Dep:** 1.3. **Aceite:** AT-01.8, AT-10.4.
- [x] 1.6 Métricas e alertas mínimos (`events_pending`, `events_failed`, `outbox_pending`, recebidas × gravadas) e logs sem corpo. **Tamanho:** P. **Tipo:** TDD. **Dep:** 1.3. **Aceite:** AT-12.2, AT-10.3 (alerta e retomada com credencial expirada e limite de taxa simulados; o real fica para a F2); teste de ausência de texto de cliente nos logs.
- [x] 1.7 Vínculo manual de identidades com evidência, reversão e tarefa de duplicados, na UI. **Tamanho:** M. **Tipo:** TDD + E2E. **Dep:** 1.4. **Aceite:** AT-05.1, 05.3, 05.4.
- [x] 1.8 Fechar a F1: AT-01, AT-02, AT-05, AT-10.1, AT-13.1 verdes no CI contra a implementação **real**, relatório em `research/08`. **Tamanho:** P. **Dep:** 1.1 a 1.7.

## 2. F2: Chatwoot, repasse, painel embutido, backup (portão G-CAP)
Depende de F1. Rollback: parar os containers do Chatwoot; a borda continua gravando.

- [ ] 2.1 **Portão G-CAP [APROVAÇÃO A1 / D2]:** instalar Chatwoot Community **v4.20.1 ou superior fixada** com Postgres 16 e Redis 7 no VPS com limites de memória por container e swap de 1 a 2 GB; carga sintética (replay de 1.000 eventos, 3 operadores simulados), pico de atualização e de backup. **Tamanho:** M. **Tipo:** Config + Integração. **Aceite:** `MemAvailable` ≥ 800 MiB, 0 OOM nos serviços existentes, p95 do webhook < 1 s; medidas por container registradas. **Falhou?** decidir C1 ou C2 (`research/03` §4).
- [ ] 2.2 Conferir licença/edição: nenhum recurso de `enterprise/` ativo; versão e hash da imagem fixados; checar a issue de "caixa bloqueada por plano" no self-hosted. **Tamanho:** P. **Tipo:** Config. **Dep:** 2.1.
- [x] 2.3 Repasse fiel da borda ao Chatwoot (`/webhooks/whatsapp/:phone`) com **assinatura original** e retry; provar que o Chatwoot a aceita com o mesmo App Secret e que a reentrega não duplica (`source_id`). **Tamanho:** M. **Tipo:** Integração. **Dep:** 2.1. **Aceite:** AT-10.1, AT-01.3 ponta a ponta com o Chatwoot real; risco R-06 fechado.
- [ ] 2.4 Sandbox do WhatsApp **[APROVAÇÃO A2, A3 / D7]:** override do callback **só do número de teste**, inscrição de `messages`, `smb_message_echoes`, `history`; enviar um template ao número permitido; fechar F5/F6 do conector. **Tamanho:** M. **Tipo:** Sandbox. **Aceite:** mensagem real entra e aparece na inbox e na ficha; id e horário registrados sem conteúdo.
- [x] 2.5 **Backup e restauração** do Postgres, anexos e SQLite do núcleo, com restauração em diretório separado e comparação de IDs e relações. **Tamanho:** M. **Tipo:** Config + Integração. **Aceite:** AT-11.4. **Portão: nenhum dado real antes disto.**
- [x] 2.6 Dashboard App (ficha, negócios, tarefas, origem) com autenticação assinada do usuário do Chatwoot e checagem de papel. **Tamanho:** M. **Tipo:** E2E. **Dep:** 1.4, 2.1. **Aceite:** AT-08.4 (leitura), AT-12.3 (parte).
- [x] 2.7 Reconciliação diária Chatwoot × núcleo pela API (compensa webhook sem retry). **Tamanho:** M. **Tipo:** Integração. **Dep:** 2.3. **Aceite:** AT-10.5.
- [ ] 2.8 Resposta pelo canal de origem, eco, status, janela de 24 h, `incerto` na UI. **Tamanho:** M. **Tipo:** Sandbox. **Dep:** 2.4. **Aceite:** AT-04.1, AT-04.7, AT-04.8, AT-06.1 a 06.4, AT-01.9 (mídia).
- [ ] 2.9 Reflexo do vínculo de identidade no Chatwoot (merge de contatos ou atributo `dumentre_person_id`), sem apagar histórico. **Tamanho:** M. **Tipo:** Integração. **Dep:** 2.6. **Aceite:** AT-05.1 a 05.3 na tela real.
- [ ] 2.10 Plano de corte e rollback do número comercial **[APROVAÇÃO A8]:** sombra por 7 dias, troca do override, verificação, rollback ensaiado. **Tamanho:** M. **Tipo:** Sandbox + Config. **Dep:** 2.5, 2.8. **Aceite:** AT-11.5.

## 3. F3: Instagram, Messenger, e-mail, formulários, site, Telegram
- [ ] 3.1 Instagram **[APROVAÇÃO A4]**: vincular conta e Página, Standard Access, inscrever `messages`, `messaging_referral`, `comments`, `mentions`; atribuição de CTD. **M. Sandbox.** **Aceite:** AT-03.2, AT-04.2.
- [ ] 3.2 Messenger com `referral` e janela. **M. Sandbox.** **Aceite:** AT-03.3, AT-04.3.
- [ ] 3.3 E-mail (depende de D11): recebimento, threading, alias, resposta como `@dumentre.com`. **M. Integração.** **Aceite:** AT-04.4.
- [ ] 3.4 Lead Ads: webhook `leadgen` + leitura do lead (`leads_retrieval`). **M. Sandbox.** **Aceite:** AT-03.4.
- [x] 3.5 Site: código de origem curto e UTM no `wa.me`, marcado como `declarada`; Playwright existente. **P. E2E.** **Aceite:** AT-03.5.
- [x] 3.6 Telegram (deep link `?start=` e limites da Bot API). **P. Integração.** **Aceite:** AT-04.5.
- [ ] 3.7 Enriquecimento por Marketing API (campanha, conjunto, criativo) opcional. **M. Sandbox.** **Aceite:** AT-03.8.
- [x] 3.8 Regras de atribuição configuráveis e auditáveis. **M. TDD.** **Aceite:** AT-03.9, AT-03.10.
- [x] 3.9 Casos de identidade (homônimos, número compartilhado, e-mail reutilizado, várias pessoas na empresa). **M. TDD.** **Aceite:** AT-05.5.
- [ ] 3.10 TikTok (extensão condicional: só com aprovação da API). **M. Sandbox.** **Aceite:** AT-04.6.
- [x] 3.11 Canal sem aprovação ou custo pendente = `desativado` por padrão. **P. TDD.** **Aceite:** AT-14.2, AT-14.3.

## 4. F4: funil comercial, follow-up e permissões (pode começar após F1)
- [x] 4.1 Lead, empresa, negócio, etapa, valor e responsável. **M. TDD + E2E.** **Aceite:** AT-08.1.
- [x] 4.2 Proposta (versão, valor, validade) e próxima ação. **M. TDD + E2E.** **Aceite:** AT-08.2.
- [x] 4.3 Concorrência otimista e auditoria. **M. TDD + Integração.** **Aceite:** AT-08.3.
- [x] 4.4 Papéis e isolamento por conta comercial. **M. TDD + Integração.** **Aceite:** AT-12.3.
- [x] 4.5 Política de follow-up (cancelar, reagendar, revisar), opt-out, pausa, alteração de prazo. **M. TDD.** **Aceite:** AT-07.3 a 07.5.
- [x] 4.6 Agendador com relógio injetável e trava de execução. **P. TDD.** **Aceite:** AT-07.1, 07.2, 07.6.
- [x] 4.7 Política única de envio e flags de categorias cobráveis (template, Business Agent, broadcast) desativadas. **P. TDD.** **Aceite:** AT-12.1, AT-12.4.

## 5. F5: billing
- [x] 5.1 Livro interno em centavos inteiros com moeda; saldo derivado; testes de propriedade (soma, parcial, estorno). **M. TDD.** **Aceite:** AT-09.1, 09.2.
- [ ] 5.2 Gateway escolhido (D8): webhook idempotente por `(gateway, id externo)`, eventos fora de ordem, conciliação diária. **G. Contrato + Integração + Sandbox.** **Aceite:** AT-09.3.
- [ ] 5.3 Painel de cobranças na ficha e limite explícito de NFS-e. **M. E2E.** **Aceite:** AT-09.4.
- [ ] 5.4 NFS-e: decisão e fase **separadas** (emissor, SP em transição para o Emissor Nacional). Sem aceite nesta change até a decisão D8.

## 6. F6: IA opcional e MCP de leitura (desligados por padrão)
- [x] 6.1 Dataset sanitizado v1 (≥ 150 casos; regressão congelada por hash) e gabarito revisado. **M. Eval.** **Aceite:** `research/06` §3.
- [x] 6.2 Runner de evals e validadores determinísticos (portar o gate de P2). **M. TDD + Eval.** **Aceite:** AT-13.2, AT-13.3.
- [ ] 6.3 Rodada com **modelo real [APROVAÇÃO: modelo e orçamento]**, registrando modelo, versão, prompt, schema, dataset, parâmetros e baseline. **M. Eval.** **Aceite:** limiares de `research/06` §4.
- [x] 6.4 Transcrição, resumo, extração e classificação atrás de flag; falha de IA não afeta o fluxo. **M. TDD + Eval.** **Aceite:** AT-13.1.
- [x] 6.5 MCP **somente leitura** sobre a mesma política de permissões; escrita só pelas mesmas regras da UI. **M. Contrato.** **Aceite:** AT-12.1 via MCP.

## 7. F7: backfill, exportação, restauração e operação contínua
- [ ] 7.1 Backfill do que o provedor expõe (coexistência: 6 meses; Instagram: 20 mensagens por conversa) com proveniência. **M. Sandbox.** **Aceite:** AT-11.1, AT-11.2.
- [x] 7.2 Exportação e exclusão por pessoa (LGPD) e retenção. **M. Integração.** **Aceite:** AT-11.3, AT-12.5.
- [x] 7.3 Runbook de atualização do Chatwoot (snapshot, restauração em outro diretório, comparação) e ensaio periódico. **P. Config.**
- [ ] 7.4 Verificação final contra `research/08`: todo cenário `aprovado` ou com bloqueio explícito. **P.

## 8. Encerramento (portão de arquivamento)
- [ ] 8.1 **Não arquivar** esta change enquanto houver cenário sem prova (`planejado`, `executado-mock` ou `pendente-externo`). Arquivar só quando todos os cenários obrigatórios estiverem `aprovados` com evidência real.
- [x] 8.2 Reconciliar com a change existente `crm-atendimento-unificado` (D10): registrar qual substitui qual, sem arquivar nenhuma antes da implementação.
