import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TeachersService } from '../services/teachers.service';
import { ResponseUtil } from '../../utils/response-format';

@Controller('api/education/teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) { }

  // 创建老师
  @Post()
  async create(@Body() createTeacherDto: any) {
    const data = await this.teachersService.create(createTeacherDto);
    return ResponseUtil.created(data, 'Teacher created successfully');
  }

  // 获取所有老师
  @Get()
  async findAll() {
    const data = await this.teachersService.findAll();
    return ResponseUtil.success(data, 'Teachers fetched successfully');
  }

  // 根据ID获取老师
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.teachersService.findOne(+id);
    return ResponseUtil.success(data, 'Teacher fetched successfully');
  }

  // 更新老师
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTeacherDto: any) {
    const data = await this.teachersService.update(+id, updateTeacherDto);
    return ResponseUtil.success(data, 'Teacher updated successfully');
  }

  // 删除老师
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.teachersService.remove(+id);
    return ResponseUtil.noContent('Teacher deleted successfully');
  }
}
