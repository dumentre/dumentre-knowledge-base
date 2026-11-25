# 01. Inventário do estado real (Rodada 1)

Data da execução: 2026-11-21. Tudo que está aqui foi lido nesta execução, em modo somente leitura, salvo onde indicado "relato". Rótulos: **medido** (comando rodado nesta execução), **lido** (arquivo/código lido), **relato** (registro de outra sessão, não reverificado), **não verificado**.

## 1. Fontes locais consultadas

| Fonte | Versão / commit | O que foi lido |
|---|---|---|
| `AGENTS.md`, `CLAUDE.md` (raiz `projects/`, `dumentre/`) | n/a | Ponteiros para as regras globais; sem regra específica de Dumentre além de "KB é a fonte única". |
| `projects-knowledge-base/ai-instructions/global-rules.md` | working copy 2026-11-21 | OpenSpec para mudança de sistema; escrita em banco/envio/gasto exigem "ok" por operação; commits sem co-autoria de IA; sem Docker/WSL. |
| `projects-knowledge-base/ai-instructions/estrategia-testes.md` | working copy | Matriz OpenSpec/TDD/BDD; Gherkin no Markdown da OpenSpec não executa; bloco "Estratégia de testes" obrigatório em `design.md`. |
| `projects-knowledge-base/mapa-de-projetos.md` | 2026-11-16 | `conectores/whatsapp-business-mcp` = webhook Meta no Hetzner; `personal/openbao-platform` = infra Hetzner. |
| `dumentre-knowledge-base` | HEAD `ec47a64`, working copy com arquivos não versionados | `openspec/config.yaml` (schema `spec-driven`, pt-BR), change existente `crm-atendimento-unificado` (proposal, 1 spec, tasks), `estrategia/atendimento-unificado.md` (14/11), `estrategia/decisao-whatsapp-api-2026-11-14.md`, export do thread Discord (18 a 21/11). |
| `conectores/whatsapp-business-mcp` | HEAD `03584b1` (18/11) | `README.md`, `CHANGELOG.md`, `src/webhook.js`, `src/webhook-service.js`, `src/inbox.js`, `src/config.js`, `src/logger.js`, `openspec/changes/webhook-hetzner-seguro/tasks.md`. **`.env` não foi aberto.** |
| `personal/openbao-platform` | n/a | `docs/infra-design.md` (default 2 vCPU/4 GB Ubuntu 24.04). |
| `dumentre-website-v2` | HEAD `553a5e2`, 6 arquivos modificados não commitados | `script.js` (captura `utm_*` e anexa "Origem: ..." ao texto do link `wa.me`), `tests/e2e/cta-links.spec.ts` (Playwright). Site estático (HTML/CSS/JS). |

A change `crm-atendimento-unificado` da KB foi lida e **não foi alterada**. A nova change a **substitui em escopo** (ver `11-decisoes-e-autorizacoes.md`, D10); nenhuma das duas foi arquivada.

## 2. Estado do WhatsApp (o que existe de fato)

Evidência: README/CHANGELOG/tasks do conector, lidos hoje; o último registro de deploy é de **2026-11-18**.

- **Implementado e relatado como implantado (relato 18/11):** container `wa-webhook` no Hetzner atrás do Traefik, `https://wa.46.224.228.253.sslip.io/webhook`, certificado Let's Encrypt, handshake GET, validação de `X-Hub-Signature-256`, corpo máx. 256 KB, rate limit, SQLite em volume, 30 testes locais. Assinatura de callback no app "Dumentre Atendimento" (`messages`, WABA inscrita).
- **Não comprovado:** mensagem real ponta a ponta (tarefas F5/F6 do conector seguem abertas: falta destinatário permitido). Uma rota que responde 401/403/200 ao handshake **não** prova recepção, gravação e exibição.
- **Medido hoje (P0, código real em SQLite temporário, fixtures sintéticas):** o webhook instalado atende **2 de 9** comportamentos do catálogo (texto simples e reentrega). Lacunas confirmadas por execução: `referral` de anúncio descartado; `statuses` ignorado; mensagem de usuário só com username/BSUID **descartada em silêncio com HTTP 200**; áudio sem id de mídia; eco `smb_message_echoes` ignorado; payload de 300 KB rejeitado (413) quando a Meta permite até 3 MB; payload bruto não retido (nada reprocessável). Saída: `evidence/saidas/p0-caracterizacao-webhook-atual.txt`.
- **Divergência de custo:** a decisão de 14/11 e o `budget.js` assumem "1.000 mensagens de serviço grátis por mês" e custo zero. A documentação oficial lida hoje confirma a franquia de 1.000 por número a partir de 01/10/2026, **mas** exige método de pagamento (sem ele a Meta para de entregar mensagens de serviço) e cobra da 1.001ª em diante. A "janela" de 24h do conector está correta. O teto local de 900 é estimativa, não limite imposto pela Meta.
- **Bug conhecido (relato 19/11) não corrigido:** a regra de janela de 24h usa data fornecida pelo chamador e não rejeita data futura/inválida (`src/policy.js`). Não reverificado hoje; entra como tarefa de teste.

