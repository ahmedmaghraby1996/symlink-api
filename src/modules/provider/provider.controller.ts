import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Inject, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { UpdateProvProjectRequest } from './dto/requests/update-provier-project-request';
import { ExpertDetailsQueryRequest } from './dto/requests/expert-details-query-request';
import { UserService } from '../user/user.service';
import { plainToInstance } from 'class-transformer';
import { PublicProfileResponse } from '../user/dto/response/profile.response';
import { I18nResponse } from 'src/core/helpers/i18n.helper';

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
    private readonly providerService: ProviderService,
    private readonly userService: UserService,
    @Inject(I18nResponse) private readonly _i18nResponse: I18nResponse,
  ) { }


  @Get('info')
  async getInfo(@Query() { user_id }: ExpertDetailsQueryRequest) {
    const info = await this.providerService.getEductional(user_id);
    const certifcate = await this.providerService.getCertificates(user_id);
    const projects = await this.providerService.getProjects(user_id);
    const user = await this.userService.getProfile(user_id);
    const userResponse = plainToInstance
    return new ActionResponse({
      info, certifcate, projects, user: this._i18nResponse.entity(new PublicProfileResponse(user))
    })
  }

  @Put("/update-eductional-info")
  @ApiProperty()
  async updateEductionalInfo(@Body() req: ProviderInfoRequest) {
    return new ActionResponse(await this.providerService.updateEductionalInfo(req));

  }

  @Put("/update-project/:project_id")
  async updateProject(@Param("project_id") project_id: string, @Body() req: UpdateProvProjectRequest) {
    return new ActionResponse(await this.providerService.updateProject(project_id, req));

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

  @Delete("project/:id")
  async deleteProviderProject(@Param("id") id: string) {
    return new ActionResponse(await this.providerService.deleteProject(id));

  }
  @Delete("certificate/:id")
  async deleteCertificateProject(@Param("id") id: string) {
    return new ActionResponse(await this.providerService.deleteCertifcate(id));
  }
}
