import type { APIRoute } from 'astro';
import { authGuard } from '../../../../shared/middleware/authGuard';
import { ClassService } from '../../../../modules/class/application/classService';
import { ClassRepository } from '../../../../modules/class/infrastructure/classRepository';
import { AppError } from '../../../../shared/utils/errors';

export const GET: APIRoute = async (context) => {
  try {
    await authGuard(context, 'admin');
    const id = context.params.id!;
    const service = new ClassService(new ClassRepository());
    const cls = await service.getClassDetails(id);
    if (!cls) return new Response(JSON.stringify({ success: false, error: 'NotFound', message: 'Class not found' }), { status: 404 });
    return new Response(JSON.stringify({ success: true, data: cls }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    if (err instanceof AppError) return new Response(JSON.stringify({ success: false, error: err.code, message: err.message }), { status: err.statusCode });
    return new Response(JSON.stringify({ success: false, error: 'InternalError', message: 'Something went wrong' }), { status: 500 });
  }
};
