## ADDED Requirements

### Requirement: Recepção durável e validada de eventos
O sistema MUST validar a assinatura de cada evento de provedor antes de qualquer interpretação, MUST persistir o payload bruto e os eventos normalizados antes de responder sucesso ao provedor e SHALL aceitar payloads até o limite documentado pelo provedor (3 MB para a Meta).

#### Scenario: AT-01.1 Primeiro WhatsApp cria registros
- **GIVEN** nenhuma pessoa, mensagem ou negócio para o remetente
- **WHEN** chega um evento `messages` assinado de um remetente novo
- **THEN** existem exatamente 1 mensagem, 1 pessoa, 1 oportunidade automática e 1 tarefa de follow-up na data da política, e a ficha mostra os quatro

#### Scenario: AT-01.2 Reinício preserva o resultado
- **GIVEN** o evento de AT-01.1 já processado
- **WHEN** o processo do núcleo é reiniciado
- **THEN** as mesmas contagens existem e nenhum dado é recriado

#### Scenario: AT-01.3 Reentrega em série e em paralelo
- **GIVEN** o mesmo payload entregue 3 vezes em série e por 8 processos simultâneos
- **WHEN** todos terminam
- **THEN** o resultado final é 1 evento, 1 mensagem, 1 oportunidade e 1 tarefa, e todas as entregas receberam sucesso

#### Scenario: AT-01.4 Usuário só com BSUID
- **GIVEN** um evento sem `from` e sem `wa_id`, apenas com `user_id`
- **WHEN** o evento é processado e, depois, outro evento traz o telefone junto do mesmo `user_id`
- **THEN** a mensagem é aceita e todos os eventos pertencem à mesma identidade e à mesma pessoa

#### Scenario: AT-01.5 Assinatura inválida
- **GIVEN** um corpo adulterado ou sem cabeçalho de assinatura
- **WHEN** o evento é enviado
- **THEN** o sistema responde 401 e nada é gravado

#### Scenario: AT-01.6 Recepção não envia nada
- **GIVEN** qualquer evento válido de entrada
- **WHEN** ele é recebido e processado
- **THEN** nenhuma mensagem externa é enviada

#### Scenario: AT-01.7 Payload grande
- **GIVEN** um evento válido de 300 KB (e até 3 MB)
- **WHEN** é recebido
- **THEN** é aceito e processado, sem resposta 413

#### Scenario: AT-01.8 Retenção e reprocessamento do bruto
- **GIVEN** eventos já recebidos
- **WHEN** um reprocessamento é pedido ou o prazo de retenção vence
- **THEN** o reprocessamento reproduz o mesmo resultado a partir do bruto e, vencido o prazo, o bruto é reduzido a metadados sem apagar mensagens nem vínculos

#### Scenario: AT-01.9 Áudio e mídia
- **GIVEN** uma mensagem de áudio com id de mídia
- **WHEN** o evento é processado
- **THEN** o tipo e o id da mídia ficam registrados e o arquivo é baixado antes da expiração; se a mídia expirar, o estado "mídia expirada" fica visível

### Requirement: Processamento idempotente e recuperação de falhas
O sistema MUST processar cada evento com efeito final idêntico independentemente de reentrega, concorrência ou reinício, MUST preservar eventos aceitos quando um destino (Chatwoot ou CRM) estiver indisponível e SHALL entregar a cada destino exatamente uma vez por evento por meio de fila de saída com recuo exponencial.

#### Scenario: AT-10.1 Destino indisponível
- **GIVEN** o destino indisponível
- **WHEN** eventos são aceitos e processados
- **THEN** mensagens e vínculos são gravados, a fila de saída acumula, tentativas respeitam o recuo, e após reinício com o destino de volta cada evento é entregue uma única vez

#### Scenario: AT-10.2 Falha entre persistir e responder
- **GIVEN** o evento persistido mas o provedor sem confirmação
- **WHEN** o provedor reentrega o evento
- **THEN** nenhuma duplicata é criada

#### Scenario: AT-10.3 Credencial expirada e limite do provedor
- **GIVEN** uma credencial expirada ou resposta de limite de taxa do provedor
- **WHEN** um envio ou consulta falha
- **THEN** o sistema emite alerta, não perde o trabalho pendente e retoma quando a condição passa

#### Scenario: AT-10.4 Falha permanente visível
- **GIVEN** um evento que falha em todas as tentativas
- **WHEN** o limite de tentativas é atingido
- **THEN** o evento fica em estado `failed`, visível ao operador e reprocessável, sem bloquear os demais

#### Scenario: AT-10.5 Webhook de saída do Chatwoot sem retry
- **GIVEN** o receptor do núcleo indisponível quando o Chatwoot emite um webhook
- **WHEN** o receptor volta
- **THEN** a reconciliação por API do Chatwoot detecta a mensagem faltante e a registra sem duplicar
