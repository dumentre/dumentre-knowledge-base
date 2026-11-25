## ADDED Requirements

### Requirement: Recepção e resposta por canal com capacidades explícitas
O sistema SHALL receber e responder pelo canal de origem preservando as diferenças reais de cada canal, MUST declarar por canal as capacidades `receive`, `reply`, `status` e `attachments` e MUST negar e exibir ao operador qualquer capacidade não declarada.

#### Scenario: AT-04.1 WhatsApp
- **GIVEN** uma conversa de WhatsApp com janela de 24 horas aberta
- **WHEN** o operador responde
- **THEN** a mensagem sai pelo mesmo canal e aparece na conversa; fora da janela só é permitido template aprovado e, sem orçamento autorizado, o envio é recusado

#### Scenario: AT-04.2 Instagram Direct, comentários e menções
- **GIVEN** a conta Instagram com permissões concedidas
- **WHEN** chegam DM, comentário e menção
- **THEN** a DM entra na conversa; comentário e menção são registrados como capacidades distintas, nunca misturados à DM

#### Scenario: AT-04.3 Messenger
- **GIVEN** a Página com webhook inscrito
- **WHEN** chega e é respondida uma mensagem do Messenger
- **THEN** entrada e resposta aparecem na mesma conversa, respeitando janela e limites do canal

#### Scenario: AT-04.4 E-mail
- **GIVEN** um endereço de e-mail do domínio
- **WHEN** chega e é respondido um e-mail com cadeia de respostas
- **THEN** a resposta mantém o encadeamento (threading) e o alias usado; mensagens enviadas fora da caixa só aparecem se o provedor as expuser

#### Scenario: AT-04.5 Chat do site e Telegram
- **GIVEN** o chat do site e um bot do Telegram ativos
- **WHEN** o contato escreve primeiro (no Telegram, após `/start`)
- **THEN** a mensagem entra na ficha e a resposta respeita os limites de taxa da Bot API

#### Scenario: AT-04.6 TikTok
- **GIVEN** a API do TikTok sem aprovação ou fora da região
- **WHEN** o canal é consultado
- **THEN** o canal permanece `desativado` com o motivo explícito; com aprovação, não há envio após 48 horas da última mensagem recebida

#### Scenario: AT-04.7 Mídia expirada, tipo desconhecido e falta de permissão
- **GIVEN** mídia expirada, tipo `unsupported` ou permissão negada
- **WHEN** o evento ou o envio é processado
- **THEN** o estado é registrado e mostrado ao operador, sem exceção não tratada

#### Scenario: AT-04.8 Mensagem enviada pelo app original
- **GIVEN** um número em coexistência (ou conta Instagram com ecos)
- **WHEN** o operador responde pelo aplicativo original
- **THEN** o eco entra na conversa como mensagem de saída, sem duplicar o que o sistema enviou

### Requirement: Envio, eco e status consistentes
O sistema MUST mostrar a resposta enviada na mesma conversa, MUST aplicar status de entrega sem rebaixar um estado final por evento antigo ou fora de ordem e MUST marcar como `incerto` e NOT reenviar um envio cujo resultado remoto não pôde ser confirmado.

#### Scenario: AT-06.1 Resposta, eco e duplicata
- **GIVEN** uma resposta enviada pela interface
- **WHEN** chegam o eco e o status do provedor
- **THEN** existe uma única mensagem de saída na conversa

#### Scenario: AT-06.2 Status fora de ordem
- **GIVEN** uma mensagem enviada
- **WHEN** chegam `read`, depois `delivered` e depois `failed`
- **THEN** o estado final é `read`

#### Scenario: AT-06.3 Timeout ambíguo
- **GIVEN** um envio que terminou em timeout depois de possível aceitação remota
- **WHEN** o operador ou um job tenta enviar de novo com a mesma chave de idempotência
- **THEN** o estado permanece `incerto`, o provedor não é chamado de novo e a interface mostra a incerteza

#### Scenario: AT-06.4 Erro definitivo
- **GIVEN** um status `failed` com código do provedor
- **WHEN** o evento é processado
- **THEN** o operador vê o erro e o motivo, e a mensagem não é reenviada automaticamente

### Requirement: Novo canal sem alterar o núcleo
O sistema SHALL permitir adicionar um canal por um adaptador que traduz o payload do provedor em eventos normalizados, MUST aplicar ao novo canal as mesmas regras de identidade, política de envio, auditoria e monitoramento e MUST manter desativado um canal sem aprovação ou com custo pendente.

#### Scenario: AT-14.1 Adaptador de teste
- **GIVEN** um adaptador de teste com fixture própria
- **WHEN** um evento do novo canal chega
- **THEN** o núcleo recebe, correlaciona, exibe a interação na ficha e aplica as políticas sem alteração do código do núcleo

#### Scenario: AT-14.2 Capacidades não oferecidas
- **GIVEN** um canal sem opção de resposta
- **WHEN** o operador tenta responder
- **THEN** o envio é recusado com o motivo "sem resposta" e a ficha mostra a capacidade como indisponível

#### Scenario: AT-14.3 Canal sem aprovação ou com custo pendente
- **GIVEN** um canal sem aprovação do provedor ou com custo desconhecido
- **WHEN** o canal é configurado
- **THEN** permanece `desativado` por padrão até autorização explícita do administrador
