---
name: chrome-automacao-9222
description: O Chrome do dia a dia do Luan (Windows, LUAN-NITRO5) é um perfil separado com porta de depuração 9222; abas se leem por lá, não pelo perfil padrão
metadata:
  type: reference
---

O Chrome que o Luan usa no dia a dia neste PC roda com `--user-data-dir=C:\Users\luanc\ChromeAutomation --remote-debugging-port=9222`. O perfil padrão (`%LOCALAPPDATA%\Google\Chrome\User Data\Default`), onde ficam o Claude in Chrome, os favoritos e os arquivos de sessão, é outra instância e não vê as abas dele.

- Para listar as abas: `http://127.0.0.1:9222/json/list` (skill `abas`). Para fechar: `/json/close/<id>`, só com o ok dele.
- Para abrir algo na tela dele: `chrome.exe --new-window <url>`. A ação `open` do Artifact não aparece no Chrome dele.
- Nunca mandar teclas às cegas para as janelas do Chrome (em 11/10/2026 isso desmarcou um item num carrinho).
- A porta aberta é um risco de segurança, registrado no backlog geral. Ver [[decidir-em-painel-visual]].
