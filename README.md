This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Start up app

### Remotely

The application is deployed on Vercel.

https://test-management.vercel.app/

### Setup locally

#### Packages

First, make sure you have these packages installed:

1. [Java 11+](https://www.oracle.com/my/java/technologies/downloads/)
2. [Node.js 20](https://nodejs.org/en)
3. [Git](https://git-scm.com/downloads)
4. [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
5. [PostgreSQ](https://www.postgresql.org/download/)

#### Steps

1. Copy the code or Go to a desired file path and run

```
git clone https://github.com/thlimtx/test-management.git
```

2. Install dependencies by running the command in root directory of the project:

```
yarn
```

3. Create a database in postgres, whether by CLI or through pgAdmin

4. Go to .env in the project repository, Keep `NEXTAUTH_SECRET` and replace `DATABASE_URL` with

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Keep `DATABASE_URL` and `NEXTAUTH_SECRET`

5. Go to prisma/schema.prisma and replace db with

```
   datasource db {
        provider = "postgresql"
        url = env("DATABASE_URL")
   }
```

6. Migrate database

```
npx prisma migrate dev
```

7. Run dev server and go to localhost:3000

```
yarn dev
```

8. (Optional) Manage data instead of using pgAdmin

```
yarn prisma studio
```

## Getting Started

First, install the dependancies:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
