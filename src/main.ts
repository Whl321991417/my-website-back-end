import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// 创建日志实例
const logger = new Logger('Main');

async function bootstrap() {
  // 检测环境
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const PORT = process.env.PORT || 3000;
  const isProduction = NODE_ENV === 'production';

  // 输出环境信息
  logger.log(`🚀 Starting application in ${NODE_ENV} mode`);
  logger.log(`🔌 Port: ${PORT}`);

  let app;

  if (isProduction) {
    // 生产环境：使用HTTPS
    logger.log('🔒 Configuring HTTPS for production environment');

    // 证书路径
    const keyPath = '/www/docker/nginx-backend/www.whl666.xyz.key';
    const certPath = '/www/docker/nginx-backend/www.whl666.xyz.pem';

    // 检查证书文件是否存在
    if (!fs.existsSync(keyPath)) {
      logger.error(`❌ SSL private key not found at: ${keyPath}`);
      process.exit(1);
    }
    if (!fs.existsSync(certPath)) {
      logger.error(`❌ SSL certificate not found at: ${certPath}`);
      process.exit(1);
    }

    logger.log(`📄 SSL Key: ${keyPath}`);
    logger.log(`📄 SSL Cert: ${certPath}`);

    // 创建HTTPS应用
    app = await NestFactory.create(AppModule, {
      httpsOptions: {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      },
    });
  } else {
    // 开发环境：使用HTTP
    logger.log('🔓 Configuring HTTP for development environment');
    app = await NestFactory.create(AppModule);
  }

  // 配置CORS - 允许前端服务访问
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://www.whl666.xyz',
    'http://www.whl666.xyz',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // 允许所有来源在开发环境，生产环境只允许特定来源
      if (!origin || !isProduction || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
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

  // 启动服务，绑定到0.0.0.0以接受外部连接
  await app.listen(PORT, '0.0.0.0');

  // 输出启动信息
  const protocol = isProduction ? 'https' : 'http';
  const host = isProduction ? 'www.whl666.xyz' : 'localhost';
  logger.log(`✅ Application started successfully`);
  logger.log(`📡 API available at: ${protocol}://${host}:${PORT}`);
  logger.log(`📚 Swagger documentation at: ${protocol}://${host}:${PORT}/api`);
}
bootstrap();
