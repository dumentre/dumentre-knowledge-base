// Protótipo DESCARTÁVEL do "núcleo Dumentre" (ingest → fila durável → identidade → ficha → regras comerciais).
// Prova a LÓGICA do desenho com SQLite local e fixtures sintéticas. NÃO prova Chatwoot, Meta nem conta real.
// Sem dependências externas (node:sqlite). Relógio injetável. Nenhum envio automático por recepção.
import { DatabaseSync } from "node:sqlite";
import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS raw_event (id INTEGER PRIMARY KEY, sha TEXT UNIQUE, provider TEXT NOT NULL, received_at TEXT NOT NULL, payload TEXT NOT NULL, parse_error TEXT);
CREATE TABLE IF NOT EXISTS event (id INTEGER PRIMARY KEY, raw_id INTEGER NOT NULL REFERENCES raw_event(id), provider TEXT NOT NULL, account TEXT NOT NULL, kind TEXT NOT NULL,
  dedupe_key TEXT NOT NULL, ext_id TEXT, occurred_at TEXT NOT NULL, ingested_at TEXT NOT NULL, data TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0, error TEXT,
  UNIQUE(provider, account, dedupe_key));
CREATE TABLE IF NOT EXISTS person (id INTEGER PRIMARY KEY, created_at TEXT NOT NULL, merged_into INTEGER REFERENCES person(id), commercial_label TEXT);
CREATE TABLE IF NOT EXISTS identity (id INTEGER PRIMARY KEY, provider TEXT NOT NULL, account TEXT NOT NULL, ext_id TEXT NOT NULL, person_id INTEGER NOT NULL REFERENCES person(id), created_at TEXT NOT NULL,
  UNIQUE(provider, account, ext_id));
CREATE TABLE IF NOT EXISTS identity_alias (identity_id INTEGER NOT NULL REFERENCES identity(id), provider TEXT NOT NULL, account TEXT NOT NULL, kind TEXT NOT NULL, value TEXT NOT NULL,
  PRIMARY KEY(provider, account, kind, value));
CREATE TABLE IF NOT EXISTS identity_link (id INTEGER PRIMARY KEY, identity_id INTEGER NOT NULL REFERENCES identity(id), person_id INTEGER NOT NULL REFERENCES person(id), from_person_id INTEGER,
  evidence TEXT NOT NULL, state TEXT NOT NULL, by TEXT NOT NULL, at TEXT NOT NULL, reason TEXT);
CREATE TABLE IF NOT EXISTS message (id INTEGER PRIMARY KEY, event_id INTEGER, identity_id INTEGER NOT NULL REFERENCES identity(id), provider TEXT NOT NULL, account TEXT NOT NULL, ext_id TEXT NOT NULL,
  direction TEXT NOT NULL, type TEXT, text TEXT, status TEXT, occurred_at TEXT NOT NULL, ingested_at TEXT NOT NULL, UNIQUE(provider, account, ext_id));
