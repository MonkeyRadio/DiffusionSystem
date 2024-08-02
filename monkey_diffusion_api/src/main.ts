import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as compression from "compression";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
    preflightContinue: false,
  });
  app.use(compression());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  await app.listen(3000);
}
bootstrap();
