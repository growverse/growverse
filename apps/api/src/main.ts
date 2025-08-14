import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8000;
  const origin = process.env.CORS_ORIGIN || '*';
  app.enableCors({ origin });
  await app.listen(port);
}
bootstrap();
