import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { readFileSync } from 'fs';
import { date, options } from 'joi';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Category } from 'src/infrastructure/entities/category/category.entity';
@Injectable()
export class ProjectsCategorySeeder implements Seeder {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async seed(): Promise<any> {
    const data = fs.readFileSync('./json/projects-category.json', 'utf-8');
    const dataParse = JSON.parse(data);

    const result = dataParse.map((item: Category, i: number) => {
      
        return this.repo.create(item);
      });
      //* save items entities in database
    return this.repo.save(result);
  }

  async drop(): Promise<any> {
    return this.repo.delete({});
  }
}
