import { eq, and } from 'drizzle-orm';
import { db } from '../../../shared/config/db';
import { attendanceRecords } from '../../../shared/config/schema';
import type { IAttendanceRepository } from '../domain/interfaces';
import type { AttendanceRecord } from '../domain/entities';

export class AttendanceRepository implements IAttendanceRepository {
  async create(data: Omit<AttendanceRecord, 'id' | 'submittedAt'>): Promise<AttendanceRecord> {
    const results = await db.insert(attendanceRecords).values(data).returning();
    return results[0];
  }

  async findBySession(sessionId: string): Promise<AttendanceRecord[]> {
    return db.select().from(attendanceRecords).where(eq(attendanceRecords.sessionId, sessionId));
  }

  async findByStudent(studentId: string): Promise<AttendanceRecord[]> {
    return db.select().from(attendanceRecords).where(eq(attendanceRecords.studentId, studentId));
  }

  async findBySessionAndStudent(sessionId: string, studentId: string): Promise<AttendanceRecord | null> {
    const results = await db.select().from(attendanceRecords).where(
      and(eq(attendanceRecords.sessionId, sessionId), eq(attendanceRecords.studentId, studentId))
    ).limit(1);
    return results[0] ?? null;
  }
}
