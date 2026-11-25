# Orçamento sob Medida por IA (sem preço público)

**Status:** Em vigor a partir de 12/11/2026 (decisão do Luan em `decisoes-2026-11-12.md`, card `DUM-01 v2`).
**Princípio central:** A Dumentre **não exibe preços fixos de vitrine no site**. Todo contato comercial (WhatsApp, Instagram, e-mail ou prospecção ativa) passa por uma conversa consultiva conduzida por IA (com supervisão do Luan), que entende a necessidade real do negócio, monta um plano técnico enxuto, estima o esforço em horas e gera um orçamento sob medida considerando escopo, margem de risco, custo de infraestrutura (na conta do cliente ou hospedado pela Dumentre em Hetzner/Cloudflare) e manutenção mensal.

---

## 1. Fluxo de Atendimento Ponta a Ponta

```
[1. Canal de Entrada]
  WhatsApp / Instagram / E-mail / Resposta de Prospecção
        │
        ▼
[2. Perguntas de Descoberta (IA)]
  Triagem consultiva em 3 a 5 perguntas curtas (sem interrogatório).
  Coleta: objetivo comercial, situação atual, volume, prazo desejado e preferência de infra.
        │
        ▼
[3. Plano de Solução (IA)]
  A IA estrutura a solução em entregas claras (fases, arquitetura enxuta, stack e o que fica de fora).
        │
        ▼
[4. Estimativa Determinística (IA → JSON → Script)]
  A IA decompõe o plano em tarefas com horas (mín / provável / máx) e preenche o JSON de escopo.
  O script `dumentre/orcamento/gerar_orcamento.py` calcula esforço esperado, aplica valor-hora,
  margem de risco e compõe os cenários de infraestrutura e manutenção.
        │
        ▼
[5. Geração do Orçamento (Markdown → PDF)]
  Documento formal gerado automaticamente com escopo, cronograma, investimento,
  comparativo de infra (Cliente vs. Dumentre Hetzner/Cloudflare), exclusões, pagamento e validade.
        │
        ▼
[6. Aprovação do Luan (Gate Obrigatório)]
  O MeuBot envia o resumo + arquivo do orçamento para o Luan aprovar ou ajustar valores/escopo.
  Nenhuma proposta ou valor é enviado ao cliente sem "ok" explícito do Luan.
        │
        ▼
[7. Envio pelo Luan]
  O Luan envia a proposta final (ou autoriza o disparo individual com `confirmado=true`)
  e conduz o fechamento (call curta se necessário + 50% de entrada via Pix).
```

### Regras de Ouro do Fluxo
1. **A IA nunca chuta nem informa preço no meio da conversa.** Se o cliente perguntar *"quanto custa um site?"* na primeira mensagem, a IA explica que na Dumentre o orçamento é montado sob medida para o tamanho exato da operação dele e faz as 3 perguntas rápidas de descoberta para preparar a proposta no mesmo dia.
2. **Quem calcula é o código, não o modelo de linguagem.** A IA decide quais tarefas entram e estima as horas (`min`, `provavel`, `max`); toda a matemática (fórmula PERT, margem de risco, arredondamento comercial, parcelas de 50/50 e somas de recorrência) é feita pelo script determinístico em `dumentre/orcamento/`.
3. **Aprovação humana inegociável.** O orçamento gerado fica em estado `rascunho_aguardando_luan` até revisão e envio pelo Luan.

---

## 2. Roteiro de Perguntas de Descoberta por Tipo de Pedido

A IA deve fazer no máximo **2 perguntas por mensagem**, em tom natural de WhatsApp, adaptando-se ao que o cliente já contou ou ao que o bot de prospecção já levantou sobre a empresa.

### 2.1. Site / Landing Page (`site`)
1. **Objetivo e ação principal:** *"Qual é o principal resultado que esse site precisa trazer hoje: receber mensagens no WhatsApp para agendamento/orçamento, apresentar o portfólio/estrutura da empresa ou captar cadastros para uma campanha específica?"*
2. **Material existente:** *"Vocês já têm identidade visual (logo, cores), textos base e fotos reais do espaço/equipe, ou querem que a gente estruture tudo do zero a partir de uma conversa rápida?"*
3. **Estrutura e páginas:** *"Uma página única direta ao ponto resolve bem o momento atual, ou vocês precisam de páginas separadas para serviços/unidades/cursos e conteúdo atualizado com frequência?"*
4. **Integrações e rastreio:** *"Vocês já anunciam (ou pretendem anunciar) no Google/Instagram para a gente configurar o rastreamento de conversão e o Google Meu Negócio junto?"*
5. **Domínio e hospedagem:** *"Vocês já têm domínio registrado (`.com.br`) e alguém que cuide de hospedagem, ou preferem que a Dumentre entregue tudo hospedado e monitorado?"*

