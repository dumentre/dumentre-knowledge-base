# 10. Rastreabilidade dos novos achados, revisão de consistência e contradições priorizadas

Estados usados (iguais aos de `../08-rastreabilidade.md`): **planejado**, **executado-mock**, **aprovado**, **reprovado**, **pendente-externo**. Neste complemento nada passou a **aprovado**. Estado novo (só aqui): **lido-código** = confirmado por leitura do fonte na tag fixa, **sem execução**.

## 1. Achados → onde atualizar o canônico → prova → estado

| Achado | Onde atualizar (canônico) | Requisito/cenário afetado | Prova que falta | Estado |
|---|---|---|---|---|
| F-01 lote perdido no Chatwoot | `design.md` §2/§5; `tasks.md` 2.3; R-06 | AT-10.6 (novo), AT-01.3, AT-10.1 | G-F01: lote de 2 mensagens no Chatwoot real | **lido-código** (núcleo: C2 executado-mock) |
| F-02 200 ≠ criado; lock sem liberação | `design.md` §2/§5; `specs/ingestao-eventos`; tasks 2.3/2.7 | AT-10.7 (novo), AT-10.2, AT-10.5 | G-F02: falha após o lock + reenvio do mesmo `wamid` | **lido-código** (hipótese forte) |
| F-03 desinscrição IG/Messenger após 1 h | `design.md` §5/§10/§11; R-09; tasks 2.10/2.11 | AT-10.9 (novo), AT-11.5 | sandbox com app/Página de teste: simular borda fora e observar assinatura | documentado (doc oficial) |
| F-04 Dashboard App sem autenticação assinada | `design.md` §9; tasks 2.6; spec operacao-seguranca | AT-12.6 (novo), AT-12.3, AT-08.4 | G-F04: sessão/cookies em iframe no mesmo site | **lido-código** |
| F-05 merge destrutivo | `design.md` §3/§4; tasks 2.9; spec identidade | AT-05.7 (novo), AT-05.1, AT-05.3 | G-F05: efeito do merge no Chatwoot de teste | **lido-código** |
| F-06 VPS = cofre + acesso | D2, A1, G-CAP, C0, tasks 2.1 | AT-11.4 (restauração), G-CAP | VM Linux local; depois servidor separado | documentado (KB) |
| F-07 coexistência exige Tech Provider | D6, R-10, tasks 0.8 | AT-04.8, AT-11.1 | tarefa 0.8 (leitura de conta) | documentado (doc oficial) |
| F-08 eco/dupla autoria | `design.md` §3; tasks 1.2/2.8 | AT-06.1, AT-06.5 (novo), AT-04.8 | adaptador de eco + sandbox | C3 executado-mock; resto planejado |
| F-09 sem webhook de merge/retry | `design.md` §5; tasks 2.7 | AT-10.5 | integração com Chatwoot real | **lido-código** |
| F-10 segredo único / parse_error / failed terminal | tasks 1.1/1.3 | AT-01.5, AT-10.4, AT-10.8 (novo) | testes vermelhos na F1 | C1 executado-mock (caracterização) |
| F-11 `app_secret_pending` aceita sem verificar | `design.md` §9; tasks 2.1/2.3 | AT-01.5 | checagem de configuração no Chatwoot real | **lido-código** |
| F-12 representatividade SQLite | `design.md` §14; `09-provas.md` Limitações; R-21 | AT-01.2, AT-01.3, AT-10 | P1 em Linux com `kill -9` | executado-mock (Windows) |
| Rate card BRL | `05-custos` §1.4; D5 | AT-12.4 | fatura real | aprovado como **fonte** (doc), não como teste |
| Hetzner oficial | `05-custos` §1.2; D2/C2 | — | — | aprovado como fonte |
| E-19 corpo duplicado (raw_event/message.text) | `design.md` §3/§9; D4 | AT-12.5 | decisão D4 + teste de retenção/exclusão | planejado |
| E-20 amostras dos evals | `06-evals-ia.md`; tasks 6.1/6.3 | AT-13 | recalcular tamanho de amostra | cálculo executado |

## 2. Revisão de cenários (AT-01 a AT-14)
- **Contagem consistente:** catálogo **78**, matriz **78**, specs **78** IDs (79 cenários; o 79º, "Aplicação autorizada" em `ia-opcional`, não tem ID AT). Verificado por script em 21/11/2026; nenhum órfão.
- **Cenários que o complemento enfraquece (devem voltar a "planejado" até a prova):** AT-05.3 (reversão: sem cobrir o Chatwoot), AT-10.1 e AT-10.2 (entrega ao destino real sem confirmação), AT-10.5 (reconciliação), AT-06.1 (eco no Chatwoot real).
- **Cenários novos propostos:** AT-10.6, 10.7, 10.8, 10.9, AT-05.7, AT-06.5, AT-12.6 (texto em `09`).
- **Cenário que a evidência torna impossível como escrito:** AT-04.6 (TikTok) assume borda; TikTok vai direto ao Chatwoot (E-14).

