import type { APIRoute } from 'astro';
import { authGuard } from '../../../../shared/middleware/authGuard';
import { UserRepository } from '../../../../modules/auth/infrastructure/userRepository';

export const GET: APIRoute = async (context) => {
  try {
    const jwtUser = await authGuard(context);
    const repo = new UserRepository();
    const user = await repo.findById(jwtUser.sub);
    if (!user) return new Response(JSON.stringify({ success: false, error: 'NotFound', message: 'User not found' }), { status: 404 });

    return new Response(JSON.stringify({
      success: true,
      data: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, nim: user.nim }
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.code || 'Unauthorized', message: err.message }), { status: err.statusCode || 401 });
  }
};
