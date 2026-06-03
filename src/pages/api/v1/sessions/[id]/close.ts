import type { APIRoute } from 'astro';
import { authGuard } from '../../../../../shared/middleware/authGuard';
import { SessionService } from '../../../../../modules/session/application/sessionService';
import { SessionRepository } from '../../../../../modules/session/infrastructure/sessionRepository';
import { AppError } from '../../../../../shared/utils/errors';

export const PATCH: APIRoute = async (context) => {
  try {
    await authGuard(context, 'admin');
    const id = context.params.id!;
    const service = new SessionService(new SessionRepository());
    const session = await service.closeSession(id);
    if (!session) return new Response(JSON.stringify({ success: false, error: 'NotFound', message: 'Session not found' }), { status: 404 });
    return new Response(JSON.stringify({ success: true, data: session }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    if (err instanceof AppError) return new Response(JSON.stringify({ success: false, error: err.code, message: err.message }), { status: err.statusCode });
    return new Response(JSON.stringify({ success: false, error: 'InternalError', message: 'Something went wrong' }), { status: 500 });
  }
};
