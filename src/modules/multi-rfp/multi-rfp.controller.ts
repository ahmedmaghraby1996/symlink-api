import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { MultiRfpService } from './multi-rfp.service';
import { CreateMultiRFPRequest } from './dto/create-multi-RFP.request';
import { I18nResponse } from 'src/core/helpers/i18n.helper';
import { MultiRFPResponse } from './dto/multi-rfp.response';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { PaginatedRequest } from 'src/core/base/requests/paginated.request';
import { PaginatedResponse } from 'src/core/base/responses/paginated.response';
import { MultiRFPFilterRequest } from './dto/multiRFP-filter.request';
import { PageMetaDto } from 'src/core/helpers/pagination/page-meta.dto';
import { PageDto } from 'src/core/helpers/pagination/page.dto';
import { Roles } from '../authentication/guards/roles.decorator';
import { Role } from 'src/infrastructure/data/enums/role.enum';
import { UpdateMultiRFPRequest } from './dto/update-multi-RFP.request';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadValidator } from 'src/core/validators/upload.validator';
import { AttachRequestForProposalRequest } from './dto/attach-request-for-propsal.request';
import { plainToInstance } from 'class-transformer';

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
  ) { }

  @Roles(Role.CLIENT)
  @Post()
  async createMultiRFP(
    @Body() createMultiRFPRequest: CreateMultiRFPRequest,
  ) {
    return await this.multiRfpService.createMultiRFP(createMultiRFPRequest);
  }

  @Roles(Role.CLIENT)
  @Post("/attach-request-for-proposal")
  @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async attachRequestForProposal(
    @Body() attachRequestForProposalRequest: AttachRequestForProposalRequest,
    @UploadedFile(new UploadValidator().build()) file: Express.Multer.File,
  ) {
    attachRequestForProposalRequest.file = file;
    return await this.multiRfpService.attachRequestForProposal(attachRequestForProposalRequest);
  }


  @Roles(Role.CLIENT)
  @Get('client-All-MultiRFP')
  async clientGetMyAllMultiRFP(
    @Query() multiRFPFilterRequest: MultiRFPFilterRequest,
  ) {
    const { limit, page } = multiRFPFilterRequest;

    const { allMultiRFPForUserDto, count } =
      await this.multiRfpService.clientGetMyAllMultiRFP(multiRFPFilterRequest);
    const data: MultiRFPResponse[] = this._i18nResponse.entity(
      allMultiRFPForUserDto,
    );
    const pageMetaDto = new PageMetaDto(page, limit, count);

    return new PageDto(data, pageMetaDto);
  }

  @Roles(Role.PROVIDER, Role.ADMIN)
  @Get('provider-All-MultiRFP')
  async providerGetMyAllMultiRFP(
    @Query() multiRFPFilterRequest: MultiRFPFilterRequest,
  ) {
    const { limit, page } = multiRFPFilterRequest;
    const { allMultiRFPForUserDto, count } =
      await this.multiRfpService.provideGetMyAllMultiRFP(multiRFPFilterRequest);
    const data: MultiRFPResponse[] = this._i18nResponse.entity(
      allMultiRFPForUserDto,
    );
    const pageMetaDto = new PageMetaDto(page, limit, count);

    return new PageDto(data, pageMetaDto);
  }

  @Roles(Role.PROVIDER)
  @Get('provider-all-offers')
  async getProjectsSubmittedOffer(
    @Query() multiRFPFilterRequest: MultiRFPFilterRequest,
  ) {
    const { limit, page } = multiRFPFilterRequest;

    const { projects, count } = await this.multiRfpService.providerGetOffers(
      multiRFPFilterRequest,
    );
    const pageMetaDto = new PageMetaDto(page, limit, count);

    return new PageDto(projects, pageMetaDto);
  }

  @Get(':id')
  async getSingleMultiRFP(@Param('id') id: string) {
    const multiRFP = await this.multiRfpService.getSingleMultiRFP(id);
    const data: MultiRFPResponse = this._i18nResponse.entity(multiRFP);
    return new ActionResponse<MultiRFPResponse>(data);
  }

  @Roles(Role.CLIENT)
  @Put(':id')
  async updateMultiRFP(
    @Param('id') id: string,
    @Body() createMultiRFPRequest: UpdateMultiRFPRequest,
  ) {
    return await this.multiRfpService.updateMultiRFP(
      id,
      createMultiRFPRequest,
    );
  }

  @Roles(Role.CLIENT)
  @Delete(':id')
  async deleteMultiRFP(@Param('id') id: string) {
    const deleted = await this.multiRfpService.deleteMultiRFP(id);
    return new ActionResponse(deleted);
  }
}
