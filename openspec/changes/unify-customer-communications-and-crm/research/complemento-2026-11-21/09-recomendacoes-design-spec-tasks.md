# 09. Recomendações concretas para `design.md`, specs e `tasks.md`

Formato: cada recomendação traz (a) **arquivo e seção** a mudar, (b) **texto proposto** (pronto para colar), (c) **erratas e achados de origem**. O orquestrador decide e aplica; nada aqui foi aplicado. Novos IDs de cenário usam sufixo livre (`AT-xx.n`) para **não renumerar** os existentes. Tamanhos P/M/G, como em `tasks.md`.

## 1. `design.md`

### 1.1 §1 (tabela de componentes): condicionar H4 e declarar o que está fora da borda
Acrescentar após a tabela: "**H4 permanece recomendada, condicionada** aos gates G-F01 (divisão de lote), G-F02 (confirmação de criação), G-F04 (sessão do painel) e G-F05 (sem merge), e a G-CAP feito **fora** do VPS do OpenBao. Se G-F02 confirmar perda silenciosa não reparável, aciona-se C1 (ver `research/complemento-2026-11-21/06`). **TikTok** aponta o webhook direto ao Chatwoot e **não passa pela borda**." *(E-14, E-01, E-02, E-06)*

### 1.2 §2 (fluxo): trocar "repasse fiel" por "repasse normalizado e confirmado"
Substituir o passo 43 do diagrama e o parágrafo "Falha temporária" por: "A borda **divide cada POST da Meta em uma unidade por mensagem/status** (`entry[i].changes[j].value.{messages|statuses|message_echoes}[k]`), **re-assina** cada unidade com o App Secret e a encaminha ao Chatwoot (`POST /webhooks/whatsapp/:phone`). A outbox tem estados `pendente → enviado (HTTP 200 = enfileirado) → confirmado (a mensagem existe no Chatwoot por `source_id`) | nao_confirmado (alerta e reinjeção)`. Entregue ≠ confirmado." *(E-01, E-02)*

### 1.3 §3 (tabela): linha "Vínculo identidade ↔ pessoa"
Trocar a projeção "merge de contatos no Chatwoot (planejado)" por "atributo `dumentre_person_id` no contato do Chatwoot; **nenhum merge automático**". Acrescentar nota: "O merge do Chatwoot é destrutivo (`destroy!`) e irreversível; só por ato humano, com snapshot." *(E-05)*

### 1.4 §5 (processamento): itens 4, 5 e 3
- Item 4: "**WhatsApp:** a Meta retenta até 7 dias. **Instagram/Messenger:** a Meta tenta por 15 min com alerta e **desinscreve o app após 1 h** de falha; reinscrever é escrita externa. A borda precisa de monitor externo, alerta aos 5 min e verificação de assinaturas a cada 10 min." *(E-03)*
- Item 5: acrescentar "reconciliação **incremental a cada 5 min** (mensagens de saída dos agentes, status da conversa, merges e exclusões) e completa diária; divergência alerta e não corrige sozinha." *(F-09)*
- Item 3: "Evento que lança exceção é `failed` com classe `transitório` (reexecuta com backoff) ou `permanente`; `raw_event.parse_error > 0` emite alerta." *(F-10)*

### 1.5 §9 (permissões): reescrever a frase do Dashboard App
"O painel **não** deriva a identidade do agente do iframe: o `postMessage` do Chatwoot (`appContext`) é **dica de navegação**, sem assinatura. O núcleo exige **sessão própria** do operador (login/forward-auth atrás da NetBird) e papéis do núcleo. O painel é servido no **mesmo site** (domínio registrável) do Chatwoot para cookies de primeira parte (a provar em G-F04)." *(E-04)*

### 1.6 §10 (métricas): acrescentar linhas
`raw_event.parse_error > 0` → alerta imediato; `outbox.enviado_sem_confirmacao > 5 min` → alerta; `meta_subscriptions_ativas ≠ esperadas` (IG/Messenger, a cada 10 min) → **crítico**; `chatwoot_reconcile_divergencias > 0`.

### 1.7 §11 (migração/corte): janela por produto
"Para Instagram/Messenger, a janela de indisponibilidade da borda **deve ser < 15 min** (ou usar endpoint sombra), pois após 1 h a Meta desinscreve o app. Para WhatsApp valem os 7 dias de retry." *(E-03)*

### 1.8 §13 (fases) e "Portão G-CAP"
- G-CAP: "executado primeiro em **VM Linux local** (2 vCPU/4 GB, Hyper-V) e **não** no VPS `openbao-platform-prod-openbao`; em seguida, em servidor Hetzner **separado** para a Dumentre se Luan aprovar (preços oficiais em `complemento/02`)." *(E-06)*
- F2: dividir em F2a (lab local + G-F01/G-F02/G-F04/G-F05), F2b (servidor separado + backup/restauração), F2c (sandbox Meta).

### 1.9 §14 (testes)
Acrescentar "Persistência/concorrência": executar a bateria P1 **em Linux** com `kill -9` em laço (≥ 200 ciclos) e HTTP real entre borda e Chatwoot de teste; documentar `node:sqlite` experimental no Node 22 e a decisão de driver. *(E-13)*

## 2. Specs (novos cenários; formato GIVEN/WHEN/THEN como os existentes)

