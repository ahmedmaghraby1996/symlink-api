import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateRequestForProposalRequest } from 'src/modules/request-for-proposal/dto/create-request-for-proposal.request';

export class CreateMultiRFPRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  project_name: string;

  @ApiProperty({ default: new Date().toISOString().split('T')[0] }) //extract only the date
  @IsNotEmpty()
  expiration_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstFullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstMobile: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  secondFullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  secondEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  secondMobile: string;
  
  @ApiProperty({ nullable: true, required: false })
  @IsOptional()
  @IsString()
  time_type_id: string;

  @ApiProperty({ type: [CreateRequestForProposalRequest] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequestForProposalRequest)
  readonly projects: CreateRequestForProposalRequest[];
  requestForProposalList: CreateRequestForProposalRequest[];
}
