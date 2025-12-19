import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable cookie parser
  app.use(cookieParser());

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Pelindo PMS Service')
    .setDescription('Performance Management System API')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('my-performance', 'Individual performance management')
    .addTag('team', 'Team performance management')
    .addTag('kpi', 'KPI management')
    .addTag('dictionary', 'KPI dictionary')
    .addTag('performance-tree', 'KPI hierarchy')
    .addCookieAuth('smartkmsystemAuth', {
      type: 'apiKey',
      in: 'cookie',
      name: 'smartkmsystemAuth',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 PMS Service is running on: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 API Documentation available at: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
