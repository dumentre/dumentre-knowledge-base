# Ofertas para faturar já

Princípio: **poucas ofertas, preço e prazo fixos, entregável fechado.** Quem compra é dono de pequeno negócio, que decide por WhatsApp e precisa entender o que leva antes de pedir orçamento. Todas as ofertas são entregáveis por 1 pessoa + Claude, sem contratar ninguém.

Os preços são **sugestões** para São Paulo (zona leste/sul), entre o freelancer barato (R$ 800–1.500 por um site de template) e a agência média (R$ 6–15 mil). A ideia é ficar no meio, com prazo curto e garantia como diferencial. O Luan decide os valores finais (ver backlog).

## Visão geral

| # | Oferta | Para quem | Prazo | Preço sugerido | Recorrência |
|---|---|---|---|---|---|
| 0 | **Raio-X Digital** (porta de entrada) | Qualquer prospect | 48 h | R$ 390, abatidos se fechar outra oferta em até 30 dias | — |
| 1 | **Site no Ar em 7 Dias** | Clínica, escolinha, escritório, comércio sem site ou com site fraco | 7 dias úteis | R$ 2.900 (ou 3× R$ 1.000) | Cuidado Mensal R$ 190/mês |
| 2 | **Campanha Pronta** (kit de marca + campanha para um momento de venda) | Quem já tem Instagram ativo mas posta "pobre" | 5 dias úteis | R$ 1.490 por campanha · R$ 3.900 com o Kit de Marca | Pacote 3 campanhas R$ 3.600 |
| 3 | **Atendente de WhatsApp com IA** | Quem perde lead por demora no WhatsApp | 10–14 dias úteis | Implantação R$ 3.500 | R$ 390/mês (infra, IA, monitoramento) + custo da API do WhatsApp repassado |
| ★ | **Combo Presença Completa** (1 + 2 com Kit de Marca + Perfil no Google) | Quem está começando do zero | 14 dias úteis | R$ 5.900 (economia de ~R$ 1.300) | Cuidado Mensal incluso por 3 meses |

Regra de cobrança: **50% para começar, 50% na entrega** (Pix ou link de pagamento). Escopo assinado antes de começar, com no máximo **2 rodadas de ajuste**.

---

## 0. Raio-X Digital — R$ 390 (abatível)

**O que é:** um vídeo de 10 a 15 minutos (gravação de tela) + 1 página em PDF analisando site, Google Maps, Instagram e WhatsApp do cliente, com as 5 correções de maior impacto em ordem.

**Por que existe:** filtra curioso, paga o tempo da análise e quase vende sozinho a oferta seguinte. Para prospecção fria, use a versão **grátis e curta** (um print anotado + 3 achados), que serve de isca para a conversa (ver [prospecção](prospeccao/README.md)).

**Como entregar rápido com Claude:** Lighthouse + print do site + leitura do Perfil de Empresa e do Instagram → Claude organiza os achados num template fixo → Luan grava o vídeo comentando. Cerca de 1 h de trabalho.

**Argumento:** "Antes de gastar com site ou anúncio, descubra o que está fazendo você perder cliente hoje. Se fechar qualquer serviço em 30 dias, o Raio-X sai de graça."

---

## 1. Site no Ar em 7 Dias — R$ 2.900

**Escopo fechado:**
- Site de 1 página longa (até 7 seções) **ou** 3 páginas curtas (home, serviços, contato).
- Texto escrito pela Dumentre a partir de uma conversa de 30 minutos (gravada e transcrita).
- Visual próprio, não template: paleta, tipografia e componentes definidos para a marca do cliente.
- Botão de WhatsApp com mensagem pronta e **rastreio de origem** (sabe se veio do Google, do Instagram ou do anúncio).
- SEO local básico: título, descrição, dados estruturados `LocalBusiness`, mapa, Search Console.
- Publicação em Cloudflare/Vercel no domínio do cliente. **O código e o domínio ficam no nome do cliente.**
- 30 dias de garantia de ajustes técnicos.

**Fora do escopo:** loja virtual, área de login, blog com CMS, sessão de fotos.

**Cronograma:** D1 conversa + briefing → D2 texto → D3–D4 visual e montagem → D5 revisão com o cliente → D6 ajustes → D7 no ar.

**Como entregar rápido com Claude:** briefing por voz transcrito → `design.md` do cliente pela skill `design-director` → site estático/Next.js gerado e criticado com screenshot → testes Playwright (mesma base do site da Dumentre) → deploy. O case Julinho é a prova de que o processo funciona.

**Upsell natural — Cuidado Mensal R$ 190/mês:** hospedagem, domínio monitorado, backup, 1 h de ajustes por mês, relatório mensal de cliques no WhatsApp. Esse é o faturamento recorrente que paga as contas.

