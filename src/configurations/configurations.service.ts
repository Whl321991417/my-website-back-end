import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from './configuration.entity';

@Injectable()
export class ConfigurationsService {
  constructor(
    @InjectRepository(Configuration)
    private configurationsRepository: Repository<Configuration>,
  ) { }

  /**
   * 获取所有配置
   */
  async findAll(): Promise<Configuration[]> {
    return this.configurationsRepository.find();
  }

  /**
   * 根据名称获取配置
   */
  async findByName(name: string): Promise<Configuration | null> {
    return this.configurationsRepository.findOne({ where: { name } });
  }

  /**
   * 创建配置
   */
  async create(name: string, content: Record<string, any>): Promise<Configuration> {
    // 检查配置名称是否已存在
    const existingConfig = await this.findByName(name);
    if (existingConfig) {
      throw new ConflictException(`Configuration with name "${name}" already exists`);
    }

    const configuration = this.configurationsRepository.create({
      name,
      content,
    });

    return this.configurationsRepository.save(configuration);
  }

  /**
   * 更新配置
   */
  async update(name: string, content: Record<string, any>): Promise<Configuration> {
    const configuration = await this.findByName(name);
    if (!configuration) {
      // 如果配置不存在，则创建新配置
      return this.create(name, content);
    }

    configuration.content = content;
    return this.configurationsRepository.save(configuration);
  }

  /**
   * 更新或创建配置
   */
  async upsert(name: string, content: Record<string, any>): Promise<Configuration> {
    const configuration = await this.findByName(name);
    if (configuration) {
      return this.update(name, content);
    } else {
      return this.create(name, content);
    }
  }

  /**
   * 删除配置
   */
  async delete(name: string): Promise<boolean> {
    const result = await this.configurationsRepository.delete({ name });
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }
}