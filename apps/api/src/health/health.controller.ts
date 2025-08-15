import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly svc: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  basic() {
    return { status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() };
  }

  @Get('full')
  @ApiOperation({ summary: 'Full health check including dependencies' })
  async full() {
    const [mongo, redis] = await Promise.all([this.svc.mongoOk(), this.svc.redisPing()]);
    const status = mongo && redis === 'PONG' ? 'ok' : 'degraded';
    return { status, mongo, redis, timestamp: new Date().toISOString() };
  }
}
