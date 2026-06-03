# tests/ — Test Suite

Bun-powered test suite with unit and integration tests.

## Structure

```
tests/
  bun-test.d.ts       # Type declarations for bun:test module
  unit/               # Unit tests (no external dependencies)
    authService.test.ts   # AuthService.registerStudent()
    jwt.test.ts           # JWT sign & verify round-trip
    validators.test.ts    # isValidNIM(), isValidEmail()
  integration/        # Integration tests (requires running server)
    auth.test.ts          # Full register + login flow
    attendance.test.ts    # Attendance submission rejection
```

## Running Tests

```bash
# Run all tests
bun test

# Run only unit tests
bun test tests/unit

# Run only integration tests (requires server on localhost:4321)
bun test tests/integration
```

## Test Conventions

### Type Declarations

`bun-test.d.ts` provides TypeScript declarations for `bun:test` globals (`describe`, `it`, `expect`, `mock`). This enables type-checking in test files without Bun's built-in loader.

### Unit Tests

Unit tests import source code directly from `../../src/` and use in-memory mocks. No database or network is required.

| Test File | Tests |
|-----------|-------|
| `authService.test.ts` | `AuthService.registerStudent()` — mocks `IUserRepository`, verifies user creation and JWT token generation |
| `jwt.test.ts` | Round-trip: `signJWT()` → `verifyJWT()` — ensures token payload survives encoding/decoding |
| `validators.test.ts` | `isValidNIM()` (valid 15-digit, rejects short), `isValidEmail()` (valid format, rejects malformed) |

### Integration Tests

Integration tests make real HTTP requests to a running server at `http://localhost:4321`. These tests validate the full request-response cycle including middleware, services, and database interactions.

| Test File | Tests |
|-----------|-------|
| `auth.test.ts` | Registers a new student (`201`), then logs in with same credentials (`200`) |
| `attendance.test.ts` | Submits attendance with non-existent session ID, expects rejection (`401`/`404`/`422`) |

### Pre-requisites for Integration Tests

The server must be running:

```bash
bun run dev
# In another terminal:
bun test tests/integration
```
