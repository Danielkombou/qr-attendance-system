# AttendX API Contracts

## Auth

- `ALL /api/auth/*` — better-auth handler (`app/api/auth/[...all]/route.ts`)
- `POST /api/onboarding/sign-up`
  - Body: `{ "name": string, "email": string, "password": string }`
  - Creates a **USER** account via better-auth (default role).
- `POST /api/onboarding/sign-in`
  - Body: `{ "email": string, "password": string }`
  - Signs in via better-auth and sets `attendx_user_id` and `attendx_role` cookies.
  - Response: `{ "ok": true, "redirectTo": "/dashboard" | "/admin/dashboard" }`

## Sites

- `GET /api/sites` (authenticated)
  - Returns `{ sites: { id, name, allowedRadiusM }[] }` for active check-in locations.

## Attendance

- `POST /api/attendance/check-in`
  - Body: `{ "siteId": string, "latitude": number, "longitude": number, "plannedTasks": string }`
  - Validates GPS against the site center and `allowedRadiusM` (Haversine).
  - Response includes `{ record, geofence: { insideFence, distanceM, allowedRadiusM } }`.
  - Rejects with 409 if the caller already has an open check-in.
- `POST /api/attendance/check-out`
  - Body: `{ "latitude": number, "longitude": number, "completedTasks": string }`
  - Closes the caller's open check-in and computes worked minutes.

## Admin — users

- `GET /api/admin/users/search?q=` (ADMIN)
  - Case-insensitive match on **email** or **name** (max 20 results).
- `PATCH /api/admin/users/:userId/role` (ADMIN)
  - Body: `{ "role": "ADMIN" | "USER" }`
  - Cannot demote yourself to **USER** if you are the last admin.

## Dashboard

- `GET /api/dashboard/user`
  - Returns `{ latest, totalWorkedMinutes, recent }` for the caller.
- `GET /api/dashboard/admin` (ADMIN)
  - Returns `{ metrics: { totalUsers, activeNow, todayCheckIns } }`.

## QR Sessions

- `POST /api/qr/session` (ADMIN)
  - Body: `{ "ttlSeconds"?: number }` (clamped to `[15, 300]`, default `45`)
  - Returns `{ "token": string, "expiresAt": number }`.
- `POST /api/qr/validate`
  - Body: `{ "token": string }`
  - Verifies signature, marks `usedAt`, and returns `{ "valid": true, "expiresAt": number }`.

## Authorization

Routes read context from cookies (or `x-user-id` / `x-role` headers in tests):

- `attendx_user_id`
- `attendx_role` (`USER` or `ADMIN`)

Middleware redirects unauthenticated users to `/sign-in` and non-admins away from `/admin/*`.
