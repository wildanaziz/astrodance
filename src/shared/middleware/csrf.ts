import type { APIContext } from 'astro';
import { ForbiddenError } from '../utils/errors';

export function csrfGuard(context: APIContext) {
  if (['POST', 'PATCH', 'DELETE'].includes(context.request.method)) {
    const token = context.request.headers.get('X-CSRF-Token');
    const cookie = context.cookies.get('csrf')?.value;
    if (!token || token !== cookie) {
      throw new ForbiddenError('Invalid CSRF token');
    }
  }
}

export function generateCSRFToken(): string {
  return crypto.randomUUID();
}
