#!/usr/bin/env python3
"""Gera research/08-rastreabilidade.md a partir do catálogo (02), das specs e das tarefas (tasks.md).
Fonte única: o catálogo e as specs. Rode: python -I gerar_matriz.py <pasta da change>"""
import re, sys, pathlib, collections

root = pathlib.Path(sys.argv[1])
cat = (root / "research/02-catalogo-aceite.md").read_text(encoding="utf-8")
tasks = (root / "tasks.md").read_text(encoding="utf-8")

# ---- cenários nas specs: id -> (capacidade, requisito)
spec_of = {}
for f in sorted((root / "specs").glob("*/spec.md")):
    cap = f.parent.name; req = None
    for line in f.read_text(encoding="utf-8").splitlines():
        m = re.match(r"### Requirement: (.+)", line)
        if m: req = m.group(1).strip()
        m = re.match(r"#### Scenario: (AT-\d\d\.\d+)", line)
        if m: spec_of[m.group(1)] = (cap, req)

# ---- tarefas por cenário (lê só o trecho "**Aceite:** ..." de cada tarefa; expande faixas e listas)
task_of = collections.defaultdict(list)
for line in tasks.splitlines():
    m = re.match(r"- \[[ x]\] (\d+\.\d+)", line)
    if not m or "**Aceite:**" not in line: continue
    tid = m.group(1)
    seg = line.split("**Aceite:**", 1)[1].split("**", 1)[0]
    ids = set()
    for r in re.finditer(r"(?:AT-)?(\d\d)\.(\d+)\s+a\s+(?:AT-)?(\d\d)\.(\d+)", seg):
        ids.update(f"AT-{r.group(1)}.{i}" for i in range(int(r.group(2)), int(r.group(4)) + 1))
    for r in re.finditer(r"AT-(\d\d)\.(\d+)((?:\s*,\s*(?:AT-)?(?:\d\d\.)\d+)*)", seg):
        ids.add(f"AT-{r.group(1)}.{r.group(2)}")
        for q in re.finditer(r"(?:AT-)?(\d\d)\.(\d+)", r.group(3)): ids.add(f"AT-{q.group(1)}.{q.group(2)}")
    for i in ids: task_of[i].append(tid)

COMP = {
 "ingestao-eventos": "Borda (webhook-service evoluído) + núcleo Node 22/SQLite; Meta Graph API v26+",
 "identidade-ficha-unificada": "Núcleo (identity/identity_link) + ficha; Chatwoot v4.20.1 (contato)",
 "canais-adaptadores": "Chatwoot Community v4.20.1 (canais) + adaptadores do núcleo",
 "atribuicao-origem": "Borda/núcleo (attribution); Meta webhooks (referral/leadgen)",
 "comercial-followup": "Núcleo (opportunity/task/policy) + Dashboard App",
 "billing": "Núcleo (livro interno) + gateway a definir (D8)",
 "operacao-seguranca-custos": "Núcleo (send/budget) + backup (PG, anexos, SQLite)",
 "ia-opcional": "Núcleo (ai_suggestion) + portão ai-gate (stub); modelo real a definir",
}
P1 = {  # cenário -> teste executado (arquivo › nome curto)
 "AT-01.1": "core.test.mjs › t1", "AT-01.2": "core.test.mjs › t1", "AT-01.3": "core.test.mjs › t2", "AT-01.4": "core.test.mjs › t4",
 "AT-01.5": "core.test.mjs › t3", "AT-01.6": "core.test.mjs › t1", "AT-01.7": "core.test.mjs › t3",
 "AT-02.1": "core.test.mjs › t8", "AT-02.2": "core.test.mjs › t8", "AT-02.3": "core.test.mjs › t8", "AT-02.4": "core.test.mjs › t8", "AT-02.5": "core.test.mjs › t9", "AT-02.6": "core.test.mjs › t8,t9 + mutante",
 "AT-03.1": "core.test.mjs › t6", "AT-03.2": "core.test.mjs › t6 (fixture)", "AT-03.6": "core.test.mjs › t6", "AT-03.7": "core.test.mjs › t6", "AT-03.9": "core.test.mjs › t6",
 "AT-05.1": "core.test.mjs › t5", "AT-05.2": "core.test.mjs › t5 (dados, sem UI)", "AT-05.3": "core.test.mjs › t5", "AT-05.4": "core.test.mjs › t14 (sem asserção dedicada)",
 "AT-06.2": "core.test.mjs › t10", "AT-06.3": "core.test.mjs › t10",
 "AT-07.1": "core.test.mjs › t14", "AT-07.2": "core.test.mjs › t14", "AT-07.3": "core.test.mjs › t14 (ramo cancelar)", "AT-07.5": "core.test.mjs › t14", "AT-07.6": "core.test.mjs › t14",
 "AT-10.1": "core.test.mjs › t7", "AT-10.2": "core.test.mjs › t2",
 "AT-12.1": "core.test.mjs › t11,t12", "AT-12.2": "core.test.mjs › t11",
 "AT-13.1": "core.test.mjs › t13", "AT-13.2": "ai-gate.test.mjs › 9 testes", "AT-13.3": "ai-gate.test.mjs › injeção",
 "AT-14.1": "core.test.mjs › t12", "AT-14.2": "core.test.mjs › t12",
}
PARTIAL = {"AT-05.4", "AT-07.4", "AT-10.4", "AT-12.4", "AT-05.2"}
SANDBOX = {"AT-03.2","AT-03.3","AT-03.4","AT-03.8","AT-04.1","AT-04.2","AT-04.3","AT-04.6","AT-04.8","AT-06.1","AT-06.4","AT-10.3","AT-11.1","AT-11.5","AT-01.9"}
CHATWOOT = {"AT-04.4","AT-04.5","AT-05.2","AT-05.6","AT-08.4","AT-10.5","AT-11.4","AT-04.7"}
WEBHOOK_ATUAL_REPROVA = {"AT-01.4": "P0 C5", "AT-01.7": "P0 C8", "AT-01.8": "P0 C9", "AT-01.9": "P0 C6", "AT-04.8": "P0 C7"}

