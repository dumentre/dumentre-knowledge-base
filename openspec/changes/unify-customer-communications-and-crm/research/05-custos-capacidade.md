# 05. Custos, capacidade e controle de gasto

Data: 2026-11-21. Moeda: o que a fonte informou (USD ou BRL); **nenhuma conversão foi feita** e nenhuma cotação de câmbio foi consultada. O que depende da conta Dumentre está marcado.

## 1. Quatro tipos de custo (separados)

### 1.1 Software (licença)
| Componente | Licença | Custo recorrente de licença | Observação |
|---|---|---|---|
| Chatwoot Community v4.20.1 | MIT fora de `enterprise/` | US$ 0 ("Free forever", self-hosted) | Premium Support US$ 19/agente/mês **não** é necessário; recursos pagos listados em `03-alternativas-stack.md`. Edição Enterprise é proprietária e **não será instalada**; verificar que nenhum recurso de `enterprise/` seja ativado por engano (tarefa F2). |
| PostgreSQL 16 + pgvector, Redis 7 | open source | 0 | exigidos pelo Chatwoot |
| Núcleo Dumentre (Node 22, SQLite) | próprio | 0 | |
| Traefik, NetBird, OpenBao | já instalados | 0 | |
| Frappe CRM (AGPL-3.0), ERPNext (GPL-3.0) | open source | 0 | só na contingência C2 |

### 1.2 Infraestrutura
| Item | Já pagamos | Custo adicional |
|---|---|---|
| VPS Hetzner 2 vCPU / 3,8 GiB / 75 GB | sim (valor mensal **não consta** nas fontes lidas) | 0 se G-CAP passar |
| Segunda VM (contingência C2) | não | **desconhecido**: fontes secundárias discordam (CX33 € 8,99 [indisponível para novos pedidos segundo uma delas]; CPX32 € 35,99 após reajuste de 15/06/2026; + € 0,50 IPv4). A página oficial de preços não foi recuperada. |
| Armazenamento de anexos / backup | disco local 61 GB livres | backup externo: **a decidir** (D-backup); sem custo conhecido |
| Domínio próprio para o Chatwoot | hoje `sslip.io` (gratuito, sem DNS) | domínio da Dumentre = decisão do Luan; fora do escopo |

### 1.3 Trabalho de manutenção (esforço, não dinheiro)
Chatwoot publica versões com frequência (v4.20.1 em 20/11/2026); a doc exige Ruby 3.4 e Node 24. Estimativa: **2 a 4 horas por mês** de atualização + verificação de backup, mais **1 dia por atualização maior** (suposição; não medida). Cada atualização exige snapshot do banco antes, teste de restauração em outro diretório e conferência da lista de variáveis de ambiente.

### 1.4 Tarifas externas (podem cobrar sem nenhuma ação do operador)

| Operação | Cobra? | Fonte e condição |
|---|---|---|
| Receber mensagem do cliente (WhatsApp) | **Não** | Meta não cobra user→business (doc) |
| Webhook e reentregas da Meta | Não (retry por até 7 dias, pode duplicar) | doc |
| Mensagem de **serviço** (resposta em janela de 24 h) | **Sim, a partir de 01/10/2026**, depois de 1.000 entregues/mês por número comercial; dentro da janela de entrada de anúncio CTWA não cobra | doc `pricing.md`. Exemplo oficial para o Brasil: ≈ US$ 0,0068 por mensagem de serviço ("0.68 ¢"); **tarifa BRL exata = CSV da Meta, não extraída** |
| **Sem método de pagamento** | Meta **para de entregar** mensagens de serviço desde 01/10/2026 | doc `non-template-messages.md` |
| Template (marketing/utility/authentication) | **Sim**, por mensagem entregue, por mercado/categoria; marketing cobra mesmo com a conta nova | doc; **bloqueado por padrão** no plano |
| Meta Business Agent | **Sim**, US$ 2,00 por 1 M de tokens (~20 a 25 mil tokens/msg ≈ US$ 0,04–0,05) a partir de 01/08/2026 | doc; **desativado** no plano |
| Instagram/Messenger DM | nenhuma tarifa encontrada nesta leitura | s/e |
| Telegram Bot API | grátis; broadcast >30 msg/s só com "paid broadcast" (0,1 Stars/msg) opt-in | doc |
| TikTok Business Messaging | s/e (aprovação necessária) | s/e |
| Marketing API (leitura de campanha/lead) | s/e (leitura) | s/e |
| IA de produção (resumo, transcrição, classificação) | **Sim** se via API paga; esta execução usou só assinatura Claude Pro | custo desconhecido até a F6 |
| Gateway de pagamento, emissão de NFS-e | **Sim**, por transação/nota | **desconhecido**; decisão D8 |
| E-mail de saída (SMTP) | depende do provedor | desconhecido; D11 |

### 1.5 Contradição com a decisão de 14/11
A decisão e o `budget.js` tratam o WhatsApp como "custo zero na franquia". Corrigido: (1) a franquia de 1.000 vale **por número comercial** e **exige** método de pagamento; (2) **janela de entrada de anúncio** não cobra, mas isso não aparece no teto local; (3) a Meta **não oferece, na documentação lida, teto de gasto imposto pelo fornecedor para mensagens no Brasil** (cobrança pré-paga existe só na Índia, `prepaid-billing.md`). Logo o único teto real é o **nosso** (local) e o alerta; a verdade fica na fatura da Meta.

