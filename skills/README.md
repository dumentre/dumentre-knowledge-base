# Skills globais para criação de conteúdo

Esta pasta é o registro compartilhado de skills usadas em diferentes projetos da Dumentre. Os briefings e arquivos específicos de cada cliente continuam nas documentações do respectivo projeto; aqui ficam apenas as ferramentas de trabalho e a forma de instalá-las.

## Skills selecionadas

Fonte: [`coreyhaines31/marketingskills`](https://github.com/coreyhaines31/marketingskills), repositório aberto com licença MIT. Consulta ao catálogo skills.sh em 1º de outubro de 2026. Os números indicam adoção, não qualidade garantida.

| Skill | Para que serve | Instalações informadas | Versão copiada |
|---|---|---:|---|
| [`image`](marketingskills/image/SKILL.md) | Direção e produção de imagens para marketing e redes sociais; compara ferramentas e ajuda a preparar prompts. | ~75,9 mil | 2.0.1 |
| [`social`](marketingskills/social/SKILL.md) | Estratégia, calendário, legendas, carrosséis, Reels e adaptação por plataforma. | ~70,1 mil | 2.2.0 |
| [`content-strategy`](marketingskills/content-strategy/SKILL.md) | Pilares editoriais, temas, pesquisa e planejamento de conteúdo. | ~148,7 mil | 2.1.1 |

O repositório marcava cerca de 52 mil estrelas no GitHub. Na verificação do catálogo, `image` passou nos três verificadores exibidos; `social` aparecia como seguro/sem alertas Socket, com risco médio no Snyk; `content-strategy` tinha um aviso Snyk. São alertas automatizados do catálogo, não prova de qualidade. Os arquivos instalados são instruções Markdown e referências de apoio; leia-os antes de tarefas que usem ferramentas externas.

## Instalação global nesta máquina

Instaladas com o Skills CLI em `C:\Users\luanc\.agents\skills\`, com os links universais para os agentes suportados — incluindo Codex, Claude Code, Cursor, Gemini CLI e Antigravity. O CLI reportou 79 destinos; Eve e PromptScript não aceitam instalação global. O arquivo abaixo é uma cópia de referência versionável; a pasta de `~/.agents/skills` é a instalação ativa.

Para restaurar ou atualizar em uma máquina com Node.js:

```powershell
npm exec --yes --package=skills -- skills add https://github.com/coreyhaines31/marketingskills --skill image -g -a '*' -y
npm exec --yes --package=skills -- skills add https://github.com/coreyhaines31/marketingskills --skill social -g -a '*' -y
npm exec --yes --package=skills -- skills add https://github.com/coreyhaines31/marketingskills --skill content-strategy -g -a '*' -y
npm exec --yes --package=skills -- skills ls -g
```

Skills são instruções, não modelos de imagem nem créditos de geração. Ferramentas de imagem e serviços externos podem ter custos próprios. Este conjunto não instala nem autoriza agendamento ou publicação automática. Nenhuma skill deve publicar sem uma instrução explícita para aquela publicação.

## Rotina de manutenção

1. Atualizar a instalação global com `skills update -g` e conferir a procedência antes de usar uma skill nova.
2. Atualizar a cópia desta pasta na mesma alteração, mantendo os arquivos `SKILL.md` e as referências originais.
3. Registrar fonte, versão, data, instalações observadas e avisos de segurança nesta tabela.
4. Guardar identidade, textos aprovados, ativos e calendário dentro da documentação do projeto cliente, nunca nesta pasta global.

As três skills e seus arquivos de referência estão copiadas em [`marketingskills/`](marketingskills/). Não copiamos skills de postagem automática.
