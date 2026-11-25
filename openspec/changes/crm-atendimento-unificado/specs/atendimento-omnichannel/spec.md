## Purpose
Consolidar contatos e conversas dos canais oficiais da Dumentre em atendimento rastreável.

## ADDED Requirements

### Requirement: Atendimento por canal
O sistema MUST registrar e apresentar entrada e resposta autorizada de cada canal declarado ativo, identificando origem, data e contato.

#### Scenario: Interação em canal integrado
- **WHEN** uma mensagem de teste chega por canal declarado ativo e uma resposta é autorizada
- **THEN** a conversa apresenta ambas as mensagens, origem e horário, sem duplicidade

### Requirement: Histórico e identidade
O sistema SHALL preservar histórico por contato e vincular identidades somente com evidência suficiente, sem fusão automática por nome.

#### Scenario: Contato em canais diferentes
- **WHEN** identidades de teste são vinculadas com critério confiável
- **THEN** as conversas permanecem identificáveis por canal e acessíveis no registro do contato

### Requirement: Continuidade do WhatsApp
A integração SHALL usar API oficial e preservar o funcionamento existente durante testes e rollback.

#### Scenario: Falha ou rollback da integração
- **WHEN** o teste isolado da integração falha ou é revertido
- **THEN** a configuração anterior permanece recuperável e o fluxo anterior é verificado

### Requirement: Proteção e recuperação
O sistema MUST restringir acesso, preservar segredos e permitir restauração testada antes de receber dados reais.

#### Scenario: Recuperação isolada
- **WHEN** um backup de teste é restaurado em ambiente isolado
- **THEN** os dados sintéticos e o histórico de teste são recuperados e acesso não autorizado é recusado

### Requirement: Funil comercial
O sistema SHALL permitir acompanhar oportunidades por responsável e próxima ação, ou registrar explicitamente que essa capacidade permanece pendente.

#### Scenario: Oportunidade de teste
- **WHEN** uma oportunidade sintética é registrada e consultada
- **THEN** responsável e próxima ação são recuperáveis ou a limitação é documentada como pendência
