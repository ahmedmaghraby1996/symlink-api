import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/infrastructure/entities/user/user.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/core/base/service/service.base';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { FileService } from '../file/file.service';
import { UploadFileRequest } from '../file/dto/requests/upload-file.request';
import { AdminUpdateUserRequest } from './dto/requests/admin-update-user.request';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UpdateProfileRequest } from './dto/requests/update-profile.request';

@Injectable({ scope: Scope.REQUEST })
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject(REQUEST) private readonly request: Request,
    @Inject(FileService) private _fileService: FileService,
    @Inject(ConfigService) private readonly _config: ConfigService,
  ) {
    super(userRepo);


  }
  async getProfile(user_id?: string) {
    //retrieve user by find with reviews as relation
    const user = await this._repo.findOne({
      where: { id: user_id ?? this.request.user.id }, relations: { city: { country: true } }

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
      } catch (e) { }
    return user;
  }

  async updateUser(req: UpdateProfileRequest) {
    const user = this.request.user;
    if (req.file) await this.updateImage(req);
    if (req.email) {
      const exsitUser = await this.findOne({ email: req.email });
      if (exsitUser && exsitUser.id !== user.id) throw new BadRequestException('Email already exists');
      user.username = req.email;
    }
    Object.assign(user, req);
    return await this.update(user);
  }

  async adminUpdateUser(user_id: string, req: AdminUpdateUserRequest) {
    const user = await this.findOne(user_id);
    if (!user) throw new NotFoundException('User not found');

    if (req.role) user.roles = [req.role];
    if (req.is_active) user.is_active = req.is_active;
    if (req.password) {
      user.password = await bcrypt.hash(req.password + this._config.get('app.key'), 10);
    }
    if (req.email) {
      const exsitUser = await this.findOne({ email: req.email });
      if (exsitUser && exsitUser.id !== user.id) throw new BadRequestException('Email already exists');
      user.email = req.email;
      user.username = req.email;
    }
    user.name = req.name;
    user.phone = req.phone;
    user.linkedin = req.linkedin;
    user.city_id = req.city_id;
    return await user.save();
  }
}


