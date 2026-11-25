## ADDED Requirements

### Requirement: Política única de envio, permissões e custos
O sistema MUST aplicar a mesma função de política a qualquer envio originado pela interface, por jobs, pela API ou por MCP, MUST recusar envio sem autorização explícita, acima do orçamento local ou em canal sem resposta, MUST manter desativadas as operações de custo desconhecido ou cobráveis sem orçamento e SHALL registrar logs sem conteúdo de cliente nem segredos.

#### Scenario: AT-12.1 Recusas da política
- **GIVEN** um envio sem autorização, outro acima do orçamento mensal e outro em canal sem resposta
- **WHEN** cada um é solicitado pela interface, por um job ou pela API
- **THEN** os três são recusados com motivo e nenhuma chamada ao provedor é feita

#### Scenario: AT-12.2 Logs sem dados sensíveis
- **GIVEN** mensagens com texto de cliente e chamadas com credenciais
- **WHEN** logs e métricas são produzidos
- **THEN** não contêm corpo de mensagem, tokens nem segredos

#### Scenario: AT-12.3 Isolamento e papéis
- **GIVEN** duas contas comerciais e usuários com papéis admin, operador e leitura
- **WHEN** um usuário tenta ver ou alterar dados de outra conta ou além do seu papel
- **THEN** o acesso é negado e a tentativa fica registrada

#### Scenario: AT-12.4 Operação cobrável sem orçamento
- **GIVEN** templates, Meta Business Agent e broadcast desativados por padrão
- **WHEN** alguém tenta usá-los sem orçamento aprovado, inclusive em teste automatizado com resposta simulada do provedor
- **THEN** a operação é recusada e nenhuma chamada paga é feita

#### Scenario: AT-12.5 Retenção, exportação e exclusão
- **GIVEN** o pedido de exportar ou excluir os dados de uma pessoa
- **WHEN** a operação é executada
- **THEN** a exportação traz ficha, vínculos, mensagens e anexos disponíveis, e a exclusão remove o conteúdo preservando apenas a auditoria mínima

### Requirement: Backfill, exportação, restauração e corte seguros
O sistema MUST importar somente o que cada provedor expõe e registrar a proveniência, MUST reimportar sem duplicar, MUST restaurar backup em ambiente de teste preservando IDs e relações antes de receber dados reais e SHALL planejar corte e rollback do webhook e do número sem perder evento nem duplicar resposta.

#### Scenario: AT-11.1 Backfill com proveniência
- **GIVEN** um provedor que expõe histórico parcial
- **WHEN** o backfill roda
- **THEN** somente o exposto é importado, marcado com a origem `backfill`, e o relatório lista o que o provedor não entrega

#### Scenario: AT-11.2 Reimportação
- **GIVEN** um backfill já executado
- **WHEN** ele roda de novo
- **THEN** nenhuma mensagem é duplicada

#### Scenario: AT-11.3 Exportação
- **GIVEN** uma ficha com mensagens, vínculos e anexos
- **WHEN** a exportação é gerada
- **THEN** contém ficha, vínculos, mensagens e anexos disponíveis, com manifesto de ids

#### Scenario: AT-11.4 Restauração
- **GIVEN** um backup do núcleo e do Chatwoot
- **WHEN** ele é restaurado em ambiente isolado
- **THEN** as contagens e os relacionamentos (pessoas, identidades, vínculos, mensagens, negócios) coincidem com a origem e o acesso não autorizado é recusado

#### Scenario: AT-11.5 Corte e rollback
- **GIVEN** o webhook atual em produção e a borda nova em sombra
- **WHEN** o override do callback do número é trocado e depois revertido
- **THEN** nenhum evento é perdido, nenhuma resposta é duplicada e a configuração anterior é restaurada
