import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from './configuration.entity';
import { ConfigurationsService } from './configurations.service';
import { ConfigurationsController } from './configurations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Configuration])],
  controllers: [ConfigurationsController],
  providers: [ConfigurationsService],
  exports: [ConfigurationsService],
})
export class ConfigurationsModule { }
