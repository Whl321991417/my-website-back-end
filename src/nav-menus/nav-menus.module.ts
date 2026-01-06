import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavMenu } from './nav-menu.entity';
import { NavMenusController } from './nav-menus.controller';
import { NavMenusService } from './nav-menus.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NavMenu]),
  ],
  controllers: [NavMenusController],
  providers: [NavMenusService],
  exports: [NavMenusService],
})
export class NavMenusModule {}
