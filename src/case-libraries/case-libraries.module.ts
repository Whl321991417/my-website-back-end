import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaseLibrary } from './case-library.entity';
import { CaseLibrariesService } from './case-libraries.service';
import { CaseLibrariesController } from './case-libraries.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CaseLibrary])],
  controllers: [CaseLibrariesController],
  providers: [CaseLibrariesService],
  exports: [CaseLibrariesService],
})
export class CaseLibrariesModule {}