CREATE TABLE IF NOT EXISTS status_pending (provider TEXT, ext_id TEXT, status TEXT, occurred_at TEXT);
CREATE TABLE IF NOT EXISTS attribution (id INTEGER PRIMARY KEY, event_id INTEGER UNIQUE, identity_id INTEGER NOT NULL, provider TEXT, ad_id TEXT, ctwa_clid TEXT, source_type TEXT, status TEXT NOT NULL,
  origin_raw TEXT NOT NULL, occurred_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS opportunity (id INTEGER PRIMARY KEY, person_id INTEGER NOT NULL REFERENCES person(id), title TEXT, state TEXT NOT NULL DEFAULT 'open', origin TEXT NOT NULL, created_at TEXT NOT NULL, closed_at TEXT);
CREATE UNIQUE INDEX IF NOT EXISTS one_open_auto_opp ON opportunity(person_id) WHERE state='open' AND origin='auto';
CREATE TABLE IF NOT EXISTS task (id INTEGER PRIMARY KEY, person_id INTEGER NOT NULL, opportunity_id INTEGER, kind TEXT NOT NULL, due_at TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'aberta',
  dedupe_key TEXT NOT NULL UNIQUE, origin_provider TEXT, reason TEXT, created_at TEXT NOT NULL, executed_at TEXT);
CREATE TABLE IF NOT EXISTS outbox (id INTEGER PRIMARY KEY, event_id INTEGER NOT NULL, target TEXT NOT NULL, payload TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'pendente', attempts INTEGER NOT NULL DEFAULT 0,
  next_at INTEGER, last_error TEXT, UNIQUE(event_id, target));
CREATE TABLE IF NOT EXISTS outbound (idem_key TEXT PRIMARY KEY, identity_id INTEGER NOT NULL, state TEXT NOT NULL, external_id TEXT, created_at TEXT NOT NULL, month TEXT NOT NULL, authorized_by TEXT);
CREATE TABLE IF NOT EXISTS policy (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS ai_suggestion (id INTEGER PRIMARY KEY, event_id INTEGER, kind TEXT, body TEXT, state TEXT NOT NULL DEFAULT 'pendente_de_revisao');
`;

const DEFAULT_POLICY = { followupDays: "3", tz: "America/Sao_Paulo", followupHour: "9", onReplySameChannel: "reagendar", onReplyOtherChannel: "revisar" };
const RANK = { sent: 1, delivered: 2, read: 3 };

// ---- fuso horário (sem biblioteca): converte "dia local + hora local" em instante UTC ----
function offsetMin(utcMs, tz) {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).formatToParts(new Date(utcMs));
  const g = (t) => Number(p.find((x) => x.type === t).value);
  return (Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"), g("second")) - utcMs) / 60000;
}
function localDate(utcMs, tz) {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(utcMs)).split("-").map(Number);
  return { y: p[0], m: p[1], d: p[2] };
}
function dueAt(occurredIso, days, hour, tz) {
  const { y, m, d } = localDate(Date.parse(occurredIso), tz);
  const guess = Date.UTC(y, m - 1, d + days, hour, 0, 0);
  return new Date(guess - offsetMin(guess, tz) * 60000).toISOString();
}

// ---- adaptadores de canal: só traduzem payload → eventos. O núcleo não conhece Meta. ----
const adapters = {
  whatsapp: {
    capabilities: { receive: true, reply: true, status: true, attachments: true },
    extract(payload) {
      const out = [];
      for (const entry of payload.entry ?? []) for (const ch of entry.changes ?? []) {
        if (ch.field !== "messages") continue;
        const v = ch.value ?? {};
        const account = v.metadata?.phone_number_id ?? entry.id ?? "?";
        for (const m of v.messages ?? []) {
          const cands = [];
          if (m.from_user_id) cands.push({ kind: "bsuid", value: m.from_user_id });
          if (m.from) cands.push({ kind: "phone", value: m.from });
          out.push({ kind: "message", account, ext_id: m.id, dedupe_key: m.id, occurred_at: new Date(Number(m.timestamp) * 1000).toISOString(), identity: cands,
            direction: "in", type: m.type, text: m.text?.body ?? null, referral: m.referral, referralKind: "whatsapp" });
        }
        for (const s of v.statuses ?? []) {
          out.push({ kind: "status", account, ext_id: s.id, dedupe_key: `${s.id}:${s.status}`, occurred_at: new Date(Number(s.timestamp) * 1000).toISOString(), status: s.status });
        }
      }
      return out;
    },
  },
  instagram: {
    capabilities: { receive: true, reply: true, status: false, attachments: true },
    extract(payload) {
      const out = [];
      for (const entry of payload.entry ?? []) for (const msg of entry.messaging ?? []) {
        if (!msg.message?.mid || msg.message.is_echo) continue; // ecos entram por outro caminho (direction out)
        out.push({ kind: "message", account: entry.id, ext_id: msg.message.mid, dedupe_key: msg.message.mid, occurred_at: new Date(Number(msg.timestamp)).toISOString(),
          identity: [{ kind: "igsid", value: msg.sender.id }], direction: "in", type: "text", text: msg.message.text ?? null, referral: msg.message.referral, referralKind: "instagram" });
      }
      return out;
    },
  },
  "canal-de-teste": {
    capabilities: { receive: true, reply: false, status: false, attachments: false },
    extract(payload) {
      return (payload.items ?? []).map((i) => ({ kind: "message", account: "TC", ext_id: i.id, dedupe_key: i.id, occurred_at: new Date(i.ts * 1000).toISOString(),
        identity: [{ kind: "tc", value: i.from }], direction: "in", type: "text", text: i.text ?? null }));
    },
  },
};

export function openCore({ path, secret, clock = Date.now, crm = null, transport = null, budget = { cap: 900 }, logger = () => {}, aiHook = null } = {}) {
  const db = new DatabaseSync(path);
  db.exec("PRAGMA busy_timeout=15000"); // antes de qualquer outro pragma: abertura concorrente também disputa lock
  db.exec("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;");
  db.exec(SCHEMA);
  const nowMs = () => clock();
  const nowIso = () => new Date(nowMs()).toISOString();
  const q = (sql) => db.prepare(sql);
  const tx = (fn) => {
    db.exec("BEGIN IMMEDIATE");
    try { const r = fn(); db.exec("COMMIT"); return r; } catch (e) { try { db.exec("ROLLBACK"); } catch { /* já encerrada */ } throw e; }
  };
  const policy = () => {
    const p = { ...DEFAULT_POLICY };
    for (const r of q("SELECT key, value FROM policy").all()) p[r.key] = r.value;
    return p;
  };
  const log = (e) => { try { logger(e); } catch { /* log nunca derruba o fluxo */ } };

  // ---------- 1) recepção: valida, persiste bruto + eventos e só então responde 200 ----------
  function ingest(provider, raw, signature) {
    const adapter = adapters[provider];
    if (!adapter) return { status: 404 };
    const expected = Buffer.from("sha256=" + createHmac("sha256", secret ?? "").update(raw).digest("hex"));
    const given = Buffer.from(String(signature ?? ""));
    if (!secret || expected.length !== given.length || !timingSafeEqual(expected, given)) return { status: 401 };
    let payload;
    try { payload = JSON.parse(raw); } catch { return { status: 400 }; }
    const sha = createHash("sha256").update(raw).digest("hex");
    tx(() => {
      q("INSERT OR IGNORE INTO raw_event(sha, provider, received_at, payload) VALUES (?,?,?,?)").run(sha, provider, nowIso(), raw);
      const rawId = q("SELECT id FROM raw_event WHERE sha=?").get(sha).id;
      let events = [];
      try { events = adapter.extract(payload); } catch (e) { q("UPDATE raw_event SET parse_error=? WHERE id=?").run(String(e.message).slice(0, 200), rawId); }
      for (const ev of events) {
        q(`INSERT OR IGNORE INTO event(raw_id, provider, account, kind, dedupe_key, ext_id, occurred_at, ingested_at, data) VALUES (?,?,?,?,?,?,?,?,?)`)
          .run(rawId, provider, ev.account, ev.kind, ev.dedupe_key, ev.ext_id ?? null, ev.occurred_at, nowIso(), JSON.stringify(ev));
      }
    });
    log({ event_type: "ingest", provider });
    return { status: 200 };
  }

  // ---------- 2) processamento assíncrono idempotente (um evento por transação) ----------
  function drain({ max = 1000 } = {}) {
    let n = 0;
    while (n < max && processOne()) n++;
    return { processed: n };
  }
  function processOne() {
    return tx(() => {
      const ev = q("SELECT * FROM event WHERE state='pending' ORDER BY id LIMIT 1").get();
      if (!ev) return false;
      const data = JSON.parse(ev.data);
      try {
        db.exec("SAVEPOINT ev");
        if (ev.kind === "message") handleMessage(ev, data); else if (ev.kind === "status") handleStatus(ev, data);
        db.exec("RELEASE ev");
        q("UPDATE event SET state='done', attempts=attempts+1 WHERE id=?").run(ev.id);
      } catch (e) {
        db.exec("ROLLBACK TO ev; RELEASE ev");
        q("UPDATE event SET state='failed', attempts=attempts+1, error=? WHERE id=?").run(String(e.message).slice(0, 200), ev.id);
        log({ event_type: "event_failed", event_id: ev.id, error_name: e.name });
      }
      return true;
    });
  }

  function resolveIdentity(provider, account, cands) {
    let identityId = null;
    for (const c of cands) {
      const a = q("SELECT identity_id FROM identity_alias WHERE provider=? AND account=? AND kind=? AND value=?").get(provider, account, c.kind, c.value);
      if (a) { identityId = a.identity_id; break; }
    }
    if (!identityId) {
      const primary = cands[0].value;
      const personId = Number(q("INSERT INTO person(created_at) VALUES (?)").run(nowIso()).lastInsertRowid);
      identityId = Number(q("INSERT INTO identity(provider, account, ext_id, person_id, created_at) VALUES (?,?,?,?,?)").run(provider, account, primary, personId, nowIso()).lastInsertRowid);
      q("INSERT INTO identity_link(identity_id, person_id, from_person_id, evidence, state, by, at) VALUES (?,?,?,?,?,?,?)").run(identityId, personId, null, "primeiro-contato", "active", "sistema", nowIso());
    }
    for (const c of cands) q("INSERT OR IGNORE INTO identity_alias(identity_id, provider, account, kind, value) VALUES (?,?,?,?,?)").run(identityId, provider, account, c.kind, c.value);
    return q("SELECT * FROM identity WHERE id=?").get(identityId);
  }
  const personIds = (pid) => [pid, ...q("SELECT id FROM person WHERE merged_into=?").all(pid).map((r) => r.id)];
  const inList = (ids) => ids.map(() => "?").join(",");

  function handleMessage(ev, d) {
    const identity = resolveIdentity(ev.provider, ev.account, d.identity);
    const ins = q(`INSERT OR IGNORE INTO message(event_id, identity_id, provider, account, ext_id, direction, type, text, status, occurred_at, ingested_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
      .run(ev.id, identity.id, ev.provider, ev.account, d.ext_id, d.direction, d.type ?? null, d.text ?? null, null, d.occurred_at, nowIso());
    if (ins.changes === 0) return; // mensagem já registrada: nada mais acontece
    if (d.referral !== undefined) recordAttribution(ev, d, identity);
    commercialRules(ev, d, identity);
    if (aiHook) {
      try {
        const s = aiHook({ eventId: ev.id }); // gancho opcional: falha/lentidão não pode bloquear (aqui: erro é engolido)
        if (s && typeof s.kind === "string" && typeof s.body === "string") q("INSERT INTO ai_suggestion(event_id, kind, body) VALUES (?,?,?)").run(ev.id, s.kind, s.body);
      } catch (e) { log({ event_type: "ai_error", error_name: e.name }); }
    }
  }

  function recordAttribution(ev, d, identity) {
    const r = d.referral;
    const adId = d.referralKind === "whatsapp" ? r?.source_id : r?.ad_id;
    const valid = typeof adId === "string" && adId.length > 0;
    q(`INSERT OR IGNORE INTO attribution(event_id, identity_id, provider, ad_id, ctwa_clid, source_type, status, origin_raw, occurred_at) VALUES (?,?,?,?,?,?,?,?,?)`)
      .run(ev.id, identity.id, ev.provider, valid ? adId : null, valid && typeof r.ctwa_clid === "string" ? r.ctwa_clid : null, r?.source_type ?? r?.source ?? null,
        valid ? "verificada" : "invalida", JSON.stringify(r ?? null), d.occurred_at);
  }

  function commercialRules(ev, d, identity) {
    const pol = policy();
    const pid = q("SELECT person_id FROM identity WHERE id=?").get(identity.id).person_id;
    const ids = personIds(pid);
    const open = q(`SELECT * FROM opportunity WHERE state='open' AND person_id IN (${inList(ids)}) ORDER BY id LIMIT 1`).get(...ids);
    if (!open) {
      const closed = q(`SELECT * FROM opportunity WHERE state IN ('won','lost') AND person_id IN (${inList(ids)}) ORDER BY id DESC LIMIT 1`).get(...ids);
      if (closed) { // contato conhecido sem negócio aberto: não cria lead sozinho, pede revisão
        q(`INSERT OR IGNORE INTO task(person_id, opportunity_id, kind, due_at, dedupe_key, origin_provider, created_at, reason) VALUES (?,?,?,?,?,?,?,?)`)
          .run(pid, closed.id, "revisar_novo_projeto", nowIso(), `revisar:${pid}:${closed.id}`, ev.provider, nowIso(), `contato com negócio ${closed.state}`);
        queueCrm(ev, { personId: pid, opportunityId: closed.id });
        return;
      }
      const opp = Number(q("INSERT INTO opportunity(person_id, title, origin, created_at) VALUES (?,?,?,?)").run(pid, "Novo contato", "auto", nowIso()).lastInsertRowid);
      q(`INSERT OR IGNORE INTO task(person_id, opportunity_id, kind, due_at, dedupe_key, origin_provider, created_at) VALUES (?,?,?,?,?,?,?)`)
        .run(pid, opp, "followup", dueAt(d.occurred_at, Number(pol.followupDays), Number(pol.followupHour), pol.tz), `followup:opp:${opp}`, ev.provider, nowIso());
      queueCrm(ev, { personId: pid, opportunityId: opp });
      return;
    }
    // negócio aberto: a mensagem entra nele; follow-up aberto segue a política (cancelar | reagendar | revisar)
    const t = q("SELECT * FROM task WHERE opportunity_id=? AND kind='followup' AND state='aberta'").get(open.id);
    if (t) {
      const action = t.origin_provider === ev.provider ? pol.onReplySameChannel : pol.onReplyOtherChannel;
      if (action === "cancelar") q("UPDATE task SET state='cancelada', reason=? WHERE id=?").run(`cliente respondeu (${ev.provider})`, t.id);
      else if (action === "revisar") q("UPDATE task SET state='revisao', reason=? WHERE id=?").run(`resposta em ${ev.provider}: revisar prazo`, t.id);
      else {
        const nd = dueAt(d.occurred_at, Number(pol.followupDays), Number(pol.followupHour), pol.tz);
        if (nd > t.due_at) q("UPDATE task SET due_at=? WHERE id=?").run(nd, t.id); // nunca recua por mensagem antiga
      }
    }
    queueCrm(ev, { personId: pid, opportunityId: open.id });
  }

  function queueCrm(ev, ref) {
    // O CRM recebe REFERÊNCIAS (ids, pessoa, negócio, último contato), não o histórico inteiro nem o texto.
    q("INSERT OR IGNORE INTO outbox(event_id, target, payload) VALUES (?,?,?)").run(ev.id, "crm", JSON.stringify({ ...ref, provider: ev.provider, occurredAt: ev.occurred_at }));
  }

  function handleStatus(ev, d) {
    const m = q("SELECT * FROM message WHERE provider=? AND ext_id=?").get(ev.provider, d.ext_id);
    if (!m) { q("INSERT INTO status_pending(provider, ext_id, status, occurred_at) VALUES (?,?,?,?)").run(ev.provider, d.ext_id, d.status, d.occurred_at); return; }
    applyStatus(m, d.status);
  }
  function applyStatus(m, status) {
    const cur = RANK[m.status] ?? 0;
    if (status === "failed") { if (cur < RANK.delivered) q("UPDATE message SET status='failed' WHERE id=?").run(m.id); return; }
    if (m.status === "failed") { if ((RANK[status] ?? 0) >= RANK.delivered) q("UPDATE message SET status=? WHERE id=?").run(status, m.id); return; }
    if ((RANK[status] ?? 0) > cur) q("UPDATE message SET status=? WHERE id=?").run(status, m.id);
  }

  // ---------- 3) entrega ao CRM por outbox: retry com backoff, 1 entrega por evento ----------
  function deliverOutbox() {
    const res = { delivered: 0, failed: 0, skippedBackoff: 0 };
    if (!crm) return res;
    const rows = q("SELECT * FROM outbox WHERE state='pendente' ORDER BY id").all();
    for (const row of rows) {
      if (row.next_at && row.next_at > nowMs()) { res.skippedBackoff++; continue; }
      try {
        crm.upsert(`crm:${row.event_id}`, JSON.parse(row.payload)); // chave idempotente: reentrega não duplica
        q("UPDATE outbox SET state='entregue', attempts=attempts+1, last_error=NULL WHERE id=?").run(row.id);
        res.delivered++;
      } catch (e) {
        const attempts = row.attempts + 1;
        q("UPDATE outbox SET attempts=?, next_at=?, last_error=? WHERE id=?").run(attempts, nowMs() + Math.min(2 ** (attempts - 1), 60) * 60000, String(e.message).slice(0, 120), row.id);
        res.failed++;
      }
    }
    return res;
  }

  // ---------- 4) identidade: vínculo só com evidência; reversão sem apagar histórico ----------
  function linkIdentities({ identityProvider, extId, toPersonId, evidence, by }) {
    if (!evidence || !by) throw new Error("vínculo exige evidência e autor");
    return tx(() => {
      const idn = q("SELECT * FROM identity WHERE provider=? AND ext_id=?").get(identityProvider, extId);
      if (!idn) throw new Error("identidade inexistente");
      const from = idn.person_id;
      if (from === toPersonId) return;
      q("UPDATE identity_link SET state='superseded' WHERE identity_id=? AND state='active'").run(idn.id);
      q("INSERT INTO identity_link(identity_id, person_id, from_person_id, evidence, state, by, at) VALUES (?,?,?,?,?,?,?)").run(idn.id, toPersonId, from, evidence, "active", by, nowIso());
      q("UPDATE identity SET person_id=? WHERE id=?").run(toPersonId, idn.id);
      const left = q("SELECT count(*) n FROM identity WHERE person_id=?").get(from).n;
      if (left === 0) q("UPDATE person SET merged_into=? WHERE id=?").run(toPersonId, from);
      const ids = personIds(toPersonId);
      const openAuto = q(`SELECT count(*) n FROM opportunity WHERE state='open' AND origin='auto' AND person_id IN (${inList(ids)})`).get(...ids).n;
      if (openAuto > 1) q("INSERT OR IGNORE INTO task(person_id, kind, due_at, dedupe_key, created_at, reason) VALUES (?,?,?,?,?,?)").run(toPersonId, "revisar_oportunidades_duplicadas", nowIso(), `dup:${toPersonId}`, nowIso(), "vínculo uniu duas oportunidades abertas; nada foi fundido");
    });
  }
  function unlinkIdentity({ identityProvider, extId, by, reason }) {
    return tx(() => {
      const idn = q("SELECT * FROM identity WHERE provider=? AND ext_id=?").get(identityProvider, extId);
      const link = q("SELECT * FROM identity_link WHERE identity_id=? AND state='active' ORDER BY id DESC LIMIT 1").get(idn.id);
      if (!link || link.from_person_id == null) throw new Error("não há vínculo manual para reverter");
      q("UPDATE identity_link SET state='revoked', reason=? WHERE id=?").run(reason ?? "", link.id);
      q("INSERT INTO identity_link(identity_id, person_id, from_person_id, evidence, state, by, at) VALUES (?,?,?,?,?,?,?)").run(idn.id, link.from_person_id, link.person_id, `reversão: ${reason ?? ""}`, "active", by, nowIso());
      q("UPDATE identity SET person_id=? WHERE id=?").run(link.from_person_id, idn.id);
      q("UPDATE person SET merged_into=NULL WHERE id=?").run(link.from_person_id);
    });
  }

  // ---------- 5) ficha (projeção de leitura) ----------
  function getFicha(personId) {
    const ids = personIds(personId);
    const ph = inList(ids);
    const idents = q(`SELECT * FROM identity WHERE person_id IN (${ph})`).all(...ids);
    const messages = q(`SELECT m.*, i.provider AS prov FROM message m JOIN identity i ON i.id=m.identity_id WHERE i.person_id IN (${ph}) ORDER BY m.occurred_at, m.id`).all(...ids);
    const inbound = messages.filter((m) => m.direction === "in");
    const last = inbound.reduce((a, m) => (!a || m.occurred_at > a.occurred_at ? m : a), null); // MAX(occurred_at): atrasada não retrocede
    const att = q(`SELECT a.* FROM attribution a JOIN identity i ON i.id=a.identity_id WHERE i.person_id IN (${ph}) ORDER BY a.occurred_at, a.id`).all(...ids);
    const good = att.filter((a) => a.status === "verificada");
    const mapTouch = (a) => a && { adId: a.ad_id, ctwaClid: a.ctwa_clid, provider: a.provider, occurredAt: a.occurred_at };
    return {
      personId,
      channels: idents.map((i) => ({ provider: i.provider, account: i.account, extId: i.ext_id, capabilities: adapters[i.provider].capabilities })),
      messages: messages.map((m) => ({ id: m.id, provider: m.prov, direction: m.direction, type: m.type, status: m.status, occurredAt: m.occurred_at, ingestedAt: m.ingested_at })),
      lastInbound: last && { provider: last.prov, occurredAt: last.occurred_at, ingestedAt: last.ingested_at },
      opportunities: q(`SELECT * FROM opportunity WHERE person_id IN (${ph}) ORDER BY id`).all(...ids),
      tasks: q(`SELECT * FROM task WHERE person_id IN (${ph}) ORDER BY id`).all(...ids),
      attribution: { status: good.length ? "verificada" : att.length ? "evidencia_invalida" : "sem_atribuicao", firstTouch: mapTouch(good[0]), lastTouch: mapTouch(good[good.length - 1]) },
    };
  }

  // ---------- 6) comercial e follow-up ----------
  const createOpportunity = (personId, title) => Number(q("INSERT INTO opportunity(person_id, title, origin, created_at) VALUES (?,?,?,?)").run(personId, title, "manual", nowIso()).lastInsertRowid);
  function closeOpportunity(id, state) {
    tx(() => {
      q("UPDATE opportunity SET state=?, closed_at=? WHERE id=?").run(state, nowIso(), id);
      q("UPDATE task SET state='cancelada', reason=? WHERE opportunity_id=? AND state='aberta' AND kind='followup'").run(`negócio ${state}`, id);
    });
  }
  const relabel = (personId, label) => q("UPDATE person SET commercial_label=? WHERE id=?").run(label, personId); // não toca em attribution.origin_raw
  const setPolicy = (obj) => tx(() => { for (const [k, v] of Object.entries(obj)) q("INSERT INTO policy(key, value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").run(k, String(v)); });
  function runDueTasks() {
    // "executar" = a tarefa INTERNA vence e fica pronta para o operador. Nunca envia mensagem externa.
    const r = tx(() => q("UPDATE task SET state='executada', executed_at=? WHERE state='aberta' AND kind='followup' AND due_at<=?").run(nowIso(), nowIso()));
    return { executed: Number(r.changes) };
  }

  // ---------- 7) envio: mesma política para UI/jobs/API; idempotente; incerto não é reenviado ----------
  function send({ identityId, text, authorizedBy, idempotencyKey }) {
    const idn = q("SELECT * FROM identity WHERE id=?").get(identityId);
    const caps = adapters[idn.provider].capabilities;
    const key = idempotencyKey ?? randomUUID();
    const prior = q("SELECT * FROM outbound WHERE idem_key=?").get(key);
    if (prior) return { state: prior.state, externalId: prior.external_id, idempotencyKey: key };
    if (!authorizedBy) return { state: "recusada", reason: "sem autorização explícita do operador" };
    if (!caps.reply) return { state: "recusada", reason: `canal ${idn.provider} sem resposta (capacidade não oferecida)` };
    const month = new Date(nowMs()).toISOString().slice(0, 7);
    const reserved = tx(() => {
      const used = q("SELECT count(*) n FROM outbound WHERE month=? AND state IN ('reservada','enviada','incerto')").get(month).n;
      if (used >= (budget?.cap ?? 0)) return false;
      q("INSERT INTO outbound(idem_key, identity_id, state, created_at, month, authorized_by) VALUES (?,?,?,?,?,?)").run(key, identityId, "reservada", nowIso(), month, authorizedBy);
      return true;
    });
    if (!reserved) return { state: "recusada", reason: "orçamento mensal esgotado (reserva local; a fatura do provedor é a fonte final)" };
    try {
      const r = transport.send({ identityId, text, idempotencyKey: key });
      tx(() => {
        q("UPDATE outbound SET state='enviada', external_id=? WHERE idem_key=?").run(r.externalId, key);
        q(`INSERT OR IGNORE INTO message(identity_id, provider, account, ext_id, direction, type, text, status, occurred_at, ingested_at) VALUES (?,?,?,?,?,?,?,?,?,?)`)
          .run(identityId, idn.provider, idn.account, r.externalId, "out", "text", null, "sent", nowIso(), nowIso());
        const m = q("SELECT * FROM message WHERE provider=? AND ext_id=?").get(idn.provider, r.externalId);
        for (const p of q("SELECT * FROM status_pending WHERE provider=? AND ext_id=? ORDER BY occurred_at").all(idn.provider, r.externalId)) applyStatus(q("SELECT * FROM message WHERE id=?").get(m.id), p.status);
        q("DELETE FROM status_pending WHERE provider=? AND ext_id=?").run(idn.provider, r.externalId);
      });
      return { state: "enviada", externalId: r.externalId, idempotencyKey: key };
    } catch (e) {
      const ambiguous = e.code === "ETIMEDOUT" || e.code === "ECONNRESET";
      q("UPDATE outbound SET state=? WHERE idem_key=?").run(ambiguous ? "incerto" : "falhou", key);
      return { state: ambiguous ? "incerto" : "falhou", idempotencyKey: key, reason: ambiguous ? "timeout: não é possível confirmar se houve envio; aguardar eco/status" : "erro definitivo" };
    }
  }

  const metrics = () => ({
    pendingEvents: q("SELECT count(*) n FROM event WHERE state='pending'").get().n,
    failedEvents: q("SELECT count(*) n FROM event WHERE state='failed'").get().n,
    outboxPending: q("SELECT count(*) n FROM outbox WHERE state='pendente'").get().n,
    uncertainSends: q("SELECT count(*) n FROM outbound WHERE state='incerto'").get().n,
  });

  return { db, ingest, drain, deliverOutbox, linkIdentities, unlinkIdentity, getFicha, createOpportunity, closeOpportunity, relabel, setPolicy, runDueTasks, send, metrics, close: () => db.close() };
}
