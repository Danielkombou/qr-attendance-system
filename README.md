# AttendX

AttendX is a simple attendance tracking app built with the Next.js App Router. Users sign up, sign in, and check in/out with planned and completed tasks. Admins get a separate dashboard.

## Implemented Scope

### Product Areas

- Public landing and auth (`/`, `/sign-in`, `/get-started`)
- User app routes (`/dashboard`, `/check-in`, `/team`, `/reports`, `/profile`, `/settings`)
- Admin routes (`/admin/dashboard`, `/admin/users`)
- Attendance flow (check-in/check-out with planned/completed tasks, office Wi‑Fi verification)
- Admin user search and role changes (`/admin/dashboard`)
- Short-lived signed QR session issuance/validation (admin-issued)

### Roles

- `ADMIN`: can access admin routes and issue QR sessions
- `USER`: can check in/out and access user routes

The first admin and a default **Office** site (`seed-main-site`) are created via the seed script.

## Tech Stack

- `Next.js` (App Router + Route Handlers)
- `TypeScript`
- `Tailwind CSS`
- `PostgreSQL`
- `Prisma`
- `better-auth`

## Project Structure

- `app/(public)/**` - public marketing/landing pages
- `app/(auth)/**` - auth-facing pages
- `app/(app)/**` - authenticated user/admin UI routes
- `app/api/**` - backend API routes
- `components/**` - reusable UI blocks
- `lib/**` - shared auth, server helpers, and Prisma client wiring
- `prisma/schema.prisma` - data model

## Getting Started

> This repo uses `pnpm`.

1. Install dependencies

```bash
pnpm install
```

2. Create `.env`

```env
DATABASE_URL=postgresql://user:password@host:5432/attendx
BETTER_AUTH_SECRET=replace-with-a-strong-secret
BETTER_AUTH_URL=http://localhost:3001
QR_TOKEN_SECRET=replace-with-a-strong-secret
```

3. Apply Prisma migrations and seed

```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

4. Start development server

```bash
pnpm dev
```

5. Open [http://localhost:3001](http://localhost:3001)

## Useful Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm test
npx prisma migrate dev
```

## API Surface

- `app/api/auth/[...all]/route.ts` (better-auth)
- `app/api/onboarding/sign-up/route.ts`
- `app/api/onboarding/sign-in/route.ts`
- `app/api/attendance/check-in/route.ts`
- `app/api/attendance/check-out/route.ts`
- `app/api/sites/route.ts`
- `app/api/admin/users/search/route.ts`
- `app/api/admin/users/[userId]/role/route.ts`
- `app/api/dashboard/user/route.ts`
- `app/api/dashboard/admin/route.ts`
- `app/api/qr/session/route.ts`
- `app/api/qr/validate/route.ts`
