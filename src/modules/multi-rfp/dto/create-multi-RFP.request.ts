import { MultiRFP } from 'src/infrastructure/entities/multi-rfp/multi-rfp.entity';
import { RequestForProposal } from 'src/infrastructure/entities/request-for-proposal/request-for-proposal.entity';
import { CreateRequestForProposalRequest } from 'src/modules/request-for-proposal/dto/create-request-for-proposal.request';

export class CreateMultiRFPRequest {
  requestForProposalList: CreateRequestForProposalRequest[];
}
