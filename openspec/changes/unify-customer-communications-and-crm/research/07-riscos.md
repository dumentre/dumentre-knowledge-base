# 07. Registro de riscos

Probabilidade (P) e impacto (I): A alta, M média, B baixa. "Prova planejada" aponta a tarefa em `tasks.md`. Itens marcados **confirmado** foram observados em código ou execução nesta sessão.

| ID | Risco | P | I | Evidência | Mitigação / prova planejada |
|---|---|---|---|---|---|
| R-01 | **Chatwoot não cabe no VPS** (RAM disponível 3,0 GiB, sem swap; doc exige 4 GB mínimo, Sidekiq 1 GB+). OOM pode derrubar OpenBao/NetBird | A | A | medido + doc | Portão G-CAP (F2.1), limites por container, swap, contingências C1/C2 (`03`) |
| R-02 | Webhook atual descarta silenciosamente mensagens de usuário só com BSUID e responde 200 (a Meta **não** retenta) | A | A | **confirmado** P0 C5 | Corrigir primeiro (tarefa F1.1, TDD); alarme "mensagens recebidas ≠ gravadas" |
| R-03 | **Webhook de saída do Chatwoot não retenta** → perda de evento para o núcleo/CRM | A | M | **confirmado** em código | Borda grava o bruto antes; reconciliação por API do Chatwoot; teste AT-10.5 |
| R-04 | Payload > 256 KB rejeitado (413); a Meta permite 3 MB e retenta por 7 dias | M | M | **confirmado** P0 C8 + doc | F1.1: limite 3 MB + teste |
| R-05 | Dupla responsabilidade pelo callback (Chatwoot e webhook atual) → evento recebido por um só, ou envio duplicado | A | A | doc (um callback por app) | Borda única + repasse; override por número no teste; plano de corte (AT-11.5) |
| R-06 | Repasse ao Chatwoot com assinatura original recusado (segredo diferente) | M | M | cod: Chatwoot valida `X-Hub-Signature-256` | Mesmo app Meta e mesmo segredo configurado; teste I em F2.3; alternativa: re-assinar com segredo do canal |
| R-07 | Atribuição de Instagram/Messenger perdida pelo Chatwoot | A | M | **confirmado** em código | Borda guarda `referral` bruto; Chatwoot só mostra |
| R-08 | Franquia/custo do WhatsApp mal entendidos; **sem método de pagamento a Meta para de entregar**; sem teto imposto pelo fornecedor | A | M | doc | `05`: teto local + reconciliação com `pricing.billable`; decisão D5; fatura mensal |
| R-09 | Mensagens do número comercial perdidas/duplicadas na troca de webhook | M | A | doc override + prática | Corte com override por número, janela de replay (7 dias de retry da Meta), rollback documentado |
| R-10 | Coexistência: histórico limitado a 6 meses; mensagens temporárias desligam; grupos não sincronizam; elegibilidade desconhecida | M | M | doc | Tratar histórico como "o que o provedor expõe" (AT-11.1); não prometer importação integral |
| R-11 | Identidade errada (juntar pessoas diferentes) | M | A | desenho | Só evidência/confirmação humana; reversão sem perda (P1 t5); revisão de duplicados |
| R-12 | BSUID/usernames: identificar só por telefone quebra | A | A | doc | Chave por BSUID + alias de telefone (P1 t4); Chatwoot tem suporte (cod) |
| R-13 | Estado financeiro incorreto (duplicidade, parcial, estorno, fora de ordem) | M | A | desenho | Centavos inteiros, idempotência por `(gateway,id)`, testes de propriedade (F5) |
| R-14 | Emissão de NFS-e prometida sem emissor integrado; SP em transição para o emissor nacional | A | M | S (WebSearch) | AT-09.4: UI nunca diz "emitida" sem protocolo; decisão D8; fase separada |
| R-15 | Módulo pago escondido (Chatwoot `enterprise/`, Twenty, EspoCRM Advanced Pack) | M | M | P+S | Instalar só Community; checar licença por recurso (F2.2); contingência C2 só após leitura da licença da versão |
| R-16 | TikTok exige aprovação e é restrito por região; sem evidência para o Brasil | A | B | S | Extensão condicional; não bloqueia nada |
| R-17 | IA obedecendo texto do cliente; invenção de preço/prazo | M | A | desenho + P2 | Portão em código (P2); IA sem superfície de envio/vínculo/cobrança; evals reais pendentes |
| R-18 | Dado pessoal em logs/backup/retenção (LGPD) | M | A | desenho | Logs sem corpo (P1 t11), retenção do bruto 90 dias (D4), exclusão por pessoa (AT-12.5); parecer jurídico pendente |
| R-19 | Manutenção do Chatwoot (atualizações frequentes, Ruby 3.4/Node 24) e do núcleo | M | M | doc | Versão fixada; snapshot antes de atualizar; ensaio de restauração; janela mensal |
| R-20 | Backup inexistente hoje; sem restauração testada | A | A | inventário | Portão: nenhum dado real antes de AT-11.4 |
| R-21 | SQLite como banco do núcleo (um escritor) | B | M | P1 (8 processos OK) | Aceito para F1–F3; revisar ao ter vários operadores simultâneos ou >10 mil eventos/dia |
| R-22 | O protótipo P1 prova lógica, não integração com Chatwoot/Meta | A | M | por construção | Marcado como `executado-mock`; nada `aprovado` sem S/I real |
| R-23 | Teste de integração desta pesquisa não pôde instalar Chatwoot (sem Docker local, servidor proibido) | A | M | restrição | Primeira tarefa de F2 e portão G-CAP |
| R-24 | Dois responsáveis por follow-up (Chatwoot automações + núcleo) | M | M | desenho | Núcleo é o único dono de follow-up; automações do Chatwoot desligadas |
| R-25 | Janela de 24 h calculada com data do chamador (relato 19/11) | M | M | relato | Derivar `last_inbound_at` do núcleo, nunca do chamador; teste de fronteira |
