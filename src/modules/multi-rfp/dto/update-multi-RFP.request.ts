import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreateMultiRFPRequest } from './create-multi-RFP.request';
import { CreateRequestForProposalRequest } from 'src/modules/request-for-proposal/dto/create-request-for-proposal.request';
import { UpdateRequestForProposalRequest } from 'src/modules/request-for-proposal/dto/update-request-for-propsal.request';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateMultiRFPRequest extends CreateMultiRFPRequest {
  @IsOptional()
  project_name: string;

  @IsOptional()
  expiration_date: Date;

  @IsOptional()
  firstFullName: string;

  @IsOptional()
  firstEmail: string;

  @IsOptional()
  firstMobile: string;

  @IsOptional()
  secondFullName: string;

  @IsOptional()
  secondEmail: string;

  @IsOptional()
  secondMobile: string;

  @IsOptional()
  time_type_id: string;

  @ApiProperty({ type: [UpdateRequestForProposalRequest] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateRequestForProposalRequest)
  readonly projects: UpdateRequestForProposalRequest[];
  requestForProposalList: UpdateRequestForProposalRequest[];
}
