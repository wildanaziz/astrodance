import { describe, it, expect } from 'bun:test';
import { signJWT, verifyJWT } from '../../src/shared/utils/jwt';

describe('jwt', () => {
  it('signs and verifies a token', async () => {
    const token = await signJWT({ sub: '1', email: 'a@b.c', role: 'student' });
    const decoded = await verifyJWT(token);
    expect(decoded.sub).toBe('1');
    expect(decoded.role).toBe('student');
  });
});
