import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KnowledgePoint, DifficultyLevel } from '../entities/knowledge-point.entity';
import { Subject } from '../entities/subject.entity';

@Injectable()
export class KnowledgePointsService {
  constructor(
    @InjectRepository(KnowledgePoint, 'education')
    private readonly knowledgePointRepository: Repository<KnowledgePoint>,
    @InjectRepository(Subject, 'education')
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  // 创建知识点
  async create(createKnowledgePointDto: {
    name: string;
    description?: string;
    difficulty?: DifficultyLevel;
    subjectId: number;
  }): Promise<KnowledgePoint> {
    // 验证学科是否存在
    const subject = await this.subjectRepository.findOneBy({ id: createKnowledgePointDto.subjectId });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${createKnowledgePointDto.subjectId} not found`);
    }

    const knowledgePoint = this.knowledgePointRepository.create({
      ...createKnowledgePointDto,
      subject,
    });

    return this.knowledgePointRepository.save(knowledgePoint);
  }

  // 获取所有知识点
  async findAll(): Promise<KnowledgePoint[]> {
    return this.knowledgePointRepository.find({
      relations: ['subject'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // 根据ID获取知识点
  async findOne(id: number): Promise<KnowledgePoint> {
    const knowledgePoint = await this.knowledgePointRepository.findOne({
      where: { id },
      relations: ['subject'],
    });

    if (!knowledgePoint) {
      throw new NotFoundException(`Knowledge point with ID ${id} not found`);
    }

    return knowledgePoint;
  }

  // 根据学科ID获取知识点
  async findBySubjectId(subjectId: number): Promise<KnowledgePoint[]> {
    return this.knowledgePointRepository.find({
      where: { subjectId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // 更新知识点
  async update(
    id: number,
    updateKnowledgePointDto: {
      name?: string;
      description?: string;
      difficulty?: DifficultyLevel;
      subjectId?: number;
      isActive?: boolean;
    },
  ): Promise<KnowledgePoint> {
    const knowledgePoint = await this.findOne(id);

    // 如果更新学科ID，验证新学科是否存在
    if (updateKnowledgePointDto.subjectId && updateKnowledgePointDto.subjectId !== knowledgePoint.subjectId) {
      const subject = await this.subjectRepository.findOneBy({ id: updateKnowledgePointDto.subjectId });
      if (!subject) {
        throw new NotFoundException(`Subject with ID ${updateKnowledgePointDto.subjectId} not found`);
      }
      knowledgePoint.subject = subject;
      knowledgePoint.subjectId = updateKnowledgePointDto.subjectId;
    }

    // 更新其他字段
    Object.assign(knowledgePoint, updateKnowledgePointDto);

    return this.knowledgePointRepository.save(knowledgePoint);
  }

  // 删除知识点
  async remove(id: number): Promise<void> {
    const result = await this.knowledgePointRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Knowledge point with ID ${id} not found`);
    }
  }
}