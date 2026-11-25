# CRM e atendimento unificado da Dumentre

## Plano
Implantar por etapas uma caixa de atendimento multicanal com cadastro de contatos e avaliar CRM comercial dedicado. Priorizar WhatsApp oficial, Instagram e Messenger; inventariar e-mail, site e demais canais antes de integrá-los. Chatwoot Community é candidato para piloto, não escolha validada. Preservar webhook existente e priorizar teste isolado antes de mudança em contas reais. Meta Business Agent é opção posterior, não dependência.

## Saída esperada (aceite)
- Inventário verificável dos canais oficiais, contas e permissões, distinguindo confirmado e não verificado.
- Caixa de atendimento acessível por conta autorizada com contatos e histórico; cada canal declarado ativo tem teste ponta a ponta de entrada e resposta autorizada, com evidência e sem mensagens duplicadas.
- Mesmo contato em canais diferentes pode ser vinculado de forma segura, com histórico e origem preservados, sem fusão por nome.
- Cadastro de oportunidade, responsável e próxima ação disponível em CRM adequado ou limitação explicitamente registrada.
- WhatsApp usa API oficial e não interrompe operação existente; teste de recuperação demonstrado.
- Controle de acesso, retenção, backup e restauração testados antes de dados reais; custos e limites confirmados antes de uso pago.

## Como testar
Testar com contas e dados de teste, registrando IDs e horários sem conteúdo privado. Cobrir cada canal com entrada, resposta autorizada, histórico, anexos quando suportados, duplicação, falhas e transferência humana. Testar backup e restauração em ambiente isolado, controle de acesso e rollback de integração. Validar OpenSpec estritamente antes e depois.

## Segurança (segredos, portões)
Nenhum segredo em arquivo versionado ou log; usar Bitwarden. Não solicitar dados de cliente nem imprimir conteúdo de mensagens. Não criar recursos externos, publicar, alterar segurança, contratar, gastar, enviar mensagens ou escrever em banco de produção sem aprovação específica por operação. Não migrar número, trocar webhook ou habilitar agente Meta sem análise de impacto, backup e portão aplicável. Não usar WSL ou Docker no PC.

## Backup/rollback
Preservar arquivos preexistentes e alterações alheias. Fazer backup com timestamp antes de editar configuração. Antes de integrar produção, salvar configuração anterior e comprovar restauração em ambiente isolado. Rollback deve restabelecer roteamento anterior sem apagar dados ou recursos alheios sem aprovação.

## Versionamento
Trabalho no repositório apropriado, com CHANGELOG, commit local sem coautoria ou menção de IA e tag com horário BRT. Não incluir alterações preexistentes no commit. Não realizar push em main, merge ou publicação sem aprovação. Registrar resultados e pendências na KB; arquivar a change somente depois dos cenários e testes cumpridos.
