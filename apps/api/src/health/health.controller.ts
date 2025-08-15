import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly svc: HealthService) {}

  @Get()
  basic() {
    return { status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() };
  }

  @Get('full')
  async full() {
    const [mongo, redis] = await Promise.all([this.svc.mongoOk(), this.svc.redisPing()]);
    const status = mongo && redis === 'PONG' ? 'ok' : 'degraded';
    return { status, mongo, redis, timestamp: new Date().toISOString() };
  }
}
