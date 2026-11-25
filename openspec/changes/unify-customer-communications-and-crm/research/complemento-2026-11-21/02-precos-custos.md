# 02. Preços e custos: Meta WhatsApp (BRL), Hetzner, e o que segue desconhecido

Leitura em **2026-11-21**, fontes públicas oficiais, sem login, sem custo, sem escrita. Substitui as lacunas de `../05-custos-capacidade.md` (ver errata E-05, E-06).

## 1. WhatsApp Business Platform: rate card oficial em BRL

**Fonte:** página oficial https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing (versão HTML; a versão `.md` remove os `href`). A seção "Rate cards and volume tiers" lista, por moeda, três downloads públicos hospedados no CDN da Meta (`scontent…fbcdn.net`, URL assinada com validade; **os arquivos "CSV" são, de fato, planilhas `.xlsx`** com `Content-Type: text/csv`). Baixei e li: "BRL list rates" (efetivo **1º/10/2026**), "BRL volume tiers" e o PDF "BRL rates and volume tiers" (166 KB, baixado, não lido por extração de texto). A linha do Brasil está em `evidencia/whatsapp-rate-card-brl-brasil.txt`.

| Categoria (Brasil, BRL por mensagem **entregue**) | Valor lista |
|---|---|
| Marketing | **R$ 0,3217** |
| Utility | **R$ 0,0350** |
| Authentication | **R$ 0,0350** (Authentication-International: n/a) |
| Service (resposta em janela de 24 h) | **R$ 0,0350** (após a franquia) |
| Meta Business Agent | US$ 2,00 por 1 milhão de tokens (cobra em USD; ~20–25 mil tokens por mensagem segundo a página) |

Trecho do cabeçalho do arquivo: "Cost per message in BRL on the WhatsApp Business Platform, effective October 1, 2026". Volume tiers (somente utility/auth): Brasil lista R$ 0,035 até 250.000 (utility) e 500.000 (authentication) mensagens/mês; faixas acima têm desconto e **não são relevantes** na escala da Dumentre.

**Condições (todas lidas na mesma página):**
- Cobra-se por mensagem **entregue**, só de empresa para usuário; mensagem do usuário não cobra.
- **Franquia:** "Each business phone number has one free tier of 1,000 delivered service messages per month. Meta charges as of the 1,001st service message per month"; não acumula.
- **Janela gratuita de entrada (FEP):** usuário chega por anúncio Click-to-WhatsApp em app Android/iOS; a 1ª resposta **dentro da janela de 24 h** abre uma FEP que "may remain open for up to **7 days**"; nela marketing, utility, authentication e service **não são cobrados**; Business Agent segue cobrado. (Duração não constava na rodada anterior.)
- **Sem método de pagamento:** "does not have a payment method on file by September 30, 2026, Meta will stop delivering service messages" desde 1º/10/2026 (`non-template-messages.md`). Confirmado de novo.
- **Moeda de faturamento:** só "Solution Providers and directly-integrated businesses whose Sold-To country is Brazil in Billing Hub" podem criar contas de mensagens em **BRL**; contas novas em BRL liberadas desde 16/07/2026. **Se a conta Dumentre já existente está em USD ou BRL: desconhecido (depende da conta).**
- Mudanças de tarifa: até 4 vezes por ano (1º/jan, abr, jul, out), com aviso mínimo por tipo de mudança.
- **Não verificado:** se os valores incluem ou excluem tributos (a página lida não os menciona); IOF/câmbio se a conta estiver em USD; método de pagamento aceito para a Dumentre.

**Exemplo ilustrativo (premissas minhas, não da Meta):** 3.000 respostas de serviço no mês por número = (3.000 − 1.000) × R$ 0,035 = **R$ 70,00**; 500 templates de marketing = 500 × R$ 0,3217 = **R$ 160,85**; sem tributos e sem FEP. Mensagens iniciadas pela empresa fora da janela exigem template (utility R$ 0,035; marketing R$ 0,3217).

