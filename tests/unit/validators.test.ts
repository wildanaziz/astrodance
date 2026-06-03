import { describe, it, expect } from 'bun:test';
import { isValidNIM, isValidEmail } from '../../src/shared/utils/validators';

describe('validators', () => {
  it('accepts 15-digit NIM', () => {
    expect(isValidNIM('235150301111028')).toBe(true);
  });
  it('rejects short NIM', () => {
    expect(isValidNIM('123')).toBe(false);
  });
  it('accepts valid email', () => {
    expect(isValidEmail('budi@student.ub.ac.id')).toBe(true);
  });
  it('rejects invalid email', () => {
    expect(isValidEmail('not-an-email')).toBe(false);
  });
});
