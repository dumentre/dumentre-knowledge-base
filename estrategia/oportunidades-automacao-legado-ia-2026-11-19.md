# Oportunidades para a Dumentre — automação, sistemas existentes e IA

**Data:** 19/11/2026  
**Status:** estudo e hipóteses comerciais; demanda e disposição a pagar ainda não validadas. Nenhuma oferta foi aprovada, publicada ou enviada.

## Origem e transcrição

Vídeo [VAI FALTAR PROGRAMADOR, ELES DISSERAM — mano deyvin](https://youtu.be/vMGhULMNwyg), publicado em 18/11/2026. [Transcrição completa com timestamps](../../../projects-knowledge-base/organizacao/aprendizados/videos/20261118-vMGhULMNwyg/transcricao.md) e [metadados](../../../projects-knowledge-base/organizacao/aprendizados/videos/20261118-vMGhULMNwyg/metadados.md): legenda manual pt-BR, 736 trechos, último aos 17:32 de 17:34. Proximidade do fim não prova ausência de lacunas nem exatidão integral.

## Tese e verificação

O vídeo defende que a IA barateia parte da produção de código e que entender dados, sistemas existentes e regras de negócio diferencia o profissional. É uma interpretação plausível, não demonstração de que front-end morreu ou que a IA causou uma queda de vagas.

- [07:34](https://youtu.be/vMGhULMNwyg?t=454): Spring Boot 14,1% e .NET 13,7% no [ranking Código Fonte 2026](https://pesquisa.codigofonte.com.br/2026/ranking), com 17.046 participantes. Confere no levantamento voluntário; não representa automaticamente todas as empresas e vagas.
- [08:15](https://youtu.be/vMGhULMNwyg?t=495): SQL apareceu em 726 de 2.563 vagas ativas na [fotografia TechJobs de 17/10/2026](https://www.techjobs.space/recursos/artigos/tecnologias-mais-pedidas-em-vagas). Menção não é requisito obrigatório nem contratação. A base não é o mercado brasileiro inteiro.
- [09:01](https://youtu.be/vMGhULMNwyg?t=541): queda de 39% em anúncios brasileiros, junho de 2025 a junho de 2026, reportada pelo [Valor com atribuição à Bain](https://valor.globo.com/carreira/noticia/2026/10/02/vagas-para-profissionais-juniores-recuam-enquanto-demanda-por-ia-cresce.ghtml). Não é recorte exclusivo de TI; anúncios não são contratações. Número não reproduzido diretamente na base primária.
- [10:45](https://youtu.be/vMGhULMNwyg?t=645): a [W3Techs](https://w3techs.com/technologies/segmentation/tld-br-/programming_language) informava PHP em 74,3% dos sites `.br` com linguagem de servidor identificável em 24/10/2026. Não representa todos os sites ou sistemas internos; o 74,4% citado no vídeo não foi confirmado historicamente.
- [15:22](https://youtu.be/vMGhULMNwyg?t=922): dizer que NoSQL não pegou é generalização sem prova. A [Shopify relata uso de Redis e posterior migração para MySQL em reservas de estoque](https://shopify.engineering/scaling-inventory-reservations); isso não descreve todos os sistemas da empresa.
- Os tempos de criação de landing pages são exemplos, não um estudo de custo completo. O saldo de 651 empregos e o percentual de React atribuídos no vídeo não foram confirmados diretamente nesta análise.

## Adequação à Dumentre

A KB já propõe atendimento com IA, sites e diagnóstico em [ofertas](ofertas.md), além de [atendimento unificado](atendimento-unificado.md), [orçamento sob medida](orcamento-sob-medida.md) e [prospecção](prospeccao/README.md). As novas ideias devem complementar essas frentes, não criar automaticamente novas ofertas ou infraestrutura. A decisão mais recente registrada em [backlog](../backlog/README.md) é **sem preço público e orçamento sob medida**; valores antigos no arquivo de ofertas são sugestões não aprovadas.

### 1. Automação operacional para pequenos negócios — prioridade alta

**Hipótese:** escolinhas, clínicas e comércio que repetem cadastro, organização de pedidos, agenda ou relatórios podem pagar para reduzir retrabalho. Começar por uma tarefa e um responsável, não por plataforma genérica.

**Piloto:** mapear processo e tempo atual; automatizar um fluxo delimitado, com conferência humana, registro de falhas e plano de retorno ao processo manual. Medir tempo por tarefa, erros e uso por uma ou duas semanas. Integrações e acesso a dados dependem de viabilidade e autorização.

**Riscos:** suporte, dados pessoais, APIs indisponíveis, exceções e dependência de fornecedor. Não prometer economia ou retorno antes da medição.

### 2. Atendimento e qualificação com IA — prioridade alta, continuidade do que já existe

**Hipótese:** negócios que perdem contatos por demora ou desorganização podem valorizar respostas a dúvidas frequentes, coleta mínima de dados e encaminhamento ao humano. Compatível com a oferta de atendimento e com o estudo de caixa unificada.

**Piloto:** avaliar conversas e tempo de resposta com autorização; configurar escopo restrito a informações aprovadas, transferência para pessoa e monitoramento. Medir tempo de resposta, encaminhamentos corretos, falhas e conversas resolvidas. Receita adicional não deve ser atribuída à solução sem comparação confiável.

**Riscos:** regras e preços atuais dos fornecedores a confirmar; privacidade, LGPD, mensagens incorretas, custos e acesso. Consultar [decisão de WhatsApp](decisao-whatsapp-api-2026-11-14.md) antes de definir arquitetura; nenhuma API ou serviço foi contratado.

### 3. Integração e melhoria de sistemas existentes — prioridade média

**Hipótese:** empresas com planilhas, ERP e canais desconectados podem precisar de conciliação, relatórios e troca de dados sem substituir todo o sistema.

**Piloto:** escolher uma integração com API ou exportação autorizada, mapear origem e destino, fazer prova em dados fictícios, definir reconciliação, backup e rollback. Medir tempo gasto e divergências antes/depois.

**Riscos:** dados sensíveis, dependência de terceiros, acesso a legado, responsabilidades e manutenção. Operações em produção exigem os portões aplicáveis; complexidade pode ultrapassar capacidade de uma pessoa.

### 4. Manutenção web e modernização gradual — prioridade média

**Hipótese:** negócios com site ou aplicação existente podem precisar de correções, integração com atendimento, acessibilidade ou estabilidade. PHP e React são meios, não produtos; evidência de uso não prova cliente pagante.

**Piloto:** diagnóstico de um problema autorizado, escopo e risco documentados, correção em cópia de teste e comparação antes/depois. Definir hospedagem, suporte, propriedade e segurança antes da proposta.

### 5. Produto próprio vertical — prioridade posterior

Só considerar transformar uma solução em produto recorrente quando a mesma dor aparecer em clientes independentes e houver evidência de pagamento. Risco de construir software sem distribuição ou sem demanda. Não substituir as oportunidades de serviços já existentes por um SaaS prematuro.

## Validação comercial sem gasto

1. Selecionar um nicho com acesso real, por exemplo escolinhas ou clínicas; examinar o material e os prospects já registrados, sem presumir interesse.
2. Preparar roteiro curto de descoberta: tarefa, frequência, responsável, custo atual, tentativas anteriores e consequência de não resolver.
3. Conversar com potenciais clientes **somente após aprovação de cada mensagem externa**. Não enviar dados privados nem usar o case Julinho publicamente sem autorização.
4. Buscar evidência de dor recorrente e disposição a pagar; descrever uma hipótese de piloto com escopo, custos, medição e responsável. Não há tamanho de amostra nem conversão comprovados nesta nota.
5. Preparar orçamento sob medida conforme a decisão vigente; implantar somente após contrato, acessos e aprovações necessários.

## Critério de escolha

Priorizar dor verificável, acesso ao decisor, facilidade de integração, risco de dados e esforço de suporte. A escolha entre segmentos acima é uma **hipótese estratégica**, não ranking baseado em faturamento, TAM ou pesquisa de mercado própria.
