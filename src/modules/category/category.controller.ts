import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { I18nResponse } from 'src/core/helpers/i18n.helper';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { Category } from 'src/infrastructure/entities/category/category.entity';
import { UpdateCategoryRequest } from './dto/update-category.request';
import { CreateCategoryRequest } from './dto/create-category.request';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Roles } from '../authentication/guards/roles.decorator';
import { Role } from 'src/infrastructure/data/enums/role.enum';
@ApiBearerAuth()
@ApiHeader({
  name: 'Accept-Language',
  required: false,
  description: 'Language header: en, ar',
})
@ApiTags('Category')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    @Inject(I18nResponse) private readonly _i18nResponse: I18nResponse,
  ) {}

  @Get()
  async getAllCategory() {
    const allCategory = await this.categoryService.getAllCategory();
    const data: Category[] = this._i18nResponse.entity(allCategory);
    return new ActionResponse<Category[]>(data);
  }
  @Roles(Role.ADMIN)
  @Post()
  async createNewCategory(
    @Body() createCategoryRequest: CreateCategoryRequest,
  ) {
    const category = await this.categoryService.createNewCategory(
      createCategoryRequest,
    );
    const data: Category = this._i18nResponse.entity(category);
    return new ActionResponse<Category>(data);
  }
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryRequest: UpdateCategoryRequest,
  ) {
    const category = await this.categoryService.updateCategory(
      updateCategoryRequest,
      id,
    );
    const data: Category = this._i18nResponse.entity(category);
    return new ActionResponse<Category>(data);
  }
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return await this.categoryService.deleteCategory(id);
  }
}
