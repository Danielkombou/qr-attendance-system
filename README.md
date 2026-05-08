# AttendX

AttendX is a multi-tenant attendance and presence tracking platform built with the Next.js App Router. It includes separated user/admin dashboard experiences, organization-scoped access controls, and API endpoints for onboarding, attendance, and analytics.

## Implemented Scope

### Product Areas

- Public landing route and auth entry points (`/`, `/sign-in`, `/get-started`)
- User app routes (`/dashboard`, `/check-in`, `/team`, `/reports`, `/profile`, `/settings`)
- Admin routes (`/admin/dashboard`, `/admin/users`)
- Organization onboarding flow (create org, request access, approve/reject requests, invitations)
- Attendance flow (check-in/check-out, geofence validation, verification levels)
- Analytics summaries for dashboard/reporting APIs
- Dynamic QR session issuance and validation endpoints

### Roles

- `Admin`/`Owner`: can manage org-scoped workflows and admin-only APIs
- `User`: can check in/out and access user dashboard features

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
- `app/api/**` - backend API contracts
- `components/**` - reusable UI blocks
- `lib/**` - shared auth, server helpers, and Prisma client wiring
- `prisma/schema.prisma` - data model and relations

## Getting Started

> This repo is configured for `pnpm`.

1. Install dependencies

```bash
pnpm install
```

2. Create `.env` and set required values

```env
DATABASE_URL=postgresql://user:password@host:5432/attendx
BETTER_AUTH_SECRET=replace-with-a-strong-secret
BETTER_AUTH_URL=http://localhost:3000
QR_TOKEN_SECRET=replace-with-a-strong-secret
```

3. Apply Prisma migrations

```bash
npx prisma migrate dev
```

4. Start development server

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Useful Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
npx prisma format
npx prisma validate
npx prisma migrate dev
```

## API Surface (Current)

- `app/api/auth/[...all]/route.ts`
- `app/api/orgs/route.ts`
- `app/api/orgs/[orgId]/join-requests/route.ts`
- `app/api/orgs/[orgId]/join-requests/[requestId]/route.ts`
- `app/api/orgs/[orgId]/invitations/route.ts`
- `app/api/onboarding/request-access/route.ts`
- `app/api/attendance/check-in/route.ts`
- `app/api/attendance/check-out/route.ts`
- `app/api/dashboard/user/route.ts`
- `app/api/dashboard/admin/route.ts`
- `app/api/analytics/summary/route.ts`
- `app/api/qr/session/route.ts`
- `app/api/qr/validate/route.ts`

## Data Integrity Notes

The schema enforces organization-scoped referential integrity, including:

- `Invitation.invitedById -> User.id`
- `OrganizationJoinRequest.reviewedById -> User.id`
- `DynamicQRSession.organizationId -> Organization.id`

These are captured in Prisma relations and migrations under `prisma/migrations/**`.
