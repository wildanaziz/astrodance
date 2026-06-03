import type { APIRoute } from 'astro';
import { authGuard } from '../../../../../../shared/middleware/authGuard';
import { AttendanceService } from '../../../../../../modules/attendance/application/attendanceService';
import { AttendanceRepository } from '../../../../../../modules/attendance/infrastructure/attendanceRepository';
import { AppError } from '../../../../../../shared/utils/errors';

export const GET: APIRoute = async (context) => {
  try {
    await authGuard(context, 'admin');
    const sessionId = context.params.id!;
    const service = new AttendanceService(new AttendanceRepository());
    const records = await service.getAttendanceBySession(sessionId);

    const rows = records.map(r => `${r.studentId},${r.mode},${r.submittedAt.toISOString()}`);
    const csv = 'studentId,mode,submittedAt\n' + rows.join('\n');

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="attendance-${sessionId}.csv"`
      }
    });
  } catch (err: any) {
    if (err instanceof AppError) return new Response(JSON.stringify({ success: false, error: err.code, message: err.message }), { status: err.statusCode });
    return new Response(JSON.stringify({ success: false, error: 'InternalError', message: 'Something went wrong' }), { status: 500 });
  }
};
