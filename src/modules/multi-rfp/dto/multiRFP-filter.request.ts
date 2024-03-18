import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { MultiRFPSortBy } from 'src/infrastructure/data/enums/multi-rfp-sortby.enum';

export class MultiRFPFilterRequest {
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

  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  search_by_name: string;

  @ApiPropertyOptional({
    nullable: true,
    required: false,
    enum: [
      MultiRFPSortBy.PROJECT_NAME,
      MultiRFPSortBy.EXPIRATION_DATE,
      MultiRFPSortBy.REQUEST_FOR_PROPOSAL_STATUS,
      MultiRFPSortBy.CREATED_AT,
    ],
  })
  @IsOptional()
  @IsEnum(MultiRFPSortBy)
  sort_by?: string = MultiRFPSortBy.CREATED_AT;

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

  @ApiProperty({required:false, description: "this id for admin if he want to get a data of specific provider"})
  @IsOptional()
  @IsUUID()
  @IsString()
  user_id?: string;
}
