import { describe, it, expect } from 'bun:test';
import { AuthService } from '../../src/modules/auth/application/authService';

const mockRepo = {
  findByEmail: () => Promise.resolve(null),
  findById: () => Promise.resolve(null),
  create: (u: any) => Promise.resolve({ ...u, id: '1', createdAt: new Date() })
};

const service = new AuthService(mockRepo as any);

describe('AuthService', () => {
  it('registers a student', async () => {
    const result = await service.registerStudent({
      fullName: 'Budi',
      nim: '235150301111028',
      email: 'budi@student.ub.ac.id',
      password: 'SecurePass123!'
    });
    expect(result.user.email).toBe('budi@student.ub.ac.id');
    expect(result.token.length > 0).toBe(true);
  });
});
