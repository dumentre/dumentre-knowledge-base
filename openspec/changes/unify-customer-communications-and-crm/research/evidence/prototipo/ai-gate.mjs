// P2: contrato versionado e "portão" determinístico para IA. A IA só PRODUZ dados; quem aplica é código determinístico + humano.
export const SCHEMA_VERSION = "extract.v1";
const ALLOWED_KEYS = new Set(["schema", "project_type", "budget_brl", "deadline", "actions"]);
const PROJECT_TYPES = new Set(["site", "automacao", "sistema", "outro"]);

function numbersIn(text) {
  const out = new Set();
  for (const m of text.matchAll(/(\d+(?:[.,]\d+)?)\s*(mil|k)\b/gi)) out.add(Math.round(parseFloat(m[1].replace(",", ".")) * 1000));
  for (const m of text.matchAll(/\d{1,3}(?:\.\d{3})+|\d+/g)) out.add(Number(m[0].replace(/\./g, "")));
  return out;
}

export function validateExtraction(out, messages) {
  const violations = [];
  if (out === null || typeof out !== "object" || Array.isArray(out)) return { violations: ["nao_e_objeto"] };
  if (out.schema !== SCHEMA_VERSION) violations.push("schema_invalido");
  for (const k of Object.keys(out)) if (!ALLOWED_KEYS.has(k)) violations.push(`campo_extra:${k}`);
  const byRef = new Map(messages.map((m) => [m.ref, m.text]));
  for (const f of ["project_type", "budget_brl", "deadline"]) {
    const field = out[f];
    if (field === undefined) continue;
    if (field === null || typeof field !== "object" || !("value" in field) || !Array.isArray(field.evidence)) { violations.push(`${f}:formato_invalido`); continue; }
    if (field.value === null) continue; // abstenção é sempre válida
    if (field.evidence.length === 0 || field.evidence.some((r) => !byRef.has(r))) { violations.push(`${f}:evidencia_inexistente`); continue; }
    const text = field.evidence.map((r) => byRef.get(r)).join(" \n ");
    if (f === "budget_brl" && !numbersIn(text).has(Number(field.value))) violations.push("budget_brl:valor_sem_suporte_no_texto");
    if (f === "deadline" && !text.toLowerCase().includes(String(field.value).toLowerCase())) violations.push("deadline:valor_sem_suporte_no_texto");
    if (f === "project_type" && !PROJECT_TYPES.has(field.value)) violations.push("project_type:valor_fora_do_enum");
  }
  // Nenhuma ação é permitida na extração: envio, vínculo de clientes, cobrança e política ficam fora do alcance do modelo.
  if (out.actions !== undefined) {
    if (!Array.isArray(out.actions)) violations.push("actions:formato_invalido");
    else for (const a of out.actions) violations.push(`acao_proibida:${a?.kind ?? "desconhecida"}`);
  }
  return { violations };
}

export async function runAi({ model, messages, timeoutMs = 5000 }) {
  let timer;
  try {
    const out = await Promise.race([
      Promise.resolve().then(() => model({ messages })),
      new Promise((_, rej) => { timer = setTimeout(() => rej(Object.assign(new Error("timeout"), { code: "TIMEOUT" })), timeoutMs); }),
    ]);
    const { violations } = validateExtraction(out, messages);
    if (violations.length) return { status: "invalida", suggestion: null, violations };
    return { status: "ok", suggestion: out, violations: [] };
  } catch (e) {
    return { status: e.code === "TIMEOUT" ? "timeout" : "indisponivel", suggestion: null, violations: [] };
  } finally {
    clearTimeout(timer);
  }
}

// A superfície de aplicação é um objeto mínimo: só o que o contrato permite. Não há send/merge/billing aqui.
export function applySuggestion({ suggestion, messages, authorizedBy, surface }) {
  if (!authorizedBy) throw new Error("aplicar sugestão requer autorização humana");
  const { violations } = validateExtraction(suggestion, messages);
  if (violations.length) throw new Error(`violação do contrato: ${violations.join(",")}`);
  if (suggestion.budget_brl?.value != null) surface.setOpportunityValue(suggestion.budget_brl.value);
}
