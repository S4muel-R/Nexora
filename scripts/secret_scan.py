"""Busca patrones de secretos en el historial completo de git (todas las ramas)."""
import re, subprocess, sys, collections
PATTERNS = {
    "Token de GitHub": r"\bgh[pousr]_[A-Za-z0-9]{30,}",
    "Clave de acceso AWS": r"\bAKIA[0-9A-Z]{16}\b",
    "Clave privada": r"-----BEGIN [A-Z ]*PRIVATE KEY-----",
    "Token de Slack": r"\bxox[baprs]-[A-Za-z0-9-]{10,}",
    "Clave de API genérica (sk-)": r"\bsk-[A-Za-z0-9]{20,}",
    "Token de Atlassian": r"\bATATT[A-Za-z0-9_\-=]{20,}",
    "Asignación de contraseña o secreto": r"(?i)(password|passwd|secret_key|api_key|token)\s*[:=]\s*['\"][^'\"\s]{6,}['\"]",
    "URL con credenciales": r"[a-z]+://[^/\s:@]+:[^/\s:@]+@[^/\s]+",
}
log = subprocess.run(["git", "log", "-p", "--all", "--no-color", "--format=COMMIT %h"], capture_output=True, text=True, encoding="utf-8", errors="replace").stdout
commit, path = "", ""
hits = collections.defaultdict(set)
for line in log.splitlines():
    if line.startswith("COMMIT "): commit = line[7:]; continue
    if line.startswith("+++ b/"): path = line[6:]; continue
    if not line.startswith("+") or line.startswith("+++"): continue
    for name, pat in PATTERNS.items():
        for m in re.finditer(pat, line):
            hits[(name, path, m.group(0)[:80])].add(commit)
commits = len(set(re.findall(r"^COMMIT (\w+)", log, re.M)))
print(f"Commits revisados: {commits}")
for (name, path, match), cs in sorted(hits.items()):
    print(f"{name} | {path} | {match} | commits: {', '.join(sorted(cs))}")
print(f"Coincidencias: {len(hits)}")
