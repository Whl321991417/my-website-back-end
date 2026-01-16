import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StudentsService } from '../services/students.service';
import { ResponseUtil } from '../../utils/response-format';

@Controller('api/education/students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) { }

  // 创建学生
  @Post()
  async create(@Body() createStudentDto: any) {
    const data = await this.studentsService.create(createStudentDto);
    return ResponseUtil.created(data, 'Student created successfully');
  }

  // 获取所有学生
  @Get()
  async findAll() {
    const data = await this.studentsService.findAll();
    return ResponseUtil.success(data, 'Students fetched successfully');
  }

  // 根据ID获取学生
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.studentsService.findOne(+id);
    return ResponseUtil.success(data, 'Student fetched successfully');
  }

  // 更新学生
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStudentDto: any) {
    const data = await this.studentsService.update(+id, updateStudentDto);
    return ResponseUtil.success(data, 'Student updated successfully');
  }

  // 删除学生
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.studentsService.remove(+id);
    return ResponseUtil.noContent('Student deleted successfully');
  }
}
