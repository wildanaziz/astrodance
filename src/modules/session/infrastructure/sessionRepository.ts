import { eq, inArray, gt, and } from 'drizzle-orm';
import { db } from '../../../shared/config/db';
import { attendanceSessions } from '../../../shared/config/schema';
import type { ISessionRepository } from '../domain/interfaces';
import type { AttendanceSession } from '../domain/entities';

export class SessionRepository implements ISessionRepository {
  async create(data: Omit<AttendanceSession, 'id' | 'createdAt'>): Promise<AttendanceSession> {
    const results = await db.insert(attendanceSessions).values(data).returning();
    return results[0];
  }

  async findByClass(classId: string): Promise<AttendanceSession[]> {
    return db.select().from(attendanceSessions).where(eq(attendanceSessions.classId, classId));
  }

  async findActiveByClasses(classIds: string[]): Promise<AttendanceSession[]> {
    if (classIds.length === 0) return [];
    const now = new Date();
    return db.select().from(attendanceSessions).where(
      and(
        inArray(attendanceSessions.classId, classIds),
        gt(attendanceSessions.endTime, now),
        eq(attendanceSessions.status, 'active')
      )
    );
  }

  async findById(id: string): Promise<AttendanceSession | null> {
    const results = await db.select().from(attendanceSessions).where(eq(attendanceSessions.id, id)).limit(1);
    return results[0] ?? null;
  }

  async closeSession(id: string): Promise<AttendanceSession | null> {
    const results = await db.update(attendanceSessions).set({ status: 'closed' }).where(eq(attendanceSessions.id, id)).returning();
    return results[0] ?? null;
  }
}
