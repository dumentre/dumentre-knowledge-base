// Processo-trabalhador da prova de concorrência: abre o MESMO arquivo SQLite, ingere e drena.
import { readFileSync } from "node:fs";
import { openCore } from "./core.mjs";
import { SECRET, sign } from "./fixtures.mjs";

const [dbPath, payloadFile] = process.argv.slice(2);
const raw = readFileSync(payloadFile, "utf8");
const core = openCore({ path: dbPath, secret: SECRET, clock: () => Date.parse("2026-11-21T12:00:00Z") });
const r = core.ingest("whatsapp", raw, sign(raw));
core.drain();
core.close();
process.stdout.write(String(r.status));
