# 07. Rodar o Chatwoot Community real: Windows nativo e recursos isolados já existentes

**Resultado:** **nenhuma execução foi feita**, porque não existe caminho nativo em Windows que seja **suportado, seguro e dentro das regras** desta rodada. Abaixo, o bloqueio exato e o caminho viável que exige uma autorização.

## 1. Windows nativo (sem Docker, sem WSL): bloqueado
| Evidência | Fonte (lida 2026-11-21) |
|---|---|
| "Chatwoot is developed for Linux-based operating systems. Please consider using a virtual machine to run Chatwoot on windows." Distribuição suportada: Ubuntu. | https://developers.chatwoot.com/self-hosted/deployment/requirements.md |
| O guia oficial "Windows Development Setup" é feito **com WSL2** (índice `llms.txt`: "…using WSL2"). | https://developers.chatwoot.com/llms.txt |
| `Gemfile.lock` na tag `v4.20.1`: `PLATFORMS` = `arm64-darwin-20/21/22`, `ruby`, `x86_64-darwin-18/20/21/22`, `x86_64-linux`. **Sem** `x64-mingw-ucrt`. Um `bundle install` no Windows exigiria alterar o lockfile e compilar gems nativas. | `Gemfile.lock` linhas 1014-1023 (`repogrep.py`) |
| Ruby `3.4.13` (`.ruby-version`), Node `24.22.1` (`.nvmrc`), PostgreSQL 16 **com pgvector**, Redis 7. | arquivos da tag; `chatwoot.com/deploy` |
| No PC não há `ruby`, `postgres`, `redis-server` (`Get-Command`: só `node` e `wsl.exe`; este último **proibido** nesta rodada). | verificação local, somente leitura |
| pgvector não tem binário oficial para Windows (compila-se de fonte com MSVC); portes de Redis para Windows ficam em 5.x; Memurai é comercial. | conhecimento geral, **não verificado nesta rodada** (rotulado como hipótese) |
| Instalar qualquer runtime fora desta pasta viola "nenhuma escrita fora da pasta nova". | regra do pedido |

Mesmo que um conjunto portátil (Ruby em zip, PostgreSQL em zip, Redis portado) fosse montado **dentro** da pasta, o resultado não representaria a produção Linux e **não mediria RAM/CPU** de forma utilizável (o G-CAP exige Linux/Ubuntu). Não tentei: seria experimento não suportado, não prova.

## 2. Recursos isolados que **já existem** (leitura somente)
| Recurso | Existe? | Pode ser usado sem criar/alterar nada remoto? |
|---|---|---|
| VPS Hetzner `openbao-platform-prod-openbao` (CPX22, 4 GB) | sim | **Não**: é o servidor de produção do OpenBao e da NetBird, do projeto `openbao-platform`, "Não é da Dumentre" (KB `hetzner-passo-a-passo.md` linhas 76-82); só acessível pela NetBird. Instalar Chatwoot nele altera produção (A1) e cria raio de explosão (F-06). |
| VM Linux local (Hyper-V/VirtualBox) | **não criada**; a KB só a planeja (`hetzner-automacao-agentes.md` linhas 13, 97, 129; `hetzner-health-updates-dr.md` linha 151) | não aplicável |
| Hyper-V no PC | hypervisor presente e 68,4 GB de RAM (KB `backlog/meubot-codex-orca-20261108.md` linha 38); `vmconnect.exe` existe | `Get-VM` nega permissão **sem elevação**; criar VM escreve VHDX fora desta pasta |
| Windows Sandbox | "não foi encontrado" (`WindowsSandbox.exe`, mesma nota da KB) | não |
| Docker no PC | há uma entrada `Docker/resources/bin` no PATH, mas `Get-Command docker` **não achou executável**; de todo modo **proibido** nesta rodada | não |
| Servidor de teste/staging Dumentre, GCP/Oracle free tier | **nada achado** nas KBs lidas (varredura de `oracle cloud|free tier|gcp|staging|ambiente de teste|segunda vm...` com `evidencia/tools/kbscan.py`) | não |
| Serviços gerenciados de terceiros (SaaS demo do Chatwoot) | não verificado | criar conta = recurso externo, fora das regras |

## 3. Caminho viável (exige autorização nova **A9**, não executado)
**Laboratório local em VM Linux (Hyper-V) com 2 vCPU/4 GB espelhando o CPX22**, criada por Luan (exige elevação e disco fora desta pasta), Ubuntu 24.04, Chatwoot `v4.20.1` pelo instalador/Compose oficial **dentro da VM**, PostgreSQL 16 + pgvector + Redis 7, **sem tráfego externo** (webhooks entregues por script local; nenhum token real). Entrega: medidas de `MemAvailable`, RSS por processo, p95 do webhook sob 1.000 eventos, e os gates **G-F01, G-F02, G-F04 (cookie no iframe), G-F05**. Custa zero em dinheiro; custo é tempo de Luan para criar a VM. Isso **precede** qualquer instalação em servidor (Hetzner), que ainda seria decisão D2.

Observação: Hyper-V não é Docker nem WSL, mas é virtualização **nova** no PC; a regra "Nenhum Docker ou WSL" não a proíbe, porém exige elevação e escrita fora da pasta, por isso fica como autorização.

## 4. O que ainda **não** se pode afirmar
Nem que o Chatwoot **roda** no CPX22 junto de OpenBao/NetBird, nem quanto ele consome. O número de RAM do Chatwoot continua estimativa (docs: 4 GB mínimo; `/deploy`: 8 GB; Sidekiq 1 GB+).
