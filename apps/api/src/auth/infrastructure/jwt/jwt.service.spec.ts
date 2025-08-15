import { describe, it, expect } from 'vitest';
import { JwtService } from './jwt.service.js';

const svc = new JwtService();

describe('JwtService', () => {
  it('signs and verifies tokens', async () => {
    const token = await svc.signAccess({ sub: '1', role: 'learner', subRole: 'basic' });
    const claims = await svc.verify(token);
    expect(claims.sub).toBe('1');
    expect(claims.iss).toBeDefined();
    expect(claims.aud).toBeDefined();
    expect(claims.exp).toBeGreaterThan(claims.iat!);
    expect(claims.jti).toBeDefined();
  });

  it('fails on tampered token', async () => {
    const token = await svc.signAccess({ sub: '1', role: 'learner', subRole: 'basic' });
    const tampered = token.slice(0, -1) + 'x';
    await expect(svc.verify(tampered)).rejects.toThrow();
  });

  it('expires tokens', async () => {
    const token = await svc.signAccess({ sub: '1', role: 'learner', subRole: 'basic' }, '1s');
    await new Promise((r) => setTimeout(r, 1100));
    await expect(svc.verify(token)).rejects.toThrow();
  });
});