def blocker(i, estado):
    if estado == "aprovado": return "—"
    parts = []
    if i in SANDBOX: parts.append("conta/canal real de teste (A2–A4; D7)")
    if i in CHATWOOT: parts.append("Chatwoot instalado (G-CAP, A1)")
    if i.startswith("AT-09"): parts.append("D8 (gateway/NFS-e)")
    if i in {"AT-04.4"}: parts.append("D11 (SMTP)")
    if i in {"AT-12.5","AT-01.8"}: parts.append("D4 (retenção/LGPD)")
    if i == "AT-04.6": parts.append("aprovação TikTok")
    if i.startswith("AT-13.3") and estado != "executado-mock": parts.append("modelo real + orçamento")
    return "; ".join(parts) if parts else "implementação (tarefa abaixo)"

rows = []
for line in cat.splitlines():
    if not re.match(r"\| AT-\d\d\.\d+ ", line): continue
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    i = cells[0]; txt = cells[-1].lower()
    if i in P1 and i not in PARTIAL: estado = "executado-mock"
    elif i in PARTIAL and i in P1: estado = "executado-mock (parcial)"
    elif i in PARTIAL: estado = "executado-mock (parcial)"
    elif "pendente-externo" in txt and i not in P1: estado = "pendente-externo"
    else: estado = "planejado"
    if i in SANDBOX and estado == "planejado": estado = "pendente-externo"
    cap, req = spec_of.get(i, ("(sem cenário na spec)", ""))
    ev = []
    if i in P1: ev.append(f"evidence/saidas/p1-tdd-green.txt" if P1[i].startswith("core") else "evidence/saidas/p2-tdd-green.txt")
    if i in WEBHOOK_ATUAL_REPROVA: ev.append(f"evidence/saidas/p0-caracterizacao-webhook-atual.txt ({WEBHOOK_ATUAL_REPROVA[i]}: **webhook atual reprova**)")
    rows.append((i, cap, req, COMP.get(cap, "?"), "; ".join(ev) or "—", P1.get(i, "a escrever (" + ", ".join("tarefa " + t for t in task_of.get(i, ["?"])) + ")"),
                 estado, blocker(i, estado), ", ".join(task_of.get(i, ["?"]))))

missing = [r[0] for r in rows if r[1].startswith("(sem")]
cnt = collections.Counter(r[6] for r in rows)
out = []
out.append("# 08. Matriz única de rastreabilidade\n")
out.append("**Gerada por `research/evidence/tools/gerar_matriz.py` a partir do catálogo (02), das specs e das tarefas.** Não editar à mão: mude a fonte e regenere.\n")
out.append("Colunas: **requisito** (capacidade › requisito da spec) | **cenário** (ID `AT-xx.y`, texto normativo na spec) | **componente/versão** | **evidência** | **teste** | **resultado** | **bloqueio** | tarefa.\n")
out.append("Vocabulário de resultado: `planejado` (escrito, sem execução) · `executado-mock` (rodou contra fixture/mock local nosso; **não é aprovação**) · `aprovado` (provado contra serviço real/sandbox) · `reprovado` · `pendente-externo` (depende de conta, autorização ou decisão). **`aprovado` = 0 nesta fase, por construção** (nenhuma prova usou Chatwoot, Meta ou serviço real).\n")
out.append("## Resumo\n")
out.append("| Resultado | Microcenários |\n|---|---|")
for k in ["aprovado", "reprovado", "executado-mock", "executado-mock (parcial)", "pendente-externo", "planejado"]:
    out.append(f"| {k} | {cnt.get(k, 0)} |")
out.append(f"| **Total** | **{len(rows)}** |\n")
out.append(f"Microcenários do catálogo sem cenário na spec: **{len(missing)}** {missing if missing else ''}\n")
out.append("Reprovações do **componente existente** (webhook instalado, commit `03584b1`) medidas em P0: AT-01.4, AT-01.7, AT-01.8, AT-01.9, AT-04.8 (e `referral`/`statuses`, que sustentam AT-03.1 e AT-06). Isso reprova o **componente atual**, não os cenários: eles seguem como requisito da implementação nova.\n")
out.append("## Matriz\n")
out.append("| Cenário | Requisito (capacidade › requisito) | Componente/versão | Evidência | Teste | Resultado | Bloqueio | Tarefa |\n|---|---|---|---|---|---|---|---|")
for r in rows:
    out.append(f"| {r[0]} | {r[1]} › {r[2]} | {r[3]} | {r[4]} | {r[5]} | {r[6]} | {r[7]} | {r[8]} |")
(root / "research/08-rastreabilidade.md").write_text("\n".join(out) + "\n", encoding="utf-8")
print("linhas", len(rows), dict(cnt), "sem_spec", missing)
unmapped = [r[0] for r in rows if r[8] == "?"]
print("sem tarefa:", unmapped)
