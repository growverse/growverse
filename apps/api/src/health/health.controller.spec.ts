import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';

describe('HealthController', () => {
  it('GET /health should return ok', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    const ctrl = moduleRef.get(HealthController);
    (ctrl as any).svc = {
      mongoOk: async () => true,
      redisPing: async () => 'PONG'
    } as HealthService;

    const res = await ctrl.basic();
    expect(res.status).toBe('ok');
    expect(typeof res.timestamp).toBe('string');
  });

  it('GET /health/full reflects deps', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    const ctrl = moduleRef.get(HealthController);
    (ctrl as any).svc = {
      mongoOk: async () => true,
      redisPing: async () => 'PONG'
    } as HealthService;

    const res = await ctrl.full();
    expect(res.status).toBe('ok');
    expect(res.mongo).toBe(true);
    expect(res.redis).toBe('PONG');
  });
});
