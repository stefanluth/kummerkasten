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

## How to run

### Development

#### Docker

```shell
docker-compose up
```

The `docker-compose.yaml` is intended for development only.
It starts a PostgreSQL database, the application in development mode and contains all necessary environment variables:

```text
    environment:
        - UNLOCK_PASSWORD=test
        - DELETE_PASSWORD=test
        - REPORTS_TO_HIDE_POST=1
```

You can access the application at `localhost:3000` and enter the password (`test`). The `DELETE_PASSWORD` is required to
delete posts. The `REPORTS_TO_HIDE_POST` specifies how many reports a post must have to no longer be displayed.

#### Local

```shell
npm install
npx prisma generate
npx prisma db push
UNLOCK_PASSWORD=test DELETE_PASSWORD=test REPORTS_TO_HIDE_POST=1 npm run dev
```

The application can be started locally with `npm run dev`. The environment variables must be set manually. The database
needs to be started separately.

```shell
docker run -p 5432:5432 -e POSTGRES_PASSWORD=kummerkasten -e POSTGRES_USER=kummerkasten -e POSTGRES_DB=kummerkasten -d postgres
```

### Production

```shell
docker run -p 3000:3000 -e UNLOCK_PASSWORD=foo -e DELETE_PASSWORD=bar ghcr.io/stefanluth/kummerkasten:latest
```

When running the application in production, the passwords must be set via the environment variables `UNLOCK_PASSWORD` and
`DELETE_PASSWORD`. The image is available via the Github Container Registry.
