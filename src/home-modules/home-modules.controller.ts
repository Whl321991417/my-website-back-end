import { Controller, Get, Post, Body, Put, Delete, Param, Res, HttpStatus } from '@nestjs/common';
import { HomeModulesService } from './home-modules.service';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@ApiTags('home-modules')
@Controller('api/home-modules')
export class HomeModulesController {
  constructor(private readonly homeModulesService: HomeModulesService) {}

  @ApiOperation({ summary: 'Get all home modules' })
  @Get()
  async getAllHomeModules(@Res() res) {
    const modules = await this.homeModulesService.findAll();
    return res.status(HttpStatus.OK).json({
      message: 'Home modules retrieved successfully',
      modules,
    });
  }

  @ApiOperation({ summary: 'Get home module by ID' })
  @ApiOkResponse({ description: 'Home module retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Home module not found' })
  @Get(':id')
  async getHomeModuleById(@Param('id') id: number, @Res() res) {
    const homeModule = await this.homeModulesService.findById(id);
    if (homeModule) {
      return res.status(HttpStatus.OK).json({
        message: 'Home module retrieved successfully',
        module: homeModule,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Home module not found',
      });
    }
  }

  @ApiOperation({ summary: 'Create home module' })
  @ApiBody({
    description: 'Home module data',
    schema: {
      type: 'object',
      properties: {
        icon: { type: 'string' },
        name: { type: 'string' },
        detail: { type: 'string' },
        actionName: { type: 'string' },
        route: { type: 'string', nullable: true },
        jumpUrl: { type: 'string', nullable: true },
        image: { type: 'string' },
        modulePosition: { type: 'string' },
        coreHighlights: { type: 'array', items: { type: 'string' } },
        scenarioValue: { type: 'string' },
      },
      required: ['icon', 'name', 'detail', 'actionName', 'image', 'modulePosition', 'coreHighlights', 'scenarioValue'],
    },
  })
  @Post()
  async createHomeModule(@Body() body, @Res() res) {
    const homeModule = await this.homeModulesService.create(body);
    return res.status(HttpStatus.CREATED).json({
      message: 'Home module created successfully',
      module: homeModule,
    });
  }

  @ApiOperation({ summary: 'Update home module' })
  @ApiBody({
    description: 'Home module data to update',
    schema: {
      type: 'object',
      properties: {
        icon: { type: 'string' },
        name: { type: 'string' },
        detail: { type: 'string' },
        actionName: { type: 'string' },
        route: { type: 'string', nullable: true },
        jumpUrl: { type: 'string', nullable: true },
        image: { type: 'string' },
        modulePosition: { type: 'string' },
        coreHighlights: { type: 'array', items: { type: 'string' } },
        scenarioValue: { type: 'string' },
      },
      required: [],
    },
  })
  @Put(':id')
  async updateHomeModule(@Param('id') id: number, @Body() body, @Res() res) {
    const homeModule = await this.homeModulesService.update(id, body);
    if (homeModule) {
      return res.status(HttpStatus.OK).json({
        message: 'Home module updated successfully',
        module: homeModule,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Home module not found',
      });
    }
  }

  @ApiOperation({ summary: 'Delete home module' })
  @ApiOkResponse({ description: 'Home module deleted successfully' })
  @ApiNotFoundResponse({ description: 'Home module not found' })
  @Delete(':id')
  async deleteHomeModule(@Param('id') id: number, @Res() res) {
    const success = await this.homeModulesService.delete(id);
    if (success) {
      return res.status(HttpStatus.OK).json({
        message: 'Home module deleted successfully',
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Home module not found',
      });
    }
  }
}