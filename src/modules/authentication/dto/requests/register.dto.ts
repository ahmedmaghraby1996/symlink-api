import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  isStrongPassword,
} from 'class-validator';
import { Unique } from 'src/core/validators/unique-constraints.validator';
import { Role } from 'src/infrastructure/data/enums/role.enum';

export class RegisterRequest {


  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @Unique('User')
  email: string;


  @ApiPropertyOptional()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[a-zA-Z\d!@#$%^&]{8,}$/, {
    message: 'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long.',
  })
  password?: string;

  @ApiProperty({ type: 'file', required: false })
  @IsOptional()
  avatarFile?: Express.Multer.File;

  @ApiProperty({ default: Role.CLIENT, enum: [Role.CLIENT, Role.PROVIDER] })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
