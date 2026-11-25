# Atendimento unificado: um contato, vários canais

**Data:** 14/11/2026. **Pergunta:** qual a melhor forma de reunir os contatos de todos os canais (e-mail, WhatsApp, Telegram, Instagram, Facebook, X), e se faz sentido mandar todo mundo para o site, rastreando a origem mesmo sem cadastro.
**Status:** pesquisa e recomendação. Nada configurado.

---

## 1. Resposta curta

**Não mande todo mundo para o site.** O site é o melhor lugar para **medir e unificar**, mas um cliente que já está no WhatsApp não quer trocar de canal para falar com você. Forçar a troca perde contato.

**O modelo que funciona:** cada canal continua aberto, mas **toda porta de entrada leva um código de origem**, e todas as conversas caem numa **caixa única** com um **registro de contato** só. O site vira a porta de origem mais rica (tem formulário, páginas de oferta e medição), não a única porta.

---

## 2. Fatos verificados

Fontes primárias, lidas em 14/11/2026.

**Telegram (deep link):** `https://t.me/<bot>?start=<payload>` entrega o payload ao bot como comando `/start`. O payload aceita letras, números, `_` e `-`, com até 64 caracteres. Isso permite atribuir a origem com certeza quando o contato começa pelo link. Fonte: [core.telegram.org/bots/features](https://core.telegram.org/bots/features).

**WhatsApp (link com texto pronto):** `https://wa.me/<número>?text=<texto codificado>` abre a conversa com o texto preenchido. Número com código do país, sem zeros, parênteses ou traço. **O cliente pode editar o texto antes de enviar**, então o código de origem nem sempre chega. Atribuição é "melhor esforço". **Fonte:** página de click-to-chat do WhatsApp (lida pelo leitor automático, sem a URL exata registrada; conferir no site oficial). Não li regra sobre a edição do texto pelo cliente: a afirmação de que ele pode editar é inferência de uso, não citação.

**WhatsApp Business Cloud API (chat de atendimento):** janela de 24h de atendimento; a franquia de 1.000 mensagens de serviço por mês vale a partir de 01/10/2026 (ver `plataforma-marketing-automatizada.md`).

**LGPD e cookies (ANPD, guia orientativo sobre cookies):**
- Cookies podem identificar uma pessoa e são **dados pessoais**, segundo o próprio guia (texto lido no PDF oficial).
- **Cookie estritamente necessário:** não cabe consentimento, por ser essencial ao funcionamento. Base indicada: outras hipóteses, como o legítimo interesse.
- **Medição de audiência:** pode usar **legítimo interesse**, mas só em contexto específico: dado **agregado**, finalidade de identificar padrões e tendências, **sem combinar com outros rastreamentos e sem formar perfil de usuário**.
- **Publicidade:** o legítimo interesse dificilmente se sustenta. O caminho é **consentimento**, com opção de recusar, cookies não necessários desativados por padrão e revogação simples.
- Informação obrigatória: finalidade, período de retenção e forma do tratamento (art. 9 da LGPD).
- Fonte: guia orientativo da ANPD sobre cookies, PDF oficial em `gov.br/anpd`.

**Meta (Click-to-WhatsApp):** anúncio que abre conversa no WhatsApp gera uma janela gratuita de até 7 dias (ver doc de plataforma). **Não verifiquei** se a Meta envia a origem (ID do anúncio) no webhook. Antes de depender disso, ler a documentação.

**Chatwoot (caixa única):** licença MIT para o código fora de `enterprise/`; cobre WhatsApp, Instagram e Messenger. **Não consegui abrir a documentação do widget de site nem do SDK** (erro 502 e 404). A informação de que o widget de site identifica visitantes e aceita atributos está **não confirmada**.

---

## 3. Como unificar um contato

**Chave de identidade, em ordem de confiança:**
1. Telefone (WhatsApp, Telegram com número compartilhado).
2. E-mail.
3. ID do visitante (cookie ou armazenamento local do site, só com a base legal certa, ver seção 4).
4. Nome de usuário da rede (Instagram, X), quando não há telefone nem e-mail. Não é confiável sozinho.

**Regra de fusão:** quando o mesmo telefone ou e-mail aparece em dois canais, funde os registros. Quando o visitante anônimo do site fornece telefone ou e-mail no chat, liga o histórico anônimo ao contato identificado. Registrar a origem de cada toque (primeiro e último).

**Código de origem:** cada link leva um código curto, por exemplo `dum-ig-bio-nov`, na URL do site (`utm_source`, `utm_campaign`) e, no WhatsApp e no Telegram, no texto ou no payload.

| Canal | Como entra | Atribuição |
|---|---|---|
| Site | UTM na URL + chat no site | Alta |
| Telegram | `t.me/<bot>?start=<código>` | Alta (payload vai como `/start`) |
| WhatsApp (link) | `wa.me/...?text=<código>` | Média (cliente pode apagar o código) |
| Instagram | Link na bio para o site, com UTM | Média (o Instagram não passa a origem para o WhatsApp) |
| E-mail | Assinatura com link UTM | Alta |
| Anúncio Meta que abre WhatsApp | Anúncio em clique-para-WhatsApp | A verificar (origem no webhook) |

---

## 4. Rastrear sem cadastro: o que a lei permite

**O que é aceitável sem consentimento:** medição agregada e anônima (quantas visitas, de onde, quais páginas), sem cookie de rastreio e sem cruzar com outros dados. Isso é o Umami configurado sem cookies, com retenção definida. Cabe no legítimo interesse, segundo o guia da ANPD, desde que seja só agregado.

**O que pede consentimento:** identificar **uma pessoa** entre visitas (cookie de origem por visitante, perfil de navegação), e mandar dados para anúncio. Se o site usar um cookie que liga visitas de uma mesma pessoa, esse cookie precisa de consentimento, com banner que permita recusar.

**A saída para o atendimento:** quando a pessoa inicia um chat no site, a origem da conversa (de qual página ela veio) é necessária para responder o pedido dela. Essa parte pode ser tratada como essencial ao atendimento, com aviso claro na página. **Não tenho parecer jurídico sobre isso.** Antes de ativar, confirmar com advogado ou com a ANPD.

**Conclusão prática:** rastreio por pessoa só com consentimento. Medição agregada sem consentimento.

---

## 5. Recomendação

1. **Site como hub de medição e de conversa:** página de oferta, chat, formulário, todas com UTM. Umami para medição agregada, sem cookie.
2. **Caixa única:** Chatwoot self-hosted (MIT), com WhatsApp, Instagram e Messenger. Verificar se o widget de site e o Telegram entram na versão gratuita (não confirmado).
3. **Registro de contato:** o próprio Chatwoot ou o CRM (Twenty ou EspoCRM). Regra de fusão por telefone e e-mail.
4. **Links com código de origem** em todo lugar: bio, anúncio, assinatura de e-mail, QR code, post.
5. **Consentimento:** banner de cookies só se houver cookie de rastreio por pessoa. Sem isso, medição agregada.

**Alternativas que eu não pesquisei a fundo:** Tawk.to, Crisp e Tidio têm chat de site e planos gratuitos, mas são serviços hospedados, com dados na nuvem deles. Não avaliei custo, limites e conformidade. Pesquisar antes de escolher.

---

## 6. Lacunas

- Documentação do widget de site do Chatwoot e do SDK (erro ao abrir).
- Se a Meta envia a origem do anúncio Click-to-WhatsApp no webhook.
- Parecer jurídico sobre o chat com origem da página (seção 4).
- Limites e preços das alternativas hospedadas.
