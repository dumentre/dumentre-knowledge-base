# 12. Provas executadas, mocks, serviços reais, sandbox e lacunas (complemento)

Ambiente: Windows 11, Node v22.21.1, Python 3.14. **Sem Docker, sem WSL.** Nada foi escrito fora de `research/complemento-2026-11-21/`. Nenhum arquivo preexistente foi alterado (conferido por data de modificação, ver `README.md`). Nenhuma chamada autenticada, nenhuma mensagem, nenhuma escrita remota. Temporários de teste ficaram em `_cache/tmp` desta pasta e foram removidos ao final.

## 1. O que foi executado
| Item | Comando | Resultado | Tipo |
|---|---|---|---|
| Releitura P1+P2 | `cd research/evidence/prototipo; TEMP=<…/_cache/tmp> node --no-warnings --test core.test.mjs ai-gate.test.mjs` | **23/23** verdes, ≈ 1 s | mock (protótipo) |
| Caracterização nova C1–C3 | `cd research/complemento-2026-11-21/evidencia/prova; node --no-warnings --test caracterizacao-prototipo-p1.test.mjs` (saída em `caracterizacao-prototipo-p1.saida.txt`) | **3/3**: payload assinado malformado → 200 sem evento; lote de 2 mensagens → 2 eventos; eco Instagram descartado | mock (caracteriza comportamento existente; não é TDD de comportamento novo) |
| Rate card BRL | download público do CDN + `evidencia/tools/lerxlsx.py` | Brasil: 0,3217 / 0,035 / 0,035 / 0,035 | leitura de fonte primária |
| Preços Hetzner | `evidencia/tools/lerfonte.py` + parser | CPX22 € 16,99; CPX32 € 30,49; CX* indisponíveis | leitura de fonte primária |
| Código Chatwoot v4.20.1 | `evidencia/tools/repogrep.py` | ver `05` e `01` §C | leitura de código (não execução) |
| Amostras de evals | `evidencia/tools/wilson.py` → `evidencia/wilson-amostras.txt` | 100 casos: só 0 erros demonstram ≥ 0,95 | cálculo |
| Contagem catálogo × matriz × specs | script (saída no `10`) | 78 = 78 = 78 | verificação de consistência |
| `openspec validate unify-customer-communications-and-crm --strict` | ver `README.md` | ver `README.md` | validação estrutural |

## 2. Classes de prova (o que cada uma prova)
- **Fonte primária lida:** o que o fornecedor afirma hoje (preços, janelas, webhooks, requisitos). **Não** prova que a conta Dumentre tem o recurso.
- **Código lido na tag:** o que a versão faz **segundo o texto**; **não** prova o comportamento em execução (ex.: F-02 é hipótese forte até G-F02).
- **Mock:** prova o **nosso** código perante um contrato simulado.
- **Serviço real local:** **não houve** (Chatwoot, PostgreSQL, Redis, ERPNext, Frappe CRM não foram executados).
- **Sandbox com canal real:** **não houve** (nenhuma conta Meta/TikTok/Telegram/e-mail acessada).

## 3. Bloqueios exatos
| Item | Bloqueio | Quem libera |
|---|---|---|
| Chatwoot real (qualquer prova de integração, RAM, merge, iframe) | Windows nativo inviável (`07`); Docker e WSL proibidos; VPS do cofre intocável | A9 (VM local) ou A10 (servidor) |
| Conta Meta (coexistência, `ads_read`, moeda, assinaturas) | sem acesso autorizado | A11 |
| TikTok (região, Advanced Access, custo) | portal oficial é SPA (só o título lido); sem conta | leitura logada após aprovação |
| EspoCRM Advanced Pack e módulos FreeScout (preço) | páginas dinâmicas/sem preço no texto lido | leitura manual do Luan, se a alternativa for reaberta |
| PDF do rate card | baixado (166 KB), **não extraído** | irrelevante: o xlsx equivalente foi lido |
| Tributos sobre o rate card | página não menciona | Billing Hub |
| Pasta Enviados do IMAP no Chatwoot | grep sem resultado (≠ inexistência) | teste na instalação |
| Parâmetro `source_id` na API pública de mensagens | não localizado nos arquivos lidos (≠ inexistência) | teste ou leitura do controller completo |
| Política de merge por papel | controller de merge não lido por completo | leitura adicional |

## 4. Lacunas conhecidas desta pesquisa (limites do que fiz)
- **Escopo do grep no Chatwoot:** `app|lib|config|enterprise` em `.rb` (1731 candidatos) para o lock; 49 arquivos para `referral`. A ferramenta ignora arquivos cujo GET falha, e `--maxfiles` limita 800 por padrão (usei 3000 nas buscas críticas). Hits ausentes **não** provam inexistência.
- **Alternativas de inbox:** só FreeScout e Zammad examinados; Rocket.Chat, Tiledesk e outras **não** foram examinadas.
- **Twenty, Odoo, SuiteCRM:** não reverificados.
- **Instagram/Messenger:** limites de taxa e custos **não lidos**; "Human Agent 7 dias" **não reconfirmado**.
- **Marketing API:** não confirmei a permissão exigida; estimativa de custo desconhecida.
- **NFS-e:** não pesquisada de novo nesta rodada.
- **Estimativas de esforço:** continuam hipóteses sem medição.
- **Sem benchmark** de nenhuma fatia (C1 inclusive): a viabilidade **não** é afirmada.
- **Evals reais:** nenhuma execução; sem orçamento nem autorização.