### 2.2. Sistema Web / Painel / Portal (`sistema`)
1. **Dor operacional central:** *"Qual processo hoje é feito em planilha, papel ou WhatsApp que mais toma tempo da equipe ou gera erro/retrabalho?"*
2. **Usuários e perfis de acesso:** *"Quem vai usar o sistema no dia a dia (ex.: só recepção e diretoria, ou também clientes/alunos/pacientes logados) e quantas pessoas aproximadamente?"*
3. **Fluxo de dados e relatórios:** *"Quais informações precisam entrar (cadastros, anexos, pagamentos, status) e qual visão ou relatório você precisa abrir na tela para saber que a operação está em dia?"*
4. **Integrações externas:** *"Esse sistema precisa conversar com alguma ferramenta que vocês já usam hoje (WhatsApp, planilha Google, gateway de pagamento/Pix, ERP) ou nasce independente?"*
5. **Infraestrutura e operação:** *"Vocês têm conta de nuvem/equipe técnica própria para manter o servidor e o banco de dados, ou preferem rodar na infraestrutura gerenciada da Dumentre com backup e monitoramento?"*

### 2.3. Automação / Atendente de WhatsApp com IA (`automacao_ia`)
1. **Volume e gargalo atual:** *"Quantas conversas novas chegam por dia aproximadamente no WhatsApp e onde o atendimento mais trava hoje (fora do horário comercial, perguntas repetidas, demora na triagem)?"*
2. **Papel do assistente e passagem para humano:** *"Quais são as 5 a 10 dúvidas mais comuns que a IA já deve responder na hora e quais dados ela precisa coletar antes de passar o resumo para a sua equipe fechar?"*
3. **Destino dos leads:** *"Onde vocês querem que cada contato qualificado fique salvo automaticamente: numa planilha Google organizada, num painel simples ou num CRM que já utilizam?"*
4. **Número e canal oficial:** *"O atendimento vai rodar num número dedicado de WhatsApp Business (API oficial da Meta) e/ou Instagram Direct?"*
5. **Gestão e infraestrutura:** *"Preferem que a Dumentre hospede o motor da automação, monitore quedas e ajuste as respostas da IA mensalmente, ou vocês têm infraestrutura própria?"*

### 2.4. Campanha Digital & Identidade Visual (`campanha`)
1. **Momento comercial (gatilho):** *"Qual é a ação que vocês querem puxar agora: campanha de matrículas/agenda aberta, lançamento de serviço, promoção sazonal ou profissionalizar o perfil como um todo?"*
2. **Padrão visual atual:** *"Vocês já têm um guia de marca definido (fontes, paleta de cores, estilo de peças) ou precisam que a gente crie a direção visual e templates reutilizáveis junto com a campanha?"*
3. **Volume de peças e canais:** *"Além de posts de feed/carrossel e stories para o Instagram, vocês vão precisar de peças para anúncios patrocinados, materiais impressos ou página de captura?"*
4. **Insumos (fotos e vídeos):** *"Vocês têm fotos reais de boa qualidade dos produtos/espaço/equipe para usarmos nas artes?"*
5. **Execução das postagens:** *"Vocês mesmos publicam com o nosso kit pronto (artes + legendas + guia), ou precisam de apoio na configuração da conta de anúncios?"*

---

## 3. Modelo de Estimativa Determinística

### 3.1. Fórmula de Esforço por Tarefa (PERT)
Para evitar subestimativas em projetos sob medida, cada tarefa do plano recebe três estimativas em horas:
- $H_{\text{min}}$: cenário otimista (tudo pronto, zero atrito);
- $H_{\text{prov}}$: cenário mais provável;
- $H_{\text{max}}$: cenário pessimista (ajustes extras de layout, regras de negócio ou integração).

O esforço esperado da tarefa ($H_{\text{esp}}$) é calculado pela média ponderada PERT:

$$H_{\text{esp}} = \frac{H_{\text{min}} + 4 \cdot H_{\text{prov}} + H_{\text{max}}}{6}$$

### 3.2. Catálogo de Tarefas-Base (Referência para a IA)

| Código | Tarefa-Base | Categoria | Min (h) | Provável (h) | Máx (h) | Esforço PERT (h) |
|---|---|---|---:|---:|---:|---:|
| `DESC-01` | Imersão de descoberta, briefing estruturado e arquitetura enxuta | Geral | 1,5 | 2,0 | 3,5 | 2,17 |
| `COPY-01` | Copywriting de conversão e arquitetura de informação (até 7 seções) | Site | 2,0 | 3,0 | 5,0 | 3,17 |
| `DES-01` | Direção visual (`design.md`), paleta, tipografia e componentes UI | Design | 2,5 | 4,0 | 6,5 | 4,17 |
| `SITE-01` | Desenvolvimento front-end responsivo (Landing Page / até 3 páginas) | Site | 4,0 | 6,0 | 9,0 | 6,17 |
| `SITE-02` | Página ou seção adicional customizada (por unidade/curso/especialidade) | Site | 1,5 | 2,0 | 3,5 | 2,17 |
| `SEO-01` | SEO local técnico (`LocalBusiness` JSON-LD, sitemap, Search Console, Maps) | Site | 1,5 | 2,0 | 3,0 | 2,08 |
| `TRACK-01` | Rastreamento de cliques no WhatsApp (UTM + `dataLayer` / GA4 / Pixel) | Site / Mkt | 1,0 | 1,5 | 3,0 | 1,67 |
| `CAMP-01` | Duas direções visuais + página de aprovação online | Campanha | 2,0 | 3,0 | 4,5 | 3,08 |
| `CAMP-02` | Pacote de peças de campanha (4 posts feed/carrossel + 3 stories + 1 capa) + legendas | Campanha | 3,5 | 5,0 | 7,5 | 5,17 |
| `CAMP-03` | Kit de Marca completo (`design.md` + 6 templates editáveis + guia de uso) | Campanha | 6,0 | 9,0 | 13,0 | 9,17 |
| `IA-01` | Mapeamento de conversas reais, árvore de triagem e prompt de sistema (FAQ 10–15 itens) | Automação IA | 2,5 | 4,0 | 6,0 | 4,08 |
| `IA-02` | Fluxo de atendimento WhatsApp + IA classificadora + transbordo com resumo para humano | Automação IA | 5,0 | 8,0 | 12,0 | 8,17 |
| `IA-03` | Integração automática de leads (Google Sheets / CRM) + alerta de lead quente | Automação IA | 2,0 | 3,5 | 5,5 | 3,58 |
| `SIS-01` | Modelagem de banco de dados, autenticação e controle de perfis (RBAC básico) | Sistema | 4,0 | 6,0 | 9,5 | 6,25 |
| `SIS-02` | Módulo CRUD completo + listagem com filtros e validação (por entidade de negócio) | Sistema | 4,0 | 6,5 | 10,0 | 6,67 |
| `SIS-03` | Painel gerencial com indicadores operacionais e exportação CSV/PDF | Sistema | 3,0 | 5,0 | 8,0 | 5,17 |
| `SIS-04` | Integração com API externa (gateway Pix/pagamento, webhook, agenda ou ERP) | Sistema | 4,0 | 7,0 | 12,0 | 7,33 |
| `QA-01` | Testes automatizados (Playwright/integração), observabilidade (Sentry/alertas) e deploy | Engenharia | 2,0 | 3,0 | 5,0 | 3,17 |

