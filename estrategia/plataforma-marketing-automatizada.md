# Plataforma de marketing automatizada da Dumentre — pesquisa verificada e plano

**Data:** 13/11/2026. **Status:** pesquisa com fontes primárias e plano. Nada foi configurado, enviado, publicado nem pago.
**Restrição:** sem assinatura nova. Preferência por cota gratuita, open source e self-hosted no Hetzner.
**Como ler:** cada afirmação vem com a fonte oficial. O que não foi possível confirmar está em "Lacunas".

---

## 1. Estado atual (verificado nas pastas locais)

| Peça | Achado |
|---|---|
| `dumentre-website-v2/index.html` | Nenhum analytics, pixel da Meta, GTM ou UTM. Verificado por busca no arquivo. |
| Botões de contato | `wa.me/5511936217352` com texto fixo, sem identificador de origem. Um `mailto:` aponta para `simplificasoftwares@gmail.com`, não para o domínio da Dumentre. |
| Redes e anúncios | `estrategia/redes/posts` e `estrategia/anuncios/` com criativos prontos. Sem esteira de publicação nem de medição. |
| CRM | `dumentre-knowledge-base/estrategia/prospeccao/pipeline.csv` (21 linhas). |
| Prospecção | Lote 1 em rascunho (`lote-auto-1-2026-11-12.md`). Nada enviado. |

---

## 2. Fatos verificados em fonte oficial

