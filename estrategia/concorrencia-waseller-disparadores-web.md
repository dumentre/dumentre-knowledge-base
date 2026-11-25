# Análise de Concorrência: WaSeller (Disparador WhatsApp via Extensão Web)

**Data:** 25/11/2026  
**Contexto:** Inteligência competitiva para a Dumentre (posicionamento CRM + Atendimento WhatsApp).  
**Produto analisado:** WaSeller (DIGITAL PRESENC X LTDA) — Oferta 'Black Friday das Cavernas'.  
**Documentos de referência interna:** [`estrategia/decisao-whatsapp-api-2026-11-14.md`](./decisao-whatsapp-api-2026-11-14.md), [`estrategia/atendimento-unificado.md`](./atendimento-unificado.md).

---

## 1. Resumo Executivo

A WaSeller vende a promessa de "mensagens e disparos ilimitados no WhatsApp" por uma taxa anual baixa (~R$ 372 a R$ 397/ano). A viabilidade econômica dessa oferta não vem de parcerias com a Meta ou subsídio de custos, mas sim do fato de que **eles não utilizam a Cloud API Oficial da Meta**.

Trata-se de uma extensão para Google Chrome injetada no WhatsApp Web. O custo marginal por mensagem para a WaSeller é zero, e o risco operacional de banimento do número é 100% transferido para o usuário final.

---

## 2. Arquitetura Técnica e Engenharia de Custos

| Dimensão | Como a WaSeller Opera | Modelo Dumentre (Cloud API Oficial) |
|---|---|---|
| **Canal / Protocolo** | Extensão Chrome injetada no `web.whatsapp.com` (emulação de eventos/DOM) | Meta WhatsApp Cloud API oficial (webhooks + REST) |
| **Custo Meta por Mensagem** | **R$ 0,00** (não usa canal faturável da Meta) | Cobrança por conversa de 24h (conforme tabela Meta) |
| **Custo de Infraestrutura** | Praticamente zero. Processamento, conexões e tráfego rodam no PC do cliente | Servidores/Gateways da plataforma gerenciando filas e SLAs |
| **Margem Bruta Unitária** | Quase 100% da assinatura anual é margem líquida direta | Margem de software sobre serviço estruturado e auditável |
| **Dependência de Execução** | Computador e aba do Chrome precisam ficar abertos e ligados | Operação 100% em nuvem (24/7 sem intervenção local) |
| **Risco de Banimento** | Crítico e frequente (bloqueio algorítmico da Meta por spam/automação não autorizada) | Nulo/Inexistente (dentro das políticas comerciais da Meta) |

---

## 3. A 'Pegadinha' do Ilimitado e Termos Contratuais

1. **O freio é o banimento, não o bolso da WaSeller:**
   - A ferramenta permite disparar quantas mensagens o usuário quiser, mas o algoritmo anti-spam da Meta detecta disparos em lote pelo WhatsApp Web e bane números em minutos se não houver aquecimento gradual ou se houver denúncias.
2. **Exoneração de responsabilidade nos Termos de Uso:**
   - Na política de privacidade e termos da WaSeller, a empresa declara expressamente que o envio em massa viola os termos do WhatsApp e que o usuário assume responsabilidade integral e exclusiva por qualquer número bloqueado ou banido.
3. **Classificação como Infoproduto:**
   - O produto é formalmente comercializado empacotado com treinamentos e e-books ("Scripts Poderosos", "Estratégia Vende", etc.) sob razão social de infoproduto (DIGITAL PRESENC X LTDA). Isso viabiliza venda com pagamento anual não reembolsável após 7 dias de garantia legal.
4. **Monetização secundária na interface (Cláusula 2.9 dos Termos):**
   - Reservam o direito de injetar anúncios, propagandas e ofertas de terceiros dentro do painel da própria extensão no navegador do usuário.

---

## 4. Dinâmica de Mercado (Churn & Burn)

- **Público-alvo:** Pequenos comerciantes, afiliados e operações de venda agressiva que buscam volume imediato sem pagar tarifa por mensagem da Meta.
- **Ciclo de vida do cliente:** Alto churn. Usuários frequentemente perdem números ou cansam da instabilidade das atualizações do WhatsApp Web (que quebram extensões). Como o pagamento é anual e antecipado, a empresa retém a receita integral antes do churn se concretizar.

---

## 5. Posicionamento Estratégico para a Dumentre

- **Diferenciação clara:** A Dumentre atende empresas B2B que não podem colocar seu número principal de atendimento em risco. O posicionamento deve reforçar que soluções 'milagrosas' de R$ 300/ano operam em canal pirata/cinzento com risco de perda do ativo digital do cliente.
- **Argumento comercial:** Um cliente que tem seu chip banido perde histórico de conversas, credibilidade com a base de clientes e fica dias incomunicável. A Cloud API oficial oferece SLA, estabilidade e conformidade jurídica.
