# Conciliação de Changes: `crm-atendimento-unificado` × `unify-customer-communications-and-crm` (D10 / Tarefa 8.2)

**Status**: Em andamento (nenhuma change arquivada antes de comprovação real de todos os cenários obrigatórios)

---

## 1. Contexto e Decisão D10
A change `crm-atendimento-unificado` foi a proposição inicial do atendimento multicanal. A change `unify-customer-communications-and-crm` expande, formaliza a matriz de rastreabilidade (08-rastreabilidade), a estratégia de mitigação de riscos (07-riscos) e as decisões arquiteturais D1 a D13.

Conforme a regra do Luan e a tarefa 8.2, ambas as changes devem ser mantidas ativas sem arquivamento precipitado.

## 2. Matriz de Substituição e Equivalência

| Capacidade / Seção | `crm-atendimento-unificado` | `unify-customer-communications-and-crm` | Relação de Substituição | Status da Implementação |
|---|---|---|---|---|
| **Núcleo WhatsApp / Ingestão** | `specs/crm/spec.md` (requisitos básicos) | `specs/crm-multicanal/spec.md` (AT-01) | A segunda substitui e expande com criptografia de ponta a ponta e buffer SQLite | Concluído em `dumentre-core` (170+ testes verdes) |
| **Fila e Resiliência** | Mencionada genericamente | `specs/crm-multicanal/spec.md` (AT-02) | A segunda especifica outbox com exponential backoff e quarentena | Concluído em `dumentre-core` |
| **Chatwoot Community** | Decisão de avaliar | Decisão D2 (v4.20.1+ com Postgres 16 e Redis 7) | A segunda define limites exatos de memória e compose pronto | Preparado localmente; Portão A1 pendente de OK |
| **Atribuição e Canais** | Escopo WhatsApp isolado | Decisão D5 / D7 (Instagram, Telegram, site wa.me) | A segunda unifica atribuição auditável e fallback seguro | Concluído em `dumentre-core` |
| **E-mail Próprio** | Não contemplado | Decisão D11 (Stalwart Mail Server na Hetzner) | Adicionado na segunda change | Proposta e compose prontos; Portão D11 pendente de OK |
| **LGPD e Retenção** | Diretrizes gerais | Decisão D4 + Tarefa 7.2 (dossiê, anonimização e retenção) | A segunda estabelece implementação verificável | Concluído em `dumentre-core` |

## 3. Diretriz de Arquivamento
1. `crm-atendimento-unificado` **não** será arquivada agora.
2. Quando os portões de produção (A1, D11, A2/A3) forem executados e validados com evidência real, `crm-atendimento-unificado` será formalmente referenciada como absorvida por `unify-customer-communications-and-crm`, sendo arquivada em conjunto.
