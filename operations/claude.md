# Claude: assinatura e acompanhamento

Registro operacional baseado nas telas de Billing e Claude Code verificadas em **8 de outubro de 2026**. Atualizar este documento quando preço, plano, renovação ou configuração de consumo mudar.

## Assinatura Claude Pro

- **Conta:** individual, Claude Pro mensal.
- **Preço observado:** **R$ 110,00 por mês**.
- **Última cobrança observada:** 8 de outubro de 2026, status Paid.
- **Próxima renovação automática:** **8 de novembro de 2026**.
- **Método:** cartão Mastercard já cadastrado. Não registrar número do cartão neste documento.
- **Team:** não contratado; a tela de Team era uma opção separada e mais cara.
- **Claude Code:** incluído no plano individual Pro, conforme a página de benefícios consultada na data do registro.

## Consumo e créditos

- Na tela de Billing, o saldo de créditos de uso adicional estava em **R$ 0,00**.
- **Auto-reload (recarga automática): desligado** na data da verificação. Não ativar sem autorização explícita.
- Revisar **Settings > Usage** e **Settings > Billing** antes da renovação mensal e quando o Claude avisar sobre limite. Registrar mudanças de saldo, limites ou cobranças nesta seção.
- A tela consultada não mostrava um total de uso corrente nem um limite mensal de gastos; não presumir que esses valores estejam configurados.

## Rotina de revisão

- Revisar a assinatura e o consumo até **1º de novembro de 2026**, uma semana antes da renovação de 8 de novembro.
- Na revisão, confirmar se o Pro continua necessário, se o valor permanece R$ 110/mês, se há créditos adicionais e se auto-reload continua desligado.
- Se a assinatura for cancelada, confirmar no Billing a data final de acesso e atualizar este registro.

## Claude Code nesta máquina

- Versão instalada antes da atualização, em 8 de outubro de 2026: **2.1.261**.
- Atualizada com `claude update`; versão verificada depois: **2.1.295**.
- `npm view @anthropic-ai/claude-code version` também retornou **2.1.295**. A página oficial de releases do GitHub mostrava **v2.1.294** como Latest na consulta. A instalação local coincide com a versão publicada no pacote npm, um patch acima da release Latest exibida no GitHub.
- Comando de conferência: `claude --version`. Atualização manual: `claude update`.

## Fontes e evidência

- Capturas da tela Billing enviadas em 8 de outubro de 2026: plano mensal, preço, data da próxima renovação, fatura paga e controles de créditos/auto-reload.
- Anthropic Help Center: [Claude Pro](https://support.anthropic.com/en/articles/8325606-what-is-the-pro-plan) e [inscrição no Pro](https://support.anthropic.com/en/articles/8325609-how-do-i-sign-up-for-claude-pro).
- Anthropic Claude Code: [releases oficiais](https://github.com/anthropics/claude-code/releases) e pacote publicado no npm `@anthropic-ai/claude-code`.
