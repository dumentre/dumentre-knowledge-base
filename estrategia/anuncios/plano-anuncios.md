# Plano de anúncios — Google Ads e Meta Ads (teste)

**Status: plano. Nenhuma conta, campanha ou cobrança criada.** Ativar é decisão do Luan, uma campanha por vez.

## Quando ligar (pré-requisitos)

Anúncio sem esses itens queima verba sem aprendizado:

1. Site novo no ar (branch `redesign/identidade-2026-10`), com a seção de ofertas.
2. Rastreamento de WhatsApp commitado (o trabalho em `main`: UTM → mensagem + `dataLayer`) e GA4 / Google Tag Manager com o evento `whatsapp_click` como conversão.
3. Pixel da Meta + API de Conversões (ou ao menos o evento `Contact` no clique do WhatsApp).
4. Instagram com os 9 posts publicados (quem clica no anúncio visita o perfil).
5. WhatsApp Business com saudação, respostas rápidas e catálogo das ofertas.
6. Primeiras 2–3 semanas de **prospecção ativa** rodando: ela é mais barata e valida qual oferta tem mais tração antes de pagar por clique.

## Orçamento de teste sugerido

| Fase | Período | Google | Meta | Total |
|---|---|---|---|---|
| Teste 1 | 21 dias | R$ 25/dia (≈ R$ 525) | R$ 20/dia (≈ R$ 420) | ≈ R$ 945 |
| Escala (se CPL ≤ meta) | mês seguinte | dobrar o canal vencedor | manter o outro no mínimo | ≈ R$ 1.500/mês |

Conta de cabeça: 1 venda do Site no Ar (R$ 2.900) paga 3 meses de teste. **Regra de corte:** se após R$ 400 num canal não houver nenhuma conversa qualificada, pausar e revisar oferta/criativo antes de gastar mais.

## Google Ads — Pesquisa (intenção alta)

- **Tipo:** Rede de Pesquisa apenas (desligar Display e parceiros de pesquisa).
- **Local:** São Paulo capital, "presença" (pessoas no local, não "interesse"). Começar por raio de 15 km a partir da zona leste/sul, ou pela cidade inteira se o volume vier baixo.
- **Horário:** seg–sáb, 7h–22h.
- **Lance:** "Maximizar cliques" com teto de CPC (R$ 4) nas 2 primeiras semanas; depois "Maximizar conversões" quando houver ≥ 15 conversões.
- **Destino:** site novo, âncora da oferta (`/#ofertas`) com UTM `utm_source=google&utm_medium=cpc&utm_campaign=<grupo>`.

### Grupos e palavras-chave (correspondência de frase e exata)

| Grupo | Palavras-chave | Anúncio leva para |
|---|---|---|
| Site rápido | "criação de site", "criar site para empresa", "site profissional preço", "quanto custa um site", "site para pequena empresa" | Oferta 01 |
| Nicho local | "site para clínica", "site para dentista", "site para escola de futebol", "site para academia", "site para advogado" + "são paulo" | Oferta 01 |
| WhatsApp com IA | "chatbot whatsapp", "atendimento automático whatsapp", "robô para whatsapp empresa", "automatizar atendimento whatsapp" | Oferta 02 |
| Google Maps | "colocar empresa no google maps", "google meu negócio configurar", "aparecer no google maps" | Raio-X / Google Perfil |

**Palavras negativas (começar com):** grátis, gratuito, curso, como fazer, wix, wordpress tutorial, emprego, vaga, freelancer, template, modelo, download, faculdade, sozinho.

Os CPCs desses termos em SP variam muito. **Antes de ativar**, rodar o Planejador de Palavras-chave (gratuito, dentro da conta Google Ads) e anotar volume e lance sugerido no backlog. Não registrei números porque não os verifiquei.

### Anúncios responsivos (exemplos)

**Grupo Site rápido**
- Títulos (≤ 30): `Site no Ar em 7 Dias` · `Preço Fechado: R$ 2.900` · `Texto Escrito por Nós` · `Aparece no Google e no Maps` · `O Código Fica com Você` · `Pequenos Negócios em SP` · `Botão de WhatsApp Rastreado`
- Descrições (≤ 90): `Site profissional com texto, Google e WhatsApp. Escopo e preço fechados antes de começar.` · `Conversa de 30 min, site no ar em 7 dias úteis. 30 dias de garantia de ajustes.`
- Extensões: sitelinks (Ofertas, Case, Como funciona, Raio-X), chamada ("Preço na etiqueta"), local (Perfil de Empresa), mensagem (WhatsApp).

