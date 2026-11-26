# E-mail Dumentre (Stalwart) — arquitetura, manutenção e aceite E2E

Data do aceite: 2026-11-26 (BRT). Sem segredos neste documento.

## Arquitetura
- Servidor: Hetzner openbao-platform-prod, container `stalwart-mail` (imagem `stalwartlabs/stalwart:v1.2.1`), compose em `/opt/stalwart/docker-compose.yml`, dados em `/opt/stalwart/{data,etc,lib,log}`.
- Portas públicas: 25 (MX), 587 (submission STARTTLS), 993 (IMAPS). Admin só em `127.0.0.1:8088` (JMAP `POST /jmap/`).
- Contas: `contato@dumentre.com` (aliases postmaster, abuse) e `luan@dumentre.com`. Senhas só no Bitwarden (`Dumentre / Stalwart / ...`).
- DNS (Cloudflare): MX `10 mail.dumentre.com`; SPF `v=spf1 a:mail.dumentre.com include:_spf.mx.cloudflare.net ~all`; DMARC `p=none`; DKIM `v1-ed25519-20261126` e `v1-rsa-20261126`; PTR `46.224.228.253 -> mail.dumentre.com`.

## Correção feita em 2026-11-26
- Sintoma: toda entrega a gmail.com falhava com `DNSSEC validation failed` (resolver tipo `System`, via 127.0.0.53 do host).
- Correção: objeto JMAP `x:DnsResolver` (singleton) trocado para `@type: Custom`, servidores `1.1.1.1` e `9.9.9.9`, protocolo `tcp` (mantém validação DNSSEC/DANE), seguido de restart do container.
- Backup antes da mudança: `/opt/stalwart/backup-resolver-20261126-0842/` (etc, compose, export JMAP do resolver anterior: `System`, attempts 2, timeout 5000).
- Rollback: `x:DnsResolver/set` com `@type: System` e restart do container.

## Evidências
Saída (luan@ -> Gmail, submission 587 AUTH), log Stalwart:
- `delivery.delivered`, queueId 342681028971724800, host `gmail-smtp-in.l.google.com`, code 250, 08:50:48Z.
- Headers no Gmail: `spf=pass ... designates 46.224.228.253`, `dkim=pass header.s=v1-rsa-20261126`, `dmarc=pass (p=NONE)`; Message-ID `<e2e-out-0850@dumentre.com>`. A chave ed25519 aparece `dkim=neutral (no key)` no Gmail (Google não valida ed25519); RSA passa.
- Mensagem caiu em Spam no Gmail (domínio novo, sem reputação). Pendência: marcar "não é spam" e aquecer reputação.

Entrada (Gmail -> contato@, porta 25), log Stalwart 08:53:20Z:
- `smtp.spf-from-pass`, `smtp.dkim-pass` (gmail.com), `smtp.dmarc-pass`, `message-ingest.ham` queueId 342681348663673344.
- Headers lidos por IMAP em contato@: `dkim=pass header.d=gmail.com`, `spf=pass ... designates 209.85.218.42`, Message-ID do Gmail presente, assunto "Teste E2E entrada Gmail 0900".

## Pendências do Luan
- Bounce do Outlook/Hotmail `550 5.7.501 Spam abuse detected from IP range` não chegou ao Stalwart (sem conexão Microsoft nos logs). Pedir delist/revisão em https://sender.office.com (login Microsoft, possível 2FA). Texto: IP 46.224.228.253, mail.dumentre.com, domínio dumentre.com, SPF/DKIM/DMARC passando, PTR configurado, uso legítimo transacional/atendimento.
- Opcional: DMARC `p=quarantine` após período de observação; MTA-STS.

## Manutenção
- Logs: `/opt/stalwart/log/stalwart.log.AAAA-MM-DD`. Fila com falha reagenda sozinha.
- Qualquer mudança de config: backup de `/opt/stalwart/etc` e do compose ao lado, com timestamp.
- Teste rápido de saída: submission 587 com AUTH para um Gmail e conferir headers.
