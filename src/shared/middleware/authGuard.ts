import type { APIContext } from 'astro';
import { verifyJWT } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

export async function authGuard(context: APIContext, requiredRole?: 'admin' | 'student') {
  const token = context.cookies.get('session')?.value;
  if (!token) throw new UnauthorizedError();

  const user = await verifyJWT(token);
  if (requiredRole && user.role !== requiredRole) {
    throw new ForbiddenError();
  }

  context.locals.user = user;
  return user;
}

export async function pageAuthGuard(context: APIContext, requiredRole?: 'admin' | 'student') {
  try {
    return await authGuard(context, requiredRole);
  } catch {
    return context.redirect('/login');
  }
}