*(A IA pode compor tarefas deste catálogo ou criar tarefas específicas do cliente seguindo a mesma estrutura `min / provavel / max`).*

### 3.3. Valor-Hora de Referência (**a confirmar pelo Luan**)
Derivado diretamente das ofertas anteriores em `estrategia/ofertas.md` (onde um Site de ~19h saía por R$ 2.900 e um Atendente IA de ~22h saía por R$ 3.500):

- **Valor-hora base proposto:** **R$ 150,00 / hora** *(a confirmar pelo Luan — card DUM-14)*.
- **Faixas opcionais por complexidade (a confirmar pelo Luan):**
  - Design, copywriting, páginas estáticas e campanhas: **R$ 140,00 / h**
  - Desenvolvimento web, automações e atendimento IA: **R$ 150,00 / h**
  - Sistemas sob medida, arquitetura de dados e integrações críticas: **R$ 175,00 / h**
  - *(Por padrão, o script usa **R$ 150,00/h** uniforme até decisão do Luan, permitindo sobrescrever `valor_hora` no JSON).*

### 3.4. Margem de Risco Técnica (`margem_risco_percentual`)
Aplicada sobre o subtotal de horas ($\text{Subtotal Base} = \sum H_{\text{esp}} \times \text{Valor-Hora}$) para absorver variações de revisão (até 2 rodadas de ajuste incluídas) e dependências do cliente:
- **Baixo (`10%`)**: escopo 100% controlado pela Dumentre (landing page estática, campanha visual sem dependência técnica).
- **Padrão (`15%`)**: sites multipágina, rastreamento de eventos, automações simples com Google Sheets.
- **Médio (`20%`)**: atendente de WhatsApp com IA (depende de aprovação de templates/conta Meta) ou sistema interno CRUD.
- **Alto (`30%`)**: sistemas com múltiplos perfis, migração de dados legados ou integrações com APIs de terceiros/pagamentos.

$$\text{Investimento de Implantação} = \text{Arredondar}_{10}\left(\text{Subtotal Base} \times (1 + \text{Margem de Risco})\right)$$

*(Arredondamento comercial para múltiplos de R$ 10 ou R$ 50 para limpeza da proposta).*

### 3.5. Custo de Infraestrutura Mensal (Dois Cenários Sempre Explícitos)

Todo orçamento apresenta duas opções transparentes de infraestrutura para o cliente escolher:

| Porte / Tipo de Projeto | Cenário A: Infra do Cliente (conta do cliente) | Cenário B: Hospedado pela Dumentre (Hetzner + Cloudflare) | O que muda na prática |
|---|---|---|---|
| **1. Site / Landing Page Estática** | **R$ 0/mês para a Dumentre** *(cliente paga apenas seu domínio ~R$ 40/ano no Registro.br; Cloudflare Pages na conta gratuita do cliente)* | **R$ 49/mês** *(Cloudflare Pages/DNS gerenciado pela Dumentre + SSL + proteção DDoS/WAF + monitoramento automático de queda)* | No Cenário A o cliente gerencia suas contas; no Cenário B a Dumentre assume toda a gestão técnica do ar. |
| **2. Automação / Atendente IA (WhatsApp)** | **R$ 0/mês de servidor para a Dumentre** *(cliente contrata sua VPS/n8n cloud ~R$ 60–120/mês + paga direto no cartão dele a API da Meta e tokens de IA ~R$ 40–150/mês)* | **R$ 120/mês de infra Dumentre** *(container isolado no Hetzner da Dumentre + banco/fila + backups diários criptografados + alerta de saúde)* **+ consumo real de API Meta/IA** *(ou pacote estimado de R$ 70/mês até 500 conversas)* | No Hetzner da Dumentre o custo de máquina é 3x a 5x menor que nuvens tradicionais e já conta com observabilidade ativa. |
| **3. Sistema Web + Banco de Dados** | **R$ 0/mês de servidor para a Dumentre** *(cliente mantém conta própria em Supabase/VPS/Cloudflare e paga os provedores diretamente, estimado R$ 80–250/mês)* | **R$ 160 a R$ 280/mês** *(aplicação e banco Postgres dedicados/isolados no Hetzner + Cloudflare Access/CDN + backup diário AES-256 em Storage Box + monitoramento)* | Cliente não precisa lidar com Linux, Docker, atualização de segurança nem rotinas de restauração de backup. |

