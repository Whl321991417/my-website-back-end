import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
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

  // 根据学科ID获取试卷
  @Get('by-subjects')
  async findBySubjects(@Query('subjectIds') subjectIds: string) {
    // 将字符串转换为数字数组
    const ids = subjectIds ? subjectIds.split(',').map(id => parseInt(id, 10)) : [];
    const data = await this.examsService.findBySubjects(ids);
    return ResponseUtil.success(data, 'Exams fetched successfully by subjects');
  }

  // 根据ID获取试卷
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // 参数验证，确保id是有效的数字
    const examId = parseInt(id, 10);
    if (isNaN(examId)) {
      return ResponseUtil.error(400, 'Invalid exam ID');
    }
    const data = await this.examsService.findOne(examId);
    return ResponseUtil.success(data, 'Exam fetched successfully');
  }

  // 更新试卷
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateExamDto: any) {
    // 参数验证，确保id是有效的数字
    const examId = parseInt(id, 10);
    if (isNaN(examId)) {
      return ResponseUtil.error(400, 'Invalid exam ID');
    }
    const data = await this.examsService.update(examId, updateExamDto);
    return ResponseUtil.success(data, 'Exam updated successfully');
  }

  // 删除试卷
  @Delete(':id')
  async remove(@Param('id') id: string) {
    // 参数验证，确保id是有效的数字
    const examId = parseInt(id, 10);
    if (isNaN(examId)) {
      return ResponseUtil.error(400, 'Invalid exam ID');
    }
    await this.examsService.remove(examId);
    return ResponseUtil.noContent('Exam deleted successfully');
  }
}
