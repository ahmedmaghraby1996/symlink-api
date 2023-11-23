import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { AttachedFilesType } from 'src/infrastructure/data/enums/attached-files-type';

export class CreateAttachedFilesRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  multi_RFP_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;


  @ApiProperty({ type: 'file', required: true })
  file: Express.Multer.File;

  @ApiProperty()
  @IsNotEmpty()
  @IsIn([
    AttachedFilesType.IMAGE
  ])
  type: AttachedFilesType;


}
