# 02. Catálogo de aceite (escrito antes de escolher a stack)

Fonte canônica do **texto normativo** de cada cenário: `specs/<capacidade>/spec.md` (OpenSpec, WHEN/THEN em pt-BR, vinculado pelo ID `AT-xx` no nome do cenário). Este arquivo guarda o que o OpenSpec não carrega bem: prioridade, estado anterior, evento, quem pode gravar, o que aparece na UI e como se prova. **Não repete o texto dos cenários** para não haver duas versões.

Legenda de prioridade: **M1** obrigatório na primeira entrega (F1 e F2); **M2** obrigatório em fase posterior; **EC** extensão condicional (depende de API, permissão ou custo).
Legenda de estado: `planejado` | `executado-mock` (rodou contra mock/fixture local) | `aprovado` | `reprovado` | `pendente-externo`. Nesta execução **nenhum cenário está `aprovado`**: o máximo é `executado-mock`, porque nenhuma prova usou serviço real da Meta nem o Chatwoot.

## Valores de política usados só como fixture (não congelam produção)

| Parâmetro | Fixture | Decisão pendente |
|---|---|---|
| X dias para o follow-up | 3 dias, às 09:00 | D3 |
| Fuso | `America/Sao_Paulo` (UTC-3, sem horário de verão desde 2019) | D3 |
| Contato com negócio **ganho** volta a falar | não cria lead; cria tarefa `revisar_novo_projeto` | D3 |
| Contato com negócio **perdido** volta a falar | idem (revisão humana); janela de reabertura automática = decisão | D3 |
| Resposta do cliente com follow-up aberto, mesmo canal | `reagendar` (nunca recua) | D3 |
| Resposta em outro canal | `revisar` por padrão (`cancelar` e `reagendar` configuráveis) | D3 |
| Retenção do payload bruto | 90 dias, depois reduzido a metadados | D4 |
| Orçamento mensal de envio | teto local = decisão do Luan; o fornecedor não impõe teto duro documentado | D5 |

## Cenários principais e microcenários

Colunas: **Prova** = nível mínimo que fecha o cenário (U unitário, C contrato por provedor/versão, I integração com serviço real local, E2E interface, S sandbox oficial, V eval).

### AT-01 Primeiro WhatsApp recebido (`ingestao-eventos`)
| ID | Microcenário | Prio | Estado anterior → evento | Quem grava | UI | Prova | Estado |
|---|---|---|---|---|---|---|---|
| AT-01.1 | Remetente novo cria mensagem, pessoa, oportunidade `auto` e tarefa de follow-up em X dias | M1 | sem registro → `messages` assinado | só o núcleo (borda) | ficha com 1 conversa, 1 negócio, 1 tarefa | U+I | executado-mock (P1 t1) |
| AT-01.2 | Sobrevive a reinício do processo | M1 | idem, depois restart | núcleo | idem | I | executado-mock (P1 t1) |
| AT-01.3 | Reentrega ×3 e ×8 em paralelo: 1 mensagem, 1 lead, 1 tarefa | M1 | mesmo payload | núcleo | idem | I | executado-mock (P1 t2, 8 processos) |
| AT-01.4 | Usuário só com BSUID (sem telefone) é aceito; depois chega o telefone e continua a mesma pessoa | M1 | `from` ausente | núcleo | mesma ficha | C+U | executado-mock (P1 t4); **webhook atual reprova** (P0 C5) |
| AT-01.5 | Assinatura ausente/errada → 401, nada gravado | M1 | corpo adulterado | ninguém | n/a | U | executado-mock (P1 t3) |
| AT-01.6 | Nenhum envio automático por recepção | M1 | qualquer evento | ninguém envia | n/a | U | executado-mock (P1 t1, espião de transporte = 0) |
| AT-01.7 | Payload de até 3 MB é aceito | M1 | corpo 300 KB | núcleo | n/a | U | executado-mock (P1 t3); **webhook atual reprova** (P0 C8) |
| AT-01.8 | Payload bruto retido (reprocessável) e retenção aplicada | M1 | qualquer | núcleo | n/a | I | planejado |
| AT-01.9 | Mídia/áudio: guarda `type` e id da mídia; baixa o arquivo antes de expirar | M2 | áudio | núcleo (job) | anexo tocável | I+S | planejado (P0 C6 reprova no atual) |

