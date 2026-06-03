import type { APIRoute } from 'astro';
import { authGuard } from '../../../../../shared/middleware/authGuard';
import { SessionService } from '../../../../../modules/session/application/sessionService';
import { SessionRepository } from '../../../../../modules/session/infrastructure/sessionRepository';
import { AppError } from '../../../../../shared/utils/errors';

export const POST: APIRoute = async (context) => {
  try {
    await authGuard(context, 'admin');
    const classId = context.params.id!;
    const body = await context.request.json();
    const service = new SessionService(new SessionRepository());
    const session = await service.initiateSession(classId, body.name || null, new Date(body.startTime), new Date(body.endTime));
    return new Response(JSON.stringify({ success: true, data: session }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    if (err instanceof AppError) return new Response(JSON.stringify({ success: false, error: err.code, message: err.message }), { status: err.statusCode });
    return new Response(JSON.stringify({ success: false, error: 'InternalError', message: 'Something went wrong' }), { status: 500 });
  }
};

export const GET: APIRoute = async (context) => {
  try {
    await authGuard(context, 'admin');
    const classId = context.params.id!;
    const service = new SessionService(new SessionRepository());
    const list = await service.listSessionsByClass(classId);
    return new Response(JSON.stringify({ success: true, data: list }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    if (err instanceof AppError) return new Response(JSON.stringify({ success: false, error: err.code, message: err.message }), { status: err.statusCode });
    return new Response(JSON.stringify({ success: false, error: 'InternalError', message: 'Something went wrong' }), { status: 500 });
  }
};
