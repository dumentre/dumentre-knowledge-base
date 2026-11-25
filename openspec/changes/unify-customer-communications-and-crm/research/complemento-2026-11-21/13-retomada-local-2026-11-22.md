# 13. Retomada local da vertical de ingestão (22/11/2026)

Escopo: só implementação local e sintética no repositório `whatsapp-business-mcp`, change `reforcar-ingestao-omnichannel`. Nenhuma produção, webhook oficial, conta, número, banco real, envio ou serviço pago foi tocado. A change maior desta KB segue **aberta**.

## O que ficou verificado localmente

- BSUID lido do campo da Meta (`messages[].from_user_id`, nome em `contacts[].user_id`). O código anterior lia `user_id` no nível da mensagem e descartava em silêncio mensagens só com BSUID.
- Entrada durável: o webhook responde 200 só depois do commit de um lote numa transação SQLite. Falha de gravação responde 500 e desfaz o lote inteiro.
- Bruto cifrado com AES-256-GCM. Sem `WHATSAPP_RAW_KEY_BASE64` o webhook responde 503 (fechado por padrão).
- Idempotência e isolamento por conta comercial (`account`): 10 entregas simultâneas e 4 processos em paralelo geram uma mensagem, um contato e uma próxima ação.
- Status, eco, referral (presente/ausente), áudio com `media_id` e limitação explícita, eventos não reconhecidos sinalizados para revisão.
- Visibilidade local: `GET /conversations` e `GET /conversations/{conta}/{contato}` (histórico, status, próxima ação), sem bruto.
- Evidências: `openspec/changes/reforcar-ingestao-omnichannel/evidencias/00-mapa-cenarios.md`.

## O que NÃO foi verificado (não afirmar)

- Canal real da Meta, payloads reais, assinatura real de produção, limites reais de envio.
- Chatwoot, sandbox, billing, autorização de usuários, alta disponibilidade, segurança geral.
- Identidade BSUID × telefone: um contato que chega só com BSUID e depois com telefone **não** é unificado nesta fatia (ficam dois contatos). Limitação registrada.
- Fixtures são sintéticas; a forma do payload de Instagram/Messenger não foi conferida contra a documentação oficial nesta sessão.

## Pendências para decisão do Luan

1. Prazo de retenção do bruto (`WEBHOOK_RAW_RETENTION_DAYS`, valor de fixture: 30 dias).
2. Gestão da chave `WHATSAPP_RAW_KEY_BASE64` em produção (onde fica, rotação).
3. Produção ainda tem `raw_payload` em texto claro (versão anterior). A limpeza existe (`clearLegacyRawPayload`) mas **não** foi executada; exige backup e autorização.
4. Redeploy no Hetzner ainda não feito; produção segue na versão anterior.
