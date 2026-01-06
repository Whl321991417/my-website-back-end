import { Controller, Post, Body, Res, HttpStatus, Get, Param, Put, Delete } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('blogs')
@Controller('api/blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) { }

  @ApiOperation({ summary: 'Create a new blog' })
  @ApiBody({
    description: 'Blog data',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        content: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        cover: { type: 'string' },
        author: { type: 'string' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      required: ['title', 'description', 'content', 'tags'],
    },
  })
  @Post()
  async createBlog(@Body() body: any, @Res() res) {
    const blog = await this.blogsService.create(body);
    return res.status(HttpStatus.CREATED).json({
      message: 'Blog created successfully',
      blog,
    });
  }

  @ApiOperation({ summary: 'Get all blogs' })
  @Get()
  async getAllBlogs(@Res() res) {
    const blogs = await this.blogsService.findAll();
    return res.status(HttpStatus.OK).json({
      message: 'Blogs retrieved successfully',
      blogs,
    });
  }

  @ApiOperation({ summary: 'Get blog by ID' })
  @Get(':id')
  async getBlogById(@Param('id') id: number, @Res() res) {
    const blog = await this.blogsService.findById(id);
    if (blog) {
      return res.status(HttpStatus.OK).json({
        message: 'Blog retrieved successfully',
        blog,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Blog not found',
      });
    }
  }

  @ApiOperation({ summary: 'Get blogs by tags' })
  @ApiBody({
    description: 'Tags and number of blogs to retrieve',
    schema: {
      type: 'object',
      properties: {
        tags: { type: 'array', items: { type: 'string' }, description: 'Array of tags' },
        number: { type: 'number', default: 3, description: 'Number of blogs to retrieve' },
      },
      required: ['tags'],
    },
  })
  @Post('tags')
  async getBlogsByTags(@Body() body: { tags: string[]; number?: number }, @Res() res) {
    const { tags, number = 3 } = body;
    const blogs = await this.blogsService.findByTags(tags, number);
    return res.status(HttpStatus.OK).json({
      message: 'Blogs retrieved successfully',
      blogs,
    });
  }

  @ApiOperation({ summary: 'Update blog' })
  @ApiBody({
    description: 'Blog data to update',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        content: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        cover: { type: 'string' },
        author: { type: 'string' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      required: [],
    },
  })
  @Put(':id')
  async updateBlog(@Param('id') id: number, @Body() body: any, @Res() res) {
    const blog = await this.blogsService.update(id, body);
    if (blog) {
      return res.status(HttpStatus.OK).json({
        message: 'Blog updated successfully',
        blog,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Blog not found',
      });
    }
  }

  @ApiOperation({ summary: 'Delete blog' })
  @Delete(':id')
  async deleteBlog(@Param('id') id: number, @Res() res) {
    const success = await this.blogsService.delete(id);
    if (success) {
      return res.status(HttpStatus.OK).json({
        message: 'Blog deleted successfully',
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Blog not found',
      });
    }
  }
}