import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExamRecordsService } from '../services/exam-records.service';
import { ResponseUtil } from '../../utils/response-format';

@Controller('api/education/exam-records')
export class ExamRecordsController {
  constructor(private readonly examRecordsService: ExamRecordsService) { }

  // 创建考试记录（提交考试）
  @Post()
  async create(@Body() createExamRecordDto: any) {
    // 验证必填字段
    if (!createExamRecordDto.studentId || !createExamRecordDto.subjectId) {
      return ResponseUtil.error(400, 'Missing required fields: studentId or subjectId');
    }
    const data = await this.examRecordsService.create(createExamRecordDto);
    return ResponseUtil.created(data, 'Exam record created successfully');
  }

  // 获取所有考试记录
  @Get()
  async findAll() {
    const data = await this.examRecordsService.findAll();
    return ResponseUtil.success(data, 'Exam records fetched successfully');
  }

  // 根据ID获取考试记录
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.examRecordsService.findOne(+id);
    return ResponseUtil.success(data, 'Exam record fetched successfully');
  }

  // 根据学生ID获取考试记录
  @Get('student/:studentId')
  async findByStudent(@Param('studentId') studentId: string) {
    const data = await this.examRecordsService.findByStudent(+studentId);
    return ResponseUtil.success(data, 'Student exam records fetched successfully');
  }

  // 更新考试记录
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateExamRecordDto: any) {
    const data = await this.examRecordsService.update(+id, updateExamRecordDto);
    return ResponseUtil.success(data, 'Exam record updated successfully');
  }

  // 删除考试记录
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.examRecordsService.remove(+id);
    return ResponseUtil.noContent('Exam record deleted successfully');
  }
}