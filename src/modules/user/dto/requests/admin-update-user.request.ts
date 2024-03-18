import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UpdateProfileRequest } from "./update-profile.request";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, Matches } from "class-validator";
import { Role } from "src/infrastructure/data/enums/role.enum";
import { Transform } from "class-transformer";

export class AdminUpdateUserRequest extends UpdateProfileRequest {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[a-zA-Z\d!@#$%^&]{8,}$/, {
        message: 'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and be at least 8 characters long.',
    })
    password?: string;

    @ApiPropertyOptional({ default: Role.CLIENT, enum: [Role.CLIENT, Role.PROVIDER] })
    @IsOptional()
    @IsNotEmpty()
    @IsEnum(Role)
    role?: Role;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => {
        return value === true || value === 'true';
    })
    @IsBoolean()
    is_active?: boolean;
}