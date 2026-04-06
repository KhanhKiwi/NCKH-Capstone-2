import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend (allow PATCH and necessary headers)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('ITCEP API')
    .setDescription('API documentation for ITCEP backend')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
  log('Swagger UI available at http://localhost:3000/api');
}

bootstrap();
