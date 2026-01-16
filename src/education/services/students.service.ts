import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { Class } from '../entities/class.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student, 'education')
    private studentsRepository: Repository<Student>,
    @InjectRepository(Class, 'education')
    private classesRepository: Repository<Class>,
  ) { }

  // 创建学生
  async create(createStudentDto: any): Promise<Student> {
    // 验证班级是否存在
    const classEntity = await this.classesRepository.findOne({ where: { id: createStudentDto.classId } });
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${createStudentDto.classId} not found`);
    }

    const student = this.studentsRepository.create(createStudentDto);
    return this.studentsRepository.save(student) as unknown as Student;
  }

  // 获取所有学生
  async findAll(): Promise<Student[]> {
    return this.studentsRepository.find({
      relations: ['class'],
    });
  }

  // 根据ID获取学生
  async findOne(id: number): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { id },
      relations: ['class'],
    });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  // 更新学生
  async update(id: number, updateStudentDto: any): Promise<Student> {
    const student = await this.findOne(id);

    // 验证班级是否存在
    if (updateStudentDto.classId && updateStudentDto.classId !== student.classId) {
      const classEntity = await this.classesRepository.findOne({ where: { id: updateStudentDto.classId } });
      if (!classEntity) {
        throw new NotFoundException(`Class with ID ${updateStudentDto.classId} not found`);
      }
    }

    // 合并成绩数据，如果有提供成绩的话
    if (updateStudentDto.grades) {
      student.grades = {
        ...student.grades,
        ...updateStudentDto.grades,
      };
      // 移除grades字段，避免重复更新
      delete updateStudentDto.grades;
    }

    Object.assign(student, updateStudentDto);
    return this.studentsRepository.save(student) as unknown as Student;
  }

  // 删除学生
  async remove(id: number): Promise<void> {
    const result = await this.studentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
  }
}