### 2.1 Preço e regras do WhatsApp Business Platform
Fonte: [documentação de preços da Meta](https://developers.facebook.com/docs/whatsapp/pricing).

- **Cobrança por mensagem entregue**, não mais por conversa. Desde **1º/07/2025**. O modelo por conversa está descontinuado.
- Categorias: **marketing, utilidade e autenticação** (são mensagens de template, enviadas a qualquer momento). **Serviço** (resposta livre dentro da janela de atendimento de 24h, inclusive de agente humano ou IA de terceiros).
- **Serviço gratuito:** desde **01/11/2024**. Mas desde **01/10/2026**, serviço e utilidade dentro da janela passaram a ser cobráveis, com **franquia de 1.000 mensagens de serviço entregues por mês por número**, sem acumular. Sem forma de pagamento cadastrada, o envio pode ser bloqueado após a franquia. Entidades sem fins lucrativos elegíveis mantêm a gratuidade até 31/12/2027.
- **Janela de atendimento (24h):** abre quando o cliente escreve, e cada nova mensagem do cliente reinicia o prazo. Dentro dela, cabe mensagem livre. Fora dela, só template.
- **Clique-para-WhatsApp (anúncio):** abre uma janela gratuita de **até 7 dias** para qualquer tipo de mensagem (exceto as do Meta Business Agent).
- **Moeda:** desde **01/07/2026**, contas elegíveis podem operar em **BRL** e a fatura sai pela Facebook Brasil. Contas não migradas para BRL deixam de ter mensagens entregues a partir de **01/07/2027**.
- **Valor de referência para o Brasil:** utilidade e autenticação em torno de **0,68 centavo de dólar por mensagem** (texto da página oficial). **Não consegui abrir a tabela em BRL nem o preço de marketing em reais.** Ver lacunas.

### 2.2 Limite de envio iniciado pela empresa
Fonte: [limites de mensagens da Meta](https://developers.facebook.com/docs/whatsapp/messaging-limits).

- Portfólio novo começa com **250 números únicos por 24h** para mensagens iniciadas pela empresa fora da janela de 24h. O limite é **compartilhado por todos os números do portfólio**.
- Degraus: 250 → 2.000 → 10.000 → 100.000 → ilimitado.
- Para chegar a 2.000: verificar a empresa, ou enviar 2.000 mensagens entregues para números únicos em 30 dias com templates de alta qualidade. Depois, a Meta analisa a qualidade antes de aprovar.
- Se a qualidade cair, o limite não sobe. A página não descreve rebaixamento.

**Consequência prática:** disparo de campanha para muita gente, iniciado pela empresa, esbarra no limite de 250 por dia e exige template aprovado. Isso já é uma barreira técnica contra disparo em massa.

### 2.3 API Conversions (medição de servidor da Meta)
Fontes: [visão geral](https://developers.facebook.com/docs/marketing-api/conversions-api), [parâmetros de evento](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/server-event), [informações do cliente](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters).

- Envio por `POST` do servidor ao endpoint da Meta. Funciona **sem o pixel do navegador**, mas a página não afirma isso de forma explícita.
- **Deduplicação:** `event_id` do navegador precisa ser igual ao `event_id` do servidor. Eventos iguais enviados em até **48h** são contados uma vez; em caso de conflito dentro de ~5 minutos, prevalece o do navegador.
- **Hash SHA-256 obrigatório:** `em` (e-mail), `ph` (telefone), `fn`, `ln`, `ct`, `st`, `zp`, `country`. `external_id`: recomendado.
- **Nunca com hash:** `client_ip_address`, `client_user_agent`, `fbc`, `fbp`.
- `event_time` em Unix, até 7 dias antes do envio. Se um evento estiver fora desse prazo, a requisição inteira falha.

**Implicação de privacidade:** a CAPI manda ao Meta dados pessoais (e-mail, telefone hasheados, IP, navegador). Isso exige base legal e, para transferência internacional, uma das hipóteses do art. 33 da LGPD. Ver 2.4.

### 2.4 LGPD (Lei 13.709/2018)
Fonte: [texto no planalto.gov.br](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm).

- **Art. 7:** o tratamento só pode ocorrer em hipóteses listadas. Entre elas, **consentimento (I)** e **legítimo interesse (IX)**.
- **Art. 8:** consentimento por escrito ou outro meio que comprove a vontade do titular. O ônus da prova é do controlador (§2). **Autorizações genéricas são nulas** (§4).
- **Art. 10:** legítimo interesse só vale para **finalidades legítimas**, e só com os dados **estritamente necessários** (§1).
- **Art. 14:** dados de crianças exigem consentimento específico e destacado de um dos pais ou responsável. Relevante para qualquer coisa ligada ao Gael ou a outros menores.
- **Art. 18:** direitos do titular, incluindo acesso, correção, eliminação e revogação do consentimento.
- **Art. 20:** revisão humana de decisões tomadas somente por processamento automatizado.
- **Art. 33:** transferência internacional só em casos listados, como país com proteção adequada (I) ou **consentimento específico e em destaque** (VIII). Meta, Google e Chatwoot Cloud estão fora do Brasil.

**Lacuna:** não li os artigos 37 a 45 (relatório de impacto, segurança e sanções). Para decisão de contrato, ler antes.

### 2.5 Umami (medição)
Fontes: [instalação](https://docs.umami.is/docs/install), [FAQ](https://docs.umami.is/docs/faq), [repositório](https://github.com/umami-software/umami).

- **Licença MIT.**
- **Sem cookies:** "Umami's web tracker does not use cookies" (FAQ).
- **Coleta:** pageviews, URLs de origem, navegador, sistema operacional, tipo de dispositivo e **localização aproximada**.
- **Retenção:** em instalação self-hosted, os dados são mantidos **indefinidamente** até apagamento manual. Precisa de rotina de retenção para cumprir a LGPD.
- **Requisitos:** Node.js 20.19 ou superior, PostgreSQL 12.14 ou superior. Docker Compose disponível.
- **Atenção:** o primeiro login cria usuário `admin` com senha `umami`. Trocar antes de qualquer coisa. `APP_SECRET` é obrigatório.
- **Lacuna:** a FAQ não diz se o IP é descartado ou armazenado. Verificar no código-fonte antes de declarar conformidade.

### 2.6 Chatwoot (caixa de atendimento)
Fonte: [LICENSE no GitHub](https://github.com/chatwoot/chatwoot/blob/develop/LICENSE).

- Licença **MIT Expat** para o código fora de `enterprise/`.
- O diretório `enterprise/` tem licença própria (`enterprise/LICENSE`), **não lida**. Usar só o que estiver fora dele, ou ler o arquivo antes de ativar recursos pagos.

---

## 3. Lacunas (não confirmadas, não usar como fato)

1. **Preço de marketing em BRL** e tabelas por categoria. Os arquivos CSV e PDF são dinâmicos e não abriram. Caminho: `developers.facebook.com/docs/whatsapp/pricing#rate-cards`, baixar o CSV "BRL list rates" manualmente.
2. **Verificação de empresa na Meta:** documentos aceitos, prazo e restrições. As páginas de ajuda abriram só com o título. Caminho: abrir a central de ajuda no seu navegador logado.
3. **Migração de número do app comercial para a Cloud API:** se o app do celular deixa de funcionar. A documentação aponta para o "Embedded Signup", que não li.
4. **Retenção e IP no Umami:** precisa de leitura do código.
5. **LGPD, artigos 37 a 45**, e a base legal específica para CAPI e para medição por cookie de terceiros.

---

## 4. O que muda no plano por causa dos fatos

- **Atendimento por WhatsApp:** responder quem escreveu é gratuito dentro da janela de 24h, mas a franquia de 1.000 mensagens por mês vale a partir de outubro de 2026. Para volume maior, é preciso método de pagamento cadastrado.
- **Disparo para quem não escreveu:** limite de 250 por dia no portfólio novo. Com a regra "uma por vez, aprovada pelo Luan", o limite nem é o gargalo.
- **Anúncio que abre conversa:** a janela de 7 dias é gratuita. É o caminho mais barato para o WhatsApp em campanha paga, e precisa de anúncio aprovado.
- **Medição:** Umami cumpre o básico sem cookie, mas exige política de retenção. CAPI só depois de decidir a base legal.
- **Caixa única:** Chatwoot (MIT) cobre WhatsApp, Instagram e Messenger, com a ressalva do `enterprise/`.

---

## 5. Arquitetura proposta (sem mudança desde a versão anterior)

```
Visitante → site (Cloudflare Pages)
  ├─ Umami self-hosted (sem cookie; retenção definida)
  └─ botões com UTM → WhatsApp / e-mail
WhatsApp / Instagram / Messenger → Chatwoot self-hosted (MIT)
  └─ n8n ou Activepieces (regras, rascunhos, lembretes; aprovação humana para envio)
CRM self-hosted (Twenty ou EspoCRM) ← pipeline.csv
Painel semanal no canal Dumentre (MeuBot)
```

**Hospedagem:** Hetzner. Umami precisa de Node 20.19+ e PostgreSQL 12.14+, ou Docker Compose. No Windows, sem Docker.

---

## 6. Fase 0 (antes da campanha), sem depender de verificação

- [ ] UTM nos botões do site e código de origem em cada `wa.me`. Custo zero.
- [ ] Trocar o `mailto:` por endereço `@dumentre.com` depois do DUM-07.
- [ ] Instalar Umami no Hetzner, trocar a senha `admin`, definir retenção.
- [ ] Antes de qualquer teste com CAPI: decidir base legal e texto de consentimento.

**Não dá para ficar pronto amanhã:** verificação da empresa na Meta (prazo não confirmado), API oficial do WhatsApp em produção e CAPI.

---

## 7. Decisões do Luan

1. Campanha de amanhã: orgânica, ou com anúncio em clique-para-WhatsApp (janela gratuita de 7 dias)? Com teto diário.
2. Número do WhatsApp: migrar para a API oficial (risco de desconectar o app do celular) ou usar outro número?
3. Hospedagem: Docker no Hetzner ou instalação direta?
4. Plataforma de fluxo: n8n (uso interno) ou Activepieces (MIT, se for revender)?
5. Ok para a fase 0 (UTM e Umami).
