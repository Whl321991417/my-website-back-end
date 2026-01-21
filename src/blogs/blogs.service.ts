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

  // 获取所有博客（带分页）
  async findAll(page: number = 1, limit: number = 10): Promise<{ blogs: Blog[]; total: number }> {
    const [blogs, total] = await this.blogRepository.findAndCount({
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { blogs, total };
  }

  // 根据ID获取博客
  async findById(id: number): Promise<Blog | undefined> {
    const blog = await this.blogRepository.findOneBy({ id });
    return blog ?? undefined;
  }

  // 根据标签获取博客
  async findByTags(tags: string[], number: number = 3): Promise<Blog[]> {
    // 搜索数据库中所有包含其中任意一个标签的文章
    const queryBuilder = this.blogRepository.createQueryBuilder('blog');

    // 构建 WHERE 条件，使用 OR 连接多个 LIKE 检查
    // 注意：tags列是simple-array类型，TypeORM会将其存储为逗号分隔的字符串
    if (tags && tags.length > 0) {
      const conditions = tags.map((tag, index) => {
        // 使用LIKE操作符查询包含特定标签的记录
        // 前后加上逗号是为了确保精确匹配，避免部分匹配（如"前端"匹配"前端开发"）
        return `CONCAT(',', blog.tags, ',') LIKE :tag${index}`;
      });

      const whereClause = conditions.join(' OR ');
      queryBuilder.where(whereClause);

      // 设置参数，为每个标签添加前后逗号，并使用不同的参数名
      tags.forEach((tag, index) => {
        queryBuilder.setParameter(`tag${index}`, `%,${tag},%`);
      });
    }

    const blogs = await queryBuilder.getMany();

    // 随机排序
    const shuffledBlogs = [...blogs].sort(() => Math.random() - 0.5);

    // 选中指定数量的文章返回
    return shuffledBlogs.slice(0, number);
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