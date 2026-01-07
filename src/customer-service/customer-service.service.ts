import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerService as CustomerServiceEntity } from './customer-service.entity';

@Injectable()
export class CustomerServiceService {
  constructor(
    @InjectRepository(CustomerServiceEntity)
    private customerServiceRepository: Repository<CustomerServiceEntity>,
  ) {}

  // 获取客服信息
  async findOne(): Promise<CustomerServiceEntity | null> {
    // 由于是单一客服，只返回第一条记录
    const result = await this.customerServiceRepository.find({ take: 1 });
    return result.length > 0 ? result[0] : null;
  }

  // 更新客服信息
  async update(updateData: Partial<CustomerServiceEntity>): Promise<CustomerServiceEntity | null> {
    // 由于是单一客服，只更新第一条记录
    const existing = await this.findOne();
    
    if (!existing) {
      // 如果没有记录，则创建新记录
      const newEntity = this.customerServiceRepository.create(updateData);
      return this.customerServiceRepository.save(newEntity);
    }
    
    // 更新现有记录
    await this.customerServiceRepository.update(existing.id, updateData);
    return this.findOne();
  }
}
