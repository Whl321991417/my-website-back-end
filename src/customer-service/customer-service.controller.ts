import { Controller, Get, Put, Body, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerServiceService } from './customer-service.service';

@ApiTags('customer-service')
@Controller('api/customer-service')
export class CustomerServiceController {
  constructor(private readonly customerServiceService: CustomerServiceService) {}

  @ApiOperation({ summary: 'Get customer service details' })
  @ApiOkResponse({ description: 'Customer service details retrieved successfully' })
  @Get()
  async getCustomerService(@Res() res) {
    try {
      const customerService = await this.customerServiceService.findOne();
      
      if (!customerService) {
        // 如果没有客服信息，返回默认值
        return res.status(HttpStatus.OK).json({
          message: 'Customer service details retrieved successfully',
          customerService: {
            accessPath: '',
            authKey: '',
            appId: '',
            avatarUrl: '',
            name: ''
          },
        });
      }

      return res.status(HttpStatus.OK).json({
        message: 'Customer service details retrieved successfully',
        customerService,
      });
    } catch (error) {
      console.error('Error retrieving customer service details:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to retrieve customer service details',
        error: error.message,
      });
    }
  }

  @ApiOperation({ summary: 'Update customer service details' })
  @ApiBody({
    description: 'Customer service data to update',
    schema: {
      type: 'object',
      properties: {
        accessPath: { type: 'string', description: '访问路径' },
        authKey: { type: 'string', description: '授权密钥' },
        appId: { type: 'string', description: '应用标识' },
        avatarUrl: { type: 'string', description: '头像链接' },
        name: { type: 'string', description: '客服名称' },
      },
      required: ['accessPath', 'authKey', 'appId', 'avatarUrl', 'name'],
    },
  })
  @ApiOkResponse({ description: 'Customer service details updated successfully' })
  @Put()
  async updateCustomerService(@Body() body, @Res() res) {
    try {
      // 数据验证
      if (!body.accessPath) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Access path is required',
        });
      }

      if (!body.authKey) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Auth key is required',
        });
      }

      if (!body.appId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'App ID is required',
        });
      }

      if (!body.avatarUrl) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Avatar URL is required',
        });
      }

      if (!body.name) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Name is required',
        });
      }

      if (body.name.length < 2 || body.name.length > 20) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Name must be between 2 and 20 characters',
        });
      }

      // URL格式验证
      const urlRegex = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
      if (!urlRegex.test(body.accessPath)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Access path must be a valid URL',
        });
      }

      if (!urlRegex.test(body.avatarUrl)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Avatar URL must be a valid URL',
        });
      }

      const updatedCustomerService = await this.customerServiceService.update(body);

      return res.status(HttpStatus.OK).json({
        message: 'Customer service details updated successfully',
        customerService: updatedCustomerService,
      });
    } catch (error) {
      console.error('Error updating customer service details:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to update customer service details',
        error: error.message,
      });
    }
  }
}
