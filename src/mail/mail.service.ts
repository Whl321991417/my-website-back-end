import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // 创建邮件传输器
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.163.com',
      port: parseInt(process.env.MAIL_PORT || '465'),
      secure: true, // 启用SSL
      auth: {
        user: process.env.MAIL_USER || '',
        pass: process.env.MAIL_PASS || ''
      }
    });
  }

  /**
   * 发送邮件
   * @param businessType 业务类型: study_material(学习资料), project_cooperation(项目合作), technical_communication(技术交流)
   * @param content 邮件内容
   * @returns 发送结果
   */
  async sendMail(businessType: string, content: string): Promise<{ success: boolean; message: string }> {
    try {
      // 业务类型映射
      const businessTypeMap = {
        study_material: '学习资料获取',
        project_cooperation: '项目合作',
        technical_communication: '技术交流',
      };

      // 获取业务类型中文名称
      const businessTypeName = businessTypeMap[businessType] || "其他";

      // 邮件选项
      const mailOptions = {
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_USER, // 默认使用配置中的邮箱
        subject: `【${businessTypeName}】-来自您的网站`,
        html: content
      };

      // 发送邮件
      const info = await this.transporter.sendMail(mailOptions);
      console.log('邮件发送成功：%s', info.messageId);
      return { success: true, message: '邮件发送成功' };
    } catch (error) {
      console.error('邮件发送失败：', error);
      return { success: false, message: '邮件发送失败' };
    }
  }
}
