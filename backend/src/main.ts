import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());

  const corsOrigin = process.env.CORS_ORIGIN;

  if (!corsOrigin) {
    throw new Error('CORS_ORIGIN is not defined');
  }

  app.enableCors({
    origin: corsOrigin.split(','),
    credentials: true,
  });

  await app.listen(Number(process.env.PORT));
}

void bootstrap();
