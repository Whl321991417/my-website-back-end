import { Controller, Post, Body, Res, HttpStatus, Get, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiUnauthorizedResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    description: '登录凭证',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'admin' },
        password: { type: 'string', example: '123456' },
      },
      required: ['username', 'password'],
    },
  })
  @ApiOkResponse({
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Login successful' },
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid username or password',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Invalid username or password' },
      },
    },
  })
  @Post('login')
  async login(@Body() body: { username: string; password: string }, @Res() res) {
    const { username, password } = body;
    const user = await this.usersService.validateUser(username, password);

    if (user) {
      const token = await this.usersService.generateToken(user);
      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid username or password',
      });
    }
  }

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async getAllUsers(@Res() res) {
    const users = await this.usersService.findAll();
    return res.status(HttpStatus.OK).json({
      message: 'Users retrieved successfully',
      users,
    });
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @Get(':id')
  async getUserById(@Param('id') id: number, @Res() res) {
    const user = await this.usersService.findById(id);
    if (user) {
      return res.status(HttpStatus.OK).json({
        message: 'User retrieved successfully',
        user,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'User not found',
      });
    }
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    description: 'User data',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string', default: 'user' },
      },
      required: ['username', 'password', 'email'],
    },
  })
  @Post()
  async createUser(@Body() body: { username: string; password: string; email: string; role?: string }, @Res() res) {
    const { username, password, email, role = 'user' } = body;
    const user = await this.usersService.create(username, password, email, role);
    return res.status(HttpStatus.CREATED).json({
      message: 'User created successfully',
      user,
    });
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiBody({
    description: 'User data to update',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
      },
      required: [],
    },
  })
  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() body: Partial<{ username: string; password: string; email: string; role: string }>, @Res() res) {
    const user = await this.usersService.update(id, body);
    if (user) {
      return res.status(HttpStatus.OK).json({
        message: 'User updated successfully',
        user,
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'User not found',
      });
    }
  }

  @ApiOperation({ summary: 'Delete user' })
  @Delete(':id')
  async deleteUser(@Param('id') id: number, @Res() res) {
    const success = await this.usersService.delete(id);
    if (success) {
      return res.status(HttpStatus.OK).json({
        message: 'User deleted successfully',
      });
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'User not found',
      });
    }
  }
}
