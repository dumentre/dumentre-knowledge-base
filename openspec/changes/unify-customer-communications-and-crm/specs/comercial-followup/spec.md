## ADDED Requirements

### Requirement: Pessoa com vários negócios sem lead duplicado
O sistema MUST associar mensagens de contato conhecido ao negócio aberto existente, MUST NOT criar lead duplicado por padrão, SHALL pedir revisão humana quando o contato conhecido não tiver negócio aberto e MUST permitir que uma pessoa ou empresa tenha vários negócios por ação explícita.

#### Scenario: AT-02.1 Negócio aberto
- **GIVEN** uma pessoa com negócio aberto
- **WHEN** chega nova mensagem dela
- **THEN** a mensagem entra na conversa e nenhum negócio novo é criado

#### Scenario: AT-02.2 Mensagem atrasada
- **GIVEN** mensagens já processadas até uma data
- **WHEN** chega uma mensagem com horário anterior
- **THEN** o último contato recebido continua sendo o de maior horário

#### Scenario: AT-02.3 Negócio ganho ou perdido
- **GIVEN** uma pessoa cujo último negócio está ganho ou perdido
- **WHEN** ela escreve de novo
- **THEN** nenhum lead é criado automaticamente e surge a tarefa `revisar_novo_projeto`

#### Scenario: AT-02.4 Dois projetos
- **GIVEN** uma pessoa com um negócio
- **WHEN** o operador cria o segundo explicitamente
- **THEN** a ficha mostra dois negócios ligados à mesma pessoa

#### Scenario: AT-02.5 Concorrência
- **GIVEN** duas mensagens quase simultâneas de contato novo processadas por dois processadores
- **WHEN** ambos terminam
- **THEN** existe uma pessoa, um negócio automático e uma tarefa

#### Scenario: AT-02.6 Garantia no banco
- **GIVEN** qualquer caminho de criação de negócio automático
- **WHEN** um segundo negócio automático aberto é tentado para a mesma pessoa
- **THEN** o banco recusa por restrição única parcial

### Requirement: Follow-up com relógio injetável e política
O sistema SHALL agendar o follow-up em X dias no fuso configurado, MUST permitir relógio injetável nos testes, MUST aplicar a política configurada (cancelar, reagendar ou pedir revisão) quando o cliente responde em qualquer canal, MUST executar cada tarefa no máximo uma vez mesmo com execuções simultâneas e MUST separar tarefa interna de envio externo.

#### Scenario: AT-07.1 Fronteira de data
- **GIVEN** mensagem às 23:30 locais e X=3 dias às 09:00
- **WHEN** o relógio chega a 1 segundo antes e ao instante do vencimento
- **THEN** a tarefa não executa antes e executa no instante, calculada pelo dia local e não pelo dia em UTC

#### Scenario: AT-07.2 Execuções simultâneas
- **GIVEN** duas execuções simultâneas do agendador
- **WHEN** ambas veem a mesma tarefa vencida
- **THEN** somente uma a executa

#### Scenario: AT-07.3 Resposta em outro canal
- **GIVEN** um follow-up aberto criado por WhatsApp e a política `cancelar` para outro canal
- **WHEN** a pessoa responde pelo Instagram
- **THEN** o follow-up é cancelado com o motivo; com `reagendar` o prazo avança sem nunca recuar; com `revisar` a tarefa pede decisão

#### Scenario: AT-07.4 Etapa, ganho, perda, opt-out e pausa
- **GIVEN** um follow-up aberto
- **WHEN** o negócio muda de etapa, é ganho ou perdido, ou o contato pede para parar
- **THEN** o follow-up é cancelado, reagendado ou bloqueado conforme a política, e opt-out e pausa impedem qualquer envio

#### Scenario: AT-07.5 Alteração de prazo e reinício
- **GIVEN** uma tarefa agendada
- **WHEN** o prazo é alterado e o processo reinicia
- **THEN** a tarefa mantém o novo prazo e não duplica

#### Scenario: AT-07.6 Tarefa interna não envia
- **GIVEN** uma tarefa de follow-up vencida
- **WHEN** ela executa
- **THEN** o operador recebe o lembrete e nenhuma mensagem externa é enviada

### Requirement: Funil comercial na tela principal
O sistema SHALL permitir criar ou qualificar lead, associar empresa, criar oportunidade, alterar etapa, valor e responsável, registrar proposta e próxima ação, MUST validar campos, tratar concorrência e auditar cada alteração, e MUST oferecer essas operações dentro da tela principal do operador.

#### Scenario: AT-08.1 Operações essenciais
- **GIVEN** uma pessoa com conversa
- **WHEN** o operador qualifica, associa empresa e cria o negócio
- **THEN** o negócio aparece na ficha com etapa, valor e responsável

#### Scenario: AT-08.2 Proposta e próxima ação
- **GIVEN** um negócio aberto
- **WHEN** o operador registra uma proposta com versão, valor e validade e define a próxima ação
- **THEN** a proposta e a próxima ação ficam na ficha e geram a tarefa correspondente

#### Scenario: AT-08.3 Validação, concorrência e auditoria
- **GIVEN** dois operadores editando o mesmo negócio
- **WHEN** ambos salvam
- **THEN** o segundo recebe conflito de versão, campos inválidos são recusados e cada alteração registra autor, horário, valor anterior e novo

#### Scenario: AT-08.4 Dentro da tela principal
- **GIVEN** o operador na conversa do Chatwoot
- **WHEN** abre o painel embutido
- **THEN** executa as operações de AT-08.1 e AT-08.2 sem sair da conversa
