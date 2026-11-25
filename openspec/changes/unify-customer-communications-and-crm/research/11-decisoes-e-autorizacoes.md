# 11. Decisões do Luan e autorizações externas pendentes

Cada linha diz **o que muda** conforme a resposta. Nada aqui foi executado. Itens "D" são decisões; itens "A" são autorizações para ações com efeito fora da máquina (cada uma vale **uma operação**, conforme as regras globais).

## Decisões (D)

| ID | Decisão | Recomendação | Impacto exato |
|---|---|---|---|
| D1 | Adotar **Chatwoot Community** como caixa principal (H4) | Sim, condicionado a G-CAP | Sem D1: contingência C1 (UI própria, só WhatsApp/IG/Messenger). Define o esforço de F2/F3. |
| D2 | Onde provar a capacidade: **janela no VPS atual** (instalar Chatwoot com limites de memória + swap) **ou** VM de teste | Janela no VPS, com limites e rollback; se reprovar, decidir C1 ou C2 | Instalar no VPS altera o servidor (A1). VM nova = custo **desconhecido** (fontes não oficiais: € 8,99 a € 35,99/mês + IPv4). Sem D2 não há prova 1 e 7. |
| D3 | Políticas comerciais: X dias do follow-up (fixture 3), horário (09:00), fuso, reabertura de negócio ganho/perdido, resposta em outro canal (cancelar/reagendar/revisar) | Valores de fixture como ponto de partida; revisar após 2 semanas de uso | Muda parâmetros, não a estrutura. |
| D4 | Retenção do payload bruto (fixture 90 dias) e base legal (LGPD) para registrar origem/mensagens; parecer jurídico | 90 dias, depois reduzir a metadados | Define tamanho do banco e o texto de aviso. Não há parecer jurídico. |
| D5 | **Orçamento mensal de mensagens** e método de pagamento na Meta | Teto local conservador + alerta aos 80%; cartão cadastrado só na hora de ativar em produção | Sem cartão a Meta **não entrega** mensagens de serviço. Sem teto do fornecedor: o único freio é o nosso. |
| D6 | Número comercial: **coexistência** (manter o app WhatsApp Business) ou só API | Provar primeiro no número de teste; decidir depois | Coexistência permite espelhar mensagens do app e 6 meses de histórico, desliga mensagens temporárias, não sincroniza grupos; elegibilidade desconhecida. Só API: o app deixa de ser usado no número. |
| D7 | Destinatário permitido para o teste do número de teste (tarefa F5 do conector) | Número do próprio Luan | Libera a primeira prova **sandbox**. Envia um template `hello_world` (custo: nenhum esperado; a confirmar). |
| D8 | Billing: gateway (qual) e **emissão de NFS-e** (emissor próprio, serviço pago, ou fora do sistema) | Registro interno na F5; gateway e NFS-e decididos depois, em fase separada | Gateway e emissor têm tarifa por transação (desconhecida). Prefeitura de SP em transição para o Emissor Nacional (não confirmado). Sem D8 a F5 entrega só registro interno e conciliação manual. |
| D9 | Meta Business Agent | **Fora do caminho crítico**; não habilitar | Cobra por token (US$ 2/1M) e muda quem controla a conversa; só avaliar depois de G-CAP e com prova de handoff. |
| D10 | Destino da change `crm-atendimento-unificado` (já existente na KB) | Marcar como **substituída em escopo** por esta; não arquivar nenhuma antes da implementação | Evita duas fontes de verdade. A execução não alterou a original. |
| D11 | E-mail: SMTP de saída (Brevo gratuito? Google Workspace?) | Decidir antes da F3 | Hoje só recebe (Cloudflare → Gmail). Sem SMTP o e-mail não "responde pelo canal de origem". |
| D12 | TikTok, X e novas redes | Extensão condicional; não iniciar | TikTok exige aprovação (dias a ~2 semanas, S) e região; X sem evidência. |
| D13 | Repositório do núcleo | Novo pacote em `conectores/` (separado do MCP pessoal) reaproveitando o runner `node --test` | Define onde o código vive; evita crescer o `whatsapp-business-mcp`. |

### Resoluções Formais de Luan Cardoso (2026-11-25)
- **D1 (Chatwoot Community):** APROVADO. Adotar Chatwoot Community como caixa de entrada principal, condicionado ao teste de capacidade (G-CAP).
- **D2 (Onde provar capacidade):** APROVADO. Provar capacidade em janela no VPS atual Hetzner com limites de memória por contêiner e swap.
- **D3 (Políticas comerciais):** APROVADO. Valores de fixture adotados (30 dias reabertura, 09:00 SP, etc.).
- **D4 (Retenção do payload bruto):** APROVADO COM AJUSTE. Retenção do bruto estendida para 365 dias (1 ano) em SQLite/armazenamento local; metadados e histórico mantidos permanentemente.
- **D5 (Orçamento de mensagens):** APROVADO. Teto local conservador rígido de R$ 0 no código + alerta a 80%. Cartão na Meta apenas para ativação em produção.
- **D6 (Número comercial):** APROVADO. Provar primeiro no número de teste; decidir coexistência vs API no momento da homologação.
- **D7 (Destinatário permitido para teste):** APROVADO. Número do próprio Luan (já autenticado no navegador).
- **D8 (Billing / NFS-e):** APROVADO. Manter registro interno no ledger na F5; gateway e emissão de NFS-e decididos em fase posterior.
- **D9 (Meta Business Agent):** APROVADO. Fora do caminho crítico / desativado.
- **D10 (Change antiga na KB):** APROVADO. Marcar `crm-atendimento-unificado` como substituída em escopo por esta, sem arquivar antes da homologação.
- **D11 (E-mail):** APROVADO COM DIRETRIZ PRÓPRIA. Servidor próprio de e-mail open source na Hetzner (controle total de caixas e domínios @dumentre.com, ex: Stalwart/Mailcow/Postal).
- **D12 (TikTok / X):** APROVADO. Fora do escopo no momento.
- **D13 (Repositório do núcleo):** APROVADO. Promover o núcleo para pacote dedicado `conectores/dumentre-core`.

## Autorizações externas pendentes (A)

| ID | Ação | Escopo mínimo | Impacto se não vier |
|---|---|---|---|
| A1 | Instalar/medir Chatwoot no VPS (containers, limites de memória, swap) | janela curta, rollback documentado, sem tocar OpenBao/NetBird | F2 e provas 1/7 ficam bloqueadas |
| A2 | Configurar **override do callback** do número de teste e inscrever campos (`messages`, `smb_message_echoes`, `history`) | só número de teste; escrita na conta Meta | sem sandbox WhatsApp |
| A3 | Enviar **um** template de teste ao número permitido | custo esperado nenhum | prova S do WhatsApp bloqueada |
| A4 | Instagram/Messenger: vincular conta de teste/real ao app, inscrever campos | Standard Access, sem revisão | F3 bloqueada |
| A5 | Cadastrar método de pagamento na Meta | só ao ir para produção | Meta para de entregar service messages |
| A6 | Contratar SMTP de saída | conforme D11 | e-mail só recebe |
| A7 | Criar/ler credenciais do cofre (Bitwarden/OpenBao) para o núcleo e para o Chatwoot | via cofre, nunca em arquivo | nenhum serviço novo sobe |
| A8 | Qualquer escrita em banco de produção, publicação ou migração do número oficial | por operação | corte (AT-11.5) bloqueado |
