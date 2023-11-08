import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryRequest {

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  name_ar: string;

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  name_en: string;
  
}
