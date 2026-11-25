## ADDED Requirements

### Requirement: Identidade verificável entre canais
O sistema MUST ligar identidades de canais diferentes à mesma pessoa somente com evidência verificável ou confirmação humana registrada com autor, MUST NOT usar nome, avatar ou similaridade textual como evidência e SHALL permitir reverter um vínculo sem apagar histórico nem misturar negócios.

#### Scenario: AT-05.1 Vínculo com evidência
- **GIVEN** uma identidade de WhatsApp e outra de Instagram sem vínculo
- **WHEN** o operador vincula o Instagram ao WhatsApp informando evidência e autor
- **THEN** as duas identidades pertencem à mesma pessoa e o vínculo fica auditado; sem evidência o vínculo é recusado

#### Scenario: AT-05.3 Reversão
- **GIVEN** um vínculo manual ativo
- **WHEN** o operador o reverte informando o motivo
- **THEN** a identidade volta à pessoa de origem, todas as mensagens permanecem e os negócios não mudam de dono

#### Scenario: AT-05.4 Vínculo entre pessoas com negócio aberto
- **GIVEN** duas pessoas, cada uma com negócio aberto
- **WHEN** uma identidade é vinculada à outra pessoa
- **THEN** os negócios não são fundidos e surge uma tarefa de revisão de duplicados

#### Scenario: AT-05.5 Casos de risco de identidade
- **GIVEN** homônimos, número compartilhado, e-mail reutilizado, contas comerciais distintas ou várias pessoas na mesma empresa
- **WHEN** eventos chegam desses contatos
- **THEN** nenhuma fusão automática ocorre e a decisão fica com o operador, com a conta comercial como parte da chave

### Requirement: Ficha unificada pesquisável
O sistema SHALL apresentar, para cada pessoa, os canais, as conversas em ordem, o último contato recebido com canal e horário corretos e as oportunidades, e MUST permitir localizar a pessoa por nome ou por identificador disponível.

#### Scenario: AT-05.2 Ficha com vários canais
- **GIVEN** uma pessoa com WhatsApp, Instagram e e-mail vinculados
- **WHEN** o operador abre a ficha
- **THEN** vê todas as conversas em ordem cronológica, o canal e o horário da última mensagem recebida e as oportunidades correspondentes

#### Scenario: AT-05.6 Busca
- **GIVEN** pessoas cadastradas por vários canais
- **WHEN** o operador busca por nome, telefone, usuário de rede ou e-mail
- **THEN** a pessoa é encontrada e a ficha abre, sem expor registros de outra conta comercial