### AT-02 Contato conhecido e múltiplos negócios (`comercial-followup`)
| ID | Microcenário | Prio | Evento | UI | Prova | Estado |
|---|---|---|---|---|---|---|
| AT-02.1 | Negócio aberto: mensagem entra nele, sem lead novo | M1 | mensagem | 1 negócio | U+I | executado-mock (P1 t8) |
| AT-02.2 | Mensagem atrasada não retrocede o último contato | M1 | `occurred_at` antigo | último contato = máximo | U | executado-mock (P1 t8) |
| AT-02.3 | Negócio ganho/perdido: não cria lead; cria tarefa de revisão | M1 | mensagem | tarefa visível | U | executado-mock (P1 t8) |
| AT-02.4 | Dois projetos legítimos coexistem (2º é explícito) | M1 | ação do operador | 2 negócios na mesma pessoa | U | executado-mock (P1 t8) |
| AT-02.5 | Duas mensagens simultâneas do contato novo: 1 lead | M1 | concorrência | 1 negócio | I | executado-mock (P1 t9, 2 processadores) |
| AT-02.6 | Contato existente nunca vira lead duplicado por padrão (índice único parcial) | M1 | qualquer | idem | I | executado-mock (P1 t8/t9; mutante que ignora negócio aberto reprova 3 testes) |

### AT-03 Atribuição por anúncio e origem (`atribuicao-origem`)
| ID | Microcenário | Prio | Superfície/campo | Prova | Estado |
|---|---|---|---|---|---|
| AT-03.1 | WhatsApp CTWA: `referral.source_id`, `ctwa_clid`, `source_url`, `headline` preservados no bruto e normalizados | M1 | WhatsApp | C+U | executado-mock (P1 t6) |
| AT-03.2 | Instagram CTD: `referral.ad_id`, `ref`, `ads_context_data` | M2 | Direct | C+S | executado-mock (P1 t6, fixture); real = pendente-externo |
| AT-03.3 | Messenger: `referral.ad_id`, `ref`, `source=ADS|SHORTLINK` | M2 | Messenger | C+S | planejado |
| AT-03.4 | Lead Ads: `leadgen` traz `leadgen_id/form_id/ad_id/adgroup_id`; dados pessoais exigem leitura Graph com `leads_retrieval` | M2 | formulário | C+S | planejado |
| AT-03.5 | Site: `utm_*` + `wa.me?text=` (cliente pode apagar) = atribuição de melhor esforço, marcada como "declarada" | M1 | site | E2E (Playwright existente) | planejado |
| AT-03.6 | Sem `referral`/UTM: `sem_atribuicao` (visualização sem dado individual não atribui) | M1 | todas | U | executado-mock (P1 t6) |
| AT-03.7 | `referral` inválido/conflitante: guarda bruto, marca `evidencia_invalida`, não atribui | M1 | todas | U | executado-mock (P1 t6) |
| AT-03.8 | Anúncio removido / enriquecimento negado (campanha/conjunto via Marketing API): mantém `ad_id`, campanha = `desconhecida` | M2 | todas | S | planejado |
| AT-03.9 | Primeiro e último toque separados; etiqueta comercial não reescreve o bruto | M1 | todas | U | executado-mock (P1 t6) |
| AT-03.10 | Regra determinística configurável dispara ação comercial (ex.: etiqueta, responsável) com auditoria | M2 | todas | U | planejado |

### AT-04 Canal de entrada e resposta (`canais-adaptadores`)
| ID | Microcenário | Prio | Prova | Estado |
|---|---|---|---|---|
| AT-04.1 | WhatsApp: receber, responder no mesmo canal, anexos, status, janela 24h, template fora da janela | M1 | I+S | planejado (S pendente-externo: destinatário permitido) |
| AT-04.2 | Instagram Direct: receber/responder; comentário e menção são capacidades **distintas** (webhook `comments`/`mentions`) | M2 | S | pendente-externo |
| AT-04.3 | Messenger: idem; janela e Human Agent | M2 | S | pendente-externo |
| AT-04.4 | E-mail: threading, alias, envio de fora da inbox (só IMAP vê Enviados) | M2 | I | planejado |
| AT-04.5 | Chat do site e Telegram (Bot API: ~1 msg/s por chat, ~30/s em massa) | M2/EC | I | planejado |
| AT-04.6 | TikTok: só com aprovação da API; sem conversa de saída; sem envio após 48h | EC | S | pendente-externo |
| AT-04.7 | Mídia expirada, tipo desconhecido (`unsupported`), falta de permissão: estado explícito, sem exceção | M1 | U+I | planejado |
| AT-04.8 | Mensagem enviada pelo app original (eco `smb_message_echoes` / `is_echo`) aparece como saída | M1 (WA) / M2 | C+I | planejado; **webhook atual ignora** (P0 C7) |

