import type { APIRoute } from 'astro';
import { authGuard } from '../../../../shared/middleware/authGuard';
import { ClassService } from '../../../../modules/class/application/classService';
import { ClassRepository } from '../../../../modules/class/infrastructure/classRepository';
import { AppError } from '../../../../shared/utils/errors';

export const GET: APIRoute = async (context) => {
  try {
    const user = await authGuard(context, 'student');
    const service = new ClassService(new ClassRepository());
    const list = await service.listStudentClasses(user.sub);
    return new Response(JSON.stringify({ success: true, data: list }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    if (err instanceof AppError) return new Response(JSON.stringify({ success: false, error: err.code, message: err.message }), { status: err.statusCode });
    return new Response(JSON.stringify({ success: false, error: 'InternalError', message: 'Something went wrong' }), { status: 500 });
  }
};
