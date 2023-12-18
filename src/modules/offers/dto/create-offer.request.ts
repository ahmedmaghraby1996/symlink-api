import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsIn, IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateOfferRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  multi_RFP_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  number_of_hours: number;
  
  @ApiProperty({ nullable: true, required: false, })
  @Transform(({ value }) => {
    return value === 'true';
  })
  @IsOptional()
  @IsBoolean()
  is_anonymous: boolean;
}
