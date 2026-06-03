import type { AttendanceSession } from './entities';

export interface ISessionRepository {
  create(data: Omit<AttendanceSession, 'id' | 'createdAt'>): Promise<AttendanceSession>;
  findByClass(classId: string): Promise<AttendanceSession[]>;
  findActiveByClasses(classIds: string[]): Promise<AttendanceSession[]>;
  findById(id: string): Promise<AttendanceSession | null>;
  closeSession(id: string): Promise<AttendanceSession | null>;
}