> **Regra de ouro sobre custos variáveis de terceiros (WhatsApp Cloud API, OpenAI/Anthropic, disparo de e-mail/SMS):** sempre destacar que tarifas por mensagem da Meta e consumo de tokens de IA são **custos de uso repassados sem margem** (ou pagos diretamente no cartão do cliente na conta dele da Meta/provedor).

### 3.6. Manutenção e Evolução Opcional (Cuidado Mensal)
Separado do custo puro de infraestrutura (ou combinado em pacote), após os **30 dias de garantia técnica gratuita** da entrega:

1. **Sem plano mensal (Avulso):** cliente aciona sob demanda pelo valor-hora vigente (mínimo 1h por chamado).
2. **Cuidado Essencial (Sites e Landing Pages) — R$ 190/mês:**
   - Inclui a infra gerenciada (Cenário B para site), monitoramento de disponibilidade e SSL 24/7, backup, relatório mensal de cliques no WhatsApp e **até 1h/mês de ajustes** (troca de fotos, textos, avisos, banners).
3. **Operação Assistida (Sistemas e Atendentes IA) — R$ 390/mês (ou sob medida conforme horas):**
   - Inclui a infra base no Hetzner/Cloudflare (Cenário B), monitoramento ativo de erros (Sentry/logs com alerta para a Dumentre antes do cliente notar), ajustes contínuos nas respostas da IA / regras do sistema e **até 2h/mês de evolução técnica**.

---

## 4. Modelo de Orçamento (Markdown pronto para virar PDF)

Este é o template canônico usado pelo script `dumentre/orcamento/gerar_orcamento.py`:

```markdown
# Proposta Comercial & Técnica — {{id_orcamento}}

**Preparado para:** {{cliente_nome}} ({{cliente_segmento}})
**Responsável:** {{cliente_contato}}
**Canal de origem:** {{canal_origem}}
**Data de emissão:** {{data_emissao}} · **Validade da proposta:** {{validade_dias}} dias corridos (até {{data_validade}})
**Emitido por:** Dumentre — Engenharia de Software, Design & Automação (`dumentre.com` · CNPJ 31.030.048/0001-76)

---

## 1. Entendimento do Cenário e Objetivo
{{resumo_contexto}}

**Objetivo principal:** {{objetivo_principal}}

---

## 2. Plano de Solução e Entregáveis
{{descricao_plano}}

### Cronograma e Esforço Estimado
| # | Entrega / Tarefa | Horas Estimadas (PERT) | Entregável Verificável |
|---|---|---:|---|
{{linhas_tabela_tarefas}}
| | **Esforço técnico total estimado** | **{{total_horas}} h** | **Prazo estimado: {{prazo_dias_uteis}} dias úteis** |

---

## 3. Investimento de Implantação (Projeto)

| Componente | Detalhamento | Valor |
|---|---|---:|
| Desenvolvimento, Design e Configuração | {{total_horas}} h técnicas × {{valor_hora_formatado}}/h | {{subtotal_base_formatado}} |
| Margem de segurança técnica e revisões ({{margem_risco_pct}}%) | Reserva para até 2 rodadas de ajustes e homologação | {{valor_risco_formatado}} |
| **Total de Implantação (Escopo Fechado)** | **Entrega chave na mão + 30 dias de garantia técnica** | **{{total_implantacao_formatado}}** |

### Condições de Pagamento
- **À vista / Padrão (50/50 via Pix):**
  - **50% no aceite ({{parcela_entrada_formatado}})** para reserva de agenda e início imediato;
  - **50% na entrega e homologação ({{parcela_entrega_formatado}})** antes da publicação final.
- **Parcelamento no cartão:** em até {{max_parcelas_cartao}}x via link de pagamento (com acréscimo da taxa da operadora).

---

## 4. Infraestrutura Mensal e Manutenção (Escolha do Cliente)

O código-fonte e os dados pertencem 100% a **{{cliente_nome}}**. Para manter a solução no ar após a entrega, você pode escolher entre dois modelos:

| Modalidade | Opção A: Infraestrutura no Nome do Cliente | Opção B: Hospedado e Gerenciado pela Dumentre (Hetzner / Cloudflare) |
|---|---|---|
| **Como funciona** | {{infra_cliente_descricao}} | {{infra_dumentre_descricao}} |
| **Mensalidade de Infra Dumentre** | **R$ 0,00 / mês** *(você paga apenas seus fornecedores diretos: ~{{infra_cliente_estimativa_terceiros}})* | **{{infra_dumentre_mensal_formatado}} / mês** |
| **Custos variáveis de terceiros** | {{custos_terceiros_nota}} | {{custos_terceiros_nota}} |

### Plano Opcional de Manutenção e Evolução (Pós-Garantia de 30 dias)
- **{{manutencao_nome}} — {{manutencao_mensal_formatado}}/mês:** {{manutencao_descricao}}
- *(Caso opte pelo plano de manutenção + hospedagem Dumentre combinados: **{{total_recorrente_combinado_formatado}}/mês**).*

---

## 5. O que está FORA deste escopo (Exclusões Explícitas)
Para manter o prazo enxuto e o orçamento justo, não fazem parte desta proposta (podendo ser orçados à parte no futuro):
{{lista_fora_escopo}}

---

## 6. Garantias, Propriedade Intelectual e Próximos Passos
1. **Propriedade total (Sem Lock-in):** código, textos, artes e configurações entregues pertencem integralmente à sua empresa.
2. **Garantia técnica de 30 dias:** qualquer ajuste de funcionamento do escopo contratado é corrigido sem custo em até 30 dias corridos após a publicação.
3. **Como aprovar:** responda esta mensagem confirmando a opção de infraestrutura escolhida (**Opção A** ou **Opção B**). Em seguida, enviamos o termo simplificado de escopo e a chave Pix da primeira parcela ({{parcela_entrada_formatado}}) para darmos início no **D+1 útil**.
```

