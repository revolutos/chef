# 2nd Brain — Schema & Zugriffsregeln

> Schicht 2 des JARVIS OS. Das geteilte Gedächtnis, das alle Employees nutzen.
> **Variante: Markdown** — kein externer Dienst, alles lebt in diesem Ordner.
> Später migrierbar nach Airtable/Supabase (Spalten = Tabellen-Felder, 1:1).

---

## Warum es das gibt

Ohne Gedächtnis startet jede Aufgabe bei null. Mit Gedächtnis wird das System über
Zeit klüger: JARVIS und die Employees **lesen zuerst** den relevanten Kontext und
**schreiben** ihr Ergebnis zurück. Das ist der Unterschied zwischen einem Chatbot
und einem OS.

---

## Das Protokoll (harte Regel für alle Employees)

1. **Lesen vor Handeln.** Vor einer Aufgabe die relevante `brain/*.md`-Datei öffnen.
2. **Zurückschreiben nach Handeln.** Neue Fakten/Entscheidungen als Zeile ergänzen.
3. **Append, nicht überschreiben.** Bestehende Zeilen nur ändern, wenn sich ihr
   Status ändert (z. B. Lead `neu` → `kontaktiert`). Nichts still löschen.
4. **Jede wichtige Entscheidung landet im `log.md`** — das Langzeitgedächtnis.
5. **IDs sind stabil.** Einmal vergeben, nie wiederverwenden (`L-001`, `K-001`, …).

---

## Die Dateien

| Datei | Inhalt | Wer schreibt v. a. |
|---|---|---|
| `leads.md` | potenzielle Kunden, Status, Quelle | SALES, JARVIS |
| `kunden.md` | aktive Projekte & Kunden | JARVIS, TARS |
| `content.md` | Content-Ideen, Entwürfe, geplante Posts | SPARK |
| `tasks.md` | offene To-dos quer über alle Employees | alle |
| `log.md` | getroffene Entscheidungen & Ergebnisse | alle |

---

## Datensatz-Formate

Jede Datei ist eine Markdown-Tabelle. Neue Einträge = neue Zeile unten anhängen.

**leads.md** — `ID | Name | Firma | Quelle | Status | Nächster Schritt | Notiz`
Status-Werte: `neu` · `kontaktiert` · `im Gespräch` · `gewonnen` · `verloren`

**kunden.md** — `ID | Kunde | Projekt | Status | Kontakt | Notiz`
Status-Werte: `aktiv` · `pausiert` · `abgeschlossen`

**content.md** — `ID | Idee | Kanal | Format | Status | Fällig | Asset`
Status-Werte: `Idee` · `Entwurf` · `Freigabe offen` · `geplant` · `veröffentlicht`

**tasks.md** — `ID | Aufgabe | Employee | Priorität | Status | Fällig`
Status-Werte: `offen` · `in Arbeit` · `erledigt` · `blockiert`

**log.md** — `Datum | Employee | Entscheidung/Ergebnis`

---

## ID-Präfixe

`L-` Lead · `K-` Kunde · `C-` Content · `T-` Task. Fortlaufend nummeriert.

---

## Migration nach Airtable/Supabase (später)

Jede Datei = eine Tabelle, jede Spalte = ein Feld, jede Zeile = ein Record.
Der Umstieg ändert nur das *Wo*, nicht das *Was*: Das Protokoll oben bleibt gleich,
nur „Datei öffnen/Zeile anhängen" wird zu „Tabelle abfragen/Record anlegen".