**Argumento:** "Em 7 dias úteis seu negócio tem um site que passa confiança, aparece no Google e manda o cliente direto para o seu WhatsApp. Preço fechado, sem mensalidade obrigatória, e o site é seu."

---

## 2. Campanha Pronta — R$ 1.490 por campanha · R$ 3.900 com Kit de Marca

Baseada no case Julinho (Dia das Crianças: direção "revista + figurinhas").

**Escopo da campanha:**
- 2 direções visuais para o cliente escolher (prévia em página de aprovação online, como a do Julinho).
- 4 posts de feed (carrossel ou avulsos) + 3 stories + 1 capa de destaque.
- Legendas prontas, com hashtags locais e CTA.
- Arquivos editáveis (SVG/PNG) e guia curto para quem posta.

**Kit de Marca (adicional R$ 2.410, ou junto por R$ 3.900):** `design.md` do cliente com paleta, tipografia e regras, 6 templates reutilizáveis (post de aviso, post de depoimento, post de dica, story de agenda, story de enquete, capa de destaque) e uma página com as regras visuais da marca.

**Gatilhos (o que faz o cliente precisar da campanha):** a maioria dos pequenos negócios não se move por data comemorativa, e sim por um momento próprio de venda: matrícula ou volta às aulas, lançamento de produto ou serviço, inauguração ou mudança de endereço, promoção ou mês fraco, nova turma, agenda aberta. Data comemorativa é só um dos gatilhos, útil para varejo e serviço infantil.

**Datas que vendem, para quem usa (próximos 6 meses):** Dia das Crianças (12/10, apertado), Black Friday (27/11), Natal, volta às aulas/matrículas 2027 (janeiro), Carnaval, Dia da Mulher (08/03), Páscoa.

**Como entregar rápido com Claude:** fotos reais do cliente + `design.md` → artes em HTML/SVG renderizadas em PNG (o mesmo pipeline dos [9 posts da Dumentre](redes/README.md)) → crítica visual ≥ 8 → página de aprovação.

**Argumento:** "Seu Instagram com cara de marca grande na próxima ação: lançamento, promoção, matrícula ou data especial. Duas opções de estilo, você escolhe, recebe tudo pronto com legenda."

---

## 3. Atendente de WhatsApp com IA — R$ 3.500 + R$ 390/mês

**Escopo fechado:**
- Mapeamento das 10 perguntas mais frequentes (a partir de prints de conversas reais, anonimizadas).
- Assistente que responde as perguntas frequentes, coleta nome, interesse, bairro e melhor horário, e **passa para o humano** com um resumo.
- Registro automático de cada lead numa planilha Google ou CRM simples.
- Aviso para o dono quando um lead quente chega (WhatsApp ou e-mail).
- Painel simples com o número de conversas, leads e horários de pico.
- Monitoramento: se o assistente parar, a Dumentre é avisada antes do cliente.

**Fora do escopo:** pagamentos dentro do WhatsApp, integrações com sistemas proprietários sem API, campanhas de disparo em massa.

**Custos de terceiros (repassados, sem margem):** API oficial do WhatsApp (Meta cobra por conversa), modelo de IA, servidor. Estimar R$ 50–200/mês para pequeno volume e informar antes de fechar.

**Como entregar rápido com Claude:** n8n auto-hospedado ou worker serverless + API oficial do WhatsApp Cloud + Claude Haiku para classificar e responder com base no FAQ aprovado + Google Sheets. É o tipo de integração que o Luan já faz no dia a dia (APIs serverless, filas, observabilidade).

**Argumento:** "Cliente que espera 2 horas por uma resposta fecha com o concorrente. Seu WhatsApp responde em segundos, de dia e de noite, separa quem quer comprar e entrega para você com o resumo pronto."

**Cuidado:** não prometer "atendimento 100% automático". O humano continua no fluxo; a IA faz a triagem.

---

## ★ Combo Presença Completa — R$ 5.900

Site no Ar em 7 Dias + Kit de Marca + Campanha Pronta + Perfil de Empresa no Google otimizado + 3 meses de Cuidado Mensal. É a oferta para o anúncio e para o site novo ("Monte sua presença digital inteira em 14 dias").

---

## O que **não** vender agora

- App mobile, e-commerce sob medida e sistemas grandes: só se o cliente chegar pedindo, com orçamento sob consulta.
- "Arquitetura de sistemas autônomos" com ticket de R$ 10–30 mil (posicionamento do vault): manter para quando houver 3–5 cases. Hoje não há prova para sustentar esse preço.

## Metas sugeridas para os próximos 60 dias

| Meta | Número |
|---|---|
| Raio-X grátis enviados (prospecção) | 60 |
| Conversas abertas | 15 |
| Raio-X pagos ou propostas enviadas | 8 |
| Projetos fechados | 3 (ex.: 1 site + 1 campanha + 1 combo ≈ R$ 10 mil) |
| Clientes em Cuidado Mensal | 3 |