**Grupo WhatsApp com IA**
- Títulos: `Atendente de WhatsApp com IA` · `Responde em Segundos, 24h` · `Você Recebe Só o Resumo` · `Implantação em 14 Dias` · `Sem Perder Cliente à Noite`
- Descrições: `Responde as perguntas frequentes, separa quem quer comprar e passa para você com o resumo.` · `Implantação R$ 3.500 + R$ 390/mês. Você continua no comando do atendimento.`

## Meta Ads — Instagram e Facebook (demanda criada)

- **Objetivo:** Engajamento → "Conversas por mensagem" (WhatsApp). Mais barato que tráfego para o site e é onde a venda acontece.
- **Mensagem automática inicial:** "Oi! Vi o anúncio da Dumentre e quero saber mais sobre [oferta]." + perguntas rápidas: "Qual é o seu negócio?" / "Tem site hoje?".
- **Local:** São Paulo, raio de 10–15 km de zona leste (Tatuapé, Mooca, Vila Prudente, Penha) e zona sul (Santo Amaro, Chácara Santo Antônio). Começar com 1 conjunto por região.
- **Idade:** 28–60.
- **Públicos (1 por conjunto, testar 2):**
  1. Interesses: "pequenas empresas", "empreendedorismo", "Sebrae", "WhatsApp Business", "proprietário de pequena empresa" (comportamento: administradores de páginas de empresa).
  2. Aberto (Advantage+), deixando o criativo segmentar. Costuma funcionar quando o criativo fala com o nicho ("dono de clínica", "escola").
  3. Quando houver ≥ 100 interações: público semelhante de quem conversou no WhatsApp + remarketing de visitantes do perfil.
- **Posicionamentos:** Feed e Stories/Reels do Instagram e Facebook. Excluir Audience Network.
- **Criativos (3 para começar, testar 1 variável por vez):**

| Criativo | Formato | Ideia | Arquivo |
|---|---|---|---|
| A1 | Stories/Reels 9:16 | Oferta com preço: "Site no ar em 7 dias. R$ 2.900" | [ad-site-story.png](ad-site-story.png) |
| A2 | Feed 1:1 | Dor: "Cliente chamou às 21h. Quem respondeu?" → atendente com IA | [ad-atendente-feed.png](ad-atendente-feed.png) |
| A3 | Stories 9:16 | Isca: Raio-X grátis do site | [ad-raiox-story.png](ad-raiox-story.png) |
| A4 (depois) | Reels 15–20 s | Luan na tela: "abri o site de 20 negócios da zona leste; N não tinham botão de WhatsApp" (usar o número real que sair da [lista de prospects](../prospeccao/prospects.md)) | gravar |

Fonte editável: [`criativos.html`](criativos.html). Os 9 posts orgânicos também servem como anúncio (impulsionar o que tiver melhor engajamento orgânico depois de 7 dias).

**Texto principal (A1):** "Preço na etiqueta. Site profissional com texto, Google e botão de WhatsApp, no ar em 7 dias úteis. R$ 2.900, código no nome da sua empresa. Chama no WhatsApp e a gente começa com uma conversa de 30 minutos."

## Métricas e metas do teste

| Métrica | Onde ver | Meta inicial (ajustar após 21 dias) |
|---|---|---|
| CTR (Google) | Google Ads | ≥ 4% na Pesquisa |
| CPC médio | Google Ads | ≤ R$ 4 |
| Custo por conversa iniciada (Meta) | Gerenciador de Anúncios | ≤ R$ 15 |
| Conversa qualificada (dono de negócio com necessidade real) | planilha de leads | ≥ 40% das conversas |
| Custo por conversa qualificada | planilha | ≤ R$ 40 |
| Proposta enviada | planilha | ≥ 30% das qualificadas |
| Venda | planilha | 1 venda a cada ~R$ 600 investidos paga o canal com folga |

**Planilha de leads (mínimo):** data · canal/UTM · nome do negócio · nicho · oferta · qualificado (s/n) · proposta (s/n) · venda (R$). Sem isso não dá para dizer qual canal paga a conta.

## Riscos e cuidados

- Política de anúncios: não prometer "1º lugar no Google" nem resultado garantido; não usar "você" com atributos pessoais ("Você está falindo?").
- WhatsApp: mensagem automática da Meta não substitui resposta humana rápida. Responder em até 5 minutos no horário comercial durante o teste.
- Fotos de clientes ou alunos: nunca em anúncio sem autorização escrita.
