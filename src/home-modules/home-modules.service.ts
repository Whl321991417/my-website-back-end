import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomeModule } from './home-module.entity';

@Injectable()
export class HomeModulesService {
  constructor(
    @InjectRepository(HomeModule)
    private homeModulesRepository: Repository<HomeModule>,
  ) { }

  async findAll(): Promise<HomeModule[]> {
    return this.homeModulesRepository.find();
  }

  async findById(id: number): Promise<HomeModule | null> {
    return this.homeModulesRepository.findOne({ where: { id } });
  }

  async create(homeModuleData: Partial<HomeModule>): Promise<HomeModule> {
    const homeModule = this.homeModulesRepository.create(homeModuleData);
    return this.homeModulesRepository.save(homeModule);
  }

  async update(id: number, homeModuleData: Partial<HomeModule>): Promise<HomeModule | null> {
    const homeModule = await this.findById(id);
    if (!homeModule) {
      return null;
    }

    await this.homeModulesRepository.update(id, homeModuleData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.homeModulesRepository.delete(id);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }
}