# src/pages/student/ — Student Portal

Student-facing pages for viewing active attendance sessions, submitting attendance, and reviewing history. All routes are protected with `pageAuthGuard('student')`.

## Pages

### `dashboard.astro` — `/student/dashboard`

Student home page featuring:

- **Statistics cards**: Total attendance count, in-person count, online count, open/active sessions count
- **Active Sessions panel**: Polls `/api/v1/student/sessions/active` every 15 seconds
  - Shows sessions from enrolled classes that are currently within their time window
  - Already-attended sessions are excluded
  - Each session card has an "Attend" button that opens the attendance modal
- **Enroll button**: Opens the class enrollment modal
- **Success modal**: Displays confirmation after successful attendance or enrollment

**Modals on this page:**
- `AttendanceModal` — Radio buttons for In-Person (`luring`) vs Online (`daring`) mode
- `EnrollModal` — Lists available classes; shows "Enrolled" badge or "Enroll" button
- `SuccessModal` — Generic success confirmation, dispatches to page reload

### `attendance.astro` — `/student/attendance`

Attendance history with:

- **Statistics cards**: Total, in-person, online attendance counts
- **Filter tabs**: All / In-Person / Online
- **Record cards**: Timeline-style list showing:
  - Session name and class name
  - Attendance mode with badge (In-Person/Online)
  - Submission timestamp
  - Client-side filtering

## Client-Side Architecture

Student pages use inline `<script>` tags with `is:inline` directive to prevent Astro from hoisting scripts:

- **Polling**: `setInterval()` fetches active sessions every 15 seconds on the dashboard
- **Modals**: Global functions on `window` object (`openModal()`, `closeModal()`) for modal lifecycle
- **Events**: Custom `action-success` events coordinate between modal components
- **CSRF**: CSRF token read from `csrf` cookie and sent as `X-CSRF-Token` header

## API Dependencies

| Page | API Endpoint | Purpose |
|------|-------------|---------|
| dashboard.astro | `GET /api/v1/student/sessions/active` | Poll active sessions |
| dashboard.astro | `POST /api/v1/attendance` | Submit attendance (via modal) |
| dashboard.astro | `GET /api/v1/student/classes` | List available classes for enrollment |
| dashboard.astro | `POST /api/v1/student/enroll` | Self-enroll in a class |
| attendance.astro | `GET /api/v1/student/attendance` | Load attendance history |
