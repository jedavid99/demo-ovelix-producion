import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const reflector = app.get(Reflector);

  // Graceful shutdown (cierra conexiones Prisma en SIGTERM/SIGINT)
  app.enableShutdownHooks();

  // Security headers
  app.use(helmet());

  // Compresión gzip para respuestas
  app.use(compression());

  // CORS
  const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map(o => o.trim().replace(/\/+$/, ''))
    .filter(Boolean);
  app.enableCors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (
        corsOrigins.includes(normalizedOrigin) ||
        normalizedOrigin === 'http://localhost:5174' ||
        /^http:\/\/([a-z0-9-]+\.)?localhost:5174$/.test(normalizedOrigin)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origen no permitido por CORS: ${origin}`), false);
    },
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Global guards
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('ovelix API')
    .setDescription('API para sistema de gestión de servicio técnico')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