## 3. Instagram, Messenger, e-mail, site, TikTok, Telegram

| Canal | Estado encontrado | Rótulo |
|---|---|---|
| Instagram Direct / Messenger | Nenhuma integração encontrada. Contas reais (portfólio, Página, IG profissional) **não inventariadas**. | não verificado |
| E-mail | Backlog item 27 (12/10): `luan.cardoso@dumentre.com` **só recebe** (Cloudflare Email Routing → Gmail); enviar como o domínio não está configurado. | lido (KB) |
| Site | `script.js` (não commitado) lê `utm_source/medium/campaign/content/term` e acrescenta "Origem: ..." ao **texto** do `wa.me`. O cliente pode editar o texto: atribuição de melhor esforço. Há runner Playwright. | lido |
| Telegram / TikTok | Sem artefato. | sem evidência |
| CRM | `estrategia/prospeccao/pipeline.csv` é lista comercial local, **não é CRM** ligado aos canais. | relato (Discord 19/11) |
| Chatwoot / ERPNext / Frappe CRM | **Nada instalado** em lugar algum. | relato + confirmado pela ausência no inventário do servidor |

## 4. Servidor Hetzner (leitura única, amostra instantânea)

Comando: `ssh vps '<leituras>'` (usuário `luan`, sem root; só `date`, `nproc`, `free -m`, `df`, `uptime`, `ps` ordenado por RSS). Data/hora da amostra: **2026-11-21T13:25:46Z**.

| Item | Valor medido |
|---|---|
| vCPU | 2 |
| RAM total | 3.814 MiB |
| RAM usada / disponível | 772 MiB / 3.041 MiB (buff/cache 3.198 MiB) |
| Swap | **nenhum** |
| Disco `/` | 75 GB, 12 GB usados, **61 GB livres** (17%) |
| Carga | 0,00 (uptime 6 dias) |
| SO | Ubuntu 24.04.4 LTS |
| Maiores RSS | `systemd-journal` 260 MB, `dockerd` 103 MB, `traefik` 98 MB, `bao` 82 MB, `fail2ban-server` 77 MB, `node` 72 MB, `netbird-server` 72 MB |

Limites desta leitura: é **uma amostra instantânea**, sem pico, sem atualização, sem backup rodando. `docker stats` foi negado (usuário sem acesso ao socket; **não usei root**), portanto a memória por container não foi medida. Divergência com relatos: 61 GB livres e ~3,0 GiB disponíveis conferem com o relato do Hermes de 20 e 21/11 (2 vCPU, 3,7 GiB, ~3,0 GiB disponíveis, 61 GB livres, sem swap).

## 5. Decisões possivelmente desatualizadas

1. "Franquia de 1.000 mensagens de serviço = custo zero" (decisão 14/11): precisa de método de pagamento e muda a partir de 01/10/2026; reler `05-custos-capacidade.md`.
2. `atendimento-unificado.md` (14/11) diz que não confirmou se a Meta envia a origem do anúncio no webhook: **confirmado na documentação oficial** (campo `referral`, ver `04-matriz-canais.md`); a afirmação de que "o Instagram não passa a origem para o WhatsApp" segue válida (são superfícies distintas).
3. Hermes (20/11) citou Chatwoot "2 CPU e 4 GB" vs "4+ CPU e 8 GB": a página `/deploy` diz **8 GB mínimo (16 recomendado)** e a documentação de requisitos diz **4 GB é o mínimo exigido, 4 cores recomendados, Sidekiq pode passar de 1 GB, adicionar 1 GB de swap**. Ver `03-alternativas-stack.md`.
4. A change `crm-atendimento-unificado` lista Chatwoot como "candidato para piloto"; esta pesquisa o adota **condicionado a um portão de capacidade** (G-CAP).
5. `webhook-hetzner-seguro` marca o limite de 256 KB como decisão fechada; a documentação oficial diz que o payload pode chegar a 3 MB.

## 6. O que não foi possível verificar (bloqueios)

- Memória por container, picos, comportamento durante atualização e backup: exige root/instalação no servidor (proibido nesta execução).
- Contas Meta reais (portfólio, WABA, Página, IG), elegibilidade a coexistência, rate card em BRL, status de revisão do app: exige acesso à conta (não autorizado aqui).
- Conteúdo do `.env` e do cofre: deliberadamente não lido.
