# src/modules/class/ — Class Management Module

Manages course/class entities and student enrollment (many-to-many relationship).

## Layer Structure

```
class/
  domain/
    entities.ts         # Class & StudentClass interfaces
    interfaces.ts       # IClassRepository, EnrolledStudent type, DTOs
  application/
    classService.ts     # Business logic: CRUD & enrollment
  infrastructure/
    classRepository.ts  # Drizzle queries against classes, studentClasses, users
```

## Domain Layer

### `entities.ts`

```ts
interface Class {
  id: string;
  name: string;
  adminId: string;   // FK → users
  createdAt: Date;
}

interface StudentClass {
  studentId: string;  // FK → users
  classId: string;    // FK → classes
}
```

### `interfaces.ts`

```ts
type EnrolledStudent = {
  id: string;
  nim: string;
  fullName: string;
  email: string;
};

interface IClassRepository {
  create(data: CreateClassDTO): Promise<Class>;
  findByAdmin(adminId: string): Promise<Class[]>;
  findById(id: string): Promise<Class | null>;
  enrollStudent(classId: string, studentId: string): Promise<void>;
  findByStudent(studentId: string): Promise<Class[]>;
  findEnrolledStudents(classId: string): Promise<EnrolledStudent[]>;
}
```

## Application Layer

### `classService.ts` — `ClassService`

Constructor receives `IClassRepository` via dependency injection.

**`createClass(dto)`**
1. Validates class name is non-empty
2. Creates class record with admin ID
3. Returns created class

**`getAdminClasses(adminId)`**
- Returns all classes owned by the admin

**`getClassById(id)`**
- Returns class details including enrolled students

**`enrollStudent(classId, studentNim)`**
1. Looks up student by NIM via repository
2. Enrolls student into class (inserts into `studentClasses` junction table)
3. Returns enrolled student info

**`getStudentClasses(studentId)`**
- Returns all classes a student is enrolled in

## Infrastructure Layer

### `classRepository.ts` — `ClassRepository`

Implements `IClassRepository` using Drizzle queries across three tables:
- `classes` — Class records
- `studentClasses` — Enrollment junction
- `users` — Student profiles (for `findEnrolledStudents`)

Unique composite key on `studentClasses` prevents duplicate enrollment.

## Dependencies

- `shared/config/db.ts` — Database connection
- `shared/config/schema.ts` — `classes`, `studentClasses`, `users` tables
- `shared/utils/errors.ts` — `AppError` for validation failures
- `shared/utils/validators.ts` — NIM validation
