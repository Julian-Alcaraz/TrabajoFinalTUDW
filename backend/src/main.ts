import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NotFoundExceptionFilter } from 'src/not-found-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.set('trust proxy', 1);
  // CORS
  app.use(cookieParser());
  app.enableCors({
    // Origenes permitidos: ['http://localhost:4200', 'http://localhost:4500', 'http://localhost:4300', '**']
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS', // Metodos HTTP permitidos
    allowedHeaders: 'Content-Type, Authorization, Content-Disposition', // Encabezados permitidos
    credentials: true, // Permitir el uso de credenciales (cookies, headers de autenticación)
  });
  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new NotFoundExceptionFilter());
  // Swagger:
  // Solo disponible cuando la app esta en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder().setTitle('API TPFinalTUDW').setDescription('API para la aplicación web de la Fundacion Sol').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }
  await app.listen(3000);
}
bootstrap();
