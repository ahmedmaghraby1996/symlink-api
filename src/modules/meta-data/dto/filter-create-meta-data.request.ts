import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsEnum } from "class-validator";
import { MetaDataType } from "src/infrastructure/data/enums/meta-data-type.enum";

export class FilterMetaDataRequest {
    @ApiProperty({
        nullable: true,
        required: false,
        enum: [
            MetaDataType.apis_size,
            MetaDataType.average_applications,
            MetaDataType.color_mobile,
            MetaDataType.evaluation_is_internal_or_external,
            MetaDataType.time,
            MetaDataType.type_of_assessment,
        ],
      })
      @IsOptional()
      @IsEnum(MetaDataType)
      status: MetaDataType;
}