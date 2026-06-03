import { describe, it, expect } from 'bun:test';

describe('Auth Integration', () => {
  it('registers and logs in', async () => {
    const register = await fetch('http://localhost:4321/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test Student',
        nim: '235150301111028',
        email: `test${Date.now()}@student.ub.ac.id`,
        password: 'SecurePass123!'
      })
    });
    expect(register.status).toBe(201);

    const login = await fetch('http://localhost:4321/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test${Date.now()}@student.ub.ac.id`,
        password: 'SecurePass123!'
      })
    });
    expect(login.status).toBe(200);
  });
});
