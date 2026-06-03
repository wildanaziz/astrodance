import { AppError } from '../../../shared/utils/errors';
import type { ISessionRepository } from '../domain/interfaces';
import type { AttendanceSession } from '../domain/entities';

export class SessionService {
  constructor(private repo: ISessionRepository) {}

  async initiateSession(classId: string, name: string | null, startTime: Date, endTime: Date): Promise<AttendanceSession> {
    if (endTime <= startTime) throw new AppError(400, 'End time must be after start time', 'ValidationError');
    return this.repo.create({ classId, name, startTime, endTime, status: 'active' });
  }

  async listSessionsByClass(classId: string): Promise<AttendanceSession[]> {
    return this.repo.findByClass(classId);
  }

  async getActiveSessions(classIds: string[]): Promise<AttendanceSession[]> {
    return this.repo.findActiveByClasses(classIds);
  }

  async closeSession(id: string): Promise<AttendanceSession | null> {
    return this.repo.closeSession(id);
  }
}