### AT-05 Identidade e ficha unificada (`identidade-ficha-unificada`)
| ID | Microcenário | Prio | Prova | Estado |
|---|---|---|---|---|
| AT-05.1 | Direct + WhatsApp vinculados **só com evidência** (telefone/e-mail confirmado ou confirmação humana); nome/avatar não bastam | M1 | U+E2E | executado-mock (P1 t5) |
| AT-05.2 | Ficha mostra canais, ordem, última mensagem (canal e horário corretos) e negócios | M1 | E2E | executado-mock (P1 t5, só leitura de dados; UI real = planejado) |
| AT-05.3 | Reversão do vínculo preserva histórico e não mistura negócios | M1 | U | executado-mock (P1 t5) |
| AT-05.4 | Vincular duas identidades que já têm negócio aberto não funde negócios: gera tarefa "revisar duplicados" | M1 | U | executado-mock (P1 t14 cobre o vínculo; tarefa de duplicados = código, sem asserção dedicada) |
| AT-05.5 | Homônimos, número compartilhado, e-mail reutilizado, conta comercial distinta, várias pessoas na mesma empresa | M2 | U | planejado |
| AT-05.6 | Busca por nome ou identificador disponível | M1 | E2E | planejado |

### AT-06 Envio, eco e status (`canais-adaptadores`)
| ID | Microcenário | Prio | Prova | Estado |
|---|---|---|---|---|
| AT-06.1 | Resposta pela UI aparece na conversa; eco não duplica | M1 | I+S | planejado |
| AT-06.2 | Status fora de ordem: `read` antes de `delivered` fica `read`; `failed` após `read` é ignorado | M1 | U | executado-mock (P1 t10) |
| AT-06.3 | Timeout depois de aceitação remota: estado `incerto`, sem reenvio às cegas, mesma chave de idempotência devolve o mesmo estado | M1 | U | executado-mock (P1 t10) |
| AT-06.4 | Erro definitivo (`failed` com código) visível ao operador | M1 | I | planejado |

### AT-07 Follow-up multicanal (`comercial-followup`)
| ID | Microcenário | Prio | Prova | Estado |
|---|---|---|---|---|
| AT-07.1 | Vence em X dias às 09:00 do fuso; fronteira 23:30 local; 1 s antes não executa | M1 | U | executado-mock (P1 t14) |
| AT-07.2 | Duas execuções simultâneas: 1 só | M1 | I | executado-mock (P1 t14) |
| AT-07.3 | Resposta em outro canal: política cancelar/reagendar/revisar | M1 | U | executado-mock (P1 t14, ramo `cancelar`) |
| AT-07.4 | Mudança de etapa, ganho/perda cancelam o follow-up; opt-out e pausa bloqueiam | M2 | U | executado-mock parcial (ganho/perda em código; opt-out/pausa = planejado) |
| AT-07.5 | Alteração de prazo e reinício preservam a tarefa | M1 | I | executado-mock (P1 t14) |
| AT-07.6 | **Tarefa interna** (lembrete ao operador) e **envio externo** têm pré-condições separadas; no F1 o vencimento nunca envia | M1 | U | executado-mock (P1 t14: `runDueTasks` não chama transporte) |

### AT-08 CRM e proposta (`comercial-followup`)
| ID | Microcenário | Prio | Prova | Estado |
|---|---|---|---|---|
| AT-08.1 | Criar/qualificar lead, associar empresa, criar negócio, mudar etapa, valor e responsável | M2 | U+E2E | planejado |
| AT-08.2 | Registrar proposta (versão, valor, validade) e próxima ação | M2 | U+E2E | planejado |
| AT-08.3 | Validação de campos, concorrência otimista e auditoria (quem/quando/antes/depois) | M2 | U+I | planejado |
| AT-08.4 | As operações acima são possíveis **dentro da tela principal** (painel embutido) | M2 | E2E | planejado |

### AT-09 Billing (`billing`)
| ID | Microcenário | Prio | Prova | Estado |
|---|---|---|---|---|
| AT-09.1 | Negócio ganho gera registro financeiro ligado ao negócio certo; duas cobranças da mesma oportunidade | M2 (fase posterior) | U+I | planejado |
| AT-09.2 | Valores em inteiro de centavos + moeda; pagamento parcial; estorno; saldo em aberto | M2 | U+propriedades | planejado |
| AT-09.3 | Idempotência por `(gateway, id externo)`; eventos fora de ordem; conciliação | M2 | U+I | planejado |
| AT-09.4 | Limite explícito: registro interno ≠ cobrança no gateway ≠ NFS-e; a UI nunca diz "nota emitida" sem protocolo do emissor | M2 | U+E2E | planejado |