---

## 5. Três Exemplos Fictícios Completos

Os 3 casos abaixo demonstram o fluxo completo (respostas de descoberta → estimativa PERT → cálculo determinístico → resumo executivo do orçamento). Os arquivos JSON correspondentes estão em `dumentre/orcamento/exemplos/` e foram validados pelo script `gerar_orcamento.py`.

---

### Exemplo 1: Clínica Odontológica e Estética (Site + Atendente de Triagem no WhatsApp)

#### A. Resumo da Descoberta (Canal: WhatsApp da Dumentre)
- **Cliente:** Clínica Odonto & Face Tatuapé (Dra. Mariana)
- **Problema:** O site atual está fora do ar há 4 meses e a recepcionista demora até 3 horas para responder mensagens que chegam dos anúncios do Instagram; pacientes de implante e harmonização fecham com concorrentes.
- **O que precisa:**
  1. Landing page rápida (até 7 seções) com apresentações dos tratamentos, corpo clínico, fotos reais da clínica, mapa e botão de WhatsApp com rastreio de campanha (UTM/Meta Pixel).
  2. Assistente de triagem no WhatsApp Business que responde dúvidas iniciais 24h (convênios, endereço, estacionamento, como funciona a avaliação), coleta nome + tratamento de interesse + turno preferido e avisa a recepcionista com o resumo pronto, salvando tudo numa planilha Google.
- **Infraestrutura preferida:** Quer comparar manter na conta dela vs. deixar tudo gerenciado pela Dumentre.

#### B. Tabela de Estimativa de Horas e Cálculo
- **Valor-hora aplicado:** R$ 150,00/h *(a confirmar pelo Luan)*
- **Margem de risco:** 15% (escopo conhecido: landing page + fluxo de triagem padrão)

| # | Tarefa | Min (h) | Prov (h) | Máx (h) | PERT (h) | Subtotal (R$) |
|---|---|---:|---:|---:|---:|---:|
| 1 | Descoberta, arquitetura da página e árvore de triagem da recepção | 1,5 | 2,0 | 3,5 | 2,17 | R$ 325,00 |
| 2 | Copywriting persuasivo (implantes, estética, autoridade médica, FAQ) e direção visual (`design.md`) | 3,5 | 5,0 | 7,5 | 5,17 | R$ 775,00 |
| 3 | Desenvolvimento da Landing Page responsiva + SEO local (`MedicalClinic`) + rastreio UTM/Pixel | 5,0 | 7,0 | 10,0 | 7,17 | R$ 1.075,00 |
| 4 | Configuração do Assistente de Triagem no WhatsApp (FAQ 12 itens + coleta de dados + resumo para recepção) | 5,0 | 7,5 | 11,0 | 7,67 | R$ 1.150,00 |
| 5 | Integração com Planilha Google de Leads + testes ponta a ponta + publicação | 2,0 | 3,0 | 5,0 | 3,17 | R$ 475,00 |
| **Total** | **Prazo estimado: 10 dias úteis** | **17,0** | **24,5** | **37,0** | **25,33 h** | **R$ 3.800,00** |

- **Subtotal base (25,33 h × R$ 150/h):** R$ 3.800,00
- **Margem de risco (15%):** R$ 570,00
- **Investimento Total de Implantação (arredondado):** **R$ 4.370,00**
  - Entrada (50%): **R$ 2.185,00** · Entrega (50%): **R$ 2.185,00**

#### C. Cenários de Infraestrutura e Manutenção (Clínica)
- **Opção A (Infra da Clínica):** R$ 0/mês para a Dumentre. A clínica paga seu domínio (R$ 40/ano), usa Cloudflare Pages grátis e mantém uma conta própria de automação + consumo direto de API Meta/IA (~R$ 130/mês pagos pela clínica aos fornecedores).
- **Opção B (Hospedado pela Dumentre em Hetzner + Cloudflare):** **R$ 140,00/mês** (hospedagem do site + motor do assistente em container isolado no Hetzner + backups diários + monitoramento de queda). Consumo da API Meta/IA repassado pelo custo real (~R$ 45/mês para ~300 conversas).
- **Manutenção Opcional (Operação Assistida — Site + IA):** **R$ 250,00/mês** adicionais (ou **R$ 390,00/mês no pacote completo Infra B + Manutenção**), incluindo ajustes mensais nas respostas da IA, novos avisos no site, relatório de leads por origem e até 2h/mês de melhorias.
- **Fora do escopo:** integração direta com prontuário eletrônico fechado sem API aberta, agendamento automático com baixa em agenda médica proprietária, produção de fotos/vídeos presenciais e gestão mensal de tráfego pago.

