## Why

A Dumentre precisa arrumar a **própria operação de atendimento** antes de escalar a prospecção: hoje não há prova de uma mensagem entrando, sendo gravada e aparecendo para uma pessoa; o webhook do WhatsApp instalado em 18/11 atende **2 de 9** comportamentos do catálogo (descarta em silêncio usuários só com BSUID, ignora `statuses`, `referral`, ecos e mídia, rejeita payload acima de 256 KB e não guarda o bruto); não existe Instagram, Messenger, CRM nem registro único; e o custo do WhatsApp foi tratado como zero por uma nota que mudou em 01/10/2026. Sem um histórico e uma ficha únicos por pessoa, com origem rastreável e próxima ação, escalar é impossível.

Objetivo operacional (exemplo ponta a ponta da Bianca): anúncio → WhatsApp (texto e áudio) → ficha com origem verificável, regras comerciais e próxima ação → retorno pelo Direct na **mesma ficha** (última mensagem mostra Instagram e o horário correto) → proposta e resposta por e-mail → dois projetos = dois negócios da mesma pessoa → (fase posterior) cobranças, vencimentos, pagamentos e saldo.

## What Changes

Este documento é um **plano de implementação** (planejamento; nada foi implementado nem implantado). A change propõe:

- **Borda de ingestão** (evolução do webhook existente) como único destino do callback da Meta: assinatura, payload bruto, eventos idempotentes, repasse ao Chatwoot, atribuição, reprocessamento.
- **Chatwoot Community** (versão fixada, edição livre MIT) como caixa e tela principal, **condicionado ao portão de capacidade G-CAP** no VPS Hetzner atual (2 vCPU, 3,0 GiB disponíveis, sem swap).
- **Núcleo Dumentre pequeno**: identidade entre canais com evidência, ficha unificada, funil mínimo (pessoa/empresa, negócio, proposta, tarefa), follow-up por política com relógio injetável, atribuição auditável, política única de envio e custos, billing interno em fase posterior; exibido dentro do Chatwoot por **Dashboard App**.
- **Fases verticais** F0 a F7; a primeira (F1) demonstra `entrada → histórico → contato/lead → próxima ação → visibilidade` **sem depender de conta Meta nem do Chatwoot**, com replay, falha temporária de destino e associação de outro canal.
- IA e MCP **opcionais, desligados por padrão, fora do caminho crítico**, com plano de evals e portão determinístico.
- Contingências com condição concreta de acionamento: **C1** (núcleo + UI própria só para WhatsApp/Instagram/Messenger) e **C2** (segunda VM, com custo desconhecido).

### Prioridades
- **Obrigatório na primeira entrega (F1/F2):** AT-01, AT-02, AT-05 (núcleo), AT-06, AT-10, AT-11.4/11.5, AT-12, AT-13, AT-14 (contrato) e a correção dos defeitos do webhook atual.
- **Obrigatório em fase posterior:** atribuição por superfície (AT-03), Instagram/Messenger/e-mail (AT-04), funil completo (AT-07/08), billing (AT-09), backfill (AT-11.1 a 11.3), evals reais (AT-13.3).
- **Extensão condicional:** TikTok, X e novas redes (dependem de API, permissões e custo), Meta Business Agent (fora do caminho crítico).

### Fora de escopo (desta change)
Instalar ou alterar produção, trocar webhook ou número oficial, enviar mensagens, assinar serviços, migrar dados, emitir NFS-e, contratar gateway, escolher fornecedor fiscal. Tudo isso depende de decisões D e autorizações A em `research/11-decisoes-e-autorizacoes.md`.

## Capabilities

### New Capabilities
- `ingestao-eventos`: recepção durável, idempotência, recuperação de falhas e reprocessamento (AT-01, AT-10).
- `identidade-ficha-unificada`: identidade verificável entre canais e ficha única pesquisável (AT-05).
- `canais-adaptadores`: recepção e resposta por canal, status/eco, capacidades explícitas e contrato de novo canal (AT-04, AT-06, AT-14).
- `atribuicao-origem`: origem bruta, normalizada, primeiro/último toque e regras auditáveis (AT-03).
- `comercial-followup`: pessoa com vários negócios, funil, proposta e follow-up por política (AT-02, AT-07, AT-08).
- `billing`: registro financeiro ligado ao negócio, gateway idempotente e fronteira com NFS-e (AT-09).
- `operacao-seguranca-custos`: política única de envio, permissões, privacidade, custos, backfill, restauração e corte (AT-11, AT-12).
- `ia-opcional`: IA somente como sugestão revisável, fluxo principal independente dela (AT-13).

### Modified Capabilities
Nenhuma. A change preexistente `crm-atendimento-unificado` (na KB, não versionada) **não foi alterada**; esta a substitui em escopo (decisão D10 do Luan) e **nenhuma das duas deve ser arquivada** antes da implementação e das provas reais.

## Impact

- **Repositórios:** `conectores/whatsapp-business-mcp` (correções do webhook, F1.1); novo pacote `conectores/dumentre-core` (D13); site (`dumentre-website-v2`, código de origem curto, F3). Nada foi alterado nesta execução.
- **Infraestrutura:** VPS Hetzner (Chatwoot, Postgres, Redis, núcleo) **somente após G-CAP e autorização A1**; Traefik/NetBird/OpenBao inalterados.
- **Custos:** software sem licença recorrente; tarifas da Meta (franquia de 1.000 mensagens de serviço por número a partir de 01/10/2026, método de pagamento obrigatório, **sem teto imposto pelo fornecedor** encontrado); segunda VM, SMTP, gateway, NFS-e e IA em API são **desconhecidos** (`research/05`).
- **Riscos principais:** o Chatwoot pode não caber no VPS (R-01); o webhook do Chatwoot não retenta (R-03); webhook atual perde mensagens de usuários só com BSUID (R-02). Lista completa em `research/07-riscos.md`.
- **Verificação:** matriz `research/08-rastreabilidade.md` (requisito | cenário | componente/versão | evidência | teste | resultado | bloqueio) com estados `planejado`, `executado-mock`, `aprovado`, `reprovado` e `pendente-externo`. **Nenhum cenário está `aprovado`** nesta fase.
