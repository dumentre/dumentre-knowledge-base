# 11. Decisões realmente necessárias, pré-condições e autorizações (complemento)

Não decido pelo Luan. Cada item diz **o que muda** conforme a resposta e o que **não** pode ser afirmado sem ela. Numeração continua a de `../11-decisoes-e-autorizacoes.md` (D1–D13, A1–A8); itens revisados levam o sufixo **R**.

## Decisões

| ID | Decisão | Recomendação (com base nas provas deste complemento) | Impacto exato |
|---|---|---|---|
| **D2R** | **Onde provar a capacidade (G-CAP).** Substitui D2. Opções: (a) VM Linux local (Hyper-V, 2 vCPU/4 GB) — custo R$ 0, exige que Luan a crie; (b) **servidor Hetzner separado** para a Dumentre (CPX22 € 16,99 ou CPX32 € 30,49 por mês, sem VAT, + backup 20%); (c) VPS `openbao-platform-prod-openbao` (CPX22, cofre + NetBird) | **(a) primeiro; (b) se (a) passar e Luan aprovar o custo; (c) não recomendado** (raio de explosão, F-06) | (a) libera G-F01/G-F02/G-F04/G-F05 sem custo; (b) cria recurso cobrável; (c) altera produção do cofre. Sem D2R não há medição de RAM. |
| **D14** | **Propriedade/projeto do servidor.** O VPS atual é do projeto `openbao-platform` (Luan), "Não é da Dumentre". A Dumentre usa o mesmo projeto Hetzner/conta, ou outro? | Projeto separado, mesmo titular, para isolar custo e acesso | Define se "sem aumentar a despesa" (pedido original) ainda é alcançável: o VPS existente **não** comporta Chatwoot com segurança; qualquer opção separada **aumenta** a despesa (preços acima). |
| **D6R** | **Número comercial: coexistência × só API.** Coexistência documentada exige ser **Tech Provider/Solution Partner** + Embedded Signup | Antes de decidir, **ler** a conta (tarefa 0.8): status de parceiro, tipo de conta do número, versão do app | Sem coexistência: ou o app WhatsApp Business deixa de ser usado no número, ou o omnichannel não cobre WhatsApp. Elegibilidade real **desconhecida**. |
| **D15** | **H4 × C1** após G-F01/G-F02 | Decidir **depois** das provas; hoje H4 segue recomendada **condicionada** | G-F02 vermelho irreparável → C1 (10–15 dias na F1, sem benchmark). Nenhuma troca agora. |
| **D16** | **Política de merge no Chatwoot** | Proibir merge automático; permitir só ato humano com snapshot | Se Luan quiser merge nativo: aceitar irreversibilidade e perda da ficha separada. |
| **D17** | **Corpo das mensagens no núcleo** (E-19): manter `raw_event` cifrado 90 dias e metadados, ou assumir cópia do conteúdo | Cifrar `raw_event`, remover `message.text` de produção, retenção do D4 | Define LGPD e tamanho do banco; parecer jurídico continua pendente. |
| **D18** | **Moeda/tributos da conta Meta** e método de pagamento | Ler o Billing Hub (0.8) antes de orçar | Sem método de pagamento a Meta **não entrega** service desde 01/10/2026; moeda USD × BRL muda o custo real (tributos: desconhecidos). |
| D5 (mantida) | Orçamento mensal de mensagens | R$ 70 de exemplo para 3.000 respostas/mês é **ilustração**, não meta | Teto local continua o único freio. |
| D3, D4, D7–D13 | sem mudança | — | — |

## Autorizações

| ID | Ação | Escopo mínimo | Impacto se não vier |
|---|---|---|---|
| **A9** (nova) | Criar a VM Linux local (Hyper-V) para o laboratório | 2 vCPU/4 GB, disco 40 GB, sem rede externa além de downloads do instalador; sem tokens reais | G-F01/G-F02/G-F04/G-F05 e medição de RAM ficam bloqueados |
| **A10** (nova) | Provisionar servidor Hetzner separado (D2R-b) | um CPX22/CPX32, sem alterar o projeto `openbao-platform` | sem segundo servidor, só o lab local |
| A1 (revista) | Instalar Chatwoot no VPS do OpenBao | **não solicitar** enquanto F-06 aberto | — |
| A2–A8 | inalteradas | — | — |
| **A11** (nova) | Ler a conta Meta (somente leitura): Billing Hub (moeda, método), status de parceiro, app, permissões `ads_read`, assinaturas | leitura, sem alterar | tarefa 0.8 e D6R/D18 ficam bloqueados |

## Pré-condições (antes de qualquer fase)
1. F1: nenhuma (só repositório).
2. F2a: A9 (VM) **ou** servidor de teste equivalente; versão do Chatwoot fixada em `v4.20.1` ou superior verificada.
3. F2b: A10; backup e restauração testados; Chatwoot **só** alcançável pela borda (rota `/webhooks/*` restrita).
4. F2c: A2/A3, A11, destinatário de teste (D7).
5. F3: F2c + 2.11 (monitor da borda).
6. Billing: D8 e G-BILL.

## O que continua bloqueado por limites técnicos (não por decisão)
Executar o Chatwoot em Windows nativo; qualquer prova com conta Meta/TikTok; medição de RAM do Chatwoot; leitura do portal TikTok (SPA); preço de módulos pagos (EspoCRM, FreeScout); conteúdo do PDF do rate card (só baixado).
