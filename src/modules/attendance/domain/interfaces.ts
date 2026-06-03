import type { AttendanceRecord } from './entities';

export interface IAttendanceRepository {
  create(data: Omit<AttendanceRecord, 'id' | 'submittedAt'>): Promise<AttendanceRecord>;
  findBySession(sessionId: string): Promise<AttendanceRecord[]>;
  findByStudent(studentId: string): Promise<AttendanceRecord[]>;
  findBySessionAndStudent(sessionId: string, studentId: string): Promise<AttendanceRecord | null>;
}
