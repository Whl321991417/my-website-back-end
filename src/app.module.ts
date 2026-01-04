import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HomeModulesModule } from './home-modules/home-modules.module';
import { ImagesModule } from './images/images.module';
import { MailModule } from './mail/mail.module';
import { BlogsModule } from './blogs/blogs.module';
import { User } from './users/user.entity';
import { HomeModule } from './home-modules/home-module.entity';
import { Image } from './images/image.entity';
import { Blog } from './blogs/blog.entity';

@Module({
  imports: [
    // 加载环境变量配置
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any || 'mysql',
      host: process.env.DB_HOST || '123.60.102.168',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'my-website',
      password: process.env.DB_PASSWORD || 'root123',
      database: process.env.DB_DATABASE || 'my-website',
      entities: [User, HomeModule, Image, Blog],
      synchronize: true,
      // 添加连接池配置
      poolSize: 10,
      // 启用详细日志，便于调试
      logging: true,
      logger: 'advanced-console',
    }),
    // 配置静态文件服务，用于提供上传的图片
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    HomeModulesModule,
    ImagesModule,
    MailModule,
    BlogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
