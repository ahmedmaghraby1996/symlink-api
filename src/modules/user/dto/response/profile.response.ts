import { Expose, plainToInstance } from 'class-transformer';
import { toUrl } from 'src/core/helpers/file.helper';

import { User } from 'src/infrastructure/entities/user/user.entity';
import { Double } from 'typeorm';
import { City } from 'src/infrastructure/entities/country/city.entity';

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

export class UserInfoExpose {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() avatar: string;
  @Expose() phone: string;
  @Expose() email: string;
}

export class ProfileResponse extends UserInfoResponse {
  city: City;
  linkedin: string;

  constructor(partial: Partial<ProfileResponse>) {
    super(partial);
    this.city = plainToInstance(City, partial.city);
    this.linkedin = partial.linkedin;
  }
}
