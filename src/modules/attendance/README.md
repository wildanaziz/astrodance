# src/modules/attendance/ — Attendance Module

Handles attendance record submission with time window validation, duplicate prevention, and attendance history queries.

## Layer Structure

```
attendance/
  domain/
    entities.ts              # AttendanceRecord interface
    interfaces.ts            # IAttendanceRepository, DTOs
  application/
    attendanceService.ts     # Business logic: submit & query
  infrastructure/
    attendanceRepository.ts  # Drizzle queries against attendanceRecords
```

## Domain Layer

### `entities.ts` — `AttendanceRecord`

```ts
interface AttendanceRecord {
  id: string;
  sessionId: string;   // FK → attendanceSessions
  studentId: string;   // FK → users
  mode: 'luring' | 'daring';  // In-Person | Online
  submittedAt: Date;
}
```

Attendance modes use Indonesian terminology common in the university context:
- `luring` (Luar Jaringan) = In-Person
- `daring` (Dalam Jaringan) = Online

### `interfaces.ts` — `IAttendanceRepository`

```ts
interface IAttendanceRepository {
  create(data: CreateAttendanceDTO): Promise<AttendanceRecord>;
  findBySession(sessionId: string): Promise<AttendanceRecord[]>;
  findByStudent(studentId: string): Promise<AttendanceRecord[]>;
  findBySessionAndStudent(sessionId: string, studentId: string): Promise<AttendanceRecord | null>;
}
```

## Application Layer

### `attendanceService.ts` — `AttendanceService`

Constructor receives `IAttendanceRepository` via dependency injection. Also imports `AttendanceSession` from `session/domain/entities` for validation.

**`submitAttendance(session, studentId, mode)`**
1. Validates the session window: `session.startTime <= now <= session.endTime`
   - Throws `AttendanceWindowError` (422) if outside window
2. Validates the session is still active (`status !== 'closed'`)
3. Checks for duplicate: calls `findBySessionAndStudent()`
   - Throws `DuplicateAttendanceError` (409) if already submitted
4. Creates the attendance record
5. Returns the created record

**`getSessionAttendance(sessionId)`**
- Returns all attendance records for a session

**`getStudentAttendance(studentId)`**
- Returns all attendance records for a student

## Infrastructure Layer

### `attendanceRepository.ts` — `AttendanceRepository`

Implements `IAttendanceRepository` using Drizzle queries against the `attendanceRecords` table. The table has a unique composite constraint on `(sessionId, studentId)` to prevent duplicate submissions at the database level.

## Dependencies

- `shared/config/db.ts` — Database connection
- `shared/config/schema.ts` — `attendanceRecords` table
- `shared/utils/errors.ts` — `AttendanceWindowError`, `DuplicateAttendanceError`
- `../session/domain/entities` — `AttendanceSession` type for time window validation
