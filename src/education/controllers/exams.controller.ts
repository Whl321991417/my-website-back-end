import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamsService } from '../services/exams.service';
import { ResponseUtil } from '../../utils/response-format';

@Controller('api/education/exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) { }

  // 创建试卷
  @Post()
  async create(@Body() createExamDto: any) {
    const data = await this.examsService.create(createExamDto);
    return ResponseUtil.created(data, 'Exam created successfully');
  }

  // 获取所有试卷
  @Get()
  async findAll() {
    const data = await this.examsService.findAll();
    return ResponseUtil.success(data, 'Exams fetched successfully');
  }

  // 根据ID获取试卷
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.examsService.findOne(+id);
    return ResponseUtil.success(data, 'Exam fetched successfully');
  }

  // 更新试卷
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateExamDto: any) {
    const data = await this.examsService.update(+id, updateExamDto);
    return ResponseUtil.success(data, 'Exam updated successfully');
  }

  // 删除试卷
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.examsService.remove(+id);
    return ResponseUtil.noContent('Exam deleted successfully');
  }
}
