import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    description: 'Login credentials',
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
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            email: { type: 'string' },
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
      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid username or password',
      });
    }
  }
}
