# AttendX API Contracts (Phase 1-3)

## Auth
- `ALL /api/auth/*`: better-auth handler endpoint (`app/api/auth/[...all]/route.ts`).

## Organization and Onboarding
- `GET /api/orgs`
  - Returns organizations the current user belongs to.
- `POST /api/orgs`
  - Creates new organization and owner membership.
  - Body: `{ "name": string, "timezone"?: string }`

- `POST /api/onboarding/request-access`
  - Open-signup users request organization join approval.
  - Body: `{ "organizationSlug": string, "message"?: string }`

- `POST /api/onboarding/accept-invite`
  - Accept invite token and create membership.
  - Body: `{ "token": string }`

## Join Requests
- `GET /api/orgs/:orgId/join-requests` (admin)
- `POST /api/orgs/:orgId/join-requests` (user)
  - Body: `{ "message": string }`
- `PATCH /api/orgs/:orgId/join-requests/:requestId` (admin)
  - Body: `{ "status": "APPROVED" | "REJECTED" }`

## Invitations
- `GET /api/orgs/:orgId/invitations` (admin)
- `POST /api/orgs/:orgId/invitations` (admin)
  - Body: `{ "email": string, "role"?: "EMPLOYEE" | "MANAGER" | "ADMIN" | "OWNER" }`
  - Response includes invite token and URL.

## Attendance
- `POST /api/attendance/check-in`
  - Body: `{ "siteId": string, "latitude": number, "longitude": number }`
  - Returns check-in record + geofence result.

- `POST /api/attendance/check-out`
  - Body: `{ "latitude": number, "longitude": number }`
  - Closes active check-in and computes worked minutes.

## Dashboard
- `GET /api/dashboard/user`
  - User metrics, recent attendance, on-time rate.
- `GET /api/dashboard/admin` (admin)
  - Admin metrics and pending join requests.

## Trust / Security (Phase 2)
- `POST /api/qr/session` (admin)
  - Creates short-lived signed QR token for site scanner.
  - Body: `{ "siteId": string, "ttlSeconds"?: number }`
- `POST /api/qr/validate`
  - Validates signed QR token and prevents replay.
  - Body: `{ "token": string }`

## Analytics (Phase 3)
- `GET /api/analytics/summary` (admin)
  - Weekly attendance stats and top performers.

## Context and Authorization Headers (current foundation)
Until session middleware is fully wired to better-auth context extraction, APIs accept these request headers (or equivalent cookies) for context:
- `x-user-id`
- `x-org-id`
- `x-role`

This allows progressive integration while preserving strict route-level authorization checks.
