import { Module } from '@nestjs/common';
import { MultiRfpController } from './multi-rfp.controller';
import { MultiRfpService } from './multi-rfp.service';
import { RequestForProposalModule } from '../request-for-proposal/request-for-proposal.module';

@Module({
  controllers: [MultiRfpController],
  providers: [MultiRfpService],
  exports: [MultiRfpService],
})
export class MultiRfpModule {}
