import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, HttpStatus } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',')
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Cardinar API')
    .setDescription(
      'Car cover shop REST API - Vertical Slice Architecture with CQRS',
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addCookieAuth('access_token')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Branches', 'Branch management')
    .addTag('Categories', 'Product categories')
    .addTag('Car Makes', 'Car manufacturers')
    .addTag('Car Models', 'Car models')
    .addTag('Products', 'Products')
    .addTag('Colors', 'Color management')
    .addTag('Materials', 'Material management')
    .addTag('Orders', 'Order management')
    .addTag('Banners', 'Banner management')
    .addTag('Images', 'Image management')
    .addTag('Social Links', 'Social links management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Health check endpoint
  app.use('/health', (req, res) => {
    res.status(HttpStatus.OK).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`
╔════════════════════════════════════════════════════════════════════╗
║                    🚀 CARDINAR API STARTED                        ║
╠════════════════════════════════════════════════════════════════════╣
║ Server:  http://localhost:${port}/api                         
║ Docs:    http://localhost:${port}/api/docs                   
║ Health:  http://localhost:${port}/health                     
╚════════════════════════════════════════════════════════════════════╝
  `);
}
void bootstrap();
