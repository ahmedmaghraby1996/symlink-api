import { Body, ClassSerializerInterceptor, Controller, Get, Inject, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';


import { UserService } from './user.service';
import { UpdateProfileRequest } from './dto/requests/update-profile.request';
import { User } from 'src/infrastructure/entities/user/user.entity';
import { ApiBearerAuth, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadValidator } from 'src/core/validators/upload.validator';
import { ProfileResponse, UserInfoResponse } from './dto/response/profile.response';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { plainToInstance } from 'class-transformer';
import { toUrl } from 'src/core/helpers/file.helper';
import { I18nResponse } from 'src/core/helpers/i18n.helper';
import { OptionalUseridRequest } from './dto/requests/optional-userid-request';



@ApiBearerAuth()
@ApiHeader({
  name: 'Accept-Language',
  required: false,
  description: 'Language header: en, ar',
})
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class UserController {

  constructor(private readonly userService: UserService,
    @Inject(I18nResponse) private readonly _i18nResponse: I18nResponse,
    @Inject(REQUEST) readonly request: Request,) { }


  @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')


  @Put('/profile')
  async updateProfile(
    @Body() req: UpdateProfileRequest,
    @UploadedFile(new UploadValidator().build()) file: Express.Multer.File,
  ) {
    const user = this.request.user;
    req.file = file;
    if (req.file) await this.userService.updateImage(req);
    user.email = req.email;
    user.name = req.name;
    user.phone = req.phone;
    user.linkedin = req.linkedin;
    user.city_id = req.city_id;

    const result = await this.userService.update(user);
    return new ActionResponse(this._i18nResponse.entity(new UserInfoResponse(result)));
  }

  @Get('/profile')
  async getProfile(
    @Query() query: OptionalUseridRequest,
  ) {
    const profile = await this.userService.getProfile(query.user_id);
    profile.avatar = toUrl(profile.avatar)
    return new ActionResponse(this._i18nResponse.entity(new ProfileResponse(profile)))
  }

}





