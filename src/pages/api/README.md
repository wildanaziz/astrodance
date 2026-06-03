# src/pages/api/ — REST API

All REST API endpoints live under `/api/v1/`. Each file exports named functions matching HTTP methods (`GET`, `POST`, `PATCH`).

## API Structure

```
api/v1/
  attendance.ts                    # Submit attendance
  auth/
    login.ts                       # Login
    register.ts                    # Student registration
    logout.ts                      # Logout
    me.ts                          # Get current user
  classes/
    index.ts                       # Create class (POST), list classes (GET)
    [id].ts                        # Get class detail (GET)
    [id]/
      sessions.ts                  # Create session (POST), list sessions (GET)
      enroll.ts                    # Enroll student (POST)
  sessions/
    [id]/
      attendance.ts                # Get attendance records (GET)
      attendance/
        export.ts                  # Export attendance CSV (GET)
      close.ts                     # Close session (PATCH)
  admin/
    dashboard.ts                   # Admin dashboard stats (GET)
  student/
    sessions/
      active.ts                    # Student's active sessions (GET)
    enroll.ts                      # Student self-enroll (POST)
    classes.ts                     # Student's enrolled classes (GET)
    attendance.ts                  # Student's attendance history (GET)
```

## Response Format

All endpoints return JSON with a consistent structure:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable description"
}
```

HTTP status codes correspond to error types:
| Status | Error Class | Meaning |
|--------|-------------|---------|
| 401 | `UnauthorizedError` | Missing or invalid JWT |
| 403 | `ForbiddenError` | Insufficient role |
| 409 | `DuplicateAttendanceError` | Already submitted for this session |
| 422 | `AttendanceWindowError` | Submission outside allowed window |
| 422 | `AppError` | General validation failure |

## Authentication Flow

1. **Login** — `POST /api/v1/auth/login` returns JWT in httpOnly `session` cookie + CSRF token in `csrf` cookie
2. **Authenticated requests** — Browser automatically sends `session` cookie; client must send `X-CSRF-Token` header (from `csrf` cookie) for mutating methods
3. **Logout** — `POST /api/v1/auth/logout` clears the `session` cookie

## Middleware Applied

| Middleware | Applied To | Behavior |
|------------|-----------|----------|
| `authGuard()` | Protected endpoints | Verifies JWT, checks role |
| `csrfGuard()` | Mutating methods (POST, PATCH) | Validates `X-CSRF-Token` header |
| `rateLimiter()` | Login, attendance submit | Limits request frequency |

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /api/v1/auth/login` | 10 requests | 15 minutes per IP |
| `POST /api/v1/attendance` | 5 requests | 1 minute per user |
