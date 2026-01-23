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
  update(id: number, updateExamDto: any) {
    return this.examsRepository.update(id, updateExamDto);
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
