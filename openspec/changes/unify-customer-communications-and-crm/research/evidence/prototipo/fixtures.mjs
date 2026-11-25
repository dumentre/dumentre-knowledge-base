// Fixtures sintéticas. Nenhum número, nome ou ID real. Telefones 5500000000xxx, IDs "SINT".
import { createHmac } from "node:crypto";

export const SECRET = "segredo-sintetico-de-teste";
export const sign = (raw) => "sha256=" + createHmac("sha256", SECRET).update(raw).digest("hex");

const wrap = (value, field = "messages") =>
  JSON.stringify({
    object: "whatsapp_business_account",
    entry: [{ id: "WABA_SINT", changes: [{ field, value: { messaging_product: "whatsapp", metadata: { phone_number_id: "PNID_SINT" }, ...value } }] }],
  });

export const waText = ({ id, phone = "5500000000001", bsuid, ts, body = "olá", referral }) =>
  wrap({
    contacts: [{ ...(phone ? { wa_id: phone } : {}), ...(bsuid ? { user_id: bsuid } : {}), profile: { name: "Pessoa Sintética" } }],
    messages: [{ ...(phone ? { from: phone } : {}), ...(bsuid ? { from_user_id: bsuid } : {}), id, timestamp: String(ts), type: "text", text: { body }, ...(referral ? { referral } : {}) }],
  });

export const waAudio = ({ id, phone = "5500000000001", ts }) =>
  wrap({ contacts: [{ wa_id: phone }], messages: [{ from: phone, id, timestamp: String(ts), type: "audio", audio: { id: "MEDIA_SINT", mime_type: "audio/ogg" } }] });

export const waStatus = ({ id, status, ts, phone = "5500000000001" }) =>
  wrap({ statuses: [{ id, status, timestamp: String(ts), recipient_id: phone }] });

export const igText = ({ mid, igsid = "IGSID_SINT_1", ts, body = "oi pelo direct", referral }) =>
  JSON.stringify({
    object: "instagram",
    entry: [{ id: "IGACC_SINT", time: ts, messaging: [{ sender: { id: igsid }, recipient: { id: "IGACC_SINT" }, timestamp: ts * 1000, message: { mid, text: body, ...(referral ? { referral } : {}) } }] }],
  });

export const testChannelMsg = ({ id, who = "TC_SINT_1", ts }) =>
  JSON.stringify({ object: "canal-de-teste", items: [{ id, from: who, ts, text: "mensagem do canal de teste" }] });

export const iso = (s) => Math.floor(Date.parse(s) / 1000);
