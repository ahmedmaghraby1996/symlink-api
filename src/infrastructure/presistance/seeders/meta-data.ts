import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { date, options } from 'joi';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Category } from 'src/infrastructure/entities/category/category.entity';
import { MetaData } from 'src/infrastructure/entities/meta-data/meta-data.entity';
@Injectable()
export class MetaDataSeeder implements Seeder {
  constructor(
    @InjectRepository(MetaData)
    private readonly repo: Repository<MetaData>,
  ) {}

  async seed(): Promise<any> {
    const data = fs.readFileSync('./json/meta-data.json', 'utf-8');
    const dataParse = JSON.parse(data);

    const result = dataParse.map((item: MetaData, i: number) => {
      
        return this.repo.create(item);
      });
      //* save items entities in database
    return this.repo.save(result);
  }

  async drop(): Promise<any> {
    return this.repo.delete({});
  }
}
