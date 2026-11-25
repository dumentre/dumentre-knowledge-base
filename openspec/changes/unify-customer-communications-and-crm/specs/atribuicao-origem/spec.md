## ADDED Requirements

### Requirement: Atribuição rastreável por superfície
O sistema MUST preservar o payload bruto de origem, MUST normalizar apenas campos presentes e válidos, MUST marcar como `sem_atribuicao` quando não houver dado individual e MUST distinguir origem verificada (campo do provedor) de origem declarada (texto editável pelo cliente, como UTM no `wa.me`).

#### Scenario: AT-03.1 Click-to-WhatsApp
- **GIVEN** uma mensagem de WhatsApp com `referral` contendo `source_id`, `source_url`, `headline` e `ctwa_clid`
- **WHEN** o evento é processado
- **THEN** o bruto fica intacto e o anúncio (`ad_id`) e o `ctwa_clid` ficam normalizados na ficha com status `verificada`

#### Scenario: AT-03.2 Click-to-Instagram-Direct
- **GIVEN** uma DM do Instagram com `referral` (`ad_id`, `ref`, `source=ADS`)
- **WHEN** o evento é processado pela borda
- **THEN** a atribuição é registrada mesmo que o Chatwoot não a preserve

#### Scenario: AT-03.3 Messenger
- **GIVEN** um evento do Messenger com `referral` (`ad_id` ou `ref` de `SHORTLINK`)
- **WHEN** é processado
- **THEN** o `ad_id` ou o `ref` é registrado com a origem `ADS` ou `SHORTLINK`

#### Scenario: AT-03.4 Lead Ads
- **GIVEN** um webhook `leadgen` com `leadgen_id`, `form_id` e `ad_id`
- **WHEN** o sistema tem a permissão `leads_retrieval`
- **THEN** os dados do lead são lidos pela API e ligados ao `ad_id`; sem a permissão o evento é guardado como `pendente_de_enriquecimento` sem dado pessoal inventado

#### Scenario: AT-03.5 Site com UTM
- **GIVEN** um clique no site com `utm_*` anexado ao texto do `wa.me`
- **WHEN** a primeira mensagem chega com o código de origem
- **THEN** a origem é registrada como `declarada`; se o cliente apagou o texto, fica `sem_atribuicao`

#### Scenario: AT-03.6 Sem evidência individual
- **GIVEN** um contato sem `referral` nem UTM
- **WHEN** o evento é processado
- **THEN** a ficha mostra `sem_atribuicao` e nenhuma origem é inferida

#### Scenario: AT-03.7 Evidência inválida ou conflitante
- **GIVEN** um `referral` com `source_id` não textual ou dois anúncios conflitantes
- **WHEN** é processado
- **THEN** o bruto é guardado, o status é `evidencia_invalida` e nenhuma origem é atribuída

#### Scenario: AT-03.8 Anúncio removido ou enriquecimento negado
- **GIVEN** um `ad_id` cujo anúncio foi removido ou cuja consulta à Marketing API foi negada
- **WHEN** o enriquecimento é tentado
- **THEN** o `ad_id` é mantido e campanha, conjunto e criativo ficam `desconhecidos`

### Requirement: Toques e regras auditáveis
O sistema SHALL calcular primeiro e último toque separadamente por ordem do horário do evento, SHALL acionar ações comerciais apenas por regras determinísticas configuráveis sobre metadados verificados e MUST NOT reescrever o evento bruto quando uma etiqueta comercial mudar.

#### Scenario: AT-03.9 Primeiro e último toque
- **GIVEN** uma pessoa com dois anúncios em datas diferentes
- **WHEN** a ficha é consultada
- **THEN** o primeiro toque é o anúncio mais antigo e o último toque o mais recente, e renomear a campanha não altera o `origin_raw`

#### Scenario: AT-03.10 Ação comercial por regra
- **GIVEN** uma regra ativa "origem verificada de anúncio X define etiqueta e responsável"
- **WHEN** chega um evento que satisfaz a regra
- **THEN** a ação é aplicada e o registro mostra qual regra e qual versão dispararam
