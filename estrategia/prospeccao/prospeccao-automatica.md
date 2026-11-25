# Prospecção automática — DUM-13

**Verificação:** 12/11/2026. Rodada piloto sobre os 20 nomes já reunidos em `prospects.md` (origem inicial OpenStreetMap, 08/10). A busca pública atual em Maps confirmou 12 perfis com atividade ou evidência recente; 8 ficaram em revisão por resultado ambíguo, nome possivelmente alterado ou telefone/site sem confirmação. A rodada não acrescentou empresas além da lista inicial. Nenhuma mensagem foi enviada.

## Fluxo

1. Buscar empresas em fontes públicas por nicho e bairro em São Paulo; usar resultados do Maps públicos e páginas comerciais abertas. Registrar apenas nome, categoria, endereço comercial, telefone comercial publicado, site e URL da fonte.
2. Confirmar a ficha da empresa antes de tratá-la como ativa. Se nome, endereço, telefone ou domínio não bater, manter em `revisar`.
3. Rodar `python C:\Users\luanc\projects\dumentre\prospeccao\avaliar_sites.py --input C:\Users\luanc\projects\dumentre\dumentre-knowledge-base\estrategia\prospeccao\pipeline.csv --output C:\Users\luanc\projects\dumentre\dumentre-knowledge-base\estrategia\prospeccao\resultado.json` (o avaliador lê a coluna `site`).
4. Revisar automaticamente os achados e atribuir prioridade apenas quando o negócio estiver ativo e o domínio estiver associado à ficha. Revisão visual humana ainda é necessária para “feio” e para confirmar se um achado técnico é realmente visível ao cliente.
5. Preparar uma mensagem por empresa A em `lote-auto-1-2026-11-12.md`. O Luan revisa e envia manualmente. Não enviar automaticamente.

## Nota determinística 0–100

Começa em 100 (maior é melhor) e desconta: DNS sem resolução −25; HTTP/HTTPS sem resposta normal −20; TLS inválido −15; fallback HTTP −8; resposta acima de 4 s −10; sem viewport −10; copyright anterior a 2021 −5; jQuery abaixo de 3.5 −8; Flash/plugin legado −20; tabela HTML não marcada como apresentação −5; página estacionada/“em breve” −25; texto de apostas −25; sem link WhatsApp −3. Limite mínimo 0. Só aplica itens observáveis; ausência de dados não reduz a nota. Os 3 achados são ordenados por severidade.

Faixas iniciais, sempre combinadas com a confirmação de atividade: **A** ≤65; **B** 66–80; **C** >80 ou sem site próprio; **descartado** quando o problema antigo foi resolvido, o contato não corresponde ao negócio ou a empresa não está ativa. `A condicional` fica retido até confirmar o vínculo do domínio.

## Limites técnicos

- O script usa apenas a biblioteca padrão de Python, lê o HTML público e não preenche nem envia formulários. “Formulário presente” não significa formulário funcionando; não se testa submissão.
- “Sem WhatsApp” significa que nenhum link foi localizado no HTML baixado, não prova que a empresa não ofereça WhatsApp.
- Copyright é um indício fraco de atualização; não prova a data real da última manutenção. O teste de tabela HTML é heurístico. Flash pode estar dentro de conteúdo legado incorporado.
- A nota mede sinais técnicos detectáveis, não beleza visual, conversão, acessibilidade nem qualidade do conteúdo. Ela não decide sozinha a classe comercial.
- O teste não baixa recursos externos, não usa Chrome logado, login, API paga ou ferramenta de disparo. A ficha pública de Maps foi consultada em contexto isolado e sem login.
- O arquivo `resultado-rodada-1.json` preserva o resultado bruto. Linhas sem site ficam sem nota; um domínio não associado pode ter nota técnica isolada, mas não é atribuído à empresa nem libera abordagem.

## Resultado da primeira rodada

- 20 registros tratados, 12 perfis com atividade confirmada/recente e 8 mantidos em revisão. Nomes ou dados com divergência não entram em envio.
- Três abordagens A prontas: GDR 7 de Setembro (Flash/sem viewport), Panelão do Norte (TLS inválido em `www`) e Colégio Martins Penna (TLS inválido apenas em `www`; prioridade condicional, pois o domínio raiz abre).
- Clínica Sense ficou retida: o Maps confirma a clínica, mas não associa site; o domínio antigo apresenta texto de apostas. Não atribuir esse domínio ao negócio sem confirmação.
- A entrada antiga da Organização Contábil Marchiori agora aparece no Maps como Contabilidade ScaleYou, no mesmo endereço e telefone, com `scaleyou.com.br`; a ficha atual e o site saudável substituem a hipótese de site estacionado.
- O problema do domínio antigo do Colégio Olivetano foi superado: a ficha atual aponta `colegioolivetano.com.br`.
- Pontos de contato variam entre a lista antiga e diretórios atuais; validar novamente cada telefone antes do envio.

## Rotina semanal proposta — ainda desligada

Comando proposto para o MeuBot, contexto `dumentre`: `/prospeccao-auto nicho=<nicho> bairro=<bairro> limite=20`. Uma rodada semanal pesquisa no máximo 20 empresas novas, grava resultados em `pipeline.csv`, prepara rascunhos e encerra para revisão do Luan. A rotina não foi criada nem agendada. Decisão pendente: **DUM-15 — ligar a rodada semanal de prospecção? sim/não**.

## Fontes públicas consultadas

- [Google Maps — Clínica Sense, Tatuapé](https://www.google.com/maps/search/Cl%C3%ADnica+Sense+Tatuap%C3%A9+S%C3%A3o+Paulo): endereço, telefone (11) 98327-7277, 5,0/25; ficha sem website.
- [Google Maps — Escola de Futebol GDR 7 de Setembro](https://www.google.com/maps/search/GDR+7+de+Setembro+%C3%81gua+Rasa+S%C3%A3o+Paulo): ficha 4,5/370.
- [Google Maps — Contabilidade ScaleYou, Rua Embira](https://www.google.com/maps/search/Organiza%C3%A7%C3%A3o+Cont%C3%A1bil+Marchiori+Rua+Embira+346+Jardim+Popular+S%C3%A3o+Paulo): nome, telefone e website atuais.
- [Google Maps — Colégio Olivetano](https://www.google.com/maps/search/Col%C3%A9gio+Olivetano+Vila+Esperan%C3%A7a+S%C3%A3o+Paulo): endereço, site e telefone.
- [Google Maps — lista de empresas pesquisadas](https://www.google.com/maps/): perfis de GDR, Leal Clinic, CãoMania, Martins Penna, Panelão do Norte, Omegavet, Nakê, Terraço Food & Drinks, Umami, Puru e Escritório Dra. Isgislane.
- [CNES — Clínica Sense](https://cnes2.datasus.gov.br/Mod_Conjunto.asp?VCo_Unidade=3550304257790): cadastro da clínica em endereço diferente; confirma que diretórios podem conflitar.
- [Colégio Olivetano](https://colegioolivetano.com.br/): conteúdo escolar e dados atuais no domínio encontrado.
- [A+ Fitness — ficha pública de diretório](https://universobr.com.br/sp/sao-paulo/academias/a-fitness/): marca, endereço, contato e domínio informado; Maps atual não encontrou a ficha com segurança.
- [Organização Contábil Marchiori — LinkedIn](https://br.linkedin.com/company/organiza%C3%A7%C3%A3o-cont%C3%A1bil-marchiori): nome e endereço da ficha antiga.
