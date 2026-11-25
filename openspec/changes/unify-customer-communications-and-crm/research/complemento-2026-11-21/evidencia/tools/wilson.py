"""Limite inferior de Wilson (95%) para precisao observada: QA dos limiares do plano de evals."""
from math import sqrt
def lb(k,n,z=1.96):
    p=k/n; d=1+z*z/n; c=p+z*z/(2*n); a=z*sqrt(p*(1-p)/n+z*z/(4*n*n)); return (c-a)/d
print("n | erros -> limite inferior de Wilson 95% da precisao")
for n in (50,100,150,300):
    print(n, " ".join(f"{e}:{lb(n-e,n):.3f}" for e in (0,1,2,3,5)))
n=1
while lb(n,n)<0.95: n+=1
print("menor n com 0 erros e limite inferior >= 0,95:", n)
print("regra dos tres: 0 violacoes em 50 => taxa <= ~", round(3/50,3), "(95%)")
