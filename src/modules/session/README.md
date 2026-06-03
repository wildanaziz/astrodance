# src/modules/session/ — Attendance Session Module

Manages the lifecycle of attendance sessions — time-bounded windows during which students can submit attendance.

## Layer Structure

```
session/
  domain/
    entities.ts         # AttendanceSession interface
    interfaces.ts       # ISessionRepository, DTOs
  application/
    sessionService.ts   # Business logic: create & close sessions
  infrastructure/
    sessionRepository.ts # Drizzle queries against attendanceSessions
```

## Domain Layer

### `entities.ts` — `AttendanceSession`

```ts
interface AttendanceSession {
  id: string;
  classId: string;       // FK → classes
  name: string;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'closed';
}
```

### `interfaces.ts` — `ISessionRepository`

```ts
interface ISessionRepository {
  create(data: CreateSessionDTO): Promise<AttendanceSession>;
  findByClass(classId: string): Promise<AttendanceSession[]>;
  findActiveByClasses(classIds: string[]): Promise<AttendanceSession[]>;
  findById(id: string): Promise<AttendanceSession | null>;
  closeSession(id: string): Promise<void>;
}
```

Key method: `findActiveByClasses()` filters sessions where `endTime > now AND status = 'active'` — this is the query that powers the student dashboard's active sessions panel.

## Application Layer

### `sessionService.ts` — `SessionService`

Constructor receives `ISessionRepository` via dependency injection.

**`createSession(dto)`**
1. Validates that `endTime > startTime`
2. Creates session record with status `'active'`
3. Returns created session

**`closeSession(id)`**
- Updates session status from `'active'` to `'closed'`

**`getSessionsByClass(classId)`**
- Returns all sessions for a class (ordered by creation date descending)

**`getActiveSessions(classIds)`**
- Returns active sessions for a set of class IDs
- Filters: end time > current time AND status = 'active'

## Infrastructure Layer

### `sessionRepository.ts` — `SessionRepository`

Implements `ISessionRepository` using Drizzle queries against the `attendanceSessions` table. The `findActiveByClasses` method uses SQL conditions:

```sql
WHERE class_id IN (...) AND end_time > NOW() AND status = 'active'
```

## Dependencies

- `shared/config/db.ts` — Database connection
- `shared/config/schema.ts` — `attendanceSessions` table
- `shared/utils/errors.ts` — `AppError` for validation (e.g., endTime <= startTime)
