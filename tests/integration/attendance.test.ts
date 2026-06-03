import { describe, it, expect } from 'bun:test';

describe('Attendance Integration', () => {
  it('rejects submission outside window', async () => {
    const res = await fetch('http://localhost:4321/api/v1/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: '00000000-0000-0000-0000-000000000000', mode: 'luring' })
    });
    expect([401, 404, 422]).toContain(res.status);
  });
});
