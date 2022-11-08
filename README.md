# 🌀 Portal

ACM UTSA's in-house membership portal and database system.

## Stack

- [Next.js][next-js]
    - [tRPC][trpc]
- [React][react]
    - [TailwindCSS][tailwind-css]
        - [HeadlessUI][headless-ui]
    - [TanStack Table][tanstack-table]
    - [TanStack Query][tanstack-query]
- [Typescript][typescript]
- [Prisma][prisma]
    - [PostgreSQL][postgresql] on [Railway][railway]
- [Chart.js][chartjs]
- [Prettier][prettier]

See [`package.json`](./package.json) for all other requirements.

## Installation

- [Node.js][node-js]
    - Use Node v16 (LTS). Anything higher or lower may not be compatible.

This project uses `yarn` for package management. Install `yarn` with `npm` via `npm install --global yarn`.

This project requires credentials to run properly. See [Database](#Database).

## Development

For easy development, `yarn run dev` will start Next.js with hot-reloading & error reporting.

Build for production with `yarn run build` for a production-ready version of the site.
To execute it locally, execute `yarn run start`. Features like hot-reloading will not be available.

Analysis of package sizes in a built website can be conducted with `yarn run analyze`; this will build like `yarn run build`,
but will generate (and open) build reports useful for understanding the site's webpack size.

## Database

Prisma, our choice of Database ORM, requires a database to operate upon for nearly all interactions. If you are an ACM Officer
working on this project, contact the appropriate officer to acquire the Database URL.

The database URL should be placed in `.env` in the root directory:
```env
DATABASE_URL=postgresql://{username}:{password}@{domain}:{port}/{database}
```
Under no circumstances should this file be removed from `.gitignore` and committed to *any branch*.

If you don't have access to that database URL and would like a local database instance to work with,
Docker is an excellent option.

```dockerfile
version: '3.8'
services:
  db:
    image: postgres:latest
    restart: always
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=postgres
    ports:
      - '39755:5432'
    volumes:
      - db:/var/lib/postgresql/data
volumes:
  db:
    driver: local   
```

Paste the above inside a `docker-compose.yml` file (anywhere), then execute `docker-compose up -d` to run it in the background.

To stop the container, execute `docker-compose stop`, and to delete it, `docker-compose rm --stop` (stop & delete).
Find more commands [here][docker-compose-ref].

The `DATABASE_URL` here would be `postgresql://admin:password@localhost:39755/postgres`.
The port mapping chosen here is arbitrary (high port number reduces chances of appearance in a port exclusion range).
Change as you wish. Details [here][docker-compose-networking].

Once created, the database will need to be updated with the current schema. Execute [`yarn prisma db push`][prisma-db-push].
This command should not be used for _existing_ DBs.

## Migration

Prisma's database should be very carefully migrated, especially so in production environments.
If you do not have 100% confidence in what you are doing, you should not be attempting to migrate the database.

1. Someone else migrated the database and now my version doesn't match up!
    1. `git checkout main` and `git pull`. Unless something is going wrong, the latest database migration should be
       committed into `main`.
    2. Execute `npx prisma generate`. This will generate a new query engine and update your bindings forcibly.
        - `npx` forces execution of the latest version of Prisma, ensuring the latest version (and not whatever is in
          your local installation) is used.

[node-js]: https://nodejs.org/en/download/
[next-js]: https://nextjs.org/
[prisma]: https://www.prisma.io/
[trpc]: https://trpc.io/
[typescript]: https://www.typescriptlang.org/
[react]: https://reactjs.org/
[tailwind-css]: https://tailwindcss.com/
[chartjs]: https://www.chartjs.org/
[tanstack-query]: https://tanstack.com/query/v4
[tanstack-table]: https://tanstack.com/table/v8
[prettier]: https://prettier.io/
[postgresql]: https://www.postgresql.org/
[railway]: https://railway.app/
[headless-ui]: https://headlessui.com/
[docker-compose-networking]: https://docs.docker.com/compose/networking/
[docker-compose-ref]: https://docs.docker.com/compose/reference/
[prisma-db-push]: https://www.prisma.io/docs/reference/api-reference/command-reference#db-push