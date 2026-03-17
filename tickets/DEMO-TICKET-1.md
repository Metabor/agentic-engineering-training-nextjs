# CRM-DEMO-01: Dashboard Quick Stats implementieren

**Story Type:** Feature
**Priority:** Medium
**Status:** Open

---

## User Story

**Als** Vertriebsmitarbeiter
**möchte ich** auf dem Dashboard einen Überblick über meine Kontakte sehen
**damit** ich schnell wichtige Metriken erfasse (Gesamtanzahl, kürzliche Aktivität)

---

## Anforderungen

### Funktionale Anforderungen
- [ ] Dashboard zeigt einen "Quick Stats" Bereich mit folgenden Metriken:
  - Gesamtanzahl meiner Kontakte
  - Anzahl Kontakte, die diese Woche hinzugefügt wurden
  - Letzter Kontakt (Name + Datum)
- [ ] Stats laden asynchron über die bestehende API
- [ ] Loading-State wird angezeigt
- [ ] Bei Fehler wird Fehlermeldung angezeigt
- [ ] Responsive Design (funktioniert auf Mobile)

### Technische Anforderungen
- [ ] Neue Komponente: `components/dashboard/QuickStatsCard.tsx`
- [ ] Verwende React Query für Datenbeschaffung
- [ ] Styling mit Chakra UI (3-spaltig auf Desktop, gestapelt auf Mobile)
- [ ] Berechnung "diese Woche" mit `new Date()` auf Client-Seite

---

## Acceptance Criteria

```gherkin
Given ein Benutzer ist auf dem Dashboard
When die Seite geladen wird
Then wird der "Quick Stats" Bereich mit 3 Karten angezeigt

Given die API wird aufgerufen
When Daten werden geladen
Then wird ein Loading-Spinner angezeigt
And nach Abschluss verschwinden die Spinner

Given die API antwortet erfolgreich
When Stats werden angezeigt
Then zeigt Karte 1: "Gesamt: X Kontakte"
And zeigt Karte 2: "Diese Woche: Y Kontakte"
And zeigt Karte 3: "Letzter: [Name] (Datum)"

Given ein mobiles Endgerät
When der Benutzer das Dashboard öffnet
Then sind die 3 Karten untereinander angeordnet
And sind alle lesbar
```

---

## Design Reference

Nutze diese Struktur pro Stat-Card:
```
┌──────────────────────────┐
│ Icon | Titel             │
│ Großer Wert (z.B. "127") │
│ Subtext (z.B. "Kontakte")│
└──────────────────────────┘
```

Beispiel: `components/contacts/AddContactDialog.tsx` für Chakra UI Patterns

---

## Implementation Notes

- Verwende `useQuery` Hook
- API liefert bereits alle benötigten Daten via `GET /api/v1/contacts?limit=1000`
- Datum-Berechnung: "Diese Woche" = letzte 7 Tage
- Fehlerbehandlung: Bei Fehler Card mit "Fehler beim Laden..." anzeigen

---

## Files to Modify

| Datei | Änderung |
|-------|----------|
| `app/(dashboard)/page.tsx` | QuickStatsCard importieren + einbauen |
| `components/dashboard/QuickStatsCard.tsx` | NEU: Komponente erstellen |

---

## Definition of Done

- [ ] Komponente ist implementiert
- [ ] Stats werden korrekt berechnet
- [ ] Responsive Layout getestet
- [ ] Error-Handling funktioniert
- [ ] Code Review durchgeführt
