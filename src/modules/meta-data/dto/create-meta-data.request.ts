import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { MetaDataType } from 'src/infrastructure/data/enums/meta-data-type.enum';

export class CreateMetaDataRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name_ar: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name_en: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn([
    MetaDataType.apis_size,
    MetaDataType.type_of_assessment,
    MetaDataType.average_applications,
    MetaDataType.evaluation_is_internal_or_external,
    MetaDataType.color_mobile,
  ])
  type: MetaDataType;
}
