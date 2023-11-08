import { plainToInstance } from 'class-transformer';
import { toUrl } from 'src/core/helpers/file.helper';

import { User } from 'src/infrastructure/entities/user/user.entity';
import { Double } from 'typeorm';

export class UserInfoResponse {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;

  constructor(partial: Partial<UserInfoResponse>) {
    this.id = partial.id;
    this.name = partial.name;
    this.avatar = partial.avatar;
    this.phone = partial.phone;
    this.email = partial.email;

    if (this.avatar) {
      if (this.avatar.includes('assets')) {
        this.avatar = toUrl(this.avatar, true);
      } else {
        this.avatar = toUrl(this.avatar);
      }
    }
  }
}
