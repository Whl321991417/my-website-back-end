import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) { }

  // 获取所有标签
  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  // 根据ID获取标签
  async findOne(id: number): Promise<Tag | null> {
    return await this.tagRepository.findOne({ where: { id } });
  }

  // 创建标签
  async create(tag: Partial<Tag>): Promise<Tag> {
    return await this.tagRepository.save(tag);
  }

  // 更新标签
  async update(id: number, tag: Partial<Tag>): Promise<Tag> {
    await this.tagRepository.update(id, tag);
    const updatedTag = await this.findOne(id);
    if (!updatedTag) {
      throw new Error(`Tag with id ${id} not found`);
    }
    return updatedTag;
  }

  // 删除标签
  async delete(id: number): Promise<void> {
    await this.tagRepository.delete(id);
  }
}