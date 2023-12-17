import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { AttachedFilesService } from './attached-files.service';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAttachedFilesRequest } from './dto/Create-attached-files.request';
import { UploadValidator } from 'src/core/validators/upload.validator';
import { AttachedFilesFilterRequest } from './dto/attached-files-filter.request';
import { PageMetaDto } from 'src/core/helpers/pagination/page-meta.dto';
import { PageDto } from 'src/core/helpers/pagination/page.dto';
import { Roles } from '../authentication/guards/roles.decorator';
import { Role } from 'src/infrastructure/data/enums/role.enum';
import { RfpOwnerGuard } from '../multi-rfp/guards/rfp_owner.guard';
@ApiBearerAuth()
@ApiHeader({
  name: 'Accept-Language',
  required: false,
  description: 'Language header: en, ar',
})
@ApiTags('Attached-files')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attached-files')
export class AttachedFilesController {
  constructor(private readonly attachedFilesService: AttachedFilesService) { }

  @Get(':id')
  async getAllAttachedFiles(@Param('id') id: string, @Query() attachedFilesFilterRequest: AttachedFilesFilterRequest) {
    const { limit, page } = attachedFilesFilterRequest;

    const { attachedFilesDto, count } = await this.attachedFilesService.getAllAttachedFilesForProject(id, attachedFilesFilterRequest)

    const pageMetaDto = new PageMetaDto(page, limit, count);

    return new PageDto(attachedFilesDto, pageMetaDto);
  }
  @Roles(Role.CLIENT)

  @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @Post()
  async addAttachedFileToProject(
    @Body() createAttachedFilesRequest: CreateAttachedFilesRequest,
    @UploadedFile(new UploadValidator().build()) file: Express.Multer.File,
  ) {
    createAttachedFilesRequest.file = file;
    return new ActionResponse(
      await this.attachedFilesService.addAttachedFileToProject(createAttachedFilesRequest),
    );
  }

  @Roles(Role.CLIENT)
  @Delete(':id')
  async deleteAttachedFile(@Param('id') id: string) {
    return new ActionResponse(
      await this.attachedFilesService.deleteAttachedFile(id),
    );
  }
}
