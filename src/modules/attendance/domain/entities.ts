export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  mode: 'luring' | 'daring';
  submittedAt: Date;
}