## 2. Como impedir gasto inesperado (desenho)

| Controle | Onde | Tipo | Cobre |
|---|---|---|---|
| Função única `send()` com recusa por falta de autorização, por orçamento e por canal sem resposta | núcleo | **teto local** (estimativa, reserva antes do envio) | UI, jobs, API e MCP (AT-12) |
| Categorias cobráveis (template, Business Agent, broadcast) **desativadas por padrão** (`flag` por número/categoria) | núcleo | bloqueio local | evita ativação silenciosa |
| Contador de mensagens entregues por mês do `statuses` (campo `pricing{billable, category}`) | borda | **reconciliação** com o que a Meta diz ter cobrado | detecta divergência com o teto local |
| Alerta aos 80% e fila ao atingir o teto, sem trocar de canal | núcleo + alerta | alerta | |
| Conferir fatura da Meta todo mês | operador | **fonte da verdade** | |
| Chaves de teste/sandbox separadas das de produção; nenhum teste automatizado chama API paga (mock do provedor) | CI | teste | AT-12.4 |
| Operação de custo desconhecido = desativada | política | regra | TikTok, Marketing API, IA em API |

Diferença explícita: **orçamento local e alerta** são do nosso lado; **teto efetivamente imposto pelo fornecedor** = não encontrado para Meta no Brasil.

## 3. Capacidade do VPS: conta honesta

Medido hoje (amostra instantânea): 3.814 MiB total, 772 usados, **3.041 disponíveis**, sem swap, 2 vCPU, 61 GB livres.

| Componente | Estimativa de RAM | Base |
|---|---|---|
| Já ativos (Traefik, NetBird, OpenBao, `wa-webhook`, dockerd, journald) | ~770 MiB | medido |
| Núcleo Dumentre + SQLite (Node 22) | 100 a 200 MiB | estimativa do tamanho do processo `node` do webhook (72 MiB RSS medidos) + folga; **não medido** |
| Chatwoot web (Puma) + Sidekiq | 1,2 a 2,5 GiB | docs: "4 GB RAM é o mínimo exigido", Sidekiq "1 GB+"; **não medido** |
| PostgreSQL 16 | 200 a 400 MiB | estimativa; **não medido** |
| Redis 7 | 50 a 150 MiB | doc: "100 MB para começar" |
| **Soma H4 (núcleo + Chatwoot + PG + Redis)** | **≈ 1,6 a 3,2 GiB** | sobre 3,0 GiB disponíveis → **pode não caber; sem swap, o OOM killer pode atingir o OpenBao** |

Portanto **G-CAP é obrigatório** antes de qualquer migração (tarefa F2.1). Critério proposto: Chatwoot + PG + Redis + núcleo ativos, carga sintética (replay de 1.000 eventos + 3 operadores simulados), picos de atualização e de backup, com limite de memória por container e swap de 1–2 GB: `MemAvailable` ≥ 800 MiB, 0 reinícios por OOM nos serviços existentes, latência de resposta do webhook p95 < 1 s. Vermelho → contingência C1 ou C2.

Backup: Chatwoot exige banco + anexos + configuração (doc `backup`); o núcleo é um arquivo SQLite (backup consistente com `VACUUM INTO`/`.backup`). **Ainda não há destino de backup externo nem teste de restauração**: tarefa F2.5, portão antes de dado real.

## 4. Estimativas de desenvolvimento (por fase, em dias-pessoa; premissas no fim)

| Fase | Entrega | Faixa | Principal incerteza |
|---|---|---|---|
| F0 | Portões, decisões, medição | 2–3 | acesso ao servidor e à conta Meta |
| F1 | Borda + núcleo + ficha mínima, com replay | 6–9 | modelo de dados e UI mínima |
| F2 | Chatwoot + repasse + Dashboard App + backup/restauração | 8–12 | G-CAP, assinatura no repasse, merge de contatos |
| F3 | Instagram, Messenger, e-mail, Lead Ads, UTM, Telegram | 8–12 | revisão/permissões Meta, e-mail |
| F4 | Funil, proposta, permissões, follow-up por política | 8–10 | volume de regras |
| F5 | Billing interno + 1 gateway + conciliação (NFS-e à parte) | 8–12 (+ NFS-e: 5–15, **muito incerto**) | gateway e emissor fiscal |
| F6 | IA opcional (resumo, transcrição, extração) com evals + MCP leitura | 6–10 | custo e qualidade do modelo |
| F7 | Backfill, exportação, ensaio de restauração, corte | 4–6 | o que a Meta expõe |
| **Total** | | **50–74 dias-pessoa** (+ NFS-e) | |

Premissas: 1 pessoa com assistente de código; Node/SQLite no núcleo; reuso do Playwright e do `node --test`; sem aprovação de app Meta além de Standard Access; sem imprevistos de conta. Faixas são **hipóteses**, não compromisso; a F1 é a mais firme (protótipo P1 já cobre a lógica).
