import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  // 配置CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // 配置Swagger
  const config = new DocumentBuilder()
    .setTitle('My Website API')
    .setDescription('API documentation for My Website backend')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, '0.0.0.0');
}
bootstrap();
