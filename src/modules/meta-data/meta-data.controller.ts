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
import { MetaDataService } from './meta-data.service';
import { I18nResponse } from 'src/core/helpers/i18n.helper';
import { MetaData } from 'src/infrastructure/entities/meta-data/meta-data.entity';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { UpdateMetaDataRequest } from './dto/update-meta-data.request';
import { CreateMetaDataRequest } from './dto/create-meta-data.request';
import { Role } from 'src/infrastructure/data/enums/role.enum';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { Roles } from '../authentication/guards/roles.decorator';
import { RolesGuard } from '../authentication/guards/roles.guard';
@ApiBearerAuth()
@ApiHeader({
  name: 'Accept-Language',
  required: false,
  description: 'Language header: en, ar',
})
@ApiTags('Meta-data')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('meta-data')
export class MetaDataController {
  constructor(
    private readonly metaDataService: MetaDataService,
    @Inject(I18nResponse) private readonly _i18nResponse: I18nResponse,
  ) {}

  @Get()
  async getAllMetaData() {
    const allMetaData = await this.metaDataService.getAllMetaData();
    const data: MetaData[] = this._i18nResponse.entity(allMetaData);
    return new ActionResponse<MetaData[]>(data);
  }
  @Roles(Role.ADMIN)
  @Post()
  async createNewMetaData(
    @Body() createMetaDataRequest: CreateMetaDataRequest,
  ) {
    const metaData = await this.metaDataService.createNewMetaData(
      createMetaDataRequest,
    );
    const data: MetaData = this._i18nResponse.entity(metaData);
    return new ActionResponse<MetaData>(data);
  }
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateMetaData(
    @Param('id') id: string,
    @Body() updateMetaDataRequest: UpdateMetaDataRequest,
  ) {
    const metaData = await this.metaDataService.updateMetaData(
      updateMetaDataRequest,
      id,
    );
    const data: MetaData = this._i18nResponse.entity(metaData);
    return new ActionResponse<MetaData>(data);
  }
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return await this.metaDataService.deleteMetaData(id);
  }
}
