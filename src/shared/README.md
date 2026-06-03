# src/shared/ — Shared Kernel

Code shared across all pages, API routes, and modules. This layer provides infrastructure and cross-cutting concerns.

## Directory Map

```
shared/
  config/       # Application configuration & database setup
  middleware/    # Request pipeline middleware (auth, rate limiting, CSRF)
  utils/        # Utility functions (JWT, password, validators, errors)
```

---

## config/

### `db.ts` — Database Connection

Creates and exports a PostgreSQL connection pool via `pg` and a Drizzle ORM instance:

```ts
import { db } from '@/shared/config/db';
```

The pool is lazily initialized, using the `DATABASE_URL` environment variable.

### `schema.ts` — Database Schema

Defines all Drizzle ORM table definitions:

| Table | Description |
|-------|-------------|
| `users` | Admin & student accounts (id, nim, fullName, email, passwordHash, role, createdAt) |
| `classes` | Courses managed by admins (id, name, adminId, createdAt) |
| `studentClasses` | Enrollment junction — unique composite key on (studentId, classId) |
| `attendanceSessions` | Time-bounded attendance windows (id, classId, name, startTime, endTime, status) |
| `attendanceRecords` | Individual submissions — unique composite key on (sessionId, studentId) |

Enums: `role` (admin/student), `session_status` (active/closed), `mode` (luring/daring).

### `env.ts` — Environment Variables

Parses and validates required environment variables at startup. Exports typed values:

```ts
import { env } from '@/shared/config/env';
// env.DATABASE_URL, env.JWT_SECRET, env.JWT_EXPIRY, env.NODE_ENV, env.PORT
```

### `seed.ts` — Database Seeder

CLI script that creates an admin user with argon2-hashed password. Usage:

```bash
bun run db:seed
```

---

## middleware/

### `authGuard.ts` — Authentication & Authorization

Two guard functions:

| Function | Behavior | Use |
|----------|----------|-----|
| `authGuard(context, role?)` | Throws `UnauthorizedError` (401) or `ForbiddenError` (403) | API routes |
| `pageAuthGuard(role)` | Redirects to `/login` on failure | Astro pages |

Both read the `session` cookie, verify the JWT signature, and check the user's role against the required role.

### `rateLimiter.ts` — Rate Limiting

In-memory rate limiter using `Map<string, { count, resetAt }>`:

```ts
import { rateLimiter } from '@/shared/middleware/rateLimiter';
// rateLimiter(key, limit, windowMs): { allowed: boolean, remaining: number }
```

Currently applied to:
- Login endpoint — 10 requests per 15 minutes per IP
- Attendance submission — 5 requests per minute per user

### `csrf.ts` — CSRF Protection

| Function | Behavior |
|----------|----------|
| `csrfGuard(context)` | Validates `X-CSRF-Token` header matches `csrf` cookie for mutating methods (POST, PATCH, DELETE) |
| `generateCSRFToken()` | Generates a random CSRF token |

Applied to all mutating API endpoints. The token is set as a readable cookie on login and must be sent as a custom header.

---

## utils/

### `jwt.ts` — JWT Signing & Verification

Uses the `jose` library with HS256 algorithm. Exports:

```ts
import { signJWT, verifyJWT, type JWTPayload } from '@/shared/utils/jwt';
// JWTPayload: { sub: string, email: string, role: 'admin' | 'student' }
```

### `password.ts` — Password Hashing

Argon2id hashing with `@noble/argon2`:

```ts
import { hashPassword, verifyPassword } from '@/shared/utils/password';
```

Parameters: memoryCost=65536, timeCost=3, parallelism=4.

### `validators.ts` — Input Validation

```ts
import { isValidNIM, isValidEmail } from '@/shared/utils/validators';
// isValidNIM(nim)  — checks exactly 15 digits
// isValidEmail(email) — basic email regex
```

### `errors.ts` — Custom Error Hierarchy

```ts
import { AppError, AttendanceWindowError, DuplicateAttendanceError,
         UnauthorizedError, ForbiddenError } from '@/shared/utils/errors';
```

| Error Class | HTTP Status | Use Case |
|-------------|-------------|----------|
| `AppError` | configurable | Base class |
| `UnauthorizedError` | 401 | Missing/invalid JWT |
| `ForbiddenError` | 403 | Insufficient role |
| `AttendanceWindowError` | 422 | Submission outside session time window |
| `DuplicateAttendanceError` | 409 | Already submitted for this session |

All API routes catch `AppError` and return structured error JSON.
