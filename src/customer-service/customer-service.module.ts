import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer-service.entity';
import { CustomerServiceService } from './customer-service.service';
import { CustomerServiceController } from './customer-service.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerService])],
  controllers: [CustomerServiceController],
  providers: [CustomerServiceService],
  exports: [CustomerServiceService],
})
export class CustomerServiceModule {}
