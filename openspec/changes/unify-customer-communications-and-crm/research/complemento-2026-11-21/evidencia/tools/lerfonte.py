#!/usr/bin/env python3
"""Leitura de fonte publica (GET apenas, sem login). Grava o corpo em _cache/ (descartavel),
registra URL/status/bytes/sha256 em ../../fontes-log.jsonl (desta pasta) e imprime trechos.
Uso: python -I lerfonte.py URL [-k palavra]... [-w 200] [--max 3] [--head N] [--raw] [--ua browser]"""
import argparse, hashlib, json, re, sys, urllib.request, datetime, html, os
ap = argparse.ArgumentParser()
ap.add_argument("url"); ap.add_argument("-k", action="append", default=[])
ap.add_argument("-w", type=int, default=200); ap.add_argument("--max", type=int, default=3)
ap.add_argument("--head", type=int, default=0); ap.add_argument("--raw", action="store_true", help="nao remove tags (JSON/CSV/codigo)")
ap.add_argument("--limit", type=int, default=6_000_000)
a = ap.parse_args(); sys.stdout.reconfigure(encoding="utf-8", errors="replace")
base = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..")
log = os.path.join(base, "fontes-log.jsonl"); cache = os.path.join(base, "_cache"); os.makedirs(cache, exist_ok=True)
req = urllib.request.Request(a.url, headers={"User-Agent": "Mozilla/5.0 (pesquisa; leitura publica GET)", "Accept-Language": "en,pt-BR"})
rec = {"url": a.url, "lido_em": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")}
try:
    with urllib.request.urlopen(req, timeout=40) as r:
        raw = r.read(a.limit); rec.update(status=r.status, bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest()[:16], final=r.geturl(), tipo=r.headers.get("Content-Type"))
except Exception as e:
    rec.update(status="erro", erro=str(e)[:160]); open(log, "a", encoding="utf-8").write(json.dumps(rec, ensure_ascii=False) + "\n"); print("ERRO", rec); sys.exit(1)
open(log, "a", encoding="utf-8").write(json.dumps(rec, ensure_ascii=False) + "\n")
open(os.path.join(cache, rec["sha256"] + ".bin"), "wb").write(raw)
t = raw.decode("utf-8", "replace")
if not a.raw:
    t = re.sub(r"(?is)<(script|style|noscript).*?</\1>", " ", t); t = html.unescape(re.sub(r"(?s)<[^>]+>", " ", t)); t = re.sub(r"[ \t\r\f]+", " ", t); t = re.sub(r"\n\s*\n+", "\n", t)
print(f"[{rec['status']}] {a.url} -> {rec['final']} bytes={rec['bytes']} sha={rec['sha256']} tipo={rec['tipo']} textlen={len(t)}")
if a.head: print(t[:a.head])
for k in a.k:
    c = 0
    for m in re.finditer(k, t, re.I):
        s = max(0, m.start() - a.w); print(f"  «{k}» …{t[s:m.end()+a.w]}…".replace("\n", " ⏎ ")); c += 1
        if c >= a.max: break
    if c == 0: print(f"  «{k}» NAO ENCONTRADO no texto lido (nao e evidencia de inexistencia)")
