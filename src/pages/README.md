# src/pages/ — Routing

Astro's file-based routing system. Every `.astro` file becomes a page route; every `.ts` file under `api/` becomes a REST endpoint.

## Route Map

```
pages/
  index.astro        → /                (redirects to /login)
  login.astro        → /login           (login form)
  logout.astro       → /logout          (clears session, redirects)
  register.astro     → /register        (student self-registration)
  admin/                                (/admin/*)
    dashboard.astro  → /admin/dashboard (admin dashboard)
    classes.astro    → /admin/classes   (manage classes)
    classes/
      new.astro      → /admin/classes/new          (create class form)
      [id].astro     → /admin/classes/:id          (class detail)
      [id]/
        sessions/
          [sid].astro → /admin/classes/:id/sessions/:sid (attendance records)
  student/                              (/student/*)
    dashboard.astro  → /student/dashboard (student dashboard)
    attendance.astro → /student/attendance (attendance history)
  api/                                  (/api/v1/*)
    v1/
      attendance.ts           POST  /api/v1/attendance
      auth/
        login.ts              POST  /api/v1/auth/login
        register.ts           POST  /api/v1/auth/register
        logout.ts             POST  /api/v1/auth/logout
        me.ts                 GET   /api/v1/auth/me
      classes/
        index.ts              POST  /api/v1/classes
                               GET   /api/v1/classes
        [id].ts               GET   /api/v1/classes/:id
        [id]/
          sessions.ts         POST  /api/v1/classes/:id/sessions
                               GET   /api/v1/classes/:id/sessions
          enroll.ts           POST  /api/v1/classes/:id/enroll
      sessions/
        [id]/
          attendance.ts       GET   /api/v1/sessions/:id/attendance
          attendance/
            export.ts         GET   /api/v1/sessions/:id/attendance/export
          close.ts            PATCH /api/v1/sessions/:id/close
      admin/
        dashboard.ts          GET   /api/v1/admin/dashboard
      student/
        sessions/
          active.ts           GET   /api/v1/student/sessions/active
        enroll.ts             POST  /api/v1/student/enroll
        classes.ts            GET   /api/v1/student/classes
        attendance.ts         GET   /api/v1/student/attendance
```

## Page Patterns

### Admin Pages
- Protected via `pageAuthGuard('admin')` — redirects unauthenticated users to `/login`
- Server-side data fetching in Astro `---` code fences using module services
- HTML rendered with embedded data; forms submit to API endpoints

### Student Pages
- Protected via `pageAuthGuard('student')` — redirects unauthenticated users to `/login`
- Active sessions polled via `setInterval()` in inline scripts
- Modal-based interactions for attendance submission and class enrollment
- Custom events (`action-success`) coordinate modal lifecycle

### Public Pages
- `login.astro` — Client-side form with validation, POSTs to `/api/v1/auth/login`
- `register.astro` — Student self-registration form, POSTs to `/api/v1/auth/register`
- `logout.astro` — No UI; deletes session cookie and redirects immediately

## API Route Patterns

All API routes under `pages/api/v1/`:
- Export named functions: `GET`, `POST`, `PATCH` (matching HTTP methods)
- Receive `APIRoute` context with `Astro.request`, `Astro.cookies`, `Astro.params`
- Return JSON responses with `{ success: true/false, data/error, message }`
- Apply `authGuard()` for protected routes, `csrfGuard()` for mutating methods
