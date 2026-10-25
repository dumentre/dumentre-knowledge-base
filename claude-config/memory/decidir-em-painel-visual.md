---
name: decidir-em-painel-visual
description: "Luan quer decisões e triagens num painel visual (Artifact com banco), não em texto longo no chat; skill painel-decisoes"
metadata:
  node_type: memory
  type: feedback
  originSessionId: ca05ec25-0f6f-4baf-874e-1741ac249812
  modified: 2026-10-11T18:49:48.884Z
---

Quando houver 2 ou mais decisões ou uma lista para classificar, monte um painel em Artifact seguindo a skill `painel-decisoes`, em vez de escrever as opções no chat. No chat vão só o link e um resumo curto.

**Why:** em 11/10/2026 o Luan disse que decidir pelo chat é "muito perigoso porque é uma única thread". No painel ele decide várias coisas em paralelo, pelo PC ou pelo celular, e pediu que isso virasse skill ("bem melhor que ficar lendo mucho texto aqui por bash").

**How to apply:** use o template fixo da skill (escrever só o JSON e rodar `montar.py`), que já traz comentário livre, "marcar como avaliada" e teclado. as escolhas ficam salvas no banco do artifact, mas eu só leio quando ele avisa "respondi no painel" (ArtifactData `list`). Painéis existentes: [[painel-dumentre]] e Triagem de Abas (https://claude.ai/artifact/W3kYoWZwc7z53oBDmZxmE7). Links sempre clicáveis: [[links-clicaveis-sempre]].
