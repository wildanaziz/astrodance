export interface AttendanceSession {
  id: string;
  classId: string;
  name: string | null;
  startTime: Date;
  endTime: Date;
  status: 'active' | 'closed';
  createdAt: Date;
}
