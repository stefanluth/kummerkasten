# Was ist der Kummerkasten?

Auch wenn im Unternehmen eine offene Kommunikationskultur gefördert wird, gibt es manchmal Fragen oder Meinungen,
die man vielleicht nicht persönlich äußern möchte,
aus Angst vor Konsequenzen oder einem möglichen Unbehagen bei der Diskussion von sensiblen Themen.

Der Kummerkasten bietet einen sicheren und vertraulichen Raum,
in dem Mitarbeiter:innen ihre Gedanken und Meinungen frei und anonym äußern können.

## Features

- Passwortbasierter Zugang
- Anonyme Beiträge
- Beiträge können anonym bewertet (+1, -1) werden
- Beiträge können anonym gemeldet werden
- Beiträge können mit einem Passwort über eine API Route gelöscht werden
- Auf der Startseite werden die Beiträge nach neuesten sortiert angezeigt
- Auf den Top-Seiten (/top/day, /top/week, /top/month, /top/year, /top/all) werden die Beiträge innerhalb eines
Zeitraums (24h, 1 Woche, 1 Monat, 1 Jahr, alle) nach den höchsten Bewertungen sortiert angezeigt

## How to run

### Development

```shell
docker-compose up
```

Die `docker-compose.yaml` ist nur für die Entwicklung gedacht. Sie startet eine Postgres Datenbank und den Kummerkasten
im Development Modus und enthält die benötigten Umgebungsvariablen.

```text
    environment:
        - UNLOCK_PASSWORD=test
        - DELETE_PASSWORD=test
        - REPORTS_TO_HIDE_POST=1
```

Auf der `localhost:3000/unlock` Seite kann dann das Passwort (`test`) eingegeben werden. Das `DELETE_PASSWORD` wird
benötigt, um Beiträge zu löschen. Das `REPORTS_TO_HIDE_POST` gibt an, wie viele Meldungen ein Beitrag haben muss, um
nicht mehr angezeigt zu werden.

### Production

```shell
docker run -p 3000:3000 -e UNLOCK_PASSWORD=foo -e DELETE_PASSWORD=bar ghcr.io/stefanluth/kummerkasten:latest
```

In der Produktionsumgebung müssen die Passwörter über die Umgebungsvariablen `UNLOCK_PASSWORD` und `DELETE_PASSWORD`
gesetzt werden. Das Image ist über die Github Container Registry verfügbar.
