#!/usr/bin/env python3
"""Leitura de codigo em tag fixa (GET): lista arquivos do repo na tag e procura regex nos caminhos filtrados.
Uso: python -I repogrep.py owner/repo TAG "regex_conteudo" "filtro_caminho_regex" [--ext rb,py,...] [--show N] [--cat caminho]
--cat imprime o arquivo (ate 400 linhas) ou, com --lines a-b, um intervalo. Resultados 'sem hit' NAO provam inexistencia."""
import argparse, json, re, sys, urllib.request, concurrent.futures as cf, os
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ap=argparse.ArgumentParser(); ap.add_argument("repo"); ap.add_argument("tag"); ap.add_argument("pat", nargs="?"); ap.add_argument("pathre", nargs="?", default=".")
ap.add_argument("--ext", default="rb,py,js,ts,vue,php,yml,yaml,json,md,erb,jsx,tsx,go,java"); ap.add_argument("--show", type=int, default=3)
ap.add_argument("--cat"); ap.add_argument("--lines"); ap.add_argument("--list", action="store_true"); ap.add_argument("--maxfiles", type=int, default=800)
a=ap.parse_args()
def raw(p): return urllib.request.urlopen(urllib.request.Request(f"https://raw.githubusercontent.com/{a.repo}/{a.tag}/{p}",headers={"User-Agent":"pesquisa"}),timeout=30).read().decode("utf-8","replace")
if a.cat:
    L=raw(a.cat).splitlines(); lo,hi=(1,min(len(L),400))
    if a.lines: lo,hi=map(int,a.lines.split("-"))
    print(f"# {a.repo}@{a.tag}:{a.cat} linhas {lo}-{hi} de {len(L)}")
    for i in range(lo-1,min(hi,len(L))): print(f"{i+1:4d}| {L[i]}")
    sys.exit()
tree=json.load(urllib.request.urlopen(urllib.request.Request(f"https://api.github.com/repos/{a.repo}/git/trees/{a.tag}?recursive=1",headers={"User-Agent":"pesquisa","Accept":"application/vnd.github+json"}),timeout=60))
exts=tuple("."+e for e in a.ext.split(","))
paths=[x["path"] for x in tree["tree"] if x["type"]=="blob" and x["path"].endswith(exts) and re.search(a.pathre,x["path"]) and not re.match(r"(spec|test|tests|db/migrate|node_modules|public|locale|locales|translations|i18n)/",x["path"]) and "/locale" not in x["path"] and "/translations" not in x["path"]]
print(f"# {a.repo}@{a.tag} arvore truncada={tree.get('truncated')} total_blobs={sum(1 for x in tree['tree'] if x['type']=='blob')} candidatos={len(paths)}")
if a.list or not a.pat:
    for p in paths[:a.maxfiles]: print(p)
    sys.exit()
paths=paths[:a.maxfiles]
def chk(p):
    try: s=raw(p)
    except Exception: return None
    h=[(i+1,l.strip()[:170]) for i,l in enumerate(s.splitlines()) if re.search(a.pat,l,re.I)]
    return (p,h) if h else None
with cf.ThreadPoolExecutor(16) as ex:
    for r in ex.map(chk,paths):
        if r:
            print(r[0],f"({len(r[1])} hits)")
            for n,l in r[1][:a.show]: print(f"   {n}: {l}")
