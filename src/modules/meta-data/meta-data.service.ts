import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaData } from 'src/infrastructure/entities/meta-data/meta-data.entity';
import { Repository } from 'typeorm';
import { UpdateMetaDataRequest } from './dto/update-meta-data.request';
import { CreateMetaDataRequest } from './dto/create-meta-data.request';
import { FilterMetaDataRequest } from './dto/filter-create-meta-data.request';

@Injectable()
export class MetaDataService {
  constructor(
    @InjectRepository(MetaData)
    private metaDataRepository: Repository<MetaData>,
  ) {}

  async getAllMetaData(
    filterMetaDataRequest: FilterMetaDataRequest,
  ): Promise<MetaData[]> {
    const { status } = filterMetaDataRequest;
    return await this.metaDataRepository.find({
      where: {
        type: status,
      },
    });
  }
  private async getSingleMetaData(id: string): Promise<MetaData> {
    const category = await this.metaDataRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('MetaData not found');
    }
    return category;
  }
  async createNewMetaData(
    createMetaDataRequest: CreateMetaDataRequest,
  ): Promise<MetaData> {
    const newCategory = this.metaDataRepository.create(createMetaDataRequest);
    return await this.metaDataRepository.save(newCategory);
  }

  async updateMetaData(
    updateMetaDataRequest: UpdateMetaDataRequest,
    id: string,
  ): Promise<MetaData> {
    await this.getSingleMetaData(id);
    await this.metaDataRepository.update({ id }, updateMetaDataRequest);
    return await this.getSingleMetaData(id);
  }

  async deleteMetaData(id: string): Promise<string> {
    await this.getSingleMetaData(id);
    await this.metaDataRepository.delete({ id });
    return 'MetaData deleted successfully';
  }
}
