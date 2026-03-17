# Skill: Validate Contacts Data

**Beschreibung:** Überprüft die Datenqualität deiner Kontakte und gibt Empfehlungen zur Bereinigung.

**Beispiel:**
```
/validate-contacts
```

---

## Was dieser Skill macht

1. **Scannt alle Kontakte** des Benutzers via API
2. **Prüft auf Fehler:**
   - Leere Organisationsnamen
   - Fehlende Beschreibungen
   - Zu lange Beschreibungen (>500 Zeichen)
   - Doppeleinträge (ähnliche Organisation-Namen)
3. **Erstellt einen Report** mit:
   - Anzahl Kontakte insgesamt
   - Anzahl Probleme gefunden
   - Detaillierte Liste der Issues
   - Konkrete Handlungsempfehlungen
4. **Optionale Aktion:** Kann Kontakte automatic bereinigen (mit Bestätigung)

---

## Implementation

**Handler:** `lib/client/skills/validate-contacts.ts`

```typescript
export async function validateContacts() {
  // 1. Fetch alle Kontakte
  const contacts = await ContactsApi.list(0, 1000);

  // 2. Validierungen durchführen
  const issues = [];

  // 3. Report generieren
  return generateReport(issues);
}
```

---

## Use Cases

- 📊 **Datenqualitäts-Audit** vor Datenexport
- 🧹 **Cleanup** vor CRM-Migration
- 🔍 **Duplicate Detection** um Speicherplatz zu sparen
- 📋 **Reporting** für Management über Kontakt-Qualität

---

## Integrationen

Dieser Skill nutzt:
- ✅ `ContactsApi.list()` - Alle Kontakte laden
- ✅ `ContactsApi.delete()` - Optional: Auto-cleanup (mit Bestätigung)
- ✅ React Query - Efficient caching
- ✅ CLAUDE.md Context - Kennt API-Limits und Regeln

---

## Konfiguration (in CLAUDE.md)

```yaml
skills:
  validate-contacts:
    enabled: true
    auto_fix: false              # Kontakte nicht automatisch löschen
    report_format: "markdown"    # oder "json"
    duplicate_threshold: 0.8     # Ähnlichkeit ab 80%
```

---

## Output Beispiel

```
✅ CONTACT VALIDATION REPORT
═══════════════════════════════════════

📊 Gesamtstatus: 127 Kontakte, 12 Issues gefunden (9.4%)

🔴 Kritische Issues (5):
  • Contact ID abc123: Organisationsname ist leer!
  • Contact ID def456: Beschreibung > 500 Zeichen (612)
  • Contact ID ghi789: Ähnlich zu "Acme GmbH" (83% Match)

🟡 Warnungen (7):
  • 4 Kontakte: Keine Beschreibung
  • 3 Kontakte: Zuletzt vor >6 Monaten bearbeitet

💡 Empfehlungen:
  1. Organisationsnamen in abc123 ergänzen
  2. Beschreibung in def456 kürzen
  3. Prüfen ob abc123 und ghi789 Duplikate sind
  4. Evtl. alte Kontakte archivieren

🚀 Nächste Schritte:
   /fix-contacts  (mit Bestätigung einzeln beheben)
   /export-contacts  (Report exportieren)
```

---

## Permissions (CLAUDE.md)

```yaml
skills:
  validate-contacts:
    permissions:
      - api_call: "GET /api/v1/contacts"
      - api_call: "DELETE /api/v1/contacts/:id"  # Optional
      - read_files: true
      - write_files: true  # Report speichern
```

---

## Related Skills

- `/fix-contacts` - Automatische Bereinigung durchführen
- `/export-contacts` - Kontakte als CSV exportieren
- `/merge-duplicates` - Doppeleinträge zusammenführen
