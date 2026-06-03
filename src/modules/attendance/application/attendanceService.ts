import { AttendanceWindowError, DuplicateAttendanceError, AppError } from '../../../shared/utils/errors';
import type { IAttendanceRepository } from '../domain/interfaces';
import type { AttendanceRecord } from '../domain/entities';
import type { AttendanceSession } from '../../session/domain/entities';

export class AttendanceService {
  constructor(private repo: IAttendanceRepository) {}

  async submitAttendance(session: AttendanceSession, studentId: string, mode: 'luring' | 'daring'): Promise<AttendanceRecord> {
    const now = new Date();
    if (now < session.startTime || now > session.endTime) {
      throw new AttendanceWindowError();
    }
    if (session.status !== 'active') {
      throw new AttendanceWindowError('Session is closed');
    }

    const existing = await this.repo.findBySessionAndStudent(session.id, studentId);
    if (existing) throw new DuplicateAttendanceError();

    return this.repo.create({ sessionId: session.id, studentId, mode });
  }

  async getAttendanceBySession(sessionId: string): Promise<AttendanceRecord[]> {
    return this.repo.findBySession(sessionId);
  }

  async getStudentAttendanceHistory(studentId: string): Promise<AttendanceRecord[]> {
    return this.repo.findByStudent(studentId);
  }
}
