import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { MultiRFP } from 'src/infrastructure/entities/multi-rfp/multi-rfp.entity';
import { RequestForProposal } from 'src/infrastructure/entities/request-for-proposal/request-for-proposal.entity';
import { CreateRequestForProposalRequest } from 'src/modules/request-for-proposal/dto/create-request-for-proposal.request';

export class CreateMultiRFPRequest {
  @ApiProperty({ type: [CreateRequestForProposalRequest] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRequestForProposalRequest)
  readonly cats: CreateRequestForProposalRequest[];
  requestForProposalList: CreateRequestForProposalRequest[];
}