---

### Exemplo 2: Colégio Particular Infantil e Fundamental (Site Novo + Campanha de Matrículas 2027 + Guia de Marca)

#### A. Resumo da Descoberta (Canal: Resposta à Prospecção Ativa / WhatsApp)
- **Cliente:** Colégio Horizonte Saber (Vila Prudente — Educação Infantil e Fundamental I)
- **Problema:** O domínio do colégio está exibindo erro de SSL e o site antigo não abre direito no celular. Estão em plena campanha de matrículas 2027 e os pais pedem informações pelo Instagram e WhatsApp, mas a escola não tem material visual padronizado nem página clara para agendar visita pedagógica.
- **O que precisa:**
  1. Site institucional enxuto de 4 páginas (Home, Proposta Pedagógica & Segmentos, Estrutura & Rotina, Agendar Visita / Matrículas 2027) com botão de WhatsApp rastreado por segmento (Berçário, Infantil, Fundamental).
  2. Direção visual e Kit de Marca enxuto (`design.md` + templates editáveis) + Campanha de Matrículas 2027 pronta para o Instagram (4 carrosséis/posts de feed, 3 stories de chamada para visita e 1 capa de destaque, com legendas prontas).
- **Infraestrutura preferida:** Não têm equipe de TI; querem tudo funcionando sem dor de cabeça, mas querem ver a diferença entre usar conta própria e hospedar com a Dumentre.

#### B. Tabela de Estimativa de Horas e Cálculo
- **Valor-hora aplicado:** R$ 150,00/h *(a confirmar pelo Luan)*
- **Margem de risco:** 15% (depende de envio de fotos da escola e aprovação da direção pedagógica)

| # | Tarefa | Min (h) | Prov (h) | Máx (h) | PERT (h) | Subtotal (R$) |
|---|---|---:|---:|---:|---:|---:|
| 1 | Imersão com a direção, estruturação do discurso de matrículas 2027 e organização do acervo de fotos | 1,5 | 2,5 | 4,0 | 2,58 | R$ 387,50 |
| 2 | Direção visual (`design.md`), recuperação de vetor do brasão/logo e sistema de cores/tipografia | 3,0 | 4,5 | 6,5 | 4,58 | R$ 687,50 |
| 3 | Copywriting e desenvolvimento do site de 4 páginas + agendamento de visita via WhatsApp por segmento | 6,5 | 9,0 | 13,0 | 9,25 | R$ 1.387,50 |
| 4 | Recuperação de DNS/SSL, SEO local (`School` JSON-LD), Google Meu Negócio e testes Playwright | 2,0 | 3,0 | 4,5 | 3,08 | R$ 462,50 |
| 5 | Campanha de Matrículas 2027 (página de aprovação + 4 posts/carrosséis + 3 stories + 1 destaque + 4 templates reutilizáveis) | 5,0 | 7,0 | 10,0 | 7,17 | R$ 1.075,00 |
| **Total** | **Prazo estimado: 10 dias úteis** | **18,0** | **26,0** | **38,0** | **26,67 h** | **R$ 4.000,00** |

- **Subtotal base (26,67 h × R$ 150/h):** R$ 4.000,00
- **Margem de risco (15%):** R$ 600,00
- **Investimento Total de Implantação (arredondado):** **R$ 4.600,00**
  - Entrada (50%): **R$ 2.300,00** · Entrega (50%): **R$ 2.300,00**

#### C. Cenários de Infraestrutura e Manutenção (Colégio)
- **Opção A (Infra do Colégio):** R$ 0/mês para a Dumentre. O colégio mantém o domínio no Registro.br (~R$ 40/ano) e a hospedagem estática roda na conta gratuita do Cloudflare Pages da escola.
- **Opção B (Hospedado pela Dumentre em Cloudflare + Monitoramento Hetzner):** **R$ 59,00/mês** (gestão de DNS, renovação e monitoramento de certificado SSL para nunca mais cair em época de matrícula, CDN e backup do repositório).
- **Manutenção Opcional (Cuidado Mensal Escolar):** **R$ 190,00/mês** (já inclui a Opção B de infra + relatório mensal de cliques de pais no WhatsApp + até 1h/mês para atualizar calendário escolar, comunicados, fotos de eventos ou banners de campanha).
- **Fora do escopo:** portal do aluno com notas/boletos, secretaria acadêmica digital, sessão fotográfica presencial e gerenciamento diário de redes sociais.

---

### Exemplo 3: Restaurante & Casa de Eventos (Página de Reservas + Sistema Enxuto de Gestão de Mesas e Grupos)

