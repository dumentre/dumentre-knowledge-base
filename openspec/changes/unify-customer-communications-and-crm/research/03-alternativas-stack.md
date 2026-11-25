# 03. Alternativas de stack e escolha (Rodada 2)

Escrito **depois** do catálogo (`02-catalogo-aceite.md`). A escolha segue os requisitos obrigatórios, não as estrelas. Data da pesquisa: 2026-11-21. Rótulos de evidência: **P** fonte primária lida hoje (URL em `10-fontes.md`); **C** código lido na tag fixa; **S** fonte secundária (descobre hipótese, não decide); **M** medido por prova nossa; **?** sem evidência.

## 1. Fatos decisivos (todos com fonte)

1. **Chatwoot Community v4.20.1** (tag de 2026-11-20): MIT fora de `enterprise/` (P). Canais no código e na doc: Website, Facebook, Instagram, WhatsApp Cloud, Email, Telegram, TikTok, SMS, Line, API (P+C). Guarda `referral` só no WhatsApp (C). **Não tem funil comercial**: nenhum arquivo de `kanban|pipeline|opportunit|deal` na tag (C). Tem contatos, **empresas**, notas, atributos customizados, rótulos, mesclagem de contatos e **Dashboard Apps** (iframe no painel) em `app/` (portanto na edição livre) (C). Não inclui Captain AI, voz, SSO, SLA, papéis avançados, agent capacity, white-label (P). Suporta BSUID no WhatsApp (C).
2. **Webhook de saída do Chatwoot não tem retry** (C: `Webhooks::Trigger` captura o erro e só registra). Quem consumir `message_created` perde eventos se cair. Também **só uma URL de callback por app Meta** (P): o webhook atual e o Chatwoot não podem receber o mesmo evento direto da Meta.
3. **Requisitos do Chatwoot**: `/deploy` diz 4+ vCPU, **8 GB de RAM mínimo**, 60 GB; a doc de requisitos diz 4 GB é o mínimo exigido (até 10 mil conversas/dia), 4 cores recomendados, Sidekiq pode passar de 1 GB, + 1 GB de swap, PostgreSQL 16 com pgvector, Redis 7, Node 24, Ruby 3.4 (P). O VPS tem **3,0 GiB disponíveis, sem swap, 2 vCPU** (M). A conta não fecha com folga.
4. **Frappe CRM** (AGPL-3.0, 4.022 estrelas, push em 2026-11-20): funil (leads/negócios/Kanban), tarefas, e-mail; WhatsApp via app de terceiro; sincronização de Lead Ads é **beta**; **não** lê/responde Instagram Direct nem Messenger (P+S). Exige pilha Frappe (MariaDB + Redis + workers). **RAM de produção não publicada** pela Frappe (S: busca não achou número oficial).
5. **ERPNext** (GPL-3.0, 41 mil estrelas): CRM + faturamento + pagamentos em um produto; mesma pilha pesada; **NFS-e não é nativa** (? não encontrei suporte oficial; localização brasileira é de comunidade, não verificada).
6. **Woofed CRM** (MIT, 190 estrelas, último push 2026-08-20): Rails, integra com Chatwoot; projeto pequeno e parado há 3 meses (M via API GitHub).
7. **Twenty** (61 mil estrelas, licença `NOASSERTION` = AGPL + trechos comerciais): mensagens externas em beta; SSO/auditoria/permissões por registro em edição paga (S, Hermes 20/11 não reverificado). **EspoCRM** (AGPL-3.0): workflows/relatórios no Advanced Pack pago (S, não reverificado). **Odoo Community**: app de WhatsApp só Enterprise (S). **SuiteCRM**: sem inbox nativa (S).

## 2. Hipóteses avaliadas

