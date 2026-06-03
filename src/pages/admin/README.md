# src/pages/admin/ — Admin Panel

Admin-only pages for managing classes, attendance sessions, and student enrollments. All routes are protected with `pageAuthGuard('admin')`.

## Pages

### `dashboard.astro` — `/admin/dashboard`

Admin overview with:

- **Statistics cards**: Total classes, active sessions count, enrolled students count
- **Recent sessions table**: Lists recent attendance sessions across all classes with status badges
- Server-side data fetched from `/api/v1/admin/dashboard`

### `classes.astro` — `/admin/classes`

Lists all classes created by the currently logged-in admin:

- Cards display class name and creation date
- "Create New Class" button navigates to `/admin/classes/new`
- Clicking a card navigates to class detail `/admin/classes/[id]`
- Data loaded server-side via `ClassService`

### `classes/new.astro` — `/admin/classes/new`

Form to create a new class:

- Input: class name (required)
- POSTs to `/api/v1/classes`
- Redirects to `/admin/classes` on success

### `classes/[id].astro` — `/admin/classes/:id`

Class detail page with three sections:

1. **Enrolled Students** — Table listing enrolled students (NIM, name, email)
2. **Initiate Session** — Form to create a new attendance session (name, start time, end time)
   - POSTs to `/api/v1/classes/:id/sessions`
3. **Session History** — Table of past sessions for this class
   - Each session row links to session detail at `/admin/classes/:id/sessions/:sid`
4. **Enroll Student** — Form to enroll a student by NIM into this class
   - POSTs to `/api/v1/classes/:id/enroll`

### `classes/[id]/sessions/[sid].astro` — `/admin/classes/:id/sessions/:sid`

Attendance records view for a specific session:

- Table showing: student name, NIM, attendance mode (In-Person/Online), submission time
- **CSV Export** link — downloads attendance data as CSV via `/api/v1/sessions/:id/attendance/export`
- **Close Session** button — marks session as closed via `PATCH /api/v1/sessions/:id/close`
- Data loaded via `AttendanceService` + direct database query for student names

## Auth & Security

- All pages call `pageAuthGuard(context, 'admin')` in the Astro code fence
- Non-admin users are redirected to `/login`
- API endpoints used by these pages also apply `authGuard()` server-side
