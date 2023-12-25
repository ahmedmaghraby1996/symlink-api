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
  @IsOptional()
  @IsString()
  firstFullName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstEmail: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstMobile: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  secondFullName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  secondEmail: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  secondMobile: string;
  
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  preferred_testing_time: string[];

  @ApiProperty({ type: [CreateRequestForProposalRequest] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequestForProposalRequest)
  readonly projects: CreateRequestForProposalRequest[];
  requestForProposalList: CreateRequestForProposalRequest[];
}
