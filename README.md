# Was ist der Kummerkasten?

Auch wenn eine offene Kommunikationskultur gefördert wird,
gibt es manchmal Fragen oder Meinungen,
die man vielleicht nicht persönlich äußern möchte,
aus Angst vor Konsequenzen oder einem möglichen Unbehagen bei der Diskussion von sensiblen Themen.

Der Kummerkasten bietet einen sicheren und vertraulichen Raum,
in dem Mitarbeiter:innen ihre Gedanken und Meinungen frei teilen können.

## How to run

### Development

#### Migrationen erstellen & Prisma Client generieren

```shell
npm run prepare:db
```

#### App mit Passwort in Development Modus starten

```shell
UNLOCK_PASSWORD=test npm run dev
```

oder

```shell
docker-compose up
```

Auf der `localhost:3000/unlock` Seite dann das gewählte Passwort eingeben.

### Production

```shell
docker run -p 3000:3000 -e UNLOCK_PASSWORD=foo -e DELETE_PASSWORD=bar ghcr.io/stefanluth/kummerkasten:latest
```
