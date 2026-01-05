import { Controller, Post, Body, Res, HttpStatus, Get, Param, Put, Delete } from '@nestjs/common';
import { AiAgentsService } from './ai-agents.service';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('ai-agents')
@Controller('api/ai-agents')
export class AiAgentsController {
  constructor(private readonly aiAgentsService: AiAgentsService) { }

  @ApiOperation({ summary: 'Get all AI agents' })
  @Get()
  async getAllAiAgents(@Res() res) {
    const aiAgents = await this.aiAgentsService.findAll();
    return res.status(HttpStatus.OK).json({
      message: 'AI agents retrieved successfully',
      aiAgents,
    });
  }

  @ApiOperation({ summary: 'Get AI agent by ID' })
  @Get(':id')
  async getAiAgentById(@Param('id') id: number, @Res() res) {
    const aiAgent = await this.aiAgentsService.findById(id);
    if (aiAgent) {
      return res.status(HttpStatus.OK).json({
        message: 'AI agent retrieved successfully',
        aiAgent,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'AI agent not found',
      });
    }
  }

  @ApiOperation({ summary: 'Create AI agent' })
  @ApiBody({
    description: 'AI agent data',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        image: { type: 'string' },
        description: { type: 'string' },
        link: { type: 'string' },
        isActive: { type: 'boolean', default: true },
      },
      required: ['name', 'image', 'description', 'link'],
    },
  })
  @Post()
  async createAiAgent(@Body() body: { name: string; image: string; description: string; link: string; isActive?: boolean }, @Res() res) {
    const { name, image, description, link, isActive = true } = body;
    const aiAgent = await this.aiAgentsService.create({ name, image, description, link, isActive });
    return res.status(HttpStatus.CREATED).json({
      message: 'AI agent created successfully',
      aiAgent,
    });
  }

  @ApiOperation({ summary: 'Update AI agent' })
  @ApiBody({
    description: 'AI agent data to update',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        image: { type: 'string' },
        description: { type: 'string' },
        link: { type: 'string' },
        isActive: { type: 'boolean' },
      },
      required: [],
    },
  })
  @Put(':id')
  async updateAiAgent(@Param('id') id: number, @Body() body: Partial<{ name: string; image: string; description: string; link: string; isActive: boolean }>, @Res() res) {
    const aiAgent = await this.aiAgentsService.update(id, body);
    if (aiAgent) {
      return res.status(HttpStatus.OK).json({
        message: 'AI agent updated successfully',
        aiAgent,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'AI agent not found',
      });
    }
  }

  @ApiOperation({ summary: 'Delete AI agent' })
  @Delete(':id')
  async deleteAiAgent(@Param('id') id: number, @Res() res) {
    const success = await this.aiAgentsService.delete(id);
    if (success) {
      return res.status(HttpStatus.OK).json({
        message: 'AI agent deleted successfully',
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'AI agent not found',
      });
    }
  }
}