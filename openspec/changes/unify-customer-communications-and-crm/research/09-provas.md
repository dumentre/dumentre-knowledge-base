# 09. Provas: o que foi executado, como reproduzir e o que NÃO foi provado

Ambiente: Windows 11, Node v22.21.1, Python 3.14. **Sem Docker, sem WSL.** Diretório isolado: `research/evidence/`. Fixtures 100% sintéticas (telefones `5500000000xxx`, IDs `*_SINT`, segredo `segredo-sintetico-de-teste`). Nenhuma chamada à Meta, nenhuma mensagem enviada, nenhum arquivo preexistente alterado.

Tipos de prova (cada uma prova um aspecto diferente): **doc** (documentação oficial), **mock** (nosso código contra fixture e dublê), **local real** (serviço real rodando localmente) e **sandbox** (canal real de teste). Nesta execução houve **doc** e **mock**, mais uma **caracterização de código real** (P0). **Não houve sandbox.**

Raiz dos comandos (PowerShell ou Git Bash): `cd <worktree>\openspec\changes\unify-customer-communications-and-crm\research\evidence`

| Prova | O que prova | Comando | Resultado | Saída |
|---|---|---|---|---|
| **P0** Caracterização do webhook **já instalado** (código real em SQLite temporário, somente leitura) | O que o serviço atual faz com fixtures: texto simples, reentrega, `referral`, `statuses`, BSUID, áudio, eco, 300 KB, retenção do bruto | `node prototipo/caracterizacao-webhook-atual.mjs "C:\Users\luanc\projects\conectores\whatsapp-business-mcp"` | **2/9** atendem; 7 lacunas (R-02, R-04, R-07 e outras) | `saidas/p0-caracterizacao-webhook-atual.txt` |
| **P1** Núcleo descartável, TDD | Idempotência (série e 8 processos), reinício, BSUID, ficha multicanal, vínculo/reversão, atribuição primeiro/último toque, CRM fora do ar com outbox, política de reabertura, status fora de ordem, timeout incerto, orçamento/autorização, canal novo, IA quebrada, follow-up no fuso | `node --no-warnings --test prototipo/core.test.mjs` | **vermelho 14/14** (`não implementado`) → **verde 14/14**; 3 rodadas estáveis | `saidas/p1-tdd-red.txt`, `p1-tdd-green-tentativa1.txt`, `p1-tdd-green.txt`, `p1-estabilidade-3-rodadas.txt` |
| **P1-mut** Mutação | Os testes detectam regressão? | mutantes aplicados em cópia temporária | mutante "ignora negócio aberto": **3 testes falham**; mutante "remove OR IGNORE de message": **sobrevive** (defesa em profundidade: o índice `UNIQUE` e o evento já impedem duplicata; ver nota) | `saidas/p1-mutantes.txt` |
| **P2** Portão de IA com modelo STUB, TDD | Contrato `extract.v1`, abstenção, valor/prazo sem suporte, evidência, ações proibidas, timeout/lixo/erro, aplicação autorizada | `node --no-warnings --test prototipo/ai-gate.test.mjs` | vermelho 9/9 → verde 9/9 | `saidas/p2-tdd-red.txt`, `p2-tdd-green.txt` |
| P1+P2 juntos | | `node --no-warnings --test prototipo/core.test.mjs prototipo/ai-gate.test.mjs` | 23/23 | `saidas/p1-p2-conjunto.txt` |
| Leitura do servidor | Recursos do VPS (amostra instantânea) | `ssh vps '<date, nproc, free -m, df, uptime, ps>'` (somente leitura, sem root) | 2 vCPU, 3.814 MiB, 3.041 disponíveis, sem swap, 61 GB livres | `01-inventario.md` §4 |

## Achados das provas (que mudam o plano)
1. **Bug real encontrado pelo TDD:** abrir 8 conexões simultâneas ao mesmo SQLite falhou com `database is locked` porque `PRAGMA journal_mode=WAL` rodou antes de `busy_timeout`. Corrigido e registrado (`p1-tdd-green-tentativa1.txt`). Vira requisito de implementação (tarefa F1.3).
2. **O webhook instalado descarta em silêncio** mensagem de usuário só com BSUID e ainda responde 200, então a Meta não retenta: perda definitiva. Corrigir antes de qualquer outra coisa (tarefa F1.1).
3. **A borda precisa guardar o payload bruto**: sem ele, nada é reprocessável nem auditável (AT-01.8).

## Limitações (leia antes de confiar)
- P1 usa **SQLite local, um escritor serializado por `BEGIN IMMEDIATE`** e um CRM **simulado**. Não prova Chatwoot, ERPNext, Postgres, Redis, Traefik, rede, TLS nem Meta.
- "8 processos em paralelo" prova serialização correta num arquivo SQLite, não escala nem latência.
- O relógio é injetado; o fuso usa `Intl` do Node. Não houve teste de mudança de horário de verão (inexistente no Brasil desde 2019) nem de outro fuso.
- O mutante que sobreviveu mostra que, para esse ponto, o teste não distingue duas camadas de defesa. Aceito como defesa em profundidade, não como cobertura perdida.
- P2 usa **modelo stub**; nenhuma métrica de modelo real foi medida.

## Provas planejadas que ficaram bloqueadas
| Prova do pedido (Rodada 4) | Estado | Bloqueio exato | Quem libera |
|---|---|---|---|
| 1. Edição gratuita do Chatwoot instalada em versão fixada, com API, webhooks e painel embutido | **não executada** | exige servidor Linux; Docker local proibido; instalar no VPS altera o servidor | Luan: autorizar janela de instalação no VPS (D2) ou VM de teste |
| 2. Mensagem via fixture pela entrada normal, visível na inbox, 1 lead, 1 próxima ação | **parcial**: núcleo (P1) sim; "inbox" = Chatwoot **não** | idem | idem |
| 3. Reentrega em paralelo e após reinício | **executada no núcleo** (P1 t2) | não no Chatwoot | idem |
| 4. Contato com 2 canais na ficha com a oportunidade | **executada no núcleo** (P1 t5); UI real não | UI | F1.4 |
| 5. Metadados de anúncio do payload à ficha, incluindo ausência de ID | **executada no núcleo** (P1 t6) | exibição na ficha real | F1.4 |
| 6. Falha temporária do CRM e recuperação | **executada com CRM simulado** (P1 t7) | CRM/Chatwoot real | F2 |
| 7. Medição real de recursos e backup/restauração | **não executada** | exige instalar/rodar o produto no servidor | D2 |

## Validação OpenSpec
Comando: `openspec validate unify-customer-communications-and-crm --strict` (OpenSpec CLI 2.0.0, a partir da raiz da worktree). Saída em `evidence/saidas/openspec-validate-strict.txt`.

- Resultado: `Change 'unify-customer-communications-and-crm' is valid`. `openspec validate --all --strict`: 1 passou, 0 falhou.
- `openspec show ... --json`: **19 requisitos** em **8 capacidades** foram reconhecidos (ingestao-eventos 2, identidade-ficha-unificada 2, canais-adaptadores 3, atribuicao-origem 2, comercial-followup 3, billing 3, operacao-seguranca-custos 2, ia-opcional 2). `openspec list`: tarefas 5/59 (apenas as de pesquisa da Fase 0).
- Lacunas da validação: o validador confere estrutura (SHALL/MUST, cenários), **não** a verdade do conteúdo nem a cobertura dos AT. A cobertura foi checada por script (`evidence/tools/gerar_matriz.py`): os 78 microcenários do catálogo têm cenário nas specs e tarefa.
