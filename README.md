# AttendX

AttendX is a smart attendance and presence tracking system for organizations, schools, and teams. The goal is to make it easy to track who is present, when they arrived, how long they stayed, and what they accomplished, with minimal friction and reliable records.

For the first version of the product, the system is designed around two user roles:

- `Admin`: manages attendance workflows, monitors records, and oversees users.
- `User`: checks in, tracks presence, and interacts with assigned attendance features.

## Project Goals

- Track attendance accurately and consistently.
- Record arrival time and duration of presence.
- Support lightweight activity or accomplishment tracking.
- Provide a clean workflow for both administrators and end users.
- Build a solid foundation that can later expand to more roles and richer reporting.

## Tech Stack

This project is being built with:

- `Next.js` for both frontend and backend application logic
- `TypeScript` for type-safe development
- `Tailwind CSS` for styling
- `PostgreSQL` for persistent data storage
- `Prisma` as the database toolkit and ORM layer
- `better-auth` for authentication
- `Zustand` for client-side state management

Note: `Zustand` is part of the planned architecture, even if some pieces are still being added to the codebase.

## Package Manager

This repository uses `pnpm`, not `npm`.

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables in `.env`.

At minimum, make sure your database connection string is available:

```env
DATABASE_URL=your_postgres_connection_string
```

3. Start the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Useful Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

## Database

The project is configured to use PostgreSQL through Prisma. Prisma configuration lives in `prisma.config.ts`, and the Prisma schema is located in `prisma/schema.prisma`.

Common Prisma workflows typically include:

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

## Current Direction

AttendX is being shaped as a dependable attendance platform with a strong focus on:

- simplicity for daily use
- accurate time and presence tracking
- maintainable full-stack architecture
- room for future expansion into reporting, analytics, and broader role support
