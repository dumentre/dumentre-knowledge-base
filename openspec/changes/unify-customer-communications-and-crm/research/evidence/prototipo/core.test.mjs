// Provas P1 do plano omnichannel (TDD). Cada teste cita o cenário AT-xx que sustenta.
// Executa: node --no-warnings --test core.test.mjs   (Node >= 22; sem dependências externas: usa node:sqlite)
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { openCore } from "./core.mjs";
import { SECRET, sign, waText, waStatus, igText, testChannelMsg, iso } from "./fixtures.mjs";

const T0 = Date.parse("2026-11-21T12:00:00Z");
const WORKER = fileURLToPath(new URL("./worker.mjs", import.meta.url));
const newDb = () => {
  const d = mkdtempSync(join(tmpdir(), "core-"));
  return { dir: d, path: join(d, "core.sqlite"), done: () => rmSync(d, { recursive: true, force: true }) };
};
const open = (path, extra = {}) => openCore({ path, secret: SECRET, clock: () => T0, ...extra });
const feed = (core, provider, raw) => core.ingest(provider, raw, sign(raw));
const count = (core, sql, ...a) => core.db.prepare(sql).get(...a).n;
const makeCrm = () => {
  const o = {
    up: true,
    calls: [],
    upsert(key, payload) {
      if (!o.up) throw new Error("CRM indisponível (simulado)");
      if (!o.calls.some((c) => c.key === key)) o.calls.push({ key, payload });
      return { ok: true };
    },
  };
  return o;
};

test("AT-01 primeiro WhatsApp: 1 mensagem, 1 pessoa, 1 oportunidade, 1 tarefa (3 dias, 09:00 de São Paulo), nenhum envio, sobrevive a reinício", () => {
  const db = newDb();
  const sent = [];
  let core = open(db.path, { transport: { send: (m) => sent.push(m) } });
  const r = feed(core, "whatsapp", waText({ id: "wamid.A", ts: iso("2026-11-20T15:00:00Z") }));
  assert.equal(r.status, 200);
  core.drain();
  core.close();
  core = open(db.path); // reinício
  assert.equal(count(core, "SELECT count(*) n FROM message"), 1);
  assert.equal(count(core, "SELECT count(*) n FROM person"), 1);
  assert.equal(count(core, "SELECT count(*) n FROM opportunity WHERE state='open'"), 1);
  const task = core.db.prepare("SELECT * FROM task").all();
  assert.equal(task.length, 1);
  assert.equal(task[0].due_at, "2026-11-23T12:00:00.000Z"); // 09:00 BRT (UTC-3) de 23/11
  assert.equal(sent.length, 0, "recepção não pode enviar nada");
  core.close();
  db.done();
});

test("AT-01 reentrega: 3 vezes em série e 8 processos em paralelo geram o mesmo resultado final", async () => {
  const db = newDb();
  const raw = waText({ id: "wamid.B", ts: iso("2026-11-20T15:00:00Z") });
  const core = open(db.path);
  for (let i = 0; i < 3; i++) {
    assert.equal(feed(core, "whatsapp", raw).status, 200);
    core.drain();
  }
  core.close();
  const file = join(db.dir, "payload.json");
  writeFileSync(file, raw);
  const runs = await Promise.all(
    Array.from({ length: 8 }, () =>
      new Promise((res, rej) => {
        const p = spawn(process.execPath, ["--no-warnings", WORKER, db.path, file], { stdio: ["ignore", "pipe", "pipe"] });
        let out = "", err = "";
        p.stdout.on("data", (d) => (out += d));
        p.stderr.on("data", (d) => (err += d));
        p.on("close", (code) => (code === 0 ? res(out) : rej(new Error(`worker saiu ${code}: ${err}`))));
      }),
    ),
  );
  assert.deepEqual([...new Set(runs)], ["200"]);
  const c2 = open(db.path);
  assert.equal(count(c2, "SELECT count(*) n FROM message"), 1);
  assert.equal(count(c2, "SELECT count(*) n FROM opportunity"), 1);
  assert.equal(count(c2, "SELECT count(*) n FROM task"), 1);
  assert.equal(count(c2, "SELECT count(*) n FROM event"), 1);
  c2.close();
  db.done();
});

