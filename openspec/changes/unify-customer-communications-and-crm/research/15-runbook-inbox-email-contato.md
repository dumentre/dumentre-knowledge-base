# Runbook inbox contato@dumentre.com no Chatwoot P3

Data 2026-11-26. Conta Chatwoot 2, inbox id 5 tipo Channel::Email.

## Config
- IMAP mail.dumentre.com 993 SSL; SMTP mail.dumentre.com 587 STARTTLS; login contato@dumentre.com.
- Senha da caixa: Bitwarden, item Dumentre / Stalwart / contato@dumentre.com. Token API: item Dumentre / Chatwoot / API token hermes. Nunca imprimir.
- Criacao: POST /api/v1/accounts/2/inboxes canal email, depois PATCH com imap e smtp.

## Prova 2026-11-26
- GET inboxes: id 5 contato@dumentre.com Channel::Email, mais 3 inboxes API.
- Teste luan@ para contato@ via SMTP 587 do Stalwart gerou conversa id 6 na inbox 5.
- Resposta pelo Chatwoot, message id 1015, chegou em luan@ com 2 DKIM-Signature ed25519 e rsa d=dumentre.com; ambas verificadas contra o DNS com dkimpy: True e True.
- SPF: TXT de dumentre.com inclui a:mail.dumentre.com = 46.224.228.253, IP de saida do Stalwart.
- LIMITE: Stalwart nao grava Authentication-Results em entrega local. Cabecalho spf=pass dkim=pass de provedor externo nao capturado; depende do bounce Outlook 5.7.501 em t_523e4df1.

## Pegadinha
- Email sem Date e sem Message-ID e ignorado pelo fetch IMAP: Fetched 0 new emails. Testes devem incluir os dois.

## Rollback
- DELETE /api/v1/accounts/2/inboxes/5 remove inbox e conversa 6.
