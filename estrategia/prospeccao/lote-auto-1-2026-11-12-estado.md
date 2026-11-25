# Estado DUM-13 — 12/11/2026

## Fase 1 — concluída

- Regras, KANBAN, decisões de 12/11 e KB da Dumentre lidos.
- DUM-03 ainda não deixou um `pipeline.csv` no checkout. Esta execução criou um pipeline inicial com os 20 registros existentes; não presumiu que os dados da lista de 08/10 continuam atuais.
- Script `prospeccao/avaliar_sites.py` criado. Testes unitários: 2 passaram.
- 20 fichas consultadas em Maps público em contexto isolado; 12 confirmadas ou com evidência recente. Oito foram mantidas em revisão por correspondência incerta. Nenhum contato foi enviado.
- Resultado bruto dos domínios testados salvo em `resultado-rodada-1.json`.

## Limitações / próximos passos

- A rodada usa os 20 prospectos preexistentes; não adicionou 20 novas empresas. A rotina semanal proposta aguarda decisão DUM-15.
- Telefones da lista antiga precisam de nova confirmação antes de qualquer envio.
- “Feio” requer avaliação visual; o script detecta somente sinais de HTML, segurança, resposta e tecnologia.
- Mensagens preparadas para três perfis A; a do Martins Penna está condicional por se tratar do subdomínio `www` enquanto a raiz responde.
