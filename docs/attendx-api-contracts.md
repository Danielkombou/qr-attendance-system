# AttendX API Contracts

## Auth

- `ALL /api/auth/*` — better-auth handler (`app/api/auth/[...all]/route.ts`)
- `POST /api/onboarding/sign-up`
  - Body: `{ "name": string, "email": string, "password": string }`
  - Creates a USER account via better-auth.
- `POST /api/onboarding/sign-in`
  - Body: `{ "email": string, "password": string }`
  - Signs in via better-auth and sets `attendx_user_id` and `attendx_role` cookies.
  - Response: `{ "ok": true, "redirectTo": "/dashboard" | "/admin/dashboard" }`

## Attendance

- `POST /api/attendance/check-in`
  - Body: `{ "plannedTasks": string, "latitude"?: number, "longitude"?: number }`
  - Rejects with 409 if the caller already has an open check-in.
- `POST /api/attendance/check-out`
  - Body: `{ "completedTasks": string, "latitude"?: number, "longitude"?: number }`
  - Closes the caller's open check-in and computes worked minutes.

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
