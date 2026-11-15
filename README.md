# Kummerkasten

Kummerkasten `(/ˈkʊmɐkastn̩/)` is a German term referring to a "worry box" or "complaint box"
where individuals can anonymously submit their concerns or complaints for support, guidance or simply to vent.

This project is a digital version of that, allowing users to anonymously engage in discussions.

## Features

- Password-based access, no accounts, no user data
- Anonymous posts, replies, votes (+1, -1) and reports
- Browser/device fingerprinting
- Infinite scroll
- Bookmarking/saving posts
- Light and dark themes
- Markdown support
- FAQ and code of conduct pages at /faq and /code-of-conduct

## How to run

Requires Node.js 24.15+, npm 11, and PostgreSQL.

### Environment

Copy `.env.example` to `.env` and set fill in the passwords and secret.

```shell
cp .env.example .env
```

Generate the secret with `openssl rand -hex 32`.
Optional settings control post length limits and report thresholds.

### Database

Start PostgreSQL, install dependencies, and apply migrations:

```shell
npm install
npx prisma generate
npx prisma migrate deploy
```

Use `npm run db:migrate` to create a migration during development; commit the generated files.

### Local development

```shell
npm run dev
```

The app runs at `http://localhost:3000`. To start a local PostgreSQL container:

```shell
docker run -p 5432:5432 -e POSTGRES_PASSWORD=kummerkasten -e POSTGRES_USER=kummerkasten -e POSTGRES_DB=kummerkasten -d postgres
```

### Tests

Run unit tests with Vitest and end-to-end tests with Playwright. Playwright targets `PLAYWRIGHT_BASE_URL` (default
`http://localhost:3000`) and does not start the app.

```shell
npm run test:unit
npm run test:e2e
```

For E2E testing, start the Compose stack with
`docker compose -f docker-compose.e2e.yaml up --build --force-recreate --detach --wait`, run the tests, then clean up with
`docker compose -f docker-compose.e2e.yaml down --volumes --remove-orphans`.

### Docker

For development, Docker Compose starts the app and PostgreSQL:

```shell
docker compose up --build
```

The production image is published as `ghcr.io/stefanluth/kummerkasten`. Supply the required environment variables at
runtime and apply migrations before starting it:

```shell
docker run --rm -p 3000:3000 \
  -e UNLOCK_PASSWORD=foo \
  -e DELETE_PASSWORD=bar \
  -e SESSION_SECRET="$SESSION_SECRET" \
  -e KUMMERKASTEN_POSTGRES_PRISMA_URL=postgresql://kummerkasten:secret@database:5432/kummerkasten \
  -e KUMMERKASTEN_POSTGRES_URL_NON_POOLING=postgresql://kummerkasten:secret@database:5432/kummerkasten \
  ghcr.io/stefanluth/kummerkasten:latest
```
