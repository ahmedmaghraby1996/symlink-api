import { Module } from '@nestjs/common';
import { RequestForProposalController } from './request-for-proposal.controller';
import { RequestForProposalService } from './request-for-proposal.service';

@Module({
  controllers: [RequestForProposalController],
  providers: [RequestForProposalService],
  imports: [],
})
export class RequestForProposalModule {}
