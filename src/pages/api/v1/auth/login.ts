import type { APIRoute } from 'astro';
import { AuthService } from '../../../../modules/auth/application/authService';
import { UserRepository } from '../../../../modules/auth/infrastructure/userRepository';
import { AppError } from '../../../../shared/utils/errors';
import { rateLimiter } from '../../../../shared/middleware/rateLimiter';
import { env } from '../../../../shared/config/env';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimiter(`login:${ip}`, 10, 15 * 60 * 1000)) {
      return new Response(JSON.stringify({ success: false, error: 'RateLimit', message: 'Too many login attempts' }), { status: 429 });
    }
    const body = await request.json();
    const service = new AuthService(new UserRepository());
    const { user, token } = await service.login(body);

    const cookieOpts = {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 8,
      path: '/'
    };

    cookies.set('session', token, cookieOpts);

    const csrfToken = crypto.randomUUID();
    cookies.set('csrf', csrfToken, { httpOnly: false, secure: env.COOKIE_SECURE, sameSite: 'lax', maxAge: 60 * 60 * 8, path: '/' });

    const expiryMs = Date.now() + (8 * 60 * 60 * 1000);
    cookies.set('session_expires_at', String(expiryMs), { httpOnly: false, secure: env.COOKIE_SECURE, sameSite: 'lax', maxAge: 60 * 60 * 8, path: '/' });

    return new Response(JSON.stringify({
      success: true,
      data: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
      message: 'Login successful'
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    if (err instanceof AppError) {
      return new Response(JSON.stringify({ success: false, error: err.code, message: err.message }), { status: err.statusCode });
    }
    return new Response(JSON.stringify({ success: false, error: 'InternalError', message: 'Something went wrong' }), { status: 500 });
  }
};
