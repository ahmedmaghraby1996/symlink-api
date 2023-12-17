import { Module } from '@nestjs/common';
import { MultiRfpController } from './multi-rfp.controller';
import { MultiRfpService } from './multi-rfp.service';
import { RequestForProposalModule } from '../request-for-proposal/request-for-proposal.module';
import { RfpOwnerGuard } from './guards/rfp_owner.guard';
import { RequestForProposalService } from '../request-for-proposal/request-for-proposal.service';

@Module({
  controllers: [MultiRfpController],
  providers: [MultiRfpService, RfpOwnerGuard, RequestForProposalService],
  exports: [MultiRfpService, RfpOwnerGuard],
})
export class MultiRfpModule { }
