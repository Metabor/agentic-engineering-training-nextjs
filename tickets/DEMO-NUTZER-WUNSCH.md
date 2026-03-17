# Nutzer-Wunsch: Support-Email

```
From: mueller@company.de
To: product@company.de
Date: 17.03.2026, 14:30 Uhr
Subject: Feature Request: Kontakt-Details Seite

---

Hallo,

ich hätte gerne eine Feature Request, die mehrere User in unserem Team
haben.

Wenn ich ein Kontakt aus der Liste anklicke, würde ich gerne eine
Detailseite sehen mit:
- Dem kompletten Namen/Org des Kontakts
- Der vollständigen Beschreibung
- Wann das Kontakt zuletzt bearbeitet wurde
- Von wem das Kontakt angelegt wurde
- Buttons zum Bearbeiten oder Löschen

Aktuell kann ich das Kontakt nur aus der Tabelle bearbeiten, aber für
Detailansicht muss ich das Edit-Dialog öffnen - das ist umständlich.

Auch ein "Zurück" Button wäre gut, damit ich nicht ständig im Tab
navigieren muss.

Die betreffende Seite sollte unter `/contacts/[id]` erreichbar sein.

Danke!
Grüße,
Michael Müller
Vertrieb
```

---

## Aus diesem Feedback ergeben sich folgende Anforderungen:

### Feature: Contact Details Seite

1. **URL-Route:** `/contacts/[contactId]` (neu)
2. **Angezeigt werden:**
   - Organisation (großer Titel)
   - Vollständige Beschreibung
   - Erstellt von: [Name des Owners]
   - Erstellt am: [Datum]
   - Zuletzt bearbeitet am: [Datum]
3. **Aktionen:**
   - Edit Button → öffnet EditContactDialog
   - Delete Button → öffnet DeleteConfirmation
   - Zurück Button → zurück zur Kontakte-Liste
4. **Features:**
   - Loading State beim Laden
   - 404 Seite wenn Kontakt nicht existiert
   - Permission Check (nur Owner oder Admin können sehen)

### Warum das sinnvoll ist:
- Besser als Edit-Dialog für Detailansicht
- Bessere UX beim Browsen von Kontakten
- Zeigt Eigentümer-Info (wichtig im Team)
- Timestamps sind wichtig für Audit Trail
