import type { APIRoute } from 'astro';
import { authGuard } from '../../../shared/middleware/authGuard';
import { AttendanceService } from '../../../modules/attendance/application/attendanceService';
import { AttendanceRepository } from '../../../modules/attendance/infrastructure/attendanceRepository';
import { SessionRepository } from '../../../modules/session/infrastructure/sessionRepository';
import { AppError } from '../../../shared/utils/errors';
import { rateLimiter } from '../../../shared/middleware/rateLimiter';

export const POST: APIRoute = async (context) => {
  try {
    const user = await authGuard(context, 'student');
    if (!rateLimiter(`attendance:${user.sub}`, 5, 60 * 1000)) {
      return new Response(JSON.stringify({ success: false, error: 'RateLimit', message: 'Too many attendance submissions' }), { status: 429 });
    }
    const body = await context.request.json();
    const sessionRepo = new SessionRepository();
    const session = await sessionRepo.findById(body.sessionId);
    if (!session) return new Response(JSON.stringify({ success: false, error: 'NotFound', message: 'Session not found' }), { status: 404 });

    const service = new AttendanceService(new AttendanceRepository());
    const record = await service.submitAttendance(session, user.sub, body.mode);
    return new Response(JSON.stringify({ success: true, data: record }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    if (err instanceof AppError) return new Response(JSON.stringify({ success: false, error: err.code, message: err.message }), { status: err.statusCode });
    return new Response(JSON.stringify({ success: false, error: 'InternalError', message: 'Something went wrong' }), { status: 500 });
  }
};
