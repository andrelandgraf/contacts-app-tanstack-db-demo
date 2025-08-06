# TanStack DB w/ Sync - the future of real-time UI

This is a simple demo application showcasing TanStack DB with ElectricSQL and a Neon Postgres database for:

- Real-time UI
- Optimistic updates
- Sync behind Neon Auth
- Postgres as the source of truth

This is a [Next.js](https://nextjs.org) project, deployed on Vercel. However, the same sync code would work also with TanStack Start, Remix, and React Router.

## Setup

1. Run `npm i` to install all dependencies.

2. Create a `.env` file and copy the example `.env` content:

```bash
cp .example.env .env
```

3. Create a new Neon project on [neon.com](https://neon.com).

4. Enable Neon Auth and copy the Neon Auth credentials into the `.env` file, including the `DATBASE_URL` connection string.

5. Run `npm run db:migrate` to populate the database with the Drizzle `/migrations` database schemas.

6. Back on the Neon console, enable Logical Replication in your Neon project settings (required for Electric SQL).

7. Copy the un-pooled Neon connection string from the Connection dialog.

8. Create & deploy a new ElectricSQL sync engine via [ElectricSQL Cloud](https://dashboard.electric-sql.cloud/), using the un-pooled Neon connection string.

9. Add the ElectricSQL sync engine source id and secret to the `.env` file.

10. Run the app locally `npm run dev`

11. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
