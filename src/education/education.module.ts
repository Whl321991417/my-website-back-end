import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { Teacher } from './entities/teacher.entity';
import { Class } from './entities/class.entity';
import { Student } from './entities/student.entity';
import { Exam } from './entities/exam.entity';
import { KnowledgePoint } from './entities/knowledge-point.entity';
import { ExamRecord } from './entities/exam-record.entity';
import { SubjectsController } from './controllers/subjects.controller';
import { TeachersController } from './controllers/teachers.controller';
import { ClassesController } from './controllers/classes.controller';
import { StudentsController } from './controllers/students.controller';
import { ExamsController } from './controllers/exams.controller';
import { KnowledgePointsController } from './controllers/knowledge-points.controller';
import { ExamRecordsController } from './controllers/exam-records.controller';
import { SubjectsService } from './services/subjects.service';
import { TeachersService } from './services/teachers.service';
import { ClassesService } from './services/classes.service';
import { StudentsService } from './services/students.service';
import { ExamsService } from './services/exams.service';
import { KnowledgePointsService } from './services/knowledge-points.service';
import { ExamRecordsService } from './services/exam-records.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subject, Teacher, Class, Student, Exam, KnowledgePoint, ExamRecord], 'education'),
  ],
  controllers: [
    SubjectsController,
    TeachersController,
    ClassesController,
    StudentsController,
    ExamsController,
    KnowledgePointsController,
    ExamRecordsController,
  ],
  providers: [
    SubjectsService,
    TeachersService,
    ClassesService,
    StudentsService,
    ExamsService,
    KnowledgePointsService,
    ExamRecordsService,
  ],
})
export class EducationModule { }
