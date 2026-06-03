import type { APIRoute } from 'astro';
import { eq, inArray } from 'drizzle-orm';
import { authGuard } from '../../../../../shared/middleware/authGuard';
import { ClassService } from '../../../../../modules/class/application/classService';
import { ClassRepository } from '../../../../../modules/class/infrastructure/classRepository';
import { SessionService } from '../../../../../modules/session/application/sessionService';
import { SessionRepository } from '../../../../../modules/session/infrastructure/sessionRepository';
import { db } from '../../../../../shared/config/db';
import { attendanceRecords } from '../../../../../shared/config/schema';
import { AppError } from '../../../../../shared/utils/errors';

export const GET: APIRoute = async (context) => {
  try {
    const user = await authGuard(context, 'student');

    const classService = new ClassService(new ClassRepository());
    const enrolledClasses = await classService.listStudentClasses(user.sub);
    const classMap = new Map(enrolledClasses.map(c => [c.id, c.name]));

    const sessionService = new SessionService(new SessionRepository());
    const activeSessions = await sessionService.getActiveSessions(enrolledClasses.map(c => c.id));

    const enrolledClassIds = enrolledClasses.map(c => c.id);
    const attendedResult = enrolledClassIds.length > 0
      ? await db.select({ sessionId: attendanceRecords.sessionId })
        .from(attendanceRecords)
        .where(inArray(attendanceRecords.sessionId, activeSessions.map(s => s.id)))
        .where(eq(attendanceRecords.studentId, user.sub))
      : [];
    const attendedIds = new Set(attendedResult.map(r => r.sessionId));

    const data = activeSessions
      .filter(s => !attendedIds.has(s.id))
      .map(s => ({
        id: s.id,
        name: s.name,
        classId: s.classId,
        className: classMap.get(s.classId) || 'Unknown',
        startTime: s.startTime,
        endTime: s.endTime,
        status: s.status
      }));

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    if (err instanceof AppError)
      return new Response(JSON.stringify({ success: false, error: err.code, message: err.message }), { status: err.statusCode });
    return new Response(JSON.stringify({ success: false, error: 'InternalError', message: 'Something went wrong' }), { status: 500 });
  }
};
