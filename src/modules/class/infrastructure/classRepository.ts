import { eq, inArray } from 'drizzle-orm';
import { db } from '../../../shared/config/db';
import { classes, studentClasses, users } from '../../../shared/config/schema';
import type { IClassRepository, EnrolledStudent } from '../domain/interfaces';
import type { Class, StudentClass } from '../domain/entities';

export class ClassRepository implements IClassRepository {
  async create(data: Omit<Class, 'id' | 'createdAt'>): Promise<Class> {
    const results = await db.insert(classes).values(data).returning();
    return results[0];
  }

  async findByAdmin(adminId: string): Promise<Class[]> {
    return db.select().from(classes).where(eq(classes.adminId, adminId));
  }

  async findById(id: string): Promise<Class | null> {
    const results = await db.select().from(classes).where(eq(classes.id, id)).limit(1);
    return results[0] ?? null;
  }

  async enrollStudent(data: Omit<StudentClass, 'enrolledAt'>): Promise<StudentClass> {
    const results = await db.insert(studentClasses).values(data).returning();
    return results[0];
  }

  async findByStudent(studentId: string): Promise<Class[]> {
    const links = await db.select({ classId: studentClasses.classId }).from(studentClasses).where(eq(studentClasses.studentId, studentId));
    if (links.length === 0) return [];
    return db.select().from(classes).where(inArray(classes.id, links.map(l => l.classId)));
  }

  async findEnrolledStudents(classId: string): Promise<EnrolledStudent[]> {
    return db.select({
      id: users.id,
      fullName: users.fullName,
      nim: users.nim,
      email: users.email
    }).from(studentClasses)
      .innerJoin(users, eq(studentClasses.studentId, users.id))
      .where(eq(studentClasses.classId, classId));
  }
}
