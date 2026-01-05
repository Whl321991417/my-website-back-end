import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './blog.entity';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) { }

  // 创建博客
  async create(blogData: Partial<Blog>): Promise<Blog> {
    const blog = this.blogRepository.create(blogData);
    return this.blogRepository.save(blog);
  }

  // 获取所有博客
  async findAll(): Promise<Blog[]> {
    return this.blogRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // 根据ID获取博客
  async findById(id: number): Promise<Blog | undefined> {
    const blog = await this.blogRepository.findOneBy({ id });
    return blog ?? undefined;
  }

  // 根据标签获取博客
  async findByTags(tags: string[], limit: number = 4): Promise<Blog[]> {
    return this.blogRepository
      .createQueryBuilder('blog')
      .where('blog.tags && :tags', { tags })
      .limit(limit)
      .getMany();
  }

  // 更新博客
  async update(id: number, blogData: Partial<Blog>): Promise<Blog | undefined> {
    await this.blogRepository.update(id, blogData);
    return this.findById(id);
  }

  // 删除博客
  async delete(id: number): Promise<boolean> {
    const result = await this.blogRepository.delete(id);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }
}