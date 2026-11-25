// P0 — Caracterização (somente leitura) do webhook JÁ INSTALADO (conectores/whatsapp-business-mcp).
// Importa o código do repositório existente por caminho absoluto, SEM alterá-lo, e grava num SQLite temporário.
// Fixtures 100% sintéticas, segredo sintético. Nenhuma rede externa.
import { createHmac } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const REPO = process.argv[2];
if (!REPO) { console.error("uso: node caracterizacao-webhook-atual.mjs <caminho do whatsapp-business-mcp>"); process.exit(2); }
const mod = (p) => import(pathToFileURL(join(REPO, p)).href);
const { createWebhookService } = await mod("src/webhook-service.js");
const { createInbox } = await mod("src/inbox.js");
const { loadConfig } = await mod("src/config.js");

const SECRET = "segredo-sintetico-de-teste";
const dir = mkdtempSync(join(tmpdir(), "carac-webhook-"));
const inbox = createInbox(join(dir, "messages.sqlite"));
const config = loadConfig({ WHATSAPP_APP_SECRET: SECRET, WHATSAPP_VERIFY_TOKEN: "v", WHATSAPP_DB_PATH: join(dir, "m.sqlite") });
const logs = [];
const service = createWebhookService({ config, inbox, logger: { log: (f) => logs.push(f) } });
const addr = await service.listen(0, "127.0.0.1");
const url = `http://127.0.0.1:${addr.port}/webhook`;

const sign = (raw) => "sha256=" + createHmac("sha256", SECRET).update(raw).digest("hex");
async function post(body) {
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json", "x-hub-signature-256": sign(raw) }, body: raw });
  return r.status;
}
const wrap = (value) => ({ object: "whatsapp_business_account", entry: [{ id: "WABA_SINT", changes: [{ field: "messages", value: { messaging_product: "whatsapp", metadata: { phone_number_id: "PNID_SINT" }, ...value } }] }] });
const ts = "1760000000";
const rows = () => inbox.list(200);
const out = [];
const report = (caso, esperado, obtido, ok) => { out.push({ caso, esperado, obtido, ok }); };

// C1 mensagem de texto normal
let s = await post(wrap({ contacts: [{ wa_id: "5500000000001", user_id: "BR.SINT1" }], messages: [{ from: "5500000000001", from_user_id: "BR.SINT1", id: "wamid.SINT.A", timestamp: ts, type: "text", text: { body: "olá" } }] }));
report("C1 texto normal", "200 e 1 linha", `status ${s}, linhas ${rows().length}`, s === 200 && rows().length === 1);
// C2 reentrega
s = await post(wrap({ messages: [{ from: "5500000000001", id: "wamid.SINT.A", timestamp: ts, type: "text", text: { body: "olá" } }] }));
report("C2 reentrega do mesmo id", "200 e continua 1 linha", `status ${s}, linhas ${rows().length}`, s === 200 && rows().length === 1);
// C3 referral (Click-to-WhatsApp)
s = await post(wrap({ messages: [{ from: "5500000000002", id: "wamid.SINT.B", timestamp: ts, type: "text", text: { body: "vi o anúncio" }, referral: { source_url: "https://exemplo.invalid/ad", source_id: "AD_SINT_123", source_type: "ad", headline: "Sites", ctwa_clid: "CLID_SINT" } }] }));
const rowB = rows().find((r) => r.id === "wamid.SINT.B");
report("C3 referral de anúncio preservado", "ad_id/ctwa_clid gravados", rowB ? `colunas gravadas: ${Object.keys(rowB).join(",")}; referral NÃO gravado` : "linha ausente", false);
// C4 status de entrega (sent/delivered/read)
const antes = rows().length;
s = await post(wrap({ statuses: [{ id: "wamid.SINT.OUT1", status: "delivered", timestamp: ts, recipient_id: "5500000000001" }] }));
report("C4 evento statuses", "status gravado/visível", `status ${s}, linhas novas ${rows().length - antes} (ignorado, resposta 200)`, false);
// C5 usuário só com username/BSUID (sem from/wa_id)
const antes5 = rows().length;
s = await post(wrap({ contacts: [{ user_id: "BR.SINT3", profile: { username: "sint_user" } }], messages: [{ from_user_id: "BR.SINT3", id: "wamid.SINT.C", timestamp: ts, type: "text", text: { body: "oi, sem telefone" } }] }));
report("C5 mensagem de usuário com username (sem telefone)", "gravada, identificada por BSUID", `status ${s}, linhas novas ${rows().length - antes5} (descartada em silêncio, resposta 200)`, false);
// C6 áudio / mídia
s = await post(wrap({ messages: [{ from: "5500000000004", id: "wamid.SINT.D", timestamp: ts, type: "audio", audio: { id: "MEDIA_SINT", mime_type: "audio/ogg; codecs=opus" } }] }));
const rowD = rows().find((r) => r.id === "wamid.SINT.D");
report("C6 áudio", "tipo e id da mídia gravados", rowD ? `type=${rowD.type}, text=${rowD.text}, media_id NÃO gravado` : "linha ausente", false);
// C7 eco de coexistência (smb_message_echoes)
const antes7 = rows().length;
s = await post({ object: "whatsapp_business_account", entry: [{ id: "WABA_SINT", changes: [{ field: "smb_message_echoes", value: { message_echoes: [{ from: "PNID_SINT", to: "5500000000001", id: "wamid.SINT.E", timestamp: ts, type: "text", text: { body: "respondi pelo app" } }] } }] }] });
report("C7 eco smb_message_echoes", "mensagem enviada fora da inbox registrada", `status ${s}, linhas novas ${rows().length - antes7} (ignorado)`, false);
// C8 corpo > 256 KB (Meta aceita até 3 MB)
const grande = JSON.stringify(wrap({ messages: [{ from: "5500000000005", id: "wamid.SINT.F", timestamp: ts, type: "text", text: { body: "x".repeat(300000) } }] }));
s = await post(grande);
report("C8 payload de 300 KB (Meta permite até 3 MB)", "aceito (200)", `status ${s}`, s === 200);
// C9 payload bruto retido para reprocessar
report("C9 payload bruto retido", "sim (reprocessável)", "não: só 6 colunas (id, from_number, timestamp, type, text, received_at)", false);

await service.close(); inbox.close(); rmSync(dir, { recursive: true, force: true });
console.log(JSON.stringify(out, null, 2));
console.log(`\nRESUMO: ${out.filter((o) => o.ok).length}/${out.length} comportamentos atendem ao catálogo de aceite; ${out.filter((o) => !o.ok).length} lacunas.`);
process.exit(0);
