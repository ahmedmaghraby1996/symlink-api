import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { MultiRfpService } from './multi-rfp.service';
import { CreateMultiRFPRequest } from './dto/create-multi-RFP.request';
import { I18nResponse } from 'src/core/helpers/i18n.helper';
import { MultiRFPResponse } from './dto/multi-rfp.response';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { PaginatedRequest } from 'src/core/base/requests/paginated.request';
import { PaginatedResponse } from 'src/core/base/responses/paginated.response';
@ApiBearerAuth()
@ApiHeader({
  name: 'Accept-Language',
  required: false,
  description: 'Language header: en, ar',
})
@ApiTags('Multi-rfp')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('multi-rfp')
export class MultiRfpController {
  constructor(
    private readonly multiRfpService: MultiRfpService,
    @Inject(I18nResponse) private readonly _i18nResponse: I18nResponse,
  ) {}
  @Post()
  async createMultiRFP(@Body() createMultiRFPRequest: CreateMultiRFPRequest) {
    console.log('createMultiRFPRequest', createMultiRFPRequest);
    return await this.multiRfpService.createMultiRFP(createMultiRFPRequest);
  }

  @Get()
  async getMyAllMultiRFP(@Query() query?: PaginatedRequest) {
    const allMultiRFPForUser = await this.multiRfpService.getMyAllMultiRFP(query);
    const data: MultiRFPResponse[] =
      this._i18nResponse.entity(allMultiRFPForUser);
      if (query.page && query.limit) {
        const total = await this.multiRfpService.count();
        return new PaginatedResponse<MultiRFPResponse[]>(data, {
          meta: { total, ...query },
        });
      } else {
        return new ActionResponse<MultiRFPResponse[]>(data);
      }
  }

  @Get(':id')
  async getSingleMultiRFP(@Param('id') id: string) {
    const multiRFP = await this.multiRfpService.getSingleMultiRFP(id);
    const data: MultiRFPResponse = this._i18nResponse.entity(multiRFP);
    return new ActionResponse<MultiRFPResponse>(data);
  }
}
