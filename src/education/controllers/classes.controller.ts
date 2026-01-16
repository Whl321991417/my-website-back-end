import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClassesService } from '../services/classes.service';
import { ResponseUtil } from '../../utils/response-format';

@Controller('api/education/classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) { }

  // 创建班级
  @Post()
  async create(@Body() createClassDto: any) {
    const data = await this.classesService.create(createClassDto);
    return ResponseUtil.created(data, 'Class created successfully');
  }

  // 获取所有班级
  @Get()
  async findAll() {
    const data = await this.classesService.findAll();
    return ResponseUtil.success(data, 'Classes fetched successfully');
  }

  // 根据ID获取班级
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.classesService.findOne(+id);
    return ResponseUtil.success(data, 'Class fetched successfully');
  }

  // 更新班级
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateClassDto: any) {
    const data = await this.classesService.update(+id, updateClassDto);
    return ResponseUtil.success(data, 'Class updated successfully');
  }

  // 删除班级
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.classesService.remove(+id);
    return ResponseUtil.noContent('Class deleted successfully');
  }
}