## 3. Revisão de fases e dependências
- F2 deve ser dividida (F2a lab local, F2b servidor separado, F2c sandbox Meta); **F2 hoje depende do VPS do OpenBao** (E-06).
- F4 (funil/follow-up) "pode começar após F1": **continua válido** e é a melhor tarefa independente para absorver incerteza de F2.
- F3 depende de **F-03** (disponibilidade da borda) para IG/Messenger: acrescentar dependência em 2.11.
- F7 (corte): janela < 15 min para IG/Messenger.

## 4. Revisão de riscos (`../07-riscos.md`)
Riscos novos: **R-26** (S1) lote perdido (F-01); **R-27** (S1) mensagem aceita e não criada (F-02); **R-28** (S1) desinscrição IG/Messenger após 1 h (F-03); **R-29** (S1) painel sem autenticação derivável (F-04); **R-30** (S1) merge irreversível (F-05); **R-31** (S1) cofre e NetBird no mesmo host (F-06); **R-32** (S2) coexistência inelegível (F-07); **R-33** (S2) aceitação sem verificação no Chatwoot (F-11); **R-34** (S2) corpo duplicado fora do controle de retenção (E-19). Riscos a **reclassificar**: R-04/R-09 (impacto só vale ao WhatsApp), R-06 (premissa errada), R-21 (SQLite: probabilidade B → M até P1 em Linux), R-23 (continua; o bloqueio de Windows está explicado em `07`).

## 5. Custos
Atualizar `../05-custos-capacidade.md`: rate card BRL (§1.4), Hetzner (§1.2, remover € 35,99 e € 0,50), estimativas (nota C1). **Sem mudança** de total de 50–74 dias-pessoa para H4, **mas** acrescentar: F2a (lab local) ≈ 2–3 dias; confirmação/reinjeção (F-02) e divisão de lote (F-01) ≈ 3–5 dias dentro da F2 (hipótese).

## 6. TDD, estratégia de testes e evidências
- Conforme `estrategia-testes.md`: nesta rodada, **fontes primárias lidas** e **verificação executável proporcional** são o teste. O único código escrito foi **caracterização** de comportamento existente (3 testes) e calculadoras de leitura (Wilson, parsers); **nenhum código de produção** e **nenhuma alteração** de arquivo preexistente.
- O que **deve** ser TDD na implementação: F-01 (divisão/re-assinatura de lote: teste vermelho com lote de 5 unidades), F-02 (máquina de estados `enviado/confirmado/nao_confirmado`), F-10 (segredo por provedor, `failed` transitório/permanente, `parse_error`), eco do Instagram.
- Evidência: cada achado S1 tem fonte e arquivo/linha; os **três** que dependem de execução (G-F01, G-F02, G-F04) estão marcados **lido-código** e **não** "provados".

## 7. Contradições priorizadas (impacto → tratamento)
| # | Contradição | Impacto | Tratamento |
|---|---|---|---|
| 1 | "repasse fiel" × Chatwoot lê só o 1º elemento do lote | perde mensagens | E-01 / F-01 |
| 2 | "entregue ao destino" × 200 só enfileira + lock de 1 dia | perda silenciosa | E-02 / F-02 |
| 3 | "Meta retenta 7 dias" × IG/Messenger desinscreve em 1 h | perda + reinscrição manual | E-03 / F-03 |
| 4 | "token assinado no painel" × `postMessage('*')` sem token | falha de autorização | E-04 / F-04 |
| 5 | "merge reversível" × `destroy!` do contato | perda de histórico/identidade | E-05 / F-05 |
| 6 | "Hetzner que já pagamos (Dumentre)" × VPS do OpenBao/NetBird, "Não é da Dumentre" | raio de explosão, premissa de propriedade | E-06 / F-06 |
| 7 | "núcleo só metadados" × `raw_event` + `message.text` | LGPD, duas cópias | E-19 |
| 8 | "borda único destino do callback" × TikTok direto ao Chatwoot | atribuição/raw ausentes | E-14 |
| 9 | "coexistência = elegibilidade" × exige Tech Provider | D6 sem base | E-07 / F-07 |
| 10 | limiares de eval × tamanho de amostra | falsa segurança | E-20 |
| 11 | "provado: 8 processos" × Windows, sem `kill -9`, módulo experimental | confiança excessiva | E-13 / F-12 |
