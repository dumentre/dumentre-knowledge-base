# Proposta Técnica: Servidor de E-mail Próprio na Hetzner (D11)

## 1. Contexto e Objetivo
Luan Cardoso definiu em D11: servidor próprio open source na Hetzner para controle total de caixas sob `@dumentre.com` (ex: `contato@dumentre.com`, `luan@dumentre.com`), com interface moderna (padrão Gmail) e alta entregabilidade.

## 2. Opções Avaliadas
- **Stalwart Mail Server + Roundcube/SnappyMail/Nextcloud Mail:** Rust nativo, consome < 100 MB RAM, suporte JMAP/IMAP/SMTP, Sieve, DKIM/SPF/DMARC automáticos. Ideal para o VPS atual com recursos moderados.
- **Mailcow-dockerized:** Completo, interface SOGo, mas consome 3 a 5 GB RAM (pesado para dividir com Chatwoot e serviços atuais no VPS de 4 GB).
- **Postal:** Focado em SMTP transacional, não em webmail completo de usuário.

## 3. Topologia Recomendada
- **Engine:** Stalwart Mail Server (ou Mailcow em VPS dedicado Hetzner se aprovado).
- **Interface Webmail:** SnappyMail ou Roundcube (leve, rápida, responsiva mobile/desktop estilo Gmail).
- **DNS & Entregabilidade:** Registros MX, SPF (`v=spf1 ...`), DKIM (2048-bit Ed25519/RSA), DMARC (`p=quarantine` ou `p=none` inicial) no Cloudflare.
- **Portas de Infraestrutura (Portões do Luan):**
  - Instalação no VPS ou nova VM Hetzner: requer aprovação.
  - Alteração de DNS no Cloudflare: requer aprovação.
