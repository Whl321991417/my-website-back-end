import { IsString, IsOptional, IsBoolean, IsNumber, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 创建试卷DTO
 */
export class CreateExamDto {
  @ApiProperty({ description: '试卷标题', example: '测试2' })
  @IsString({ message: '标题必须是字符串' })
  title: string;

  @ApiProperty({ description: '试卷类型', example: 'default' })
  @IsString({ message: '类型必须是字符串' })
  type: string;

  @ApiProperty({
    description: '试卷内容',
    example: {
      name: '测试',
      desc: '测试说明',
      questions: [
        {
          type: 'single_choice',
          q: '测试',
          a: [
            {
              a1: '选项1',
              isAnswer: true
            },
            {
              a2: '选项2',
              isAnswer: false
            }
          ],
          analysis: '',
          knowledgePointId: 9
        }
      ]
    }
  })
  @IsObject({ message: '内容必须是对象' })
  content: Record<string, any>;

  @ApiPropertyOptional({ description: '科目ID', example: 3 })
  @IsOptional()
  @IsNumber({}, { message: '科目ID必须是数字' })
  subjectId?: number;

  @ApiPropertyOptional({ description: '是否激活', example: true })
  @IsOptional()
  @IsBoolean({ message: '是否激活必须是布尔值' })
  isActive?: boolean;
}

/**
 * 更新试卷DTO
 */
export class UpdateExamDto {
  @ApiPropertyOptional({ description: '试卷标题', example: '测试2' })
  @IsOptional()
  @IsString({ message: '标题必须是字符串' })
  title?: string;

  @ApiPropertyOptional({ description: '试卷类型', example: 'default' })
  @IsOptional()
  @IsString({ message: '类型必须是字符串' })
  type?: string;

  @ApiPropertyOptional({
    description: '试卷内容',
    example: {
      name: '试卷名称',
      desc: '试卷说明',
      questions: [
        {
          type: 'single_choice',
          q: '问题',
          a: [
            {
              a1: '选项1',
              isAnswer: true
            },
            {
              a2: '选项2',
              isAnswer: false
            }
          ],
          analysis: '',
          knowledgePointId: 9
        }
      ]
    }
  })
  @IsOptional()
  @IsObject({ message: '内容必须是对象' })
  content?: Record<string, any>;

  @ApiPropertyOptional({ description: '科目ID', example: 3 })
  @IsOptional()
  @IsNumber({}, { message: '科目ID必须是数字' })
  subjectId?: number;

  @ApiPropertyOptional({ description: '是否激活', example: true })
  @IsOptional()
  @IsBoolean({ message: '是否激活必须是布尔值' })
  isActive?: boolean;
}
