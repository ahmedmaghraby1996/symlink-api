import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
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
  constructor(private readonly attachedFilesService: AttachedFilesService) {}

  @Get(':id')
  async getAllAttachedFiles(@Param('id') id: string) {
    return new ActionResponse(
      await this.attachedFilesService.getAllAttachedFilesForProject(id),
    );
  }
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
}
