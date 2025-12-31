import { Controller, Post, Body, Ip } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { MailService } from './mail.service';

@ApiTags('mail')
@Controller('api/mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  // 存储IP的最后发送时间，用于限流
  private ipSendTimes: Map<string, number> = new Map();

  /**
   * 发送邮件API
   * @param businessType 业务类型: study_material(学习资料), project_cooperation(项目合作), technical_communication(技术交流)
   * @param content 邮件内容
   * @param ip 客户端IP地址
   * @returns 发送结果
   */
  @Post('send')
  @ApiBody({
    description: '发送邮件请求体',
    schema: {
      type: 'object',
      properties: {
        businessType: {
          type: 'string',
          enum: ['study_material', 'project_cooperation', 'technical_communication'],
          description: '业务类型',
          example: 'study_material'
        },
        content: {
          type: 'string',
          description: '邮件内容',
          example: '请求获取学习资料'
        }
      },
      required: ['businessType', 'content']
    }
  })
  @ApiResponse({
    status: 200,
    description: '邮件发送成功',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true
        },
        message: {
          type: 'string',
          example: '邮件发送成功'
        }
      }
    }
  })
  @ApiResponse({
    status: 429,
    description: '发送频率过高',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false
        },
        message: {
          type: 'string',
          example: '发送频率过高，请一分钟后再试'
        }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: '邮件发送失败',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false
        },
        message: {
          type: 'string',
          example: '邮件发送失败'
        }
      }
    }
  })
  async sendMail(@Body() body: {
    businessType: 'study_material' | 'project_cooperation' | 'technical_communication';
    content: string;
  }, @Ip() ip: string) {
    const { businessType, content } = body;

    // 限流逻辑：同一个IP一分钟最多发送一次
    const now = Date.now();
    const lastSendTime = this.ipSendTimes.get(ip) || 0;
    const MINUTE = 60 * 1000;

    if (now - lastSendTime < MINUTE) {
      return {
        success: false,
        message: '发送频率过高，请一分钟后再试'
      };
    }

    // 更新最后发送时间
    this.ipSendTimes.set(ip, now);

    return await this.mailService.sendMail(businessType, content);
  }
}
