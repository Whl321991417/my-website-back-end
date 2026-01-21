import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseLibrary } from './case-library.entity';

@Injectable()
export class CaseLibrariesService {
  constructor(
    @InjectRepository(CaseLibrary)
    private caseLibraryRepository: Repository<CaseLibrary>,
  ) {}

  /**
   * 获取所有启用的案例
   */
  async findAllActive(): Promise<CaseLibrary[]> {
    return this.caseLibraryRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 获取所有案例（包括禁用）
   */
  async findAll(): Promise<CaseLibrary[]> {
    return this.caseLibraryRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 根据ID获取案例
   */
  async findById(id: number): Promise<CaseLibrary> {
    const caseLibrary = await this.caseLibraryRepository.findOne({
      where: { id },
    });

    if (!caseLibrary) {
      throw new NotFoundException(`案例不存在，ID: ${id}`);
    }

    return caseLibrary;
  }

  /**
   * 根据caseId获取案例
   */
  async findByCaseId(caseId: string): Promise<CaseLibrary> {
    const caseLibrary = await this.caseLibraryRepository.findOne({
      where: { caseId },
    });

    if (!caseLibrary) {
      throw new NotFoundException(`案例不存在，caseId: ${caseId}`);
    }

    return caseLibrary;
  }

  /**
   * 创建案例
   */
  async create(caseLibraryData: Partial<CaseLibrary>): Promise<CaseLibrary> {
    const caseLibrary = this.caseLibraryRepository.create(caseLibraryData);
    return this.caseLibraryRepository.save(caseLibrary);
  }

  /**
   * 更新案例
   */
  async update(id: number, caseLibraryData: Partial<CaseLibrary>): Promise<CaseLibrary> {
    const caseLibrary = await this.findById(id);
    const updatedCaseLibrary = Object.assign(caseLibrary, caseLibraryData);
    return this.caseLibraryRepository.save(updatedCaseLibrary);
  }

  /**
   * 删除案例
   */
  async delete(id: number): Promise<void> {
    const caseLibrary = await this.findById(id);
    await this.caseLibraryRepository.remove(caseLibrary);
  }
}
