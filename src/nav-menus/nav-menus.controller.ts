import { Controller, Get, Post, Put, Delete, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { NavMenusService } from './nav-menus.service';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@ApiTags('nav-menus')
@Controller('api/nav-menus')
export class NavMenusController {
  constructor(private readonly navMenusService: NavMenusService) { }

  @ApiOperation({ summary: 'Get all navigation menus' })
  @Get()
  async getAllNavMenus(@Res() res) {
    const navMenus = await this.navMenusService.findAll();
    return res.status(HttpStatus.OK).json({
      message: 'Navigation menus retrieved successfully',
      navMenus,
    });
  }

  @ApiOperation({ summary: 'Get active navigation menus' })
  @Get('/active')
  async getActiveNavMenus(@Res() res) {
    const navMenus = await this.navMenusService.findActive();
    return res.status(HttpStatus.OK).json({
      message: 'Active navigation menus retrieved successfully',
      navMenus,
    });
  }

  @ApiOperation({ summary: 'Get navigation menu by ID' })
  @ApiOkResponse({ description: 'Navigation menu retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Navigation menu not found' })
  @Get(':id')
  async getNavMenuById(@Param('id') id: number, @Res() res) {
    const navMenu = await this.navMenusService.findById(id);
    if (navMenu) {
      return res.status(HttpStatus.OK).json({
        message: 'Navigation menu retrieved successfully',
        navMenu,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Navigation menu not found',
      });
    }
  }

  @ApiOperation({ summary: 'Create navigation menu' })
  @ApiBody({
    description: 'Navigation menu data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        key: { type: 'string' },
        route: { type: 'string' },
        url: { type: 'string' },
        isActive: { type: 'boolean', default: true },
        order: { type: 'number', default: 0 },
      },
      required: ['name', 'key'],
    },
  })
  @Post()
  async createNavMenu(@Body() body, @Res() res) {
    const navMenu = await this.navMenusService.create(body);
    return res.status(HttpStatus.CREATED).json({
      message: 'Navigation menu created successfully',
      navMenu,
    });
  }

  @ApiOperation({ summary: 'Update navigation menu' })
  @ApiBody({
    description: 'Navigation menu data to update',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        key: { type: 'string' },
        route: { type: 'string' },
        url: { type: 'string' },
        isActive: { type: 'boolean' },
        order: { type: 'number' },
      },
      required: [],
    },
  })
  @Put(':id')
  async updateNavMenu(@Param('id') id: number, @Body() body, @Res() res) {
    const navMenu = await this.navMenusService.update(id, body);
    if (navMenu) {
      return res.status(HttpStatus.OK).json({
        message: 'Navigation menu updated successfully',
        navMenu,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Navigation menu not found',
      });
    }
  }

  @ApiOperation({ summary: 'Batch update navigation menus' })
  @ApiBody({
    description: 'Batch update navigation menus data',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          isActive: { type: 'boolean' },
        },
        required: ['id', 'isActive'],
      },
    },
  })
  @Put('/batch')
  async batchUpdateNavMenus(@Body() body, @Res() res) {
    const success = await this.navMenusService.updateAll(body);
    if (success) {
      return res.status(HttpStatus.OK).json({
        message: 'Navigation menus updated successfully',
      });
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to update navigation menus',
      });
    }
  }

  @ApiOperation({ summary: 'Delete navigation menu' })
  @ApiOkResponse({ description: 'Navigation menu deleted successfully' })
  @ApiNotFoundResponse({ description: 'Navigation menu not found' })
  @Delete(':id')
  async deleteNavMenu(@Param('id') id: number, @Res() res) {
    const success = await this.navMenusService.delete(id);
    if (success) {
      return res.status(HttpStatus.OK).json({
        message: 'Navigation menu deleted successfully',
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Navigation menu not found',
      });
    }
  }
}