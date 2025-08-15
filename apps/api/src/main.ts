import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  await app.register(helmet as any);
  const origins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173').split(',');
  app.enableCors({ origin: origins, credentials: true });

  const port = Number(process.env.PORT ?? 8000);
  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`API up on http://localhost:${port}`);
}
bootstrap();
