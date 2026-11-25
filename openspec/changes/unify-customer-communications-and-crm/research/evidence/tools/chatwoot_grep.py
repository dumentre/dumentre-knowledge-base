"""Procura palavras no código-fonte do Chatwoot numa tag fixa (leitura via raw.githubusercontent, GET)."""
import json, re, sys, urllib.request
tag, pat, filt = sys.argv[1], sys.argv[2], sys.argv[3].split(",")
tree = json.load(urllib.request.urlopen(f"https://api.github.com/repos/chatwoot/chatwoot/git/trees/{tag}?recursive=1", timeout=30))
paths = [x["path"] for x in tree["tree"] if x["type"] == "blob" and x["path"].endswith((".rb",".js",".vue",".yml")) and any(k in x["path"] for k in filt) and not x["path"].startswith(("spec/","db/","public/","node_modules/"))]
print("tag", tag, "arquivos candidatos", len(paths), "tree truncada:", tree.get("truncated"))
for p in paths:
    try: s = urllib.request.urlopen(f"https://raw.githubusercontent.com/chatwoot/chatwoot/{tag}/{p}", timeout=20).read().decode("utf-8","replace")
    except Exception: continue
    hits = [l.strip()[:140] for l in s.splitlines() if re.search(pat, l, re.I)]
    if hits: print(p, hits[:3])
