# src/ — Source Code

The application source code follows **Clean Architecture** with a modular monolith structure. Each directory has a clearly defined responsibility.

## Directory Map

```
src/
  components/   # Reusable Astro UI components
  layouts/      # Global page layout shell
  modules/      # Business domain modules (Clean Architecture layers)
  pages/        # File-based routing (Astro pages + API endpoints)
  shared/       # Shared kernel (config, middleware, utils)
```

## Architecture Principles

### Modular Monolith

Business capabilities are split into independent modules under `modules/`. Each module owns its domain logic and data access. Modules communicate through their public application services — never by directly coupling to another module's repository.

### Clean Architecture Layers

Every module follows a strict three-layer structure:

| Layer | Directory | Responsibility |
|-------|-----------|---------------|
| **Domain** | `domain/` | Entities (pure data interfaces), repository interfaces (contracts), DTOs |
| **Application** | `application/` | Business logic, validation, orchestration — depends only on domain interfaces |
| **Infrastructure** | `infrastructure/` | Database queries via Drizzle ORM — implements domain repository interfaces |

### Dependency Rule

Dependencies point inward:
```
infrastructure → domain ← application
```

- **Domain** has zero dependencies on other layers
- **Application** depends on domain interfaces (injected via constructor)
- **Infrastructure** depends on domain interfaces (implements them) and on `shared/`

### Shared Kernel

Code in `shared/` is available to all modules and pages. It contains:
- `shared/config/` — Database connection, schema, environment variables, seeding
- `shared/middleware/` — Auth guards, rate limiter, CSRF protection
- `shared/utils/` — JWT, password hashing, validators, custom error classes

## How Routes Work

Astro uses file-based routing:
- `src/pages/*.astro` → HTML pages rendered server-side
- `src/pages/api/**/*.ts` → REST API endpoints exporting `GET`, `POST`, `PATCH` functions

Dynamic route parameters use `[param]` notation (e.g., `[id].astro`, `[id].ts`).

## Astro Architecture

The app runs in **server mode** (`output: 'server'`) with the Node.js adapter in standalone mode. All pages are server-side rendered (SSR). Client interactivity is handled via inline `<script>` tags and Web Components patterns within `.astro` files.
