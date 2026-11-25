import re,os,sys
sys.stdout.reconfigure(encoding='utf-8')
base='C:/Users/luanc/projects/'
roots=[base+'projects-knowledge-base',base+'dumentre/dumentre-knowledge-base']
pat=re.compile(r'oracle cloud|free tier|gcp|google cloud|codespaces|vm de teste|staging|segunda vm|second vm|droplet|lightsail|contabo|homelab|raspberry|servidor de teste|ambiente de teste|vps',re.I)
hits={}
for r in roots:
    for dp,dn,fn in os.walk(r):
        dn[:]=[d for d in dn if d not in ('.git','node_modules','archive','_cache')]
        for f in fn:
            if not f.endswith('.md'): continue
            p=os.path.join(dp,f).replace(chr(92),'/')
            if 'openspec/changes/unify' in p: continue
            try: s=open(p,encoding='utf-8',errors='ignore').read()
            except: continue
            for i,l in enumerate(s.splitlines()):
                if pat.search(l): hits.setdefault(p,[]).append((i+1,l.strip()[:170]))
for p,h in sorted(hits.items(),key=lambda x:-len(x[1]))[:12]:
    print(p.replace(base,''),len(h)); [print('   ',n,l) for n,l in h[:2]]
