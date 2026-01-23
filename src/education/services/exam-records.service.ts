import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamRecord } from '../entities/exam-record.entity';

@Injectable()
export class ExamRecordsService {
  constructor(
    @InjectRepository(ExamRecord, 'education')
    private examRecordsRepository: Repository<ExamRecord>,
  ) { }

  // 创建考试记录
  async create(createExamRecordDto: any) {
    // 解析提交的答案数据，进行阅卷
    const { answerDetail, paperDetail } = createExamRecordDto;

    // 按知识点分类统计题目
    const knowledgePointStats: Record<number, { total: number; right: number }> = {};
    let totalQuestions = 0;
    let correctQuestions = 0;

    // 遍历所有题目，统计知识点
    if (answerDetail && Array.isArray(answerDetail)) {
      answerDetail.forEach(question => {
        const knowledgePointId = question.knowledgePointId;

        // 初始化知识点统计
        if (!knowledgePointStats[knowledgePointId]) {
          knowledgePointStats[knowledgePointId] = { total: 0, right: 0 };
        }

        // 统计题目总数
        knowledgePointStats[knowledgePointId].total++;
        totalQuestions++;

        // 判断答案是否正确
        // 多选题少选多选都算错误
        const isCorrect = this.checkAnswerCorrect(question);
        if (isCorrect) {
          knowledgePointStats[knowledgePointId].right++;
          correctQuestions++;
        }
      });
    }

    // 计算总分：题目正确率*100，保留一位小数
    const accuracy = totalQuestions > 0 ? correctQuestions / totalQuestions : 0;
    const score = parseFloat((accuracy * 100).toFixed(1));

    // 转换知识点统计为数组格式
    const knowledgePointDetails = Object.keys(knowledgePointStats).map(key => ({
      knowledgePointId: parseInt(key),
      total: knowledgePointStats[parseInt(key)].total,
      right: knowledgePointStats[parseInt(key)].right,
    }));

    // 构建完整的考试记录
    const examRecordData = {
      ...createExamRecordDto,
      score,
      examTime: new Date(),
      status: 1, // 已交卷
      knowledgePointDetails,
    };

    return this.examRecordsRepository.save(examRecordData) as unknown as any;
  }

  // 检查答案是否正确
  private checkAnswerCorrect(question: any): boolean {
    if (!question.a || !Array.isArray(question.a)) {
      return false;
    }

    // 遍历题目中所有选项，检查每个选项的isAnswer字段是否等于stuAnswer字段
    for (const option of question.a) {
      // 确保选项包含isAnswer和stuAnswer字段
      if (option.isAnswer !== option.stuAnswer) {
        // 如果有任何一个选项的isAnswer字段不等于stuAnswer字段，题目判为错误
        return false;
      }
    }

    // 所有选项的isAnswer字段都等于stuAnswer字段，题目判为正确
    return true;
  }

  // 获取所有考试记录
  findAll() {
    return this.examRecordsRepository.find();
  }

  // 根据ID获取考试记录
  findOne(id: number) {
    return this.examRecordsRepository.findOneBy({ id });
  }

  // 根据学生ID获取考试记录
  findByStudent(studentId: number) {
    return this.examRecordsRepository.find({ where: { studentId } });
  }

  // 更新考试记录
  update(id: number, updateExamRecordDto: any) {
    return this.examRecordsRepository.update(id, updateExamRecordDto);
  }

  // 删除考试记录
  remove(id: number) {
    return this.examRecordsRepository.delete(id);
  }
}