#### A. Resumo da Descoberta (Canal: Instagram Direct da Dumentre → WhatsApp)
- **Cliente:** Cantina & Osteria Don Lorenzo (Mooca — salão de 110 lugares + área fechada para aniversários/eventos corporativos)
- **Problema:** Pagam caro numa plataforma de reservas que cobra taxa por pessoa sentada e ainda assim perdem os pedidos de eventos de grupo (20 a 50 pessoas) porque o atendimento no WhatsApp se perde nas anotações em caderno de papel.
- **O que precisa:**
  1. Página rápida de Cardápio Digital & Reserva de Mesas/Eventos (sem taxa por cabeça).
  2. Sistema web enxuto para o maître e o dono: formulário de solicitação de reserva/evento com confirmação automática no WhatsApp, painel diário de ocupação por turno (almoço/jantar), controle de sinal Pix para grupos acima de 10 pessoas (upload/baixa manual ou webhook simples) e lista de clientes recorrentes (exportável em CSV).
- **Infraestrutura preferida:** Querem rodar na infra da Dumentre no Hetzner para não se preocuparem com banco de dados nem servidor.

#### B. Tabela de Estimativa de Horas e Cálculo
- **Valor-hora aplicado:** R$ 150,00/h *(a confirmar pelo Luan)*
- **Margem de risco:** 20% (sistema web com banco de dados, regras de ocupação por turno e notificações WhatsApp)

| # | Tarefa | Min (h) | Prov (h) | Máx (h) | PERT (h) | Subtotal (R$) |
|---|---|---:|---:|---:|---:|---:|
| 1 | Especificação das regras de salão/turnos, modelagem do banco de dados e protótipo de fluxo | 2,5 | 3,5 | 5,0 | 3,58 | R$ 537,50 |
| 2 | Página pública mobile-first (Cardápio em destaque + fluxo de pedido de reserva e orçamento de evento) | 4,0 | 5,5 | 8,0 | 5,67 | R$ 850,00 |
| 3 | Painel do Maître/Gestor (visão do dia por turno, status da reserva, bloqueio de datas e histórico de clientes) | 6,0 | 8,5 | 12,5 | 8,75 | R$ 1.312,50 |
| 4 | Automação de aviso e confirmação no WhatsApp (nova reserva, lembrete no dia do evento e alerta de grupo grande) | 3,5 | 5,0 | 7,5 | 5,17 | R$ 775,00 |
| 5 | Testes automatizados, configuração de banco Postgres + backup e publicação | 2,5 | 3,5 | 5,5 | 3,67 | R$ 550,00 |
| **Total** | **Prazo estimado: 14 dias úteis** | **18,5** | **26,0** | **38,5** | **26,83 h** | **R$ 4.025,00** |

- **Subtotal base (26,83 h × R$ 150/h):** R$ 4.025,00
- **Margem de risco (20%):** R$ 805,00
- **Investimento Total de Implantação (arredondado):** **R$ 4.830,00**
  - Entrada (50%): **R$ 2.415,00** · Entrega (50%): **R$ 2.415,00**

#### C. Cenários de Infraestrutura e Manutenção (Restaurante)
- **Opção A (Infra do Restaurante):** R$ 0/mês para a Dumentre. O restaurante cria e paga diretamente conta em provedor de banco/servidor (~R$ 90 a R$ 150/mês) + consumo da API do WhatsApp (~R$ 40/mês).
- **Opção B (Hospedado pela Dumentre em Hetzner + Cloudflare):** **R$ 160,00/mês** (aplicação web + banco de dados Postgres no Hetzner da Dumentre + backups diários criptografados fora da máquina + Cloudflare WAF/SSL + monitoramento de disponibilidade). Consumo de mensagens WhatsApp repassado pelo custo real (~R$ 35–60/mês).
- **Manutenção Opcional (Operação Assistida — Sistema):** **R$ 230,00/mês** adicionais (ou **R$ 390,00/mês no pacote completo Infra B + Manutenção**), incluindo atualização de cardápios sazonais, suporte prioritário em véspera de datas fortes (Dia das Mães, Namorados, fim de ano) e até 2h/mês de evolução no painel.
- **Fora do escopo:** frente de caixa (PDV), emissão de cupom fiscal (NFC-e/SAT), controle de estoque de insumos/ficha técnica e integração com iFood.

---

## 6. O que precisa mudar no site para tirar os preços públicos (Levantamento — Sem Edição / Sem Deploy)

Conforme instrução da tarefa (`DUM-01 v2`, item 4), **nenhum arquivo do site foi editado e nenhum deploy foi executado**. Abaixo está o inventário exato de todos os arquivos e trechos que exibem preços públicos ou prometem "preço na etiqueta / preço fechado" nos repositórios do site.

### 6.1. Branch de Redesign (`C:\Users\luanc\projects\dumentre\dumentre-website-v2--redesign`)
Esta é a branch onde a seção `#ofertas` com preços na etiqueta foi introduzida em 08/10:

