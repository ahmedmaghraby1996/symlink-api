import { Module } from '@nestjs/common';
import { RequestForProposalController } from './request-for-proposal.controller';
import { RequestForProposalService } from './request-for-proposal.service';
import { MetaDataModule } from '../meta-data/meta-data.module';

@Module({
  controllers: [RequestForProposalController],
  providers: [RequestForProposalService],
  imports: [MetaDataModule],
})
export class RequestForProposalModule {}
