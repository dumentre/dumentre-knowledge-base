# Pesquisa: atendimento omnichannel, CRM, atribuição, follow-up e billing

Change OpenSpec: `unify-customer-communications-and-crm` (schema `spec-driven`, OpenSpec CLI 2.0.0). Execução de **2026-11-21**. Estado: **planejamento concluído para revisão; nada implementado, nada arquivado**.

## Onde está (para incorporação posterior à KB real)
- Worktree isolada: `C:\Users\luanc\projects\dumentre\pesquisa-omnichannel-20261121` (branch `pesquisa-omnichannel-20261121`; nenhum commit feito).
- Change: `C:\Users\luanc\projects\dumentre\pesquisa-omnichannel-20261121\openspec\changes\unify-customer-communications-and-crm\`
- Arquivos novos fora da change: `openspec/config.yaml` (cópia **sem sobrescrever** a da KB), `openspec/specs/.gitkeep`, `openspec/changes/archive/.gitkeep`.
- **Incorporação segura (sugerida, a executar pelo orquestrador):** copiar **apenas** a pasta `openspec/changes/unify-customer-communications-and-crm/` para `dumentre-knowledge-base/openspec/changes/` (não existe lá); **não** copiar `config.yaml` (já existe e é idêntico em conteúdo); **não** tocar em `crm-atendimento-unificado`; rodar `openspec validate unify-customer-communications-and-crm --strict` na KB; revisar o diff antes de qualquer commit (regras globais: commit sem coautoria de IA, só quando o Luan pedir).

## Índice
| Arquivo | Conteúdo |
|---|---|
| `../proposal.md`, `../design.md`, `../tasks.md`, `../specs/*/spec.md` | artefatos OpenSpec (8 capacidades, 19 requisitos, 78 cenários com ID `AT-xx.y`) |
| `00-progresso.md` | diário da execução e fatos coletados (fonte, data) |
| `01-inventario.md` | estado real: KB, webhook, site, VPS (medido), decisões desatualizadas |
| `02-catalogo-aceite.md` | AT-01 a AT-14, microcenários, prioridade, estado, política de fixture |
| `03-alternativas-stack.md` | H1 a H6, números, escolha H4, contingências C1 e C2 |
| `04-matriz-canais.md` | canais × capacidades, anúncios, permissões |
| `05-custos-capacidade.md` | custos separados por tipo, tarifas, teto local × fornecedor, conta de RAM, estimativas |
| `06-evals-ia.md` | triagem de IA, contrato, dataset, métricas, registro |
| `07-riscos.md` | 25 riscos com evidência e prova planejada |
| `08-rastreabilidade.md` | matriz requisito, cenário, componente, evidência, teste, resultado, bloqueio (**gerada**) |
| `09-provas.md` | provas executadas, comandos, limites, provas bloqueadas, validação OpenSpec |
| `10-fontes.md` | URLs, datas, versões, divergências |
| `11-decisoes-e-autorizacoes.md` | D1 a D13 e A1 a A8 com impacto exato |
| `evidence/` | protótipo descartável (`prototipo/`), saídas (`saidas/`), ferramentas (`tools/`) |
| `fontes/fetch-log.jsonl` | registro de cada leitura de fonte (URL, status, bytes, hash) |

## Resumo em 10 linhas
1. Arquitetura recomendada (H4): **Chatwoot Community (caixa) + núcleo Dumentre pequeno (borda, identidade, ficha, funil mínimo, follow-up, atribuição, billing interno) + Dashboard App**.
2. A borda reaproveita o webhook atual como **único** destino do callback da Meta (bruto + idempotência + repasse ao Chatwoot).
3. O Chatwoot **pode não caber** no VPS (3,0 GiB disponíveis, sem swap; doc pede ≥ 4 GB): **portão G-CAP** antes de migrar; contingências C1 (UI própria) e C2 (segunda VM, custo desconhecido).
4. O webhook instalado atende **2/9** do catálogo (P0): perde mensagens de usuários só com BSUID em silêncio.
5. O webhook de saída do Chatwoot **não retenta**; o Chatwoot guarda `referral` só no WhatsApp: a borda cobre os dois.
6. WhatsApp: franquia de 1.000 mensagens de serviço por número desde 01/10/2026, **exige método de pagamento**, sem teto do fornecedor encontrado: teto local + reconciliação.
7. Protótipo com TDD: 23/23 verdes (vermelho antes); **mock, não prova Chatwoot nem Meta**.
8. Nenhum cenário `aprovado`: 41 `executado-mock`, 14 `pendente-externo`, 23 `planejado`.
9. Primeira tarefa: **1.1**, reproduzir C5/C8/C9 como testes vermelhos no `whatsapp-business-mcp` e corrigir.
10. Decisões do Luan: D1 a D13; autorizações A1 a A8 (uma por operação).
