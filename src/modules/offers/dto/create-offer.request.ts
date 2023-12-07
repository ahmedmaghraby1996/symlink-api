import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsIn, IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';
import { Duration } from 'src/infrastructure/data/enums/duration.enum';

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
  @IsIn([
    Duration.HOUR,
    Duration.DAY,
    Duration.WEEK,
    Duration.MONTH,
    Duration.YEAR,
  ])
  duration: Duration;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  duration_num: number;
  
  @ApiProperty({ nullable: true, required: false, })
  @Transform(({ value }) => {
    return value === 'true';
  })
  @IsOptional()
  @IsBoolean()
  is_anonymous: boolean;
}
