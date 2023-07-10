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
UNLOCK_PASSWORD=password123 npm run dev
```

Auf der `/unlock` Seite dann das gewählte Passwort eingeben.

### Production

```shell
docker-compose up
```

oder ohne das Repo zu klonen:

```shell
docker run -p 3000:3000 ghcr.io/stefanluth/kummerkasten:latest
```
