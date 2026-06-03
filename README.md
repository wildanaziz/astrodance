# University Student Attendance Management System

A modular monolith web application for managing university attendance. Built with a clean architecture approach, separating domains into independent modules with well-defined boundaries.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Astro](https://astro.build) v5 (SSR mode) |
| Runtime | [Bun](https://bun.sh) |
| Database | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team) |
| Auth | JWT (jose) + Argon2id password hashing |
| Containerization | Docker + Docker Compose |

## Architecture

This project follows a **modular monolith** design with Clean Architecture principles. Each business domain (auth, class, session, attendance) is an independent module with three layers:

```
src/modules/{module}/
  domain/          # Entities, repository interfaces (contracts)
  application/     # Business logic, orchestration
  infrastructure/  # Database implementation (Drizzle ORM)
```

Modules depend on abstraction interfaces (not concrete implementations), following the Dependency Inversion Principle.

## Project Structure

```
astrodance/
  src/
    components/      # Reusable Astro UI components
    layouts/         # Global layout shell with design tokens
    modules/         # Business domain modules (Clean Architecture)
      auth/          # Authentication & authorization
      class/         # Class management
      session/       # Attendance session lifecycle
      attendance/    # Attendance record submission
    pages/           # File-based routes (Astro pages + API endpoints)
      admin/         # Admin panel routes
      api/           # REST API endpoints (/api/v1/)
      student/       # Student portal routes
    shared/          # Shared kernel (config, middleware, utils)
  tests/
    unit/            # Unit tests (Bun)
    integration/     # Integration tests (requires running server)
  drizzle/           # Drizzle migration files
  docs/              # Design & planning documents
```

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- PostgreSQL running on `localhost:5432`

### Setup

```bash
# 1. Install dependencies
bun install

# 2. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET

# 3. Run database migrations
bun run db:generate
bun run db:migrate

# 4. Seed admin user
bun run db:seed

# 5. Start development server
bun run dev
```

The app will be available at `http://localhost:4321`.

### Docker

```bash
docker compose up --build
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start Astro dev server |
| `bun run build` | Build for production |
| `bun run start` | Preview production build |
| `bun run db:generate` | Generate Drizzle migrations |
| `bun run db:migrate` | Apply migrations to database |
| `bun run db:studio` | Open Drizzle Studio GUI |
| `bun run db:seed` | Seed admin user into database |
| `bun test` | Run test suite (Bun) |
| `npm run lint` | TypeScript type check |

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | `c770...` |
| `JWT_EXPIRY` | JWT token expiry duration | `8h` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `PORT` | Server port (default: 4321) | `4321` |

## User Roles

| Role | Access |
|------|--------|
| **Admin** | Dashboard, manage classes, create sessions, enroll students, view attendance |
| **Student** | Dashboard, view active sessions, submit attendance, view history |

## Database Schema

Five core tables:

- `users` — Admin & student accounts (NIM, email, role, password hash)
- `classes` — Courses/classes managed by admins
- `student_classes` — Many-to-many enrollment junction
- `attendance_sessions` — Time-bounded attendance windows per class
- `attendance_records` — Individual student attendance submissions

## API Overview

All API endpoints are under `/api/v1/` and return JSON responses:

```json
{ "success": true, "data": { ... } }
{ "success": false, "error": "ERROR_CODE", "message": "..." }
```

Authentication uses httpOnly JWT cookies with CSRF token protection. Rate limiting is applied to login (10/15min) and attendance submission (5/min).

## Security

- JWT stored in httpOnly cookie (not accessible via JavaScript)
- CSRF token sent as `X-CSRF-Token` header for mutating requests
- Passwords hashed with Argon2id (memory: 65536, iterations: 3)
- In-memory rate limiting on sensitive endpoints
- Input validation on all endpoints (NIM format, email, password strength)

## Testing

```bash
# Run all tests
bun test

# Unit tests (no external dependencies)
bun test tests/unit

# Integration tests (requires running server on localhost:4321)
bun test tests/integration
```
