# src/modules/auth/ — Authentication Module

Handles user registration, login, and JWT-based session management.

## Layer Structure

```
auth/
  domain/
    entities.ts         # User interface
    interfaces.ts       # IUserRepository, IAuthService, DTOs
  application/
    authService.ts      # Business logic: register & login
  infrastructure/
    userRepository.ts   # Drizzle queries against users table
```

## Domain Layer

### `entities.ts` — `User`

```ts
interface User {
  id: string;
  nim: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'student';
  createdAt: Date;
}
```

### `interfaces.ts` — Repository & Service Contracts

```ts
interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByNim(nim: string): Promise<User | null>;
  create(user: CreateUserDTO): Promise<User>;
}

interface RegisterStudentDTO {
  fullName: string;
  nim: string;
  email: string;
  password: string;
}

interface LoginDTO {
  email: string;
  password: string;
}
```

## Application Layer

### `authService.ts` — `AuthService`

Constructor receives `IUserRepository` via dependency injection.

**`registerStudent(dto: RegisterStudentDTO)`**
1. Validates NIM format (15 digits) via `isValidNIM()`
2. Validates email format via `isValidEmail()`
3. Validates password length (minimum length check)
4. Checks email and NIM uniqueness via repository
5. Hashes password with Argon2id
6. Creates user record
7. Signs JWT token
8. Returns `{ user, token }`

**`login(dto: LoginDTO)`**
1. Finds user by email
2. Verifies password with Argon2id
3. Signs JWT token
4. Returns `{ user, token }`

## Infrastructure Layer

### `userRepository.ts` — `UserRepository`

Implements `IUserRepository` using Drizzle ORM queries against the `users` table. All methods are async and interact directly with `db` from `shared/config/db.ts`.

## Dependencies

- `shared/config/db.ts` — Database connection
- `shared/config/schema.ts` — `users` table definition
- `shared/utils/password.ts` — Argon2id hashing
- `shared/utils/jwt.ts` — JWT signing
- `shared/utils/validators.ts` — NIM & email validation
