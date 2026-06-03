import type { APIRoute } from 'astro';
import { authGuard } from '../../../../shared/middleware/authGuard';
import { AttendanceService } from '../../../../modules/attendance/application/attendanceService';
import { AttendanceRepository } from '../../../../modules/attendance/infrastructure/attendanceRepository';
import { AppError } from '../../../../shared/utils/errors';

export const GET: APIRoute = async (context) => {
  try {
    const user = await authGuard(context, 'student');
    const service = new AttendanceService(new AttendanceRepository());
    const records = await service.getStudentAttendanceHistory(user.sub);
    return new Response(JSON.stringify({ success: true, data: records }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    if (err instanceof AppError) return new Response(JSON.stringify({ success: false, error: err.code, message: err.message }), { status: err.statusCode });
    return new Response(JSON.stringify({ success: false, error: 'InternalError', message: 'Something went wrong' }), { status: 500 });
  }
};
