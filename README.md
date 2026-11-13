# Kummerkasten

Kummerkasten (/ˈkʊmɐkastn̩/) is a German term referring to a "worry box" or "complaint box"
where individuals can anonymously submit their concerns or complaints for support, guidance or simply to vent.

This project is a web application that allows users to submit anonymous posts and vote on them.

## Features

- Password-based access
- Anonymous contributions
- Posts can be anonymously rated (+1, -1)
- Posts can be anonymously reported
- Posts can be deleted via an API route with a password
- "Top" pages (/top/day, /top/week, /top/month, /top/year, /top/all), where posts are displayed sorted by highest
  ratings within the given timeframe (24 hours, 1 week, 1 month, 1 year, all)
- Markdown support
- FAQ and code of conduct pages at /faq and /code-of-conduct

## How to run

### Requirements

- Node.js 24.15 or newer
- npm 11
- PostgreSQL

### Environment

Copy the example file and adjust it:

```shell
cp .env.example .env
```

Set `UNLOCK_PASSWORD` and `DELETE_PASSWORD`. The unlock password protects the site, while the delete password is
required to delete posts. Set `SESSION_SECRET` to a stable, randomly generated secret (for example,
`openssl rand -hex 32`). Keep the same secret across application restarts and instances; changing it invalidates active
unlock sessions. Set both PostgreSQL URLs:

- `KUMMERKASTEN_POSTGRES_PRISMA_URL` is used by the application at runtime.
- `KUMMERKASTEN_POSTGRES_URL_NON_POOLING` is used for migrations and other non-pooled connections.

The optional `MIN_TITLE_LENGTH`, `MAX_TITLE_LENGTH`, `MIN_CONTENT_LENGTH`, `MAX_CONTENT_LENGTH` and
`REPORTS_TO_HIDE_POST` settings control post limits and how many reports are needed to hide a post. `.env` is untracked;
never commit it.

After deploying signed sessions, visitors with an existing raw-password cookie must unlock once again.

### Database

Start PostgreSQL, then install dependencies and prepare the database:

```shell
npm install
npx prisma generate
npx prisma migrate deploy
```

`npm run db:deploy` runs the same migration deployment. While developing a schema change, use `npm run db:migrate` to
create and apply a new migration, and commit the generated files. Do not use `prisma db push`.

The repository includes the initial migration `20261112000000_init`. A database that already has the schema from
before migrations were introduced must mark it as applied once:

```shell
npx prisma migrate resolve --applied 20261112000000_init
```

### Local development

```shell
npm run dev
```

The application is available at `localhost:3000`. You can start a matching PostgreSQL container with:

```shell
docker run -p 5432:5432 -e POSTGRES_PASSWORD=kummerkasten -e POSTGRES_USER=kummerkasten -e POSTGRES_DB=kummerkasten -d postgres
```

### Scripts

- `npm run dev` starts the development server
- `npm run build` creates the production build
- `npm run start` starts the production server
- `npm run lint` runs ESLint
- `npm run format:check` checks formatting with Prettier
- `npm run typecheck` runs the TypeScript compiler
- `npm run test:unit` runs the Vitest unit tests
- `npm run test:e2e` runs the Playwright end-to-end tests
- `npm run check` runs format checking, linting, typechecking and unit tests
- `npm run db:deploy` applies committed migrations
- `npm run db:migrate` creates and applies a new migration during development

### Tests

Unit tests use Vitest. Run `npm run build` before `npm run test:e2e`; Playwright starts the built application through
its `webServer` configuration with `npm run start`. CI runs against a PostgreSQL service, applies the migrations and
executes the unit and end-to-end suites.

### Docker

For development, start the application and PostgreSQL with:

```shell
docker compose up --build
```

The development stack applies migrations and runs the app in development mode at `localhost:3000`, using `test` as the
unlock and delete passwords and a local-only session secret. Set your own `SESSION_SECRET` for deployments.

The production image uses Next.js standalone output, runs as the non-root `nextjs` user and exposes `/api/health` for
health checks. Images are published to `ghcr.io/stefanluth/kummerkasten` with `sha-*` and `latest` tags. Pass the
environment at runtime; the image does not contain a `.env` file:

```shell
docker run --rm -p 3000:3000 \
  -e UNLOCK_PASSWORD=foo \
  -e DELETE_PASSWORD=bar \
  -e SESSION_SECRET="$SESSION_SECRET" \
  -e KUMMERKASTEN_POSTGRES_PRISMA_URL=postgresql://kummerkasten:secret@database:5432/kummerkasten \
  -e KUMMERKASTEN_POSTGRES_URL_NON_POOLING=postgresql://kummerkasten:secret@database:5432/kummerkasten \
  ghcr.io/stefanluth/kummerkasten:latest
```

Replace the example database URLs with addresses reachable from the container. Apply migrations to the database before
starting the container. Generate `SESSION_SECRET` once with `openssl rand -hex 32`, store it in your deployment secret
manager, and reuse it across restarts and all application instances.
