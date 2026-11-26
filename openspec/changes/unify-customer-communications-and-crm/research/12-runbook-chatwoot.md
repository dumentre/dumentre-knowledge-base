# Runbook Operacional: Atualização e Recuperação do Chatwoot Community (v4.20.1+)

**Alvo**: Hetzner VPS (`openbao-platform-prod`)
**Referência**: Tarefa 7.3 / Decisão D2

---

## 1. Janela de Manutenção e Pré-Requisitos
1. Agendar janela fora do horário de pico comercial.
2. Confirmar uso de memória no host:
   ```bash
   free -m; vmstat 1 3
   ```
   *Critério*: `MemAvailable` >= 800 MiB.

## 2. Snapshot e Backup de Segurança
Antes de qualquer upgrade de versão ou migração de banco:
1. **Backup do Postgres do Chatwoot**:
   ```bash
   docker exec -t $(docker ps -qf "name=chatwoot-postgres") pg_dump -U chatwoot chatwoot_production | gzip > /opt/backups/chatwoot/pg-backup-$(date +%Y%m%d%H%M%S).sql.gz
   ```
2. **Backup de Armazenamento/Anexos**:
   ```bash
   tar -czf /opt/backups/chatwoot/storage-$(date +%Y%m%d%H%M%S).tar.gz -C /opt/chatwoot/storage .
   ```
3. **Backup do SQLite do dumentre-core**:
   ```bash
   sqlite3 /opt/dumentre-core/data/dumentre.sqlite3 ".backup '/opt/backups/dumentre-core/core-backup-$(date +%Y%m%d%H%M%S).sqlite3'"
   ```

## 3. Ensaio de Restauração em Diretório Separado
1. Criar pasta temporária de teste de restore:
   ```bash
   mkdir -p /opt/restore-test/pg
   gunzip -c /opt/backups/chatwoot/pg-backup-LATEST.sql.gz > /opt/restore-test/pg/restore.sql
   ```
2. Subir container Postgres temporário na porta 5433 para validar integridade do dump:
   ```bash
   docker run --rm -d --name pg-test -p 5433:5432 -e POSTGRES_PASSWORD=test -v /opt/restore-test/pg:/tmp postgres:16-alpine
   sleep 5
   docker exec -i pg-test psql -U postgres -c "CREATE DATABASE chatwoot_test;"
   docker exec -i pg-test psql -U postgres -d chatwoot_test -f /tmp/restore.sql
   docker exec -i pg-test psql -U postgres -d chatwoot_test -c "SELECT count(*) FROM conversations;"
   docker stop pg-test
   rm -rf /opt/restore-test
   ```

## 4. Aplicação de Atualização
1. Atualizar tag da imagem em `/opt/chatwoot/docker-compose.yml`.
2. Rodar migrações:
   ```bash
   docker compose run --rm chatwoot-web bundle exec rails db:chatwoot_prepare
   ```
3. Recriar containers:
   ```bash
   docker compose up -d
   ```

## 5. Procedimento de Rollback
Em caso de falha de inicialização, OOM ou regressão de schema:
1. Parar containers atuais:
   ```bash
   docker compose down
   ```
2. Voltar a tag da imagem no `docker-compose.yml`.
3. Restaurar o banco a partir do backup:
   ```bash
   docker compose up -d chatwoot-postgres
   sleep 5
   gunzip -c /opt/backups/chatwoot/pg-backup-LATEST.sql.gz | docker exec -i $(docker ps -qf "name=chatwoot-postgres") psql -U chatwoot -d chatwoot_production
   docker compose up -d
   ```
4. Conferir webhook e reprocessar eventos pendentes na outbox do `dumentre-core`

## Fechamento do onboarding publico (2026-11-25 23:20 BRT)
- Risco: onboarding respondia 200 para qualquer pessoa.
- Feito pelo servidor, sem navegador: AccountBuilder via rails runner no container web criou conta Dumentre e usuario luan@dumentre.com (Luan Cardoso), SuperAdmin, confirmado, administrator. Chave Redis de onboarding apagada.
- Prova: curl no onboarding passou de 200 para 302 com destino a raiz do Chatwoot (login).
- GET api/v1/profile com o token: id=1, name=Luan Cardoso, role=administrator, account_id=2.
- Bitwarden pasta Dumentre: Dumentre / Chatwoot / admin luan (2026-11-25) e Dumentre / Chatwoot / API token (hermes). Valores nunca impressos.
- A conta tem id 2: usar account_id=2 nas chamadas da API..