test("segurança/AT-10: assinatura inválida => 401 e nada gravado; payload de 300 KB é aceito", () => {
  const db = newDb();
  const core = open(db.path);
  const raw = waText({ id: "wamid.C", ts: iso("2026-11-20T15:00:00Z") });
  assert.equal(core.ingest("whatsapp", raw, "sha256=" + "0".repeat(64)).status, 401);
  assert.equal(core.ingest("whatsapp", raw, undefined).status, 401);
  assert.equal(count(core, "SELECT count(*) n FROM raw_event"), 0);
  const big = waText({ id: "wamid.BIG", ts: iso("2026-11-20T15:00:00Z"), body: "x".repeat(300000) });
  assert.equal(feed(core, "whatsapp", big).status, 200);
  core.drain();
  assert.equal(count(core, "SELECT count(*) n FROM message"), 1);
  core.close();
  db.done();
});

test("AT-01/AT-05 BSUID: mensagem sem telefone é aceita; depois o telefone aparece e continua a mesma pessoa", () => {
  const db = newDb();
  const core = open(db.path);
  feed(core, "whatsapp", waText({ id: "wamid.D1", bsuid: "BR.SINT9", phone: null, ts: iso("2026-11-20T15:00:00Z") }));
  core.drain();
  feed(core, "whatsapp", waText({ id: "wamid.D2", bsuid: "BR.SINT9", phone: "5500000000009", ts: iso("2026-11-20T16:00:00Z") }));
  core.drain();
  feed(core, "whatsapp", waText({ id: "wamid.D3", phone: "5500000000009", ts: iso("2026-11-20T17:00:00Z") })); // só telefone
  core.drain();
  assert.equal(count(core, "SELECT count(*) n FROM message"), 3);
  assert.equal(count(core, "SELECT count(*) n FROM person"), 1);
  assert.equal(count(core, "SELECT count(*) n FROM identity"), 1);
  core.close();
  db.done();
});

test("AT-05 ficha unificada: Direct vinculado ao WhatsApp com evidência; última mensagem = Instagram; reversão preserva histórico e não mistura negócios", () => {
  const db = newDb();
  const core = open(db.path);
  feed(core, "whatsapp", waText({ id: "wamid.E", ts: iso("2026-11-20T15:00:00Z") }));
  core.drain();
  feed(core, "instagram", igText({ mid: "mid.E1", ts: iso("2026-11-20T18:00:00Z") }));
  core.drain();
  assert.equal(count(core, "SELECT count(*) n FROM person"), 2, "sem evidência não há fusão automática");
  const pWa = core.db.prepare("SELECT person_id p FROM identity WHERE provider='whatsapp'").get().p;
  const pIg = core.db.prepare("SELECT person_id p FROM identity WHERE provider='instagram'").get().p;
  core.linkIdentities({ identityProvider: "instagram", extId: "IGSID_SINT_1", toPersonId: pWa, evidence: "cliente confirmou no chat (fixture)", by: "operador-sint" });
  let f = core.getFicha(pWa);
  assert.deepEqual(f.channels.map((c) => c.provider).sort(), ["instagram", "whatsapp"]);
  assert.equal(f.lastInbound.provider, "instagram");
  assert.equal(f.lastInbound.occurredAt, "2026-11-20T18:00:00.000Z");
  assert.equal(f.messages.length, 2);
  core.unlinkIdentity({ identityProvider: "instagram", extId: "IGSID_SINT_1", by: "operador-sint", reason: "vínculo errado (fixture)" });
  f = core.getFicha(pWa);
  assert.deepEqual(f.channels.map((c) => c.provider), ["whatsapp"]);
  assert.equal(f.messages.length, 1);
  assert.equal(count(core, "SELECT count(*) n FROM message"), 2, "histórico preservado");
  const igPerson = core.db.prepare("SELECT person_id p FROM identity WHERE provider='instagram'").get().p;
  assert.equal(core.getFicha(igPerson).messages.length, 1, "o Direct volta a ter ficha própria");
  assert.ok(igPerson === pIg || igPerson !== pWa);
  assert.equal(count(core, "SELECT count(*) n FROM identity_link WHERE state='revoked'"), 1, "reversão auditada");
  core.close();
  db.done();
});

test("AT-03 atribuição: referral válido, ausente e inválido; primeiro e último toque; origem bruta intacta; etiqueta não reescreve", () => {
  const db = newDb();
  const core = open(db.path);
  const ad = (n) => ({ source_url: "https://exemplo.invalid/ad" + n, source_id: "AD_SINT_" + n, source_type: "ad", headline: "H" + n, ctwa_clid: "CLID_SINT_" + n });
  feed(core, "whatsapp", waText({ id: "wamid.F0", phone: "5500000000020", ts: iso("2026-11-20T10:00:00Z") }));
  core.drain();
  feed(core, "whatsapp", waText({ id: "wamid.F1", phone: "5500000000021", ts: iso("2026-11-20T10:00:00Z"), referral: ad(1) }));
  core.drain();
  feed(core, "whatsapp", waText({ id: "wamid.F2", phone: "5500000000021", ts: iso("2026-11-21T10:00:00Z"), referral: ad(2) }));
  core.drain();
  feed(core, "whatsapp", waText({ id: "wamid.F3", phone: "5500000000022", ts: iso("2026-11-20T10:00:00Z"), referral: { source_id: 12345 } }));
  core.drain();
  const pid = (ext) => core.db.prepare("SELECT person_id p FROM identity WHERE ext_id=?").get(ext).p;
  assert.equal(core.getFicha(pid("5500000000020")).attribution.status, "sem_atribuicao");
  const a1 = core.getFicha(pid("5500000000021")).attribution;
  assert.equal(a1.firstTouch.adId, "AD_SINT_1");
  assert.equal(a1.lastTouch.adId, "AD_SINT_2");
  assert.equal(a1.firstTouch.ctwaClid, "CLID_SINT_1");
  assert.equal(core.getFicha(pid("5500000000022")).attribution.status, "evidencia_invalida");
  const raw = () => JSON.parse(core.db.prepare("SELECT origin_raw o FROM attribution WHERE ad_id='AD_SINT_1'").get().o);
  assert.equal(raw().headline, "H1");
  core.relabel(pid("5500000000021"), "campanha-renomeada");
  assert.equal(raw().headline, "H1");
  feed(core, "instagram", igText({ mid: "mid.F9", igsid: "IGSID_SINT_7", ts: iso("2026-11-20T10:00:00Z"), referral: { ref: "r", ad_id: "AD_IG_SINT", source: "ADS", type: "OPEN_THREAD" } }));
  core.drain();
  assert.equal(core.getFicha(pid("IGSID_SINT_7")).attribution.firstTouch.adId, "AD_IG_SINT");
  core.close();
  db.done();
});

test("AT-10 CRM fora do ar: processamento local segue, outbox acumula, recupera após reinício, exatamente 1 entrega por evento", () => {
  const db = newDb();
  const crm = makeCrm();
  crm.up = false;
  let now = T0;
  let core = open(db.path, { crm, clock: () => now });
  feed(core, "whatsapp", waText({ id: "wamid.G1", phone: "5500000000110", ts: iso("2026-11-20T15:00:00Z") }));
  feed(core, "whatsapp", waText({ id: "wamid.G2", phone: "5500000000111", ts: iso("2026-11-20T15:00:00Z") }));
  core.drain();
  let r = core.deliverOutbox();
  assert.equal(r.delivered, 0);
  assert.equal(r.failed, 2);
  assert.equal(count(core, "SELECT count(*) n FROM message"), 2, "mensagens preservadas apesar do CRM");
  r = core.deliverOutbox();
  assert.equal(r.skippedBackoff, 2, "respeita o backoff");
  core.close();
  crm.up = true;
  now += 10 * 60 * 1000; // reinício, CRM volta e o tempo passa
  core = open(db.path, { crm, clock: () => now });
  r = core.deliverOutbox();
  assert.equal(r.delivered, 2);
  assert.equal(core.deliverOutbox().delivered, 0);
  assert.equal(crm.calls.length, 2);
  assert.equal(core.metrics().outboxPending, 0);
  core.close();
  db.done();
});

test("AT-02 contato conhecido: aberta recebe a mensagem; atrasada não retrocede o último contato; ganha => revisão sem lead duplicado; 2º projeto é explícito", () => {
  const db = newDb();
  const core = open(db.path);
  feed(core, "whatsapp", waText({ id: "wamid.H2", ts: iso("2026-11-20T15:00:00Z") }));
  core.drain();
  feed(core, "whatsapp", waText({ id: "wamid.H3", ts: iso("2026-11-20T18:00:00Z") }));
  core.drain();
  feed(core, "whatsapp", waText({ id: "wamid.H1", ts: iso("2026-11-19T09:00:00Z") })); // chega atrasada
  core.drain();
  const pid = core.db.prepare("SELECT person_id p FROM identity").get().p;
  let f = core.getFicha(pid);
  assert.equal(f.opportunities.length, 1);
  assert.equal(f.messages.length, 3);
  assert.equal(f.lastInbound.occurredAt, "2026-11-20T18:00:00.000Z");
  const oppId = f.opportunities[0].id;
  core.closeOpportunity(oppId, "won");
  feed(core, "whatsapp", waText({ id: "wamid.H4", ts: iso("2026-11-21T09:00:00Z") }));
  core.drain();
  f = core.getFicha(pid);
  assert.equal(f.opportunities.length, 1, "contato com negócio ganho não vira lead automático");
  assert.ok(f.tasks.some((t) => t.kind === "revisar_novo_projeto" && t.state === "aberta"));
  const second = core.createOpportunity(pid, "Segundo projeto (fixture)");
  assert.equal(core.getFicha(pid).opportunities.length, 2);
  assert.ok(second > oppId);
  core.close();
  db.done();
});

test("AT-02 concorrência: dois processadores sobre o mesmo arquivo não criam 2 leads para o mesmo contato novo", () => {
  const db = newDb();
  const c = open(db.path);
  feed(c, "whatsapp", waText({ id: "wamid.I1", ts: iso("2026-11-20T15:00:00Z") }));
  feed(c, "whatsapp", waText({ id: "wamid.I2", ts: iso("2026-11-20T15:00:01Z") }));
  c.close();
  const c1 = open(db.path);
  const c2 = open(db.path);
  c1.drain();
  c2.drain();
  assert.equal(count(c1, "SELECT count(*) n FROM opportunity"), 1);
  assert.equal(count(c1, "SELECT count(*) n FROM person"), 1);
  assert.equal(count(c1, "SELECT count(*) n FROM task"), 1);
  c1.close();
  c2.close();
  db.done();
});

test("AT-06 status fora de ordem e envio: read antes de delivered fica read; failed após read é ignorado; timeout deixa 'incerto' e não reenvia", () => {
  const db = newDb();
  const sends = [];
  const transport = {
    send: (m) => {
      sends.push(m);
      if (m.text === "TIMEOUT") throw Object.assign(new Error("timeout"), { code: "ETIMEDOUT" });
      return { externalId: "wamid.OUT1" };
    },
  };
  const core = open(db.path, { transport, budget: { cap: 5 } });
  feed(core, "whatsapp", waText({ id: "wamid.J0", ts: iso("2026-11-21T11:00:00Z") }));
  core.drain();
  const ident = core.db.prepare("SELECT id FROM identity").get().id;
  const ok = core.send({ identityId: ident, text: "resposta autorizada", authorizedBy: "operador-sint" });
  assert.equal(ok.state, "enviada");
  assert.equal(ok.externalId, "wamid.OUT1");
  for (const [status, ts] of [["read", "2026-11-21T11:05:00Z"], ["delivered", "2026-11-21T11:01:00Z"], ["failed", "2026-11-21T11:06:00Z"]]) {
    feed(core, "whatsapp", waStatus({ id: "wamid.OUT1", status, ts: iso(ts) }));
    core.drain();
  }
  assert.equal(core.db.prepare("SELECT status s FROM message WHERE ext_id='wamid.OUT1'").get().s, "read");
  const t = core.send({ identityId: ident, text: "TIMEOUT", authorizedBy: "operador-sint" });
  assert.equal(t.state, "incerto");
  const again = core.send({ identityId: ident, text: "TIMEOUT", authorizedBy: "operador-sint", idempotencyKey: t.idempotencyKey });
  assert.equal(again.state, "incerto");
  assert.equal(sends.filter((m) => m.text === "TIMEOUT").length, 1, "não reenviou às cegas");
  core.close();
  db.done();
});

test("AT-12 política única: envio sem autorização ou acima do orçamento é recusado; logs não carregam texto de cliente", () => {
  const db = newDb();
  const sends = [];
  const logs = [];
  const core = open(db.path, {
    transport: { send: (m) => (sends.push(m), { externalId: "x" + sends.length }) },
    budget: { cap: 1 },
    logger: (e) => logs.push(JSON.stringify(e)),
  });
  feed(core, "whatsapp", waText({ id: "wamid.K0", ts: iso("2026-11-21T11:00:00Z"), body: "TEXTO-SECRETO-SINT" }));
  core.drain();
  const ident = core.db.prepare("SELECT id FROM identity").get().id;
  assert.equal(core.send({ identityId: ident, text: "a" }).state, "recusada");
  assert.equal(core.send({ identityId: ident, text: "a", authorizedBy: "op" }).state, "enviada");
  const over = core.send({ identityId: ident, text: "b", authorizedBy: "op" });
  assert.equal(over.state, "recusada");
  assert.match(over.reason, /orçamento/);
  assert.equal(sends.length, 1);
  assert.ok(!logs.join("\n").includes("TEXTO-SECRETO-SINT"));
  core.close();
  db.done();
});

test("AT-14 canal novo sem mexer no núcleo: adaptador de teste só recebe; capacidades não oferecidas ficam explícitas", () => {
  const db = newDb();
  const core = open(db.path);
  assert.equal(feed(core, "canal-de-teste", testChannelMsg({ id: "tc.1", ts: iso("2026-11-21T11:00:00Z") })).status, 200);
  core.drain();
  const row = core.db.prepare("SELECT id, person_id FROM identity WHERE provider='canal-de-teste'").get();
  const f = core.getFicha(row.person_id);
  assert.equal(f.messages.length, 1);
  assert.equal(f.opportunities.length, 1);
  assert.deepEqual(f.channels[0].capabilities, { receive: true, reply: false, status: false, attachments: false });
  const r = core.send({ identityId: row.id, text: "x", authorizedBy: "op" });
  assert.equal(r.state, "recusada");
  assert.match(r.reason, /sem resposta/);
  core.close();
  db.done();
});

test("AT-13 IA desligada/quebrada: gancho opcional que lança erro não impede recepção, lead nem tarefa, e não inventa sugestão", () => {
  const db = newDb();
  const core = open(db.path, { aiHook: () => { throw new Error("modelo indisponível (simulado)"); } });
  feed(core, "whatsapp", waText({ id: "wamid.L0", ts: iso("2026-11-21T11:00:00Z") }));
  core.drain();
  assert.equal(count(core, "SELECT count(*) n FROM message"), 1);
  assert.equal(count(core, "SELECT count(*) n FROM opportunity"), 1);
  assert.equal(count(core, "SELECT count(*) n FROM task"), 1);
  assert.equal(count(core, "SELECT count(*) n FROM ai_suggestion"), 0);
  core.close();
  db.done();
});

test("AT-07 follow-up: fronteira de data no fuso, execução simultânea roda 1 vez, resposta em OUTRO canal cancela por política", () => {
  const db = newDb();
  let now = Date.parse("2026-11-20T00:00:00Z");
  let core = open(db.path, { clock: () => now });
  feed(core, "whatsapp", waText({ id: "wamid.M0", ts: iso("2026-11-21T02:30:00Z") })); // 23:30 de 20/11 em SP
  core.drain();
  assert.equal(core.db.prepare("SELECT due_at d FROM task").get().d, "2026-11-23T12:00:00.000Z"); // 20/11 + 3 dias, 09:00 BRT
  core.close();
  core = open(db.path, { clock: () => now });
  now = Date.parse("2026-11-23T11:59:59Z");
  assert.equal(core.runDueTasks().executed, 0, "um segundo antes");
  now = Date.parse("2026-11-23T12:00:00Z");
  const core2 = open(db.path, { clock: () => now });
  const a = core.runDueTasks().executed;
  const b = core2.runDueTasks().executed;
  assert.equal(a + b, 1);
  core.close();
  core2.close();
  db.done();

  const db2 = newDb();
  const c = open(db2.path, { clock: () => Date.parse("2026-11-20T00:00:00Z") });
  feed(c, "whatsapp", waText({ id: "wamid.N0", ts: iso("2026-11-20T12:00:00Z") }));
  c.drain();
  feed(c, "instagram", igText({ mid: "mid.N1", ts: iso("2026-11-20T13:00:00Z") }));
  c.drain();
  const p1 = c.db.prepare("SELECT person_id p FROM identity WHERE provider='whatsapp'").get().p;
  c.linkIdentities({ identityProvider: "instagram", extId: "IGSID_SINT_1", toPersonId: p1, evidence: "fixture", by: "op" });
  c.setPolicy({ onReplyOtherChannel: "cancelar" });
  feed(c, "instagram", igText({ mid: "mid.N2", ts: iso("2026-11-21T10:00:00Z") }));
  c.drain();
  assert.equal(c.db.prepare("SELECT state s FROM task WHERE kind='followup' AND person_id=?").get(p1).s, "cancelada");
  c.close();
  db2.done();
});
