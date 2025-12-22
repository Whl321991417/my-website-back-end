import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeModule } from './home-module.entity';
import { HomeModulesController } from './home-modules.controller';
import { HomeModulesService } from './home-modules.service';

@Module({
  imports: [TypeOrmModule.forFeature([HomeModule])],
  controllers: [HomeModulesController],
  providers: [HomeModulesService],
})
export class HomeModulesModule {}