| # | Composição | Cobertura do catálogo | RAM/CPU no VPS atual | Esforço próprio | Veredito |
|---|---|---|---|---|---|
| H1 | Chatwoot CE + ERPNext + integração própria | Canais: ok. CRM e billing: ok. Identidade unificada: **dois cadastros** (contato Chatwoot × Customer ERPNext) a reconciliar. NFS-e: fora. | **Não cabe junto** (Chatwoot ≥4 GB exigido + pilha Frappe); exigiria VM separada | Alto: integração bidirecional, mapa de identidade, UI de ficha no ERPNext **fora** da tela principal | **Descartada para a F1–F4**; fica como contingência C2 |
| H2 | Chatwoot CE + Frappe CRM, billing desacoplado | Funil pronto; mensagens do Chatwoot não aparecem no Frappe (issue de inbox omnichannel aberta no Frappe, S) → operador alterna telas | Não cabe junto | Médio-alto: sync + painel | Contingência C2 (mesma condição) |
| H3 | Chatwoot CE + Woofed CRM | Integração documentada com Chatwoot (S); histórico por negócio **não provado** | Rails ×2 (compartilham Postgres/Redis; ainda soma RAM) | Médio | **Descartada**: dependência pequena e parada; risco de manutenção sem ganho comprovado |
| H4 | **Chatwoot CE (caixa) + Núcleo Dumentre pequeno (borda de ingestão, identidade, ficha, funil mínimo, follow-up, atribuição, billing interno) + painel embutido** | Cobre os 14 ATs; canais prontos via Chatwoot; funil/atribuição/identidade/billing nossos | Núcleo Node+SQLite: ordem de 100 a 200 MiB (**estimativa**, não medida); Chatwoot: **portão G-CAP** | Médio (ver `tasks.md`), concentrado no diferencial da Dumentre | **Recomendada** |
| H5 | Só núcleo + UI própria sem Chatwoot | Cada canal (WA, IG, Messenger, e-mail, Telegram, TikTok) vira adaptador próprio de recepção **e envio** | Cabe (leve) | Alto e contínuo: manutenção de 5+ APIs | **Contingência C1** (condição abaixo); contraria "reusar primeiro" |
| H6 | Plataforma SaaS (Kommo, RD, respond.io…) | Fora da restrição ("sem contratar plataforma"). Citada só como referência de experiência | n/a | n/a | Descartada por restrição |

## 3. Por que H4 e não as outras

- **Evita CRM de terceiros na fase 1** porque o diferencial pedido (identidade entre canais, política de reabertura, atribuição auditável, follow-up por política, billing ligado ao negócio) **precisa ser código nosso de qualquer forma**; adotar Frappe/ERPNext colocaria um segundo cadastro de pessoas e uma segunda tela. Um funil mínimo (negócio, etapa, valor, responsável, proposta, tarefa) é pequeno: 6 tabelas no protótipo P1.
- **Evita reescrever canais**: Chatwoot entrega recepção e envio de WhatsApp, Instagram, Messenger, e-mail, Telegram, TikTok e site, com anexos e status (P).
- **Corrige os dois defeitos do Chatwoot que importam** sem fork: (a) o webhook de saída sem retry e a perda de `referral` do Instagram/Messenger são cobertos por uma **borda de ingestão** (evolução do webhook existente) que guarda o payload bruto, repassa fielmente ao Chatwoot com retry e extrai a atribuição; (b) o funil vive no núcleo e aparece na tela do Chatwoot por Dashboard App.
- **Reaproveita o webhook atual** como a borda: um único responsável pelo callback da Meta (evita "duas integrações para o mesmo evento"), com o código e os testes que já existem (30 testes, runner `node --test`).
- **Custo de dependência**: Chatwoot (Rails + Sidekiq + Postgres + Redis) é a dependência pesada. Se ela falhar, a borda continua guardando eventos; o operador perde a tela até restaurar. Isso é aceito e testado (AT-10).

## 4. Condição para trocar de rota (contingências)

| Contingência | Quando acionar | O que muda |
|---|---|---|
| **C0 (padrão)**: H4 com Chatwoot **no VPS atual** | G-CAP verde: com Chatwoot+Postgres+Redis ativos sob carga sintética, `MemAvailable` ≥ 800 MiB e OpenBao/NetBird/Traefik inalterados, com limites de memória por container e swap de 1 a 2 GB. **Exige alterar o servidor** (autorização). | Nada além do plano. |
| **C1**: núcleo + UI própria só para WhatsApp, Instagram, Messenger | G-CAP vermelho e o Luan **não aprova** custo de segunda VM | Menor implantação útil no VPS atual: núcleo (≈100–200 MiB, estimado) + tela própria mínima (lista, ficha, responder) + adaptadores de envio (HTTP Graph API). E-mail, Telegram, TikTok e site ficam adiados. Esforço sobe (ver `tasks.md`, F2-alt). |
| **C2**: segunda VM (≥ 4 vCPU/8 GB) com Chatwoot e, se o Luan quiser, Frappe CRM/ERPNext | G-CAP vermelho e o Luan aprova o custo, **ou** o funil próprio estourar 6 semanas de esforço acumulado / exigir previsão, relatórios e permissões que o núcleo não entrega | Custo novo (**desconhecido**: fontes secundárias dão € 8,99 a € 35,99/mês + IPv4; preço oficial não recuperado). Chatwoot sai do VPS atual. |

## 5. O que ficou **sem prova**
Instalação real do Chatwoot (pede servidor; Docker local proibido), consumo real de RAM, painel embutido funcionando, repasse com assinatura original aceito pelo Chatwoot, merge de contatos no Chatwoot refletindo o vínculo do núcleo, backup/restauração do Chatwoot, qualquer prova com conta Meta. Cada item é tarefa com teste e bloqueio em `tasks.md` e `08-rastreabilidade.md`.