**Teto imposto pelo fornecedor:** a prévia rodada registrou que cobrança pré-paga só existe para a Índia (`prepaid-billing.md`); **não encontrei** teto duro de gasto para o Brasil. O único freio continua sendo o orçamento **local**; a fatura da Meta é a verdade.

## 2. Hetzner: preços oficiais de novo pedido (EUR, sem VAT)

Fonte: páginas oficiais https://www.hetzner.com/cloud/regular-performance/ e https://www.hetzner.com/cloud/cost-optimized/ (exibição padrão; **a moeda/região do visitante pode alterar a exibição**; os preços abaixo são "from /month" do local listado, eu-central).

| Tipo | vCPU / RAM / disco | EUR/mês (sem VAT) | Estado lido |
|---|---|---|---|
| CPX22 | 2 / 4 GB / 80 GB | **16,99** | listado |
| CPX32 | 4 / 8 GB / 160 GB | **30,49** | listado |
| CPX42 | 8 / 16 GB / 320 GB | 59,49 | listado |
| CPX12 | 1 / 2 GB / 40 GB | 9,99 | listado |
| CX23 | 2 / 4 GB / 40 GB | 5,99 | **"not available"** |
| CX33 | 4 / 8 GB / 80 GB | 8,99 | **"not available"** |
| CX43 | 8 / 16 GB / 160 GB | 16,49 | **"not available"** |

- **Backups:** https://docs.hetzner.com/cloud/billing/faq/ "We will bill you for Backups with a monthly flat price, which is 20% of the price of the server you activate them for", 7 slots; a página de produto diz "starting at € 1.0980" (20% de 5,49). Snapshots: € 0,0143 por GB por mês. Backups do provedor são do **servidor inteiro**, ligado, sem consistência garantida de banco: não substituem `pg_dump`/`VACUUM INTO`.
- **Contratos existentes:** https://www.hetzner.com/pressroom/standardization-and-price-adjustment-of-our-server-products/: "Existing server contracts will keep their terms and conditions ... The changes apply exclusively to new orders and rescales". Logo **o valor pago hoje pelo VPS existente não é dedutível** destes preços, e a segunda VM paga o preço novo.
- **Correções à rodada anterior:** "CPX32 € 35,99" **não confirmado** (oficial lido: € 30,49); "+ € 0,50 IPv4" **não encontrado** (a FAQ cobra Primary IPv4 separadamente, valor não lido). O CX33 indisponível foi confirmado como oficial.
- **O VPS atual** é o `openbao-platform-prod-openbao`, **CPX22** (4 GB, 2 vCPU, 80 GB), do projeto `openbao-platform` (KB local; ver `05-revisao-adversarial.md` F-06). Preço do novo pedido equivalente: € 16,99/mês; o **custo real pago hoje é desconhecido** (contrato anterior; Luan vê na fatura).
- **Custo de uma máquina Dumentre separada (opção, não decisão):** CPX22 € 16,99 + backups 20% (€ 3,40) ≈ **€ 20,39/mês** (sem VAT); CPX32 € 30,49 + € 6,10 ≈ **€ 36,59/mês**. Câmbio não consultado.

## 3. O que continua desconhecido (e como destravar)
| Item | Estado | Destravar |
|---|---|---|
| Moeda e tributos da conta Meta da Dumentre | desconhecido | Billing Hub (leitura) na tarefa 0.8 |
| Tarifa TikTok Business Messaging | sem evidência | portal oficial é SPA (só o título foi lido); ler a doc logada após aprovação |
| Custo de Marketing API (leitura de campanha) | sem evidência de cobrança | doc oficial de Marketing API + prova com conta |
| Gateway de pagamento, NFS-e | desconhecido | decisão D8 e cotação |
| SMTP de saída | desconhecido | decisão D11 |
| IA em API | desconhecido | decisão de modelo/orçamento (F6) |
| Preço de módulos pagos (FreeScout, EspoCRM Advanced Pack) | não lido | só relevante se H-alternativa for reaberta |
