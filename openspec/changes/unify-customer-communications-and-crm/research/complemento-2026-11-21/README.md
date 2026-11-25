# Complemento da pesquisa (21/11/2026): índice

Execução do `pedido-complemento-pesquisa.md`. **Somente arquivos novos**, todos nesta pasta. Nada preexistente foi editado; o orquestrador aplica à KB o que verificar. Escrito em pt-BR; nomes de APIs, campos e comandos preservados.

## Leia primeiro (5 achados que mudam decisões)
1. **Chatwoot processa só a 1ª mensagem de cada POST** (`entry[0].changes[0]`, `messages.first`) e a Meta agrega até 1000 updates: o "repasse fiel" do `design.md` perde mensagens. Substituto: dividir o lote e re-assinar. (`05` F-01)
2. **"200 do Chatwoot" = enfileirado**; lock Redis de 1 dia (`SET NX`) sem liberação achada pode descartar a mensagem sem erro. Gate G-F02. (`05` F-02)
3. **Instagram/Messenger: 1 h de falha desinscreve o app**; a premissa "Meta retenta 7 dias" vale só ao WhatsApp. (`05` F-03)
4. **O VPS não é "da Dumentre"**: é `openbao-platform-prod-openbao` (CPX22), cofre + NetBird; G-CAP não pode ser lá. (`05` F-06)
5. **Dashboard App não tem autenticação assinada** e o **merge do Chatwoot é irreversível**: duas premissas do desenho caem. (`05` F-04, F-05)

## Arquivos
| Arquivo | Conteúdo |
|---|---|
| `00-progresso-complemento.md` | diário da execução (gravado ao longo do trabalho) |
| `01-fontes-evidencia.md` | bibliografia: URL exata, data, estado (lida / achada-não-lida), trechos curtos |
| `02-precos-custos.md` | **rate card BRL oficial** (Brasil) e condições; **Hetzner oficial**; desconhecidos |
| `03-comparativo-crm-inbox.md` | Chatwoot, Frappe CRM, ERPNext, Woofed, EspoCRM, FreeScout, Zammad com versões, licenças, edições |
| `04-matriz-canais-complemento.md` | por canal: receber, responder, iniciar, eco, histórico, permissões, origem, custo; confiabilidade dos webhooks |
| `05-revisao-adversarial.md` | F-01 a F-13, reconsideração construir × comprar |
| `06-fatia-vertical-sem-chatwoot.md` | contingência C1 especificada, **benchmark B1–B6**, sem afirmar viabilidade |
| `07-chatwoot-windows-e-recursos-isolados.md` | por que não há execução nativa em Windows; recursos isolados existentes; caminho viável (A9) |
| `08-errata.md` | E-01 a E-20, vinculadas a `arquivo:linha` dos arquivos antigos |
| `09-recomendacoes-design-spec-tasks.md` | texto proposto para `design.md`, specs (novos cenários) e `tasks.md` |
| `10-rastreabilidade-complemento.md` | achado → canônico → prova → estado; revisão de cenários, fases, riscos, custos, TDD; contradições priorizadas |
| `11-decisoes-e-autorizacoes-complemento.md` | D2R, D6R, D14–D18, A9–A11, pré-condições |
| `12-provas-e-lacunas.md` | executado × mock × real × sandbox; bloqueios; limites desta pesquisa |
| `evidencia/` | ferramentas (`tools/`), caracterização executável (`prova/`), saídas, rate card do Brasil, cálculo de amostras, saída da validação OpenSpec |
| `fontes-log.jsonl` | registro de cada leitura pública (URL, status, bytes, SHA-256 truncado) |

## Verificação
- `openspec validate unify-customer-communications-and-crm --strict` (OpenSpec CLI 2.0.0, na raiz da worktree): **"Change 'unify-customer-communications-and-crm' is valid"**; saída em `evidencia/openspec-validate-complemento.txt`. O validador confere estrutura, não a verdade do conteúdo.
- Reexecução do protótipo (P1+P2): 23/23. Caracterização nova: 3/3 (`evidencia/prova/`).
- Contagem de cenários: catálogo 78 = matriz 78 = specs 78.
- **Arquivos novos nesta pasta: 25** (14 `.md`, 1 `.jsonl`, 5 `.py`, 1 `.mjs`, 4 `.txt`), contados após este README.

## Como reproduzir leituras
`python -I evidencia/tools/lerfonte.py <URL> -k <regex> --raw` (cria `_cache/` descartável, registra em `fontes-log.jsonl`); `python -I evidencia/tools/repogrep.py <org/repo> <tag> <regex> <filtro-de-caminho> [--maxfiles N]` ou `--cat <caminho> --lines a-b`; `python -I evidencia/tools/lerxlsx.py <arquivo>`. URLs do CDN da Meta são assinadas e expiram: a fonte estável é a página de preços, de onde os links saem.

## Limites (resumo; detalhe em `12`)
Nenhum serviço real foi executado (Chatwoot, Postgres, Redis, ERPNext, Frappe CRM); nenhuma conta Meta, TikTok, Telegram ou e-mail foi acessada; nenhum benchmark foi rodado; achados F-01, F-02, F-04, F-05 e F-09 são **leitura de código na tag fixa**, não execução.
