import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/infrastructure/entities/category/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryRequest } from './dto/create-category.request';
import { UpdateCategoryRequest } from './dto/update-category.request';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getAllCategory(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }
  private async getSingleCategory(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
  async createNewCategory(
    createNewCategory: CreateCategoryRequest,
  ): Promise<Category> {
    const newCategory = this.categoryRepository.create(createNewCategory);
    return await this.categoryRepository.save(newCategory);
  }

  async updateCategory(
    updateCategoryRequest: UpdateCategoryRequest,
    id: string,
  ): Promise<Category> {
    await this.getSingleCategory(id);
    await this.categoryRepository.update({ id }, updateCategoryRequest);
    return await this.getSingleCategory(id);
  }

  async deleteCategory(id: string): Promise<string> {
    await this.getSingleCategory(id);
    await this.categoryRepository.delete({ id });
    return 'Category deleted successfully';
  }
  
}
