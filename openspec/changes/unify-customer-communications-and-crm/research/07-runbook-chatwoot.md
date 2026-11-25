# Runbook: Atualização e Recuperação do Chatwoot Community (v4.20.1+)

**Data:** 2026-11-25  
**Ambiente:** VPS Hetzner (`openbao-platform-prod`)  
**Critério atendido:** Tarefa 7.3 / AT-11.4

---

## 1. Princípios Operacionais
- Nenhuma atualização em produção sem backup prévio e ensaio de restauração em diretório/banco isolado.
- Preservação estrita dos limites de memória do compose (`limits: memory: 1024M` para web, `768M` para sidekiq).
- Imagem de container sempre fixada por tag semântica explícita (nunca `latest`).

## 2. Procedimento de Snapshot e Backup
1. **Backup do PostgreSQL:**
   ```bash
   docker exec -t chatwoot-postgres pg_dump -U chatwoot -Fc chatwoot_production > /var/backups/chatwoot/pg-chatwoot-$(date +%Y%m%d%H%M%S).dump
   ```
2. **Backup de Anexos/Storage:**
   ```bash
   tar -czf /var/backups/chatwoot/storage-$(date +%Y%m%d%H%M%S).tar.gz -C /var/lib/docker/volumes/chatwoot_storage/_data .
   ```

## 3. Ensaio de Restauração em Diretório Isolado
1. Criar banco e pasta de restauração de teste:
   ```bash
   createdb -U chatwoot chatwoot_restore_test
   pg_restore -U chatwoot -d chatwoot_restore_test /var/backups/chatwoot/pg-chatwoot-<timestamp>.dump
   ```
2. Comparar integridade de tabelas críticas (`conversations`, `contacts`, `messages`):
   ```sql
   SELECT count(*) FROM conversations;
   SELECT count(*) FROM contacts;
   SELECT count(*) FROM messages;
   ```
3. Descartar banco de ensaio após validação.

## 4. Atualização de Versão (Tag Semântica)
1. Editar `docker-compose.chatwoot.yml` e alterar a tag da imagem `chatwoot/chatwoot:v4.X.Y`.
2. Rodar migrações do banco:
   ```bash
   docker compose run --rm chatwoot-web bundle exec rails db:migrate
   ```
3. Reiniciar serviços:
   ```bash
   docker compose up -d
   ```
4. Conferir logs e consumo de memória:
   ```bash
   docker stats --no-stream
   ```

## 5. Rollback Imediato
- Em caso de falha ou regressão:
  1. Parar containers: `docker compose down`
  2. Restaurar dump do Postgres sobre `chatwoot_production`
  3. Reverter tag do compose para `v4.20.1` e executar `docker compose up -d`
