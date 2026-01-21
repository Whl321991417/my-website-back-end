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
import { AiAgentsModule } from './ai-agents/ai-agents.module';
import { NavMenusModule } from './nav-menus/nav-menus.module';
import { TagsModule } from './tags/tags.module';
import { CustomerServiceModule } from './customer-service/customer-service.module';
import { ConfigurationsModule } from './configurations/configurations.module';
import { EducationModule } from './education/education.module';
import { CaseLibrariesModule } from './case-libraries/case-libraries.module';
import { User } from './users/user.entity';
import { HomeModule } from './home-modules/home-module.entity';
import { Image } from './images/image.entity';
import { Blog } from './blogs/blog.entity';
import { AiAgent } from './ai-agents/ai-agent.entity';
import { NavMenu } from './nav-menus/nav-menu.entity';
import { Tag } from './tags/tag.entity';
import { CustomerService } from './customer-service/customer-service.entity';
import { Configuration } from './configurations/configuration.entity';
import { CaseLibrary } from './case-libraries/case-library.entity';
import { Subject } from './education/entities/subject.entity';
import { Teacher } from './education/entities/teacher.entity';
import { Class } from './education/entities/class.entity';
import { Student } from './education/entities/student.entity';
import { Exam } from './education/entities/exam.entity';
import { KnowledgePoint } from './education/entities/knowledge-point.entity';

@Module({
  imports: [
    // 加载环境变量配置
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // 主数据库连接配置
    TypeOrmModule.forRoot({
      name: 'default',
      type: process.env.DB_TYPE as any || 'mysql',
      host: process.env.DB_HOST || '123.60.102.168',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'my-website',
      password: process.env.DB_PASSWORD || 'root123',
      database: process.env.DB_DATABASE || 'my-website',
      entities: [User, HomeModule, Image, Blog, AiAgent, NavMenu, Tag, CustomerService, Configuration, CaseLibrary],
      synchronize: true,
      // 添加连接池配置
      poolSize: 10,
      // 启用详细日志，便于调试
      logging: true,
      logger: 'advanced-console',
    }),
    // 教育系统数据库连接配置
    TypeOrmModule.forRoot({
      name: 'education',
      type: 'mysql',
      host: process.env.EDUCATION_DB_HOST || '123.60.102.168',
      port: parseInt(process.env.EDUCATION_DB_PORT || '3306', 10),
      username: process.env.EDUCATION_DB_USERNAME || 'my_education',
      password: process.env.EDUCATION_DB_PASSWORD || 'my_education',
      database: process.env.EDUCATION_DB_DATABASE || 'my_education',
      entities: [Subject, Teacher, Class, Student, Exam, KnowledgePoint],
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
    AiAgentsModule,
    NavMenusModule,
    TagsModule,
    CustomerServiceModule,
    ConfigurationsModule,
    EducationModule,
    CaseLibrariesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
