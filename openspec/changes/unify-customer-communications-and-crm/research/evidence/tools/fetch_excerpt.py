#!/usr/bin/env python3
"""Busca uma URL pública (GET apenas), registra metadados em fontes/fetch-log.jsonl e
imprime só trechos que casam com as palavras-chave. Não grava o conteúdo da página.
Uso: python -I fetch_excerpt.py URL [-k palavra]... [-w 160] [--max 12]"""
import argparse, hashlib, json, re, sys, urllib.request, datetime, html, os
ap = argparse.ArgumentParser()
ap.add_argument("url"); ap.add_argument("-k", action="append", default=[])
ap.add_argument("-w", type=int, default=160); ap.add_argument("--max", type=int, default=1, help="ocorrências por palavra-chave")
ap.add_argument("--head", type=int, default=0, help="imprime os N primeiros caracteres do texto")
a = ap.parse_args(); sys.stdout.reconfigure(encoding="utf-8", errors="replace")
req = urllib.request.Request(a.url, headers={"User-Agent": "Mozilla/5.0 (research; read-only GET)", "Accept-Language": "en,pt-BR"})
log = os.path.join(os.path.dirname(__file__), "..", "..", "fontes", "fetch-log.jsonl")
rec = {"url": a.url, "date": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")}
try:
    with urllib.request.urlopen(req, timeout=30) as r:
        raw = r.read(3_000_000); rec.update(status=r.status, bytes=len(raw), sha256=hashlib.sha256(raw).hexdigest()[:16], final=r.geturl())
except Exception as e:
    rec.update(status="erro", erro=str(e)[:120]); open(log, "a", encoding="utf-8").write(json.dumps(rec, ensure_ascii=False) + "\n"); print("ERRO", rec); sys.exit(1)
open(log, "a", encoding="utf-8").write(json.dumps(rec, ensure_ascii=False) + "\n")
t = raw.decode("utf-8", "replace")
t = re.sub(r"(?is)<(script|style|noscript).*?</\1>", " ", t)
t = html.unescape(re.sub(r"(?s)<[^>]+>", " ", t)); t = re.sub(r"\s+", " ", t)
print(f"[{rec['status']}] {a.url} bytes={rec['bytes']} sha={rec['sha256']} textlen={len(t)}")
if a.head: print(t[:a.head])
n = 0
t = re.sub(r"_jsx[^`]{0,200}`", " ", t)
for k in a.k:
    c = 0
    for m in re.finditer(re.escape(k), t, re.I):
        s = max(0, m.start() - a.w); print(f"  «{k}» …{t[s:m.end()+a.w]}…"); c += 1
        if c >= a.max: break
