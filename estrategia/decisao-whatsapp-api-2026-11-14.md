# Decisão: WhatsApp da Dumentre pela API oficial, com teto de custo (14/11/2026)

- **Decidido pelo Luan:** usar somente a WhatsApp Cloud API oficial no número da Dumentre. Sem QR, sem Baileys, sem segundo canal.
- **Motivo:** custo zero na franquia de 1.000 mensagens de serviço por mês; sem custo de mensagens iniciadas pela empresa, que não estão no plano agora.
- **Trava de custo:** teto mensal de 900 (máximo 1000), aviso em 800, fila ao atingir o teto (sem troca de canal), templates bloqueados por padrão, liberação da fila só com confirmação e descarte de mensagens fora da janela de 24h.
- **Risco aceito:** a cobrança real é da Meta; a contagem local é uma estimativa. Conferir a fatura no fim de cada mês.
- **Onde:** `conectores/whatsapp-business-mcp` (repositório separado do pessoal `whatsapp-pessoal-mcp`). Nenhum commit ou push feito até o ok do Luan.
- **Pendências do Luan:** criar o app na Meta, enviar o Phone Number ID, o token (direto no Bitwarden), o verify token e o app secret. Decidir templates, se algum for usado.
- **Regra fixa:** nenhuma foto de menor sai sem autorização escrita.
