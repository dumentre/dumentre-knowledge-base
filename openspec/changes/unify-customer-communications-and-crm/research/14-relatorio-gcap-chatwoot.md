# 14 - Relatório G-CAP: Chatwoot v4.20.1 no VPS openbao-platform-prod

Data: 2026-11-25/26 (BRT 22:30-22:55). Host: 2 vCPU, 3814 MiB RAM, disco 75G. Chatwoot em `/opt/chatwoot` (Compose próprio), atrás do Traefik existente (`netbird-traefik`), URL `https://chatwoot.46-224-228-253.sslip.io`. Segredos: item Bitwarden `Hetzner / chatwoot / env (2026-11-25)` (330 bytes, sha256 prefixo 2b0f7520). Valores não registrados aqui.

## Antes (01:30 UTC, sem Chatwoot)
| Métrica | Valor |
|---|---|
| RAM usada / disponível | 790 / 3023 MiB |
| Swap | 0 |
| Disco `/` | 13G usados, 60G livres (18%) |
| Load 1/5/15 | 0.19 / 0.04 / 0.01 |

Swap de 2G (`/swapfile`, persistente em fstab) criado nesta janela, conforme D2.

## Depois, ocioso (01:53 UTC, 4 containers Chatwoot healthy)
| Métrica | Valor |
|---|---|
| RAM usada / disponível | 1970 / 1843 MiB |
| Swap usado | 256 KiB de 2G |
| Disco `/` | 18G usados, 54G livres (25%) (inclui imagens ~5G) |
| Load | 0.07 / 0.17 / 0.16 |
| web | 641 MiB / 1 GiB |
| worker (sidekiq) | 554 MiB / 768 MiB |
| postgres | 74 MiB / 512 MiB |
| redis | 5.6 MiB / 256 MiB |

Serviços existentes sem alteração: wa-webhook 19 MiB, openbao 18 MiB, traefik 43 MiB, netbird dashboard 24 MiB e server 48 MiB; todos seguem Up (uptime 7-10 dias, sem restart).

## Carga simulada
300 requisições HTTPS a `/api` via Traefik, 20 concorrentes: 300 x HTTP 200, média 0,449 s, máximo 0,918 s. Pico: web 15,9% CPU, traefik 10,3% CPU, load 0.62, RAM usada 2020 MiB, swap intocado. Após carga: RAM usada 1980 MiB, todos healthy.

## Veredito
- Passa para operação ociosa e carga HTTP leve: margem de ~1,8 GiB de RAM, swap sem uso, disco 25%, nenhum serviço existente afetado.
- LIMITAÇÃO: o critério de 05-custos-capacidade.md (replay de 1.000 eventos + 3 operadores simulados + picos de atualização) NÃO foi executado; só havia carga HTTP sintética. Executar o replay completo quando o canal WhatsApp (P1) estiver ligado. G-CAP completo = pendente; D1 segue condicionado.
- Risco: worker + web já usam ~1,2 GiB; com núcleo Node/SQLite e backup, acompanhar `available` (alerta abaixo de 800 MiB).

## Incidentes durante a implantação
- Healthcheck do web usava `curl`, ausente na imagem: container ficava `starting`, Traefik não o roteava. Corrigido com `wget` + header `X-Forwarded-Proto: https` (FORCE_SSL redireciona HTTP local). Backup `docker-compose.yml.bak-20251125-2250`.

## Prova
`docker ps`: chatwoot-web, worker, redis, postgres `(healthy)`. `curl -I https://chatwoot.46-224-228-253.sslip.io/` = `HTTP/2 302` (Location `/installation/onboarding`, TLS válido). Conta admin ainda NÃO criada (onboarding aberto: criar logo; signup público desativado).
