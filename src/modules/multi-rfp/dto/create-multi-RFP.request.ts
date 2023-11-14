import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { MultiRFP } from 'src/infrastructure/entities/multi-rfp/multi-rfp.entity';
import { RequestForProposal } from 'src/infrastructure/entities/request-for-proposal/request-for-proposal.entity';
import { CreateRequestForProposalRequest } from 'src/modules/request-for-proposal/dto/create-request-for-proposal.request';

export class CreateMultiRFPRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  project_name: string;

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
