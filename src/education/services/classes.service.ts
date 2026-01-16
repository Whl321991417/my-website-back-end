import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../entities/class.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class, 'education')
    private classesRepository: Repository<Class>,
  ) { }

  // 创建班级
  async create(createClassDto: any): Promise<Class> {
    const classEntity = this.classesRepository.create(createClassDto);
    return this.classesRepository.save(classEntity) as unknown as Class;
  }

  // 获取所有班级
  async findAll(): Promise<Class[]> {
    return this.classesRepository.find();
  }

  // 根据ID获取班级
  async findOne(id: number): Promise<Class> {
    const classEntity = await this.classesRepository.findOne({ where: { id } });
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    return classEntity;
  }

  // 更新班级
  async update(id: number, updateClassDto: any): Promise<Class> {
    const classEntity = await this.findOne(id);
    Object.assign(classEntity, updateClassDto);
    return this.classesRepository.save(classEntity) as unknown as Class;
  }

  // 删除班级
  async remove(id: number): Promise<void> {
    const result = await this.classesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
  }
}
