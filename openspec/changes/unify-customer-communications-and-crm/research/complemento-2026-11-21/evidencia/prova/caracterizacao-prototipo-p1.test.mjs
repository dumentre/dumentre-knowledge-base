// Caracterização (não é TDD de comportamento novo): documenta o que o protótipo P1 JÁ faz em 3 pontos
// levantados na revisão adversarial. Só leitura do protótipo; fixtures sintéticas; SQLite em diretório temporário
// (use TEMP/TMP apontando para a pasta _cache/tmp desta pasta).
// Executa: node --no-warnings --test evidencia/prova/caracterizacao-prototipo-p1.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openCore } from "../../../evidence/prototipo/core.mjs";
import { SECRET, sign, waText, igText } from "../../../evidence/prototipo/fixtures.mjs";

const T0 = Date.parse("2026-11-21T12:00:00Z");
const mk = () => { const d = mkdtempSync(join(tmpdir(), "carac-")); const c = openCore({ path: join(d, "c.sqlite"), secret: SECRET, clock: () => T0 }); return { c, done: () => { c.close(); rmSync(d, { recursive: true, force: true }); } }; };
const n = (c, sql) => c.db.prepare(sql).get().n;

test("C1 payload assinado porém malformado: responde 200, nenhum evento, parse_error gravado (sucesso prematuro: a Meta NÃO retenta)", () => {
  const { c, done } = mk();
  const raw = JSON.stringify({ object: "instagram", entry: 5 }); // entry não iterável: extract lança
  const r = c.ingest("instagram", raw, sign(raw));
  c.drain();
  assert.equal(r.status, 200);
  assert.equal(n(c, "SELECT count(*) n FROM event"), 0);
  assert.equal(n(c, "SELECT count(*) n FROM raw_event WHERE parse_error IS NOT NULL"), 1, "só o campo parse_error denuncia; nenhum alerta/contador próprio no protótipo");
  done();
});

test("C2 lote com 2 mensagens no mesmo POST: o núcleo extrai as 2 (o Chatwoot v4.20.1 processaria só a primeira)", () => {
  const { c, done } = mk();
  const a = JSON.parse(waText({ id: "wamid.A", ts: 1766318400 }));
  const b = JSON.parse(waText({ id: "wamid.B", ts: 1766318401 }));
  a.entry[0].changes[0].value.messages.push(b.entry[0].changes[0].value.messages[0]);
  const raw = JSON.stringify(a);
  assert.equal(c.ingest("whatsapp", raw, sign(raw)).status, 200);
  c.drain();
  assert.equal(n(c, "SELECT count(*) n FROM message"), 2);
  done();
});

test("C3 eco do Instagram (is_echo) é descartado pelo adaptador: nenhuma mensagem de saída registrada", () => {
  const { c, done } = mk();
  const base = JSON.parse(igText({ mid: "mid.ECO", ts: 1766318400 }));
  base.entry[0].messaging[0].message.is_echo = true;
  const raw = JSON.stringify(base);
  assert.equal(c.ingest("instagram", raw, sign(raw)).status, 200);
  c.drain();
  assert.equal(n(c, "SELECT count(*) n FROM event"), 0);
  assert.equal(n(c, "SELECT count(*) n FROM message"), 0, "o comentário do adaptador diz 'ecos entram por outro caminho', que não existe no protótipo");
  done();
});