1. **`dumentre-website-v2--redesign/index.html`**
   - **Linha 62 (JSON-LD `LocalBusiness`):**
     - Trecho atual: `"priceRange": "$$",`
     - Ação recomendada: remover a propriedade `"priceRange"` do JSON-LD (é opcional no Schema.org) ou manter apenas dados institucionais.
   - **Linhas 151–153 (CTA secundário do Hero):**
     - Trecho atual:
       ```html
       <a href="#ofertas" class="btn btn-secondary">
         <span>Ver ofertas e preços</span>
       </a>
       ```
     - Ação recomendada: trocar para `<span>Ver soluções e formatos</span>` ou `<span>Como funciona o orçamento</span>`.
   - **Linhas 256–261 (Cabeçalho da seção `#ofertas`):**
     - Trecho atual:
       ```html
       <p class="eyebrow"><b>02</b> Ofertas com preço na etiqueta</p>
       <h2 class="section-title">Escopo fechado, prazo fechado, preço fechado.</h2>
       <p class="section-subtitle">Três formas de começar sem projeto gigante. Você sabe o que leva, quanto paga e quando fica pronto antes de fechar.</p>
       ```
     - Ação recomendada: mudar para abordagem de escopo sob medida (ex.: Eyebrow `<b>02</b> Projetos sob medida`, Título `Escopo claro, prazo combinado e orçamento na medida do seu negócio.`, Subtítulo explicando que no WhatsApp o atendimento entende a necessidade, monta o plano e entrega o orçamento detalhado).
   - **Linha 277 (Card Oferta 01 — Site no Ar em 7 Dias):**
     - Trecho atual: `<div><dt>Investimento</dt><dd>R$ 2.900</dd></div>`
     - Ação recomendada: substituir `<dt>Investimento</dt><dd>R$ 2.900</dd>` por `<dt>Orçamento</dt><dd>Sob medida no WhatsApp</dd>` (ou `<dt>Hospedagem</dt><dd>Sua conta ou gerenciada</dd>`).
   - **Linha 296 (Card Oferta 02 — Atendente de WhatsApp com IA):**
     - Trecho atual: `<div><dt>Investimento</dt><dd>R$ 3.500 <small>+ R$ 390/mês</small></dd></div>`
     - Ação recomendada: substituir por `<dt>Orçamento</dt><dd>Sob medida (conforme volume e integrações)</dd>`.
   - **Linhas 311 e 315 (Card Oferta 03 — Campanha Pronta):**
     - Trechos atuais:
       - Linha 311: `<li>Com Kit de Marca: R$ 3.900</li>`
       - Linha 315: `<div><dt>Investimento</dt><dd>R$ 1.490</dd></div>`
     - Ação recomendada: trocar linha 311 por `<li>Opção com Kit de Marca completo e templates reutilizáveis</li>` e linha 315 por `<dt>Orçamento</dt><dd>Sob medida por campanha</dd>`.
   - **Linhas 325–326 (Faixa de entrada — Raio-X Digital):**
     - Trecho atual:
       ```html
       <p class="offer-entry-title">Raio-X Digital: vídeo de 15 minutos com as 5 correções que mais trazem cliente.
         <span class="price-inline">R$ 390, abatidos se você fechar qualquer oferta em 30 dias.</span></p>
       ```
     - Ação recomendada: remover o valor `R$ 390` e destacar o diagnóstico consultivo sob medida pelo WhatsApp.
   - **Linhas 796–798 (FAQ — "Como funciona o processo de entrega e acompanhamento?"):**
     - Trecho atual: `... (2) Escopo claro de entregas e orçamento fechado; ...`
     - Ação recomendada: trocar para `... (2) Plano sob medida com estimativa de esforço, opções de infraestrutura e orçamento transparente; ...`.

2. **`dumentre-website-v2--redesign/style.css`**
   - **Linha 194:** seletor `.offer-entry-title .price-inline { font-family: var(--font-mono); font-size: 0.92rem; color: var(--accent); }`
   - Ação recomendada: se a classe `.price-inline` deixar de existir ou virar `.highlight-inline`, renomear ou limpar a regra CSS correspondente.

3. **`dumentre-website-v2--redesign/scripts/generate-brand-assets.js` e `og-image.png`**
   - **Linha 52:**
     - Trecho atual: `<span class="tag">Escopo, prazo e preço fechados →</span>`
     - Ação recomendada: alterar para `<span class="tag">Sites, sistemas e automações sob medida →</span>` e regerar `og-image.png` para que o preview de link no WhatsApp/LinkedIn não mostre "preço fechado".

4. **`dumentre-website-v2--redesign/tests/e2e/cta-links.spec.ts`**
   - **Linha 21:**
     - Trecho atual: `const heroOffers = page.locator(".hero-actions").getByRole("link", { name: /Ver ofertas e preços/i });`
     - Ação recomendada: atualizar a regex do teste E2E para refletir o novo rótulo do botão secundário do hero.

---

### 6.2. Checkout Principal (`C:\Users\luanc\projects\dumentre\dumentre-website-v2`, branch `main`)
O site em `main` **não possui** a seção `#ofertas` com valores em reais (`R$`), mas tem 2 pontos menores para alinhar quando do merge:

1. **`dumentre-website-v2/index.html`**
   - **Linha 62:** `"priceRange": "$$",` no JSON-LD `LocalBusiness` (opcional remover).
   - **Linhas 856–858 (FAQ Item 8):** `... (2) Escopo claro de entregas e orçamento fechado; ...` → alinhar texto para orçamento sob medida.
2. **`dumentre-website-v2/docs/backlog/tabela-planos.md` (também presente na worktree redesign)**
   - Documento interno de backlog no repositório do site que propunha *"Exibição de preços em moeda local sem prévia consulta comercial"*. Deve ser marcado como **Descartado / Substituído por Orçamento sob Medida via IA (12/11/2026)** quando o repositório do site for editado.
