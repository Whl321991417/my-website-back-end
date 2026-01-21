import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { KnowledgePointsService } from '../services/knowledge-points.service';
import { ResponseUtil } from '../../utils/response-format';

@Controller('api/education/knowledge-points')
export class KnowledgePointsController {
  constructor(private readonly knowledgePointsService: KnowledgePointsService) { }

  // 创建知识点
  @Post()
  async create(@Body() createKnowledgePointDto: any) {
    const data = await this.knowledgePointsService.create(createKnowledgePointDto);
    return ResponseUtil.created(data, 'Knowledge point created successfully');
  }

  // 获取所有知识点
  @Get()
  async findAll(@Query('subjectId') subjectId?: string) {
    let data;
    if (subjectId) {
      data = await this.knowledgePointsService.findBySubjectId(+subjectId);
    } else {
      data = await this.knowledgePointsService.findAll();
    }
    return ResponseUtil.success(data, 'Knowledge points fetched successfully');
  }

  // 根据ID获取知识点
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.knowledgePointsService.findOne(+id);
    return ResponseUtil.success(data, 'Knowledge point fetched successfully');
  }

  // 更新知识点
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateKnowledgePointDto: any) {
    const data = await this.knowledgePointsService.update(+id, updateKnowledgePointDto);
    return ResponseUtil.success(data, 'Knowledge point updated successfully');
  }

  // 删除知识点
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.knowledgePointsService.remove(+id);
    return ResponseUtil.noContent('Knowledge point deleted successfully');
  }
}