# How to run

## Development

### Migrationen erstellen

```shell
npx prisma migrate dev --name init
```

### Prisma Client generieren

```shell
npx prisma generate
```

### App in Development Modus starten

```shell
UNLOCK_PASSWORD=password123 npm run dev
```

Auf der `/unlock` Seite dann das gewählte Passwort eingeben.

## Production

```shell
bash ./deploy.sh
```
