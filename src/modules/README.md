# src/modules/ — Business Domain Modules

Modular monolith architecture. Four independent modules, each owning its business logic and data access.

## Modules

| Module | Domain | Key Responsibilities |
|--------|--------|---------------------|
| `auth/` | Authentication & Authorization | Student registration, login, JWT management, password hashing |
| `class/` | Class Management | Create/view classes, enroll students |
| `session/` | Attendance Sessions | Create/close time-bounded sessions per class |
| `attendance/` | Attendance Records | Submit attendance, validate time windows, prevent duplicates |

## Architecture Pattern

Every module follows the same three-layer structure:

```
modules/{module}/
  domain/
    entities.ts       # Pure data interfaces (zero dependencies)
    interfaces.ts     # Repository contracts (I*Repository) + DTOs
  application/
    {module}Service.ts   # Business logic, validation, orchestration
  infrastructure/
    {module}Repository.ts   # Drizzle ORM implementation of repository interfaces
```

### Layer Responsibilities

#### Domain Layer
- **entities.ts** — TypeScript interfaces describing domain objects (`User`, `Class`, `AttendanceSession`, `AttendanceRecord`). No logic, no dependencies.
- **interfaces.ts** — Repository contracts (`IUserRepository`, `IClassRepository`, etc.) and Data Transfer Objects. Defines *what* data operations are needed without specifying *how*.

#### Application Layer
- Contains all business rules and validation logic
- Receives repository interfaces via constructor injection (Dependency Inversion)
- Throws domain-specific errors (`AppError` subclasses)
- No direct database access — depends on injected repository interfaces

#### Infrastructure Layer
- Implements repository interfaces using Drizzle ORM
- Direct dependency on `shared/config/db.ts` and `shared/config/schema.ts`
- Translates between domain entities and database rows

### Dependency Graph

```
application ──depends on──▶ domain interfaces ◀──implements── infrastructure
                                    │
                              shared kernel
                           (config, utils, middleware)
```

### Module Communication

Modules are loosely coupled. Cross-module references are limited to:
- `attendance` module imports `AttendanceSession` entity type from `session/domain/entities`
- Other cross-module needs are handled at the page/API route level by orchestrating multiple services

### Why This Architecture?

1. **Testability** — Services can be tested with mock repositories (no database needed for unit tests)
2. **Maintainability** — Business rules live in one place (application layer)
3. **Swap-ability** — Repository implementations can be replaced (e.g., PostgreSQL → MySQL) without changing business logic
4. **Modular boundaries** — Clear ownership of data and logic per domain
