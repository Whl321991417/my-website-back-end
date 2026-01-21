import { Controller, Get, Post, Put, Delete, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { CaseLibrariesService } from './case-libraries.service';
import { CaseLibrary } from './case-library.entity';

@Controller('api/case-libraries')
export class CaseLibrariesController {
  constructor(private readonly caseLibrariesService: CaseLibrariesService) { }

  /**
   * 获取所有启用的案例
   */
  @Get('active')
  async findAllActive(@Res() res) {
    const caseLibraries = await this.caseLibrariesService.findAllActive();
    return res.status(HttpStatus.OK).json({
      message: '获取启用的案例成功',
      caseLibraries,
    });
  }

  /**
   * 获取所有案例（包括禁用）
   */
  @Get()
  async findAll(@Res() res) {
    const caseLibraries = await this.caseLibrariesService.findAll();
    return res.status(HttpStatus.OK).json({
      message: '获取所有案例成功',
      caseLibraries,
    });
  }

  /**
   * 根据ID获取案例
   */
  @Get(':id')
  async findById(@Param('id') id: string, @Res() res) {
    const caseLibrary = await this.caseLibrariesService.findById(Number(id));
    return res.status(HttpStatus.OK).json({
      message: '获取案例成功',
      caseLibrary,
    });
  }

  /**
   * 根据caseId获取案例
   */
  @Get('case-id/:caseId')
  async findByCaseId(@Param('caseId') caseId: string, @Res() res) {
    const caseLibrary = await this.caseLibrariesService.findByCaseId(caseId);
    return res.status(HttpStatus.OK).json({
      message: '获取案例成功',
      caseLibrary,
    });
  }

  /**
   * 创建案例
   */
  @Post()
  async create(@Body() caseLibraryData: Partial<CaseLibrary>, @Res() res) {
    const caseLibrary = await this.caseLibrariesService.create(caseLibraryData);
    return res.status(HttpStatus.CREATED).json({
      message: '创建案例成功',
      caseLibrary,
    });
  }

  /**
   * 更新案例
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() caseLibraryData: Partial<CaseLibrary>, @Res() res) {
    const caseLibrary = await this.caseLibrariesService.update(Number(id), caseLibraryData);
    return res.status(HttpStatus.OK).json({
      message: '更新案例成功',
      caseLibrary,
    });
  }

  /**
   * 删除案例
   */
  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res) {
    await this.caseLibrariesService.delete(Number(id));
    return res.status(HttpStatus.OK).json({
      message: '删除案例成功',
    });
  }
}
