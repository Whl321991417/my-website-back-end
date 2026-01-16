import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubjectsService } from '../services/subjects.service';
import { ResponseUtil } from '../../utils/response-format';

@Controller('api/education/subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) { }

  // 创建学科
  @Post()
  async create(@Body() createSubjectDto: any) {
    const data = await this.subjectsService.create(createSubjectDto);
    return ResponseUtil.created(data, 'Subject created successfully');
  }

  // 获取所有学科
  @Get()
  async findAll() {
    const data = await this.subjectsService.findAll();
    return ResponseUtil.success(data, 'Subjects fetched successfully');
  }

  // 根据ID获取学科
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.subjectsService.findOne(+id);
    return ResponseUtil.success(data, 'Subject fetched successfully');
  }

  // 更新学科
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSubjectDto: any) {
    const data = await this.subjectsService.update(+id, updateSubjectDto);
    return ResponseUtil.success(data, 'Subject updated successfully');
  }

  // 删除学科
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.subjectsService.remove(+id);
    return ResponseUtil.noContent('Subject deleted successfully');
  }
}
