import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function seedUsers() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UsersService);

  try {
    // 创建管理员用户
    const adminUser = await usersService.findOne('admin');
    if (!adminUser) {
      await usersService.create('admin', '123456', 'admin@example.com');
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }

    // 创建普通用户
    const user1 = await usersService.findOne('user1');
    if (!user1) {
      await usersService.create('user1', 'password123', 'user1@example.com');
      console.log('User1 created successfully');
    } else {
      console.log('User1 already exists');
    }

    const user2 = await usersService.findOne('user2');
    if (!user2) {
      await usersService.create('user2', 'password456', 'user2@example.com');
      console.log('User2 created successfully');
    } else {
      console.log('User2 already exists');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await app.close();
  }
}

seedUsers();
