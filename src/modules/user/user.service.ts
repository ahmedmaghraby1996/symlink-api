import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/infrastructure/entities/user/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/core/base/service/service.base';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { FileService } from '../file/file.service';
import { UploadFileRequest } from '../file/dto/requests/upload-file.request';
@Injectable({ scope: Scope.REQUEST })
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject(REQUEST) private readonly request: Request,
    @Inject(FileService) private _fileService: FileService,
  ) {
    super(userRepo);


  }
  async getProfile() {
    //retrieve user by find with reviews as relation
    const user = await this._repo.findOne({
        where: { id: this.request.user.id },relations:{city:{country:true}}
       
    })
    return user;
}
async updateImage(req: UploadFileRequest) {
  const user = this.request.user;

  if (req.file) {
    const tempImage = await this._fileService.upload(req, 'avatars');
    if (tempImage) {
      if (user.avatar) await this._fileService.delete(user.avatar);
      user.avatar = tempImage;
      await super.update(user);
    }
  } else
    try {
      await this._fileService.delete(user.avatar);
      user.avatar = null;
      await super.update(user);
    } catch (e) {}
  return user;
}




}