### AT-10 Recuperação e integridade (`ingestao-eventos`, `operacao-seguranca-custos`)
| ID | Microcenário | Prio | Prova | Estado |
|---|---|---|---|---|
| AT-10.1 | CRM/inbox indisponível: eventos continuam aceitos, outbox acumula, backoff, recupera após reinício, **1 entrega por evento** | M1 | I | executado-mock (P1 t7) |
| AT-10.2 | Falha após persistir e antes de responder: reentrega da Meta é idempotente | M1 | I | executado-mock (P1 t2) |
| AT-10.3 | Credencial expirada, rate limit do provedor, backlog: alerta + retomada | M1 | I+S | planejado |
| AT-10.4 | Evento `failed` permanente fica visível e reprocessável manualmente (nunca some) | M1 | U | executado-mock parcial (estado `failed` + métrica) |
| AT-10.5 | Chatwoot **não repete** webhook de saída: reconciliação por API cobre o buraco | M1 (F2) | I | planejado (risco R-03) |

### AT-11 Backfill, exportação, restauração e corte (`operacao-seguranca-custos`)
| ID | Microcenário | Prio | Prova | Estado |
|---|---|---|---|---|
| AT-11.1 | Importar só o que cada provedor expõe, com proveniência (WA coexistência: 6 meses; IG: detalhe das 20 mais recentes) | M2 | S | pendente-externo |
| AT-11.2 | Reimportar sem duplicar (chave `(provedor,conta,id externo)`) | M2 | I | planejado |
| AT-11.3 | Exportar ficha, vínculos, mensagens e anexos disponíveis | M2 | I | planejado |
| AT-11.4 | Restaurar backup em teste e comparar IDs e relações | M1 (antes de dado real) | I | planejado |
| AT-11.5 | Corte e rollback do webhook sem perder evento nem duplicar resposta | M1 (F2) | I+S | planejado |

### AT-12 Permissões, privacidade e custos (`operacao-seguranca-custos`)
| ID | Microcenário | Prio | Prova | Estado |
|---|---|---|---|---|
| AT-12.1 | Envio sem autorização, acima do orçamento ou em canal sem reply é **recusado** pela mesma função usada por UI, job, API e MCP | M1 | U | executado-mock (P1 t11, t12) |
| AT-12.2 | Logs sem texto de cliente nem segredo | M1 | U | executado-mock (P1 t11) |
| AT-12.3 | Isolamento por conta comercial e por papel | M2 | U+I | planejado |
| AT-12.4 | Operação potencialmente cobrável sem orçamento fica desativada (template, Business Agent, broadcast) | M1 | U | executado-mock parcial (orçamento sim; flags de categoria = planejado) |
| AT-12.5 | Retenção, exportação e exclusão (LGPD) de uma pessoa | M2 | I | planejado |

### AT-13 IA desligada e falhas de modelo (`ia-opcional`)
| ID | Microcenário | Prio | Prova | Estado |
|---|---|---|---|---|
| AT-13.1 | IA off/quebrada/lenta: recebe, persiste, cria lead, atribui, agenda e opera billing | M1 | U+I | executado-mock (P1 t13: gancho que lança erro) |
| AT-13.2 | Saída inválida do modelo é descartada, sem sugestão inventada | M1 | U | executado-mock (P1 t13) |
| AT-13.3 | IA nunca envia, junta clientes, altera billing nem ignora política | M2 | U (gate) | planejado; ver `06-evals-ia.md` |

### AT-14 Novo canal sem reescrever o núcleo (`canais-adaptadores`)
| ID | Microcenário | Prio | Prova | Estado |
|---|---|---|---|---|
| AT-14.1 | Adaptador de teste recebe, correlaciona, exibe e aplica políticas sem tocar no núcleo | M1 | U+I | executado-mock (P1 t12) |
| AT-14.2 | Capacidades não oferecidas (reply, status, anexos) ficam explícitas ao operador e a recusa tem motivo | M1 | U | executado-mock (P1 t12) |
| AT-14.3 | Canal sem aprovação ou com custo pendente fica `desativado` por padrão | M1 | U | planejado |

Total: 14 cenários principais, **78 microcenários** (contagem das linhas acima). Planejados: a maioria; executados contra mock: ver `08-rastreabilidade.md`.
