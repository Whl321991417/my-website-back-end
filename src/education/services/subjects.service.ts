import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../entities/subject.entity';
import { KnowledgePointsService } from './knowledge-points.service';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject, 'education')
    private subjectsRepository: Repository<Subject>,
    private knowledgePointsService: KnowledgePointsService,
  ) { }

  // 创建学科
  async create(createSubjectDto: any): Promise<Subject> {
    const subject = this.subjectsRepository.create(createSubjectDto);
    return this.subjectsRepository.save(subject) as unknown as Subject;
  }

  // 获取所有学科
  async findAll(): Promise<Subject[]> {
    return this.subjectsRepository.find();
  }

  // 根据ID获取学科
  async findOne(id: number): Promise<Subject> {
    const subject = await this.subjectsRepository.findOne({ where: { id } });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  // 更新学科
  async update(id: number, updateSubjectDto: any): Promise<Subject> {
    const subject = await this.findOne(id);
    Object.assign(subject, updateSubjectDto);
    return this.subjectsRepository.save(subject) as unknown as Subject;
  }

  // 删除学科
  async remove(id: number): Promise<void> {
    // 检查学科是否存在
    const subject = await this.findOne(id);

    // 检查是否有关联的知识点
    const knowledgePoints = await this.knowledgePointsService.findBySubjectId(id);
    if (knowledgePoints.length > 0) {
      throw new ConflictException(
        `Cannot delete subject "${subject.name}" because it has ${knowledgePoints.length} associated knowledge points. Please delete all associated knowledge points first.`
      );
    }

    // 删除学科
    const result = await this.subjectsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
  }
}
