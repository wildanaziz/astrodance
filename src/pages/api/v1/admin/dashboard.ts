import type { APIRoute } from 'astro';
import { eq, inArray, sql } from 'drizzle-orm';
import { authGuard } from '../../../../shared/middleware/authGuard';
import { db } from '../../../../shared/config/db';
import { classes, studentClasses, attendanceSessions } from '../../../../shared/config/schema';
import { AppError } from '../../../../shared/utils/errors';

export const GET: APIRoute = async (context) => {
  try {
    const user = await authGuard(context, 'admin');

    const myClasses = await db.select({ id: classes.id, name: classes.name }).from(classes).where(eq(classes.adminId, user.sub));
    const classIds = myClasses.map(c => c.id);
    const classMap = new Map(myClasses.map(c => [c.id, c.name]));

    const totalStudents = classIds.length > 0
      ? (await db.select({ count: sql<number>`count(distinct ${studentClasses.studentId})` }).from(studentClasses).where(inArray(studentClasses.classId, classIds)))[0]?.count || 0
      : 0;

    const allSessions = classIds.length > 0
      ? await db.select().from(attendanceSessions).where(inArray(attendanceSessions.classId, classIds))
      : [];

    const now = new Date();
    const activeCount = allSessions.filter(s => s.status === 'active' && new Date(s.endTime) > now).length;

    const recentSessions = allSessions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map(s => ({
        id: s.id,
        name: s.name,
        className: classMap.get(s.classId) || s.classId,
        classId: s.classId,
        startTime: s.startTime,
        endTime: s.endTime,
        status: s.status === 'active' && new Date(s.endTime) > now ? 'active' : 'closed'
      }));

    return new Response(JSON.stringify({
      success: true,
      data: {
        totalClasses: myClasses.length,
        activeSessions: activeCount,
        totalStudents,
        recentSessions
      }
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    if (err instanceof AppError) return new Response(JSON.stringify({ success: false, error: err.code, message: err.message }), { status: err.statusCode });
    return new Response(JSON.stringify({ success: false, error: 'InternalError', message: 'Something went wrong' }), { status: 500 });
  }
};
