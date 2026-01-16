import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../entities/teacher.entity';
import { Class } from '../entities/class.entity';
import { Subject } from '../entities/subject.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher, 'education')
    private teachersRepository: Repository<Teacher>,
    @InjectRepository(Class, 'education')
    private classesRepository: Repository<Class>,
    @InjectRepository(Subject, 'education')
    private subjectsRepository: Repository<Subject>,
  ) { }

  // 创建老师
  async create(createTeacherDto: any): Promise<Teacher> {
    // 验证班级是否存在
    const classEntity = await this.classesRepository.findOne({ where: { id: createTeacherDto.classId } });
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${createTeacherDto.classId} not found`);
    }

    // 处理学科关联
    let subjects: Subject[] = [];
    if (createTeacherDto.subjectIds && createTeacherDto.subjectIds.length > 0) {
      subjects = await this.subjectsRepository.findByIds(createTeacherDto.subjectIds);
      if (subjects.length !== createTeacherDto.subjectIds.length) {
        throw new NotFoundException('One or more subjects not found');
      }
    }

    const teacher = this.teachersRepository.create({
      ...createTeacherDto,
      subjects,
    });

    return this.teachersRepository.save(teacher) as unknown as Teacher;
  }

  // 获取所有老师
  async findAll(): Promise<Teacher[]> {
    return this.teachersRepository.find({
      relations: ['class', 'subjects'],
    });
  }

  // 根据ID获取老师
  async findOne(id: number): Promise<Teacher> {
    const teacher = await this.teachersRepository.findOne({
      where: { id },
      relations: ['class', 'subjects'],
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  // 更新老师
  async update(id: number, updateTeacherDto: any): Promise<Teacher> {
    const teacher = await this.findOne(id);

    // 验证班级是否存在
    if (updateTeacherDto.classId && updateTeacherDto.classId !== teacher.classId) {
      const classEntity = await this.classesRepository.findOne({ where: { id: updateTeacherDto.classId } });
      if (!classEntity) {
        throw new NotFoundException(`Class with ID ${updateTeacherDto.classId} not found`);
      }
    }

    // 处理学科关联
    if (updateTeacherDto.subjectIds) {
      let subjects: Subject[] = [];
      if (updateTeacherDto.subjectIds.length > 0) {
        subjects = await this.subjectsRepository.findByIds(updateTeacherDto.subjectIds);
        if (subjects.length !== updateTeacherDto.subjectIds.length) {
          throw new NotFoundException('One or more subjects not found');
        }
      }
      teacher.subjects = subjects;
    }

    Object.assign(teacher, updateTeacherDto);
    return this.teachersRepository.save(teacher) as unknown as Teacher;
  }

  // 删除老师
  async remove(id: number): Promise<void> {
    const result = await this.teachersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
  }
}
