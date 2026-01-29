import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '../entities/exam.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam, 'education')
    private examsRepository: Repository<Exam>,
  ) { }

  // 创建试卷
  create(createExamDto: any) {
    return this.examsRepository.save(createExamDto) as unknown as any;
  }

  // 获取所有试卷
  findAll() {
    return this.examsRepository.find();
  }

  // 根据ID获取试卷
  findOne(id: number) {
    return this.examsRepository.findOneBy({ id });
  }

  // 更新试卷
  async update(id: number, updateExamDto: any): Promise<Exam> {
    // 先更新试卷
    const updateResult = await this.examsRepository.update(id, updateExamDto);

    // 检查是否更新成功
    if (updateResult.affected === 0) {
      throw new Error(`Exam with ID ${id} not found`);
    }

    // 然后返回更新后的试卷
    const updatedExam = await this.examsRepository.findOneBy({ id });

    // 确保返回的是Exam对象
    if (!updatedExam) {
      throw new Error(`Exam with ID ${id} not found after update`);
    }

    return updatedExam;
  }

  // 删除试卷
  remove(id: number) {
    return this.examsRepository.delete(id);
  }

  // 根据学科ID获取试卷
  findBySubjects(subjectIds: number[]) {
    if (!subjectIds || subjectIds.length === 0) {
      return [];
    }
    return this.examsRepository.createQueryBuilder('exam')
      .where('exam.subjectId IN (:...subjectIds)', { subjectIds })
      .getMany();
  }
}
