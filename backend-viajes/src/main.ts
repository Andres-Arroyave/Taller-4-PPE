import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para permitir peticiones del cliente Vue 3
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  // Habilitar validaciones globales DTO con transformacion automatica de tipos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Servidor NestJS escuchando en http://localhost:${port}`);
}

await bootstrap();