**`specs/ingestao-eventos/spec.md`**, requisito "Processamento idempotente e recuperação de falhas":
```
#### Scenario: AT-10.6 Lote de várias mensagens
- **GIVEN** um POST assinado da Meta com 3 mensagens e 2 status
- **WHEN** a borda o aceita
- **THEN** 5 unidades são encaminhadas ao Chatwoot, cada uma assinada pela borda, e as 3 mensagens existem no Chatwoot e no núcleo, sem duplicata

#### Scenario: AT-10.7 Aceito pelo Chatwoot, mas não criado
- **GIVEN** o Chatwoot respondeu 200 e a mensagem não existe após N minutos
- **WHEN** a verificação por `source_id` falha
- **THEN** a unidade fica `nao_confirmado`, o operador é alertado, a reinjeção cria a mensagem uma única vez e o `raw_event` permanece intacto

#### Scenario: AT-10.8 Payload malformado porém assinado
- **GIVEN** um POST com assinatura válida e corpo que o adaptador não consegue interpretar
- **WHEN** a borda o recebe
- **THEN** o corpo bruto é retido, `parse_error` é registrado, um alerta é emitido e o evento é reprocessável após a correção do adaptador

#### Scenario: AT-10.9 Borda indisponível em Instagram/Messenger
- **GIVEN** a borda fora por mais de 15 minutos
- **WHEN** a verificação periódica de assinaturas roda
- **THEN** o alerta crítico dispara antes de completar 1 hora e o runbook de reinscrição é apresentado ao operador sem executar escrita externa automática
```
**`specs/identidade-ficha-unificada/spec.md`**: acrescentar `AT-05.7 Sem merge no Chatwoot` (GIVEN dois contatos do Chatwoot ligados no núcleo; WHEN o vínculo é criado e revertido; THEN nenhum contato do Chatwoot é destruído e o atributo `dumentre_person_id` é atualizado nos dois sentidos).
**`specs/operacao-seguranca-custos/spec.md`**: `AT-12.6 Painel sem autenticação derivada do iframe` (GIVEN requisição ao painel com `appContext` forjado e sem sessão; WHEN o servidor a recebe; THEN responde 401 e nada é lido).
**`specs/canais-adaptadores/spec.md`**: `AT-06.5 Eco do Instagram` (GIVEN mensagem de saída com `is_echo`; WHEN recebida; THEN é registrada como fato de saída pela chave `(instagram, conta, mid)` sem criar mensagem no Chatwoot).

## 3. `tasks.md`

| Alvo | Mudança proposta | Tipo | Tam. | Aceite |
|---|---|---|---|---|
| 1.1 | acrescentar testes vermelhos de **payload malformado assinado (C1)**, **lote (C2)** e **eco IG (C3)** (já existem como caracterização em `complemento/evidencia/prova/`) | TDD + Contrato | P | AT-10.8, AT-10.6 (parte núcleo), AT-06.5 |
| 1.3 | segredo HMAC **por provedor**; `failed` transitório × permanente; adaptador de `smb_message_echoes`/`history` (só registrar) | TDD | M | AT-01.5, AT-10.4 |
| **2.0 (nova)** | **Laboratório local Linux (VM Hyper-V)** com Chatwoot `v4.20.1`: medir RAM/CPU; **G-F01** lote de 2 mensagens; **G-F02** falha após lock e reenvio do mesmo `wamid`; **G-F04** sessão do painel em iframe (cookies); **G-F05** efeito do merge | Config + Integração | M | decisões registradas; se G-F02 confirma perda irreparável → C1 |
| 2.1 | G-CAP **fora** do VPS do OpenBao; só depois, servidor separado (D2 revisada) | Config | M | idem |
| 2.3 | repasse **normalizado**: dividir lote, re-assinar, `enviado → confirmado`; reinjeção | Integração | M | AT-10.6, AT-10.7 |
| 2.6 | painel com **sessão própria**; `appContext` só como dica; mesmo site do Chatwoot | E2E | M | AT-12.6, AT-08.4 |
| 2.7 | reconciliação **incremental 5 min** + completa diária | Integração | M | AT-10.5 |
| 2.9 | **atributo `dumentre_person_id`**, nunca merge automático | Integração | P | AT-05.7 |
| **2.11 (nova)** | monitor externo da borda + verificação de assinaturas Meta (IG/Messenger) a cada 10 min | Config | P | AT-10.9 |
| 0.8 | incluir: status Tech Provider/Solution Partner; moeda e tributos da conta; `ads_read`; região TikTok | Config (leitura) | P | tabela "confirmado/não verificado" |
| 3.1 | `messaging_referrals` (plural) | — | — | — |
| **3.12 (nova)** | benchmark **B1–B6** da C1 (somente se acionada) | Integração | M | `06` §4 |

Primeira tarefa que pode começar **já**, sem conta, sem servidor e sem decisão: **1.1** ampliada (testes vermelhos C1/C2/C3 + C5/C8/C9 do P0), em `conectores/whatsapp-business-mcp`, runner `node --test` existente.

## 4. Ordem de execução sugerida
1.1 → 1.3 → (Luan cria a VM Linux, A9) 2.0 → decidir H4 × C1 com G-F01/G-F02 → 2.1/2.3 → 2.6/2.7/2.9 → 2.11 → F2c (sandbox Meta, A2/A3).
