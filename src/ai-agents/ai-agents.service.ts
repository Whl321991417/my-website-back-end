import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiAgent } from './ai-agent.entity';

@Injectable()
export class AiAgentsService {
  constructor(
    @InjectRepository(AiAgent)
    private aiAgentsRepository: Repository<AiAgent>,
  ) { }

  async findAll(onlyActive?: boolean): Promise<AiAgent[]> {
    const where = onlyActive ? { isActive: true } : {};
    return this.aiAgentsRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(id: number): Promise<AiAgent | null> {
    return this.aiAgentsRepository.findOne({ where: { id } });
  }

  async create(aiAgentData: Partial<AiAgent>): Promise<AiAgent> {
    const aiAgent = this.aiAgentsRepository.create(aiAgentData);
    return this.aiAgentsRepository.save(aiAgent);
  }

  async update(id: number, aiAgentData: Partial<AiAgent>): Promise<AiAgent | null> {
    const aiAgent = await this.findById(id);
    if (!aiAgent) {
      return null;
    }

    await this.aiAgentsRepository.update(id, aiAgentData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.aiAgentsRepository.delete(id);
    return result.affected !== undefined && result.affected !== null && result.affected > 0;
  }
}