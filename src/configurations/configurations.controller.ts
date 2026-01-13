import { Controller, Get, Post, Put, Delete, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';

@ApiTags('configurations')
@Controller('api/configurations')
export class ConfigurationsController {
  constructor(private readonly configurationsService: ConfigurationsService) { }

  @ApiOperation({ summary: 'Get all configurations' })
  @ApiOkResponse({ description: 'Configurations retrieved successfully' })
  @Get()
  async getAllConfigurations(@Res() res) {
    const configurations = await this.configurationsService.findAll();
    return res.status(HttpStatus.OK).json({
      message: 'Configurations retrieved successfully',
      configurations,
    });
  }

  @ApiOperation({ summary: 'Get configuration by name' })
  @ApiParam({ name: 'name', description: 'Configuration name' })
  @ApiOkResponse({ description: 'Configuration retrieved successfully' })
  @ApiNotFoundResponse({ description: 'Configuration not found' })
  @Get(':name')
  async getConfigurationByName(@Param('name') name: string, @Res() res) {
    const configuration = await this.configurationsService.findByName(name);
    if (configuration) {
      return res.status(HttpStatus.OK).json({
        message: 'Configuration retrieved successfully',
        configuration,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Configuration not found',
      });
    }
  }

  @ApiOperation({ summary: 'Create configuration' })
  @ApiBody({
    description: 'Configuration data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        content: { type: 'object' },
      },
      required: ['name', 'content'],
    },
  })
  @Post()
  async createConfiguration(@Body() body, @Res() res) {
    try {
      const configuration = await this.configurationsService.create(body.name, body.content);
      return res.status(HttpStatus.CREATED).json({
        message: 'Configuration created successfully',
        configuration,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Update configuration' })
  @ApiParam({ name: 'name', description: 'Configuration name' })
  @ApiBody({
    description: 'Configuration content',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'object' },
      },
      required: ['content'],
    },
  })
  @Put(':name')
  async updateConfiguration(@Param('name') name: string, @Body() body, @Res() res) {
    try {
      const configuration = await this.configurationsService.update(name, body.content);
      return res.status(HttpStatus.OK).json({
        message: 'Configuration updated successfully',
        configuration,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Upsert configuration' })
  @ApiBody({
    description: 'Configuration data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        content: { type: 'object' },
      },
      required: ['name', 'content'],
    },
  })
  @Post('upsert')
  async upsertConfiguration(@Body() body, @Res() res) {
    try {
      const configuration = await this.configurationsService.upsert(body.name, body.content);
      return res.status(HttpStatus.OK).json({
        message: 'Configuration upserted successfully',
        configuration,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Delete configuration' })
  @ApiParam({ name: 'name', description: 'Configuration name' })
  @ApiOkResponse({ description: 'Configuration deleted successfully' })
  @ApiNotFoundResponse({ description: 'Configuration not found' })
  @Delete(':name')
  async deleteConfiguration(@Param('name') name: string, @Res() res) {
    const success = await this.configurationsService.delete(name);
    if (success) {
      return res.status(HttpStatus.OK).json({
        message: 'Configuration deleted successfully',
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Configuration not found',
      });
    }
  }
}