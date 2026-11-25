import zipfile, sys, xml.etree.ElementTree as ET
sys.stdout.reconfigure(encoding='utf-8')
M='http://schemas.openxmlformats.org/spreadsheetml/2006/main'
def rows(fn):
    z=zipfile.ZipFile(fn); ss=[]
    if 'xl/sharedStrings.xml' in z.namelist():
        for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('{%s}si'%M): ss.append(''.join(t.text or '' for t in si.iter('{%s}t'%M)))
    out=[]
    for row in ET.fromstring(z.read('xl/worksheets/sheet1.xml')).iter('{%s}row'%M):
        cells=[]
        for c in row.findall('{%s}c'%M):
            v=c.find('{%s}v'%M); t=c.get('t')
            cells.append(None if v is None else (ss[int(v.text)] if t=='s' else v.text))
        out.append([x for x in cells])
    return out
if __name__=='__main__':
    fn=sys.argv[1]; flt=sys.argv[2:] 
    for i,r in enumerate(rows(fn)):
        if any(x is not None for x in r) and (not flt or any(f.lower() in str(x).lower() for x in r for f in flt) or i<8):
            print(i,[x for x in r if x is not None])
