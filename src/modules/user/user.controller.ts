import { Body, ClassSerializerInterceptor, Controller, Get, Inject, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';


import { UserService } from './user.service';
import { UpdateProfileRequest } from './dto/requests/update-profile.request';
import { User } from 'src/infrastructure/entities/user/user.entity';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadValidator } from 'src/core/validators/upload.validator';
    import { UserInfoResponse } from './dto/response/profile.response';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { ActionResponse } from 'src/core/base/responses/action.response';
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class UserController {

  constructor(private readonly userService: UserService,
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
    if (req.file ) await this.userService.updateImage(req);
    user.email = req.email;
    user.name = req.name;
   user.linkedin=req.linkedin;
   
    const result = await this.userService.update(user);
    return new UserInfoResponse(result);
  }
  
@Get('/profile')
async getProfile() {
    return await new ActionResponse(await this.userService.getProfile());
}
  
}





