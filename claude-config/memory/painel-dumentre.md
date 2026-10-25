---
name: painel-dumentre
description: "Painel \"Tração Dumentre\" (artifact) guarda as decisões do Luan e o status dos prospects; como ler e regenerar"
metadata:
  node_type: memory
  type: reference
  originSessionId: ca05ec25-0f6f-4baf-874e-1741ac249812
  modified: 2026-10-11T09:49:17.736Z
---

Painel privado: https://claude.ai/artifact/Aor9cK49hE2ybS7hazbUaQ (criado em 09/10/2026).

- As escolhas do Luan ficam no banco do artifact: coleção `decisoes` (docs `d01`…`d20`, campos `escolha`, `nota`, `em`) e `prospects` (`p01`…`p20`, campo `status`). Ler com a ferramenta ArtifactData antes de seguir com qualquer item do backlog.
- O conteúdo vem dos .md da `dumentre-knowledge-base` (fonte de verdade). Para atualizar: `cd dumentre-knowledge-base/scripts/painel && node build.js <pasta>` e republicar a pasta na mesma URL. O painel em si é `scripts/painel/painel.html`.
- Regra de links: [[links-clicaveis-sempre]].
