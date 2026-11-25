## ADDED Requirements

### Requirement: Registro financeiro ligado ao negócio
O sistema SHALL ligar cada cobrança a exatamente um negócio, MUST representar valores em inteiros da menor unidade da moeda com a moeda explícita, MUST derivar o saldo em aberto das cobranças, pagamentos e estornos e SHALL permitir várias cobranças para o mesmo negócio.

#### Scenario: AT-09.1 Negócio ganho e duas cobranças
- **GIVEN** um negócio ganho
- **WHEN** duas cobranças são registradas para ele
- **THEN** as duas ficam ligadas ao negócio correto e a ficha mostra emitido, pago, vencido e em aberto

#### Scenario: AT-09.2 Decimal, moeda, parcial e estorno
- **GIVEN** uma cobrança de R$ 1.234,56
- **WHEN** ocorrem um pagamento parcial e um estorno
- **THEN** os valores são exatos (123456 centavos), o saldo em aberto reflete os dois eventos e uma moeda diferente é recusada para a mesma cobrança

### Requirement: Eventos de gateway idempotentes e conciliados
O sistema MUST processar eventos de gateway de forma idempotente por `(gateway, id externo)`, MUST convergir para o mesmo estado final mesmo com eventos fora de ordem e SHALL conciliar diariamente o livro interno com o gateway.

#### Scenario: AT-09.3 Idempotência, ordem e conciliação
- **GIVEN** o mesmo evento de pagamento entregue duas vezes e um evento de estorno que chega antes do pagamento
- **WHEN** os eventos são processados
- **THEN** há um único pagamento, o estado final é consistente e a conciliação aponta divergências sem corrigi-las sozinha

### Requirement: Fronteira entre registro interno, gateway e NFS-e
O sistema MUST distinguir registro interno, cobrança emitida no gateway e NFS-e, e MUST NOT apresentar nota fiscal como emitida sem o protocolo do emissor fiscal.

#### Scenario: AT-09.4 Nota fiscal
- **GIVEN** uma cobrança paga sem protocolo de NFS-e
- **WHEN** o operador consulta a ficha
- **THEN** a interface mostra "NFS-e não emitida" e nenhuma invoice interna é tratada como nota fiscal
