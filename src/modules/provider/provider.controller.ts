import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderProjectRequest } from './dto/requests/provider-project-request';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiHeader, ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { UploadValidator } from 'src/core/validators/upload.validator';

import { FileInterceptor } from '@nestjs/platform-express';


import { ProviderInfoRequest } from './dto/requests/provider-info-reqest';
import { UploadFileRequest } from '../file/dto/requests/upload-file.request';

@ApiBearerAuth()
@ApiHeader({
  name: 'Accept-Language',
  required: false,
  description: 'Language header: en, ar',
})
@ApiTags('Provider')
@UseGuards(JwtAuthGuard, RolesGuard)

@Controller('provider')
export class ProviderController {
  constructor(
    private readonly providerService: ProviderService
  ) { }


  @Get('info')
  async getInfo() {
    const info = await this.providerService.getEductional();
    const certifcate = await this.providerService.getCertificates();
    const projects = await this.providerService.getProjects();
    return new ActionResponse({
      info, certifcate, projects
    })

  }

  @Put("/update-eductional-info")

  @ApiProperty()
  async updateEductionalInfo(@Body() req: ProviderInfoRequest) {
    return new ActionResponse(await this.providerService.updateEductionalInfo(req));

  }

  @Post("/add-project")
  async addProivderProject(@Body() req: ProviderProjectRequest) {
    return new ActionResponse(await this.providerService.addProivderProject(req));

  }


  @Post("/add-certificate")
  @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')// Specify the content type for Swagger
  @ApiBody({
    description: 'File upload',
    type: UploadFileRequest, // Use the DTO class representing your file entity
  })
  async addProivderCertifcate(
    @Body() req: UploadFileRequest,
    @UploadedFile(new UploadValidator().build()) file: Express.Multer.File,
  ) {
    req.file = file
    return new ActionResponse(await this.providerService.addProivderCertifcate(req))

  }

  @Delete("/delete-project/:project_id")
  async deleteProject(@Param("project_id") project_id: string) {
    return new ActionResponse(await this.providerService.deleteProject(project_id))
  }
}
