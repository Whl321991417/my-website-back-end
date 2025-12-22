import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
  ) { }

  async findAll(): Promise<Image[]> {
    return this.imagesRepository.find();
  }

  async findById(id: number): Promise<Image | null> {
    return this.imagesRepository.findOne({ where: { id } });
  }

  async create(imageData: Partial<Image>): Promise<Image> {
    const image = this.imagesRepository.create(imageData);
    return this.imagesRepository.save(image);
  }

  async update(id: number, imageData: Partial<Image>): Promise<Image | null> {
    const image = await this.findById(id);
    if (!image) {
      return null;
    }

    await this.imagesRepository.update(id, imageData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.imagesRepository.delete(id);
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }
}