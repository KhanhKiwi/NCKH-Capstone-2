import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { log } from 'console';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VillagesModule } from './modules/villages/villages.module';
import { CraftsModule } from './modules/crafts/crafts.module';
import { ProgressModule } from './modules/progress/progress.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { MediaModule } from './modules/media/media.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for frontend (allow PATCH and necessary headers)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
    credentials: true,
  });

  // Serve static uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const config = new DocumentBuilder()
    .setTitle('ITCEP API')
    .setDescription('API documentation for ITCEP backend')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [AuthModule, UsersModule, VillagesModule, CraftsModule, ProgressModule, SessionsModule, MediaModule],
  });
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
  log('Swagger UI available at http://localhost:3000/api');
}

bootstrap();
