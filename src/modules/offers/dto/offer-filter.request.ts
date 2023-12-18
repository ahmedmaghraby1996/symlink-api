import { ApiProperty, ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  isArray,
} from 'class-validator';
import { toRightNumber } from 'src/core/helpers/cast.helper';
import { OfferSortyBy } from 'src/infrastructure/data/enums/offer-sortby.enum';

export class OfferFilterRequest {
  @ApiProperty({ required: false, default: 1 })
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  page: number;

  @ApiProperty({ required: false, default: 10 })
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  limit: number;

  @ApiProperty({ nullable: true, required: false, })
  @IsOptional()
  @IsString()
  search_by_name: string;

  @ApiPropertyOptional({
    nullable: true,
    required: false,
    enum: [
      OfferSortyBy.PRICE,
      OfferSortyBy.DURATION,
      OfferSortyBy.IS_ACCEPTED,
      OfferSortyBy.BIDER_NAME,
    ],
  })
  @IsOptional()
  @IsEnum(OfferSortyBy)
  sort_by?: string;

  @ApiPropertyOptional({
    nullable: true,
    required: false,
    enum: [
      'ASC',
      'DESC'
    ],
    default: 'DESC'
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: string = "DESC";
}
