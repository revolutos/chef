# JARVIS OS

Ein eigenständiges Agenten-Betriebssystem für **MR. LOVABLE** — selbst gebaut aus
Bausteinen, die bereits vorhanden sind (Claude Code + MCP-Connectors + Skills + Routines).

**Dies ist ein separates Projekt.** Es lebt in seinem eigenen Ordner, hat sein eigenes
`CLAUDE.md` und vermischt sich nicht mit anderen Repos oder Projekten. Der umgebende
`chef`-Codebase ist nur der aktuelle Aufbewahrungsort.

## Aufbau

```
jarvis-os/
├─ CLAUDE.md         Betriebshandbuch + Isolations-Grenze (lädt Claude Code automatisch)
├─ JARVIS.md         Kern-Persona (Schicht 1)  ✅ live
├─ BLUEPRINT.md      Architektur-Gesamtplan
├─ blueprint.html    visuelle Version des Blueprints
├─ .claude/
│  └─ settings.json  projekt-eigene Config
├─ brain/            2nd Brain — geteiltes Gedächtnis (Schicht 2)   ✅ live (Markdown)
├─ employees/        AI Employees: SPARK, TARS, SALES (Schichten 3–4)  ⏳ geplant
└─ routines/         Auslöser/Zeitpläne (Schicht 5)                 ⏳ geplant
```

## Wie man damit arbeitet

Öffne Claude Code **im Ordner `jarvis-os/`**. Dadurch wird `CLAUDE.md` geladen, der
Agent nimmt die JARVIS-Identität an und bleibt innerhalb der Projektgrenze. Alles, was
JARVIS OS braucht, liegt in diesem Ordner.

## Baustand

- [x] **Phase 1 — Kern:** `JARVIS.md` (Persona, Regeln, Business-Kontext)
- [x] **Phase 2 — Gedächtnis:** `brain/` als Markdown (schema + leads/kunden/content/tasks/log)
- [ ] **Phase 3 — SPARK:** erster Employee (Social/Content)
- [ ] **Phase 4 — Autonomie:** Routine, die SPARK feuert
- [ ] **Phase 5 — TARS:** zweiter Employee (Ops)
- [ ] **Phase 6 — Skalieren:** SALES, weitere Skills, Deployments

Details: siehe `BLUEPRINT.md`.

## Später: in ein eigenes Repo auslagern

Weil alles self-contained unter `jarvis-os/` liegt, ist der Umzug in ein eigenes
Git-Repo trivial. Zwei Wege:

**A) Einfach kopieren** (Historie egal):
```bash
cp -r jarvis-os ../jarvis-os-standalone
cd ../jarvis-os-standalone && git init && git add . && git commit -m "JARVIS OS"
```

**B) Mit Git-Historie herauslösen** (`git subtree`):
```bash
git subtree split -P jarvis-os -b jarvis-os-only
# dann jarvis-os-only in ein neues, leeres Repo pushen
```

Nach dem Umzug `CLAUDE.md` an der neuen Repo-Wurzel belassen — die Isolation wird
dann durch die Repo-Grenze selbst erzwungen.
