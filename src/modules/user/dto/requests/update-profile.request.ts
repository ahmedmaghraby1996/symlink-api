//UpdateProfile request
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Unique } from "src/core/validators/unique-constraints.validator";

export class UpdateProfileRequest {
    
  
    @ApiPropertyOptional()
    @IsOptional()  @IsString()
    name: string;
    @ApiPropertyOptional()
    @IsOptional()
  
    @IsEmail()  
    email?:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()  
    linkedin:string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    @IsString()  
    city_id:string



    @ApiProperty({ type: 'file', required: false })
    @IsOptional()
    file: Express.Multer.File;
   
    }