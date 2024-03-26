import { Expose, plainToInstance } from 'class-transformer';
import { toUrl } from 'src/core/helpers/file.helper';

import { User } from 'src/infrastructure/entities/user/user.entity';
import { City } from 'src/infrastructure/entities/country/city.entity';
import { Role } from 'src/infrastructure/data/enums/role.enum';

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

// this is the response for the public profile if someone wants to see the profile of a user
export class PublicProfileResponse extends UserInfoResponse {
  city: City;
  linkedin: string;
  roles: Role[];
  constructor(partial: Partial<PublicProfileResponse>) {
    super(partial);
    this.city = plainToInstance(City, partial.city);
    this.linkedin = partial.linkedin;
  }
}

// this is the response for the private profile if the user||admin wants to see his own profile
export class PrivateProfileResponse extends PublicProfileResponse {
  balance: number;
  constructor(partial: Partial<PrivateProfileResponse>) {
    super(partial);
    this.balance = partial.balance;
  }
}

export class PublicProfileExpose extends UserInfoExpose {
  @Expose() city: City;
  @Expose() linkedin: string;
  @Expose() roles: Role[];
}

export class PrivateProfileExpose extends PublicProfileExpose {
  @Expose() balance: number;
  @Expose() completed_projects: number;
  @Expose() active_projects: number;
  @Expose() is_active: boolean;
}