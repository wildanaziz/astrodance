import type { APIRoute } from 'astro';
import { authGuard } from '../../../../../shared/middleware/authGuard';
import { ClassService } from '../../../../../modules/class/application/classService';
import { ClassRepository } from '../../../../../modules/class/infrastructure/classRepository';
import { UserRepository } from '../../../../../modules/auth/infrastructure/userRepository';
import { AppError } from '../../../../../shared/utils/errors';

export const POST: APIRoute = async (context) => {
  try {
    await authGuard(context, 'admin');
    const classId = context.params.id!;
    const body = await context.request.json();

    const userRepo = new UserRepository();
    const student = await userRepo.findByNim(body.nim);
    if (!student) return new Response(JSON.stringify({ success: false, error: 'NotFound', message: 'Student not found' }), { status: 404 });

    const service = new ClassService(new ClassRepository());
    const enrollment = await service.enrollStudent(classId, student.id);
    return new Response(JSON.stringify({ success: true, data: enrollment }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    if (err instanceof AppError) return new Response(JSON.stringify({ success: false, error: err.code, message: err.message }), { status: err.statusCode });
    return new Response(JSON.stringify({ success: false, error: 'InternalError', message: 'Something went wrong' }), { status: 500 });
  }
};
