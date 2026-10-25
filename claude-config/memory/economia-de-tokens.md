---
name: economia-de-tokens
description: "Inegociável desde 12/10/2026 — Claude só orquestra; trabalho braçal vai para script, Codex/OpenCode/AGY (skill orquestrar) ou subagente Haiku"
metadata:
  node_type: memory
  type: feedback
  originSessionId: ca05ec25-0f6f-4baf-874e-1741ac249812
  modified: 2026-10-12T12:35:53.135Z
---

O Luan quer gastar o mínimo de tokens do Claude. O Claude planeja, decide e revisa; o resto é delegado na escada: script → workers externos (`skills/orquestrar/scripts/delegar.py`: codex, opencode, agy) → subagente Haiku → Sonnet → modelo principal.

**Why:** pedido "bem urgente" em 12/10/2026. Ele assina outras ferramentas (Codex, AGY, OpenCode) cuja cota fica parada, e acha o Haiku "foda e barato".

**How to apply:** antes de leitura em massa, varredura, extração, resumo ou tarefa longa, delegar. Escolher o modelo mais barato que dê resultado igual ou quase. Sugerir `/model haiku` quando a sessão for só de coisas simples. Gemini CLI não funciona na conta dele (usar AGY). Hooks que obrigam (leitura em massa e modelo caro com `#PRECISA-CLAUDE`) em C:\Users\luanc\projects\projects-knowledge-base\wiki\economia-de-tokens.md. Ver [[autonomia-maxima]].
