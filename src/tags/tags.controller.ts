import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tag } from './tag.entity';

@Controller('api/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // 获取所有标签
  @Get()
  async findAll() {
    const tags = await this.tagsService.findAll();
    return { tags };
  }

  // 根据ID获取标签
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const tag = await this.tagsService.findOne(id);
    return { tag };
  }

  // 创建标签
  @Post()
  async create(@Body() tag: Partial<Tag>) {
    const createdTag = await this.tagsService.create(tag);
    return { tag: createdTag };
  }

  // 更新标签
  @Put(':id')
  async update(@Param('id') id: number, @Body() tag: Partial<Tag>) {
    const updatedTag = await this.tagsService.update(id, tag);
    return { tag: updatedTag };
  }

  // 删除标签
  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.tagsService.delete(id);
    return { message: '标签删除成功' };
  }
}