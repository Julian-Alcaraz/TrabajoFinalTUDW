import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // CORS
  app.enableCors({
    // Origenes permitidos: ['http://localhost:4200', 'http://localhost:4500', 'http://localhost:4300', '**']
    origin: true,
    methods: 'GET,POST,PUT,DELETE,PATCH, OPTIONS', // Metodos HTTP permitidos
    allowedHeaders: 'Content-Type, Authorization', // Encabezados permitidos
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
  // Swagger:
  const config = new DocumentBuilder().setTitle('API TPFinalTUDW').setDescription('API para la aplicación web de la Fundacion Sol').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
