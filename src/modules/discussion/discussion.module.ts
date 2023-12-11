import { Module } from '@nestjs/common';
import { DiscussionController } from './discussion.controller';
import { MultiRfpModule } from '../multi-rfp/multi-rfp.module';
import { GatewaysModule } from 'src/integration/gateways/gateways.module';
import { DiscussionService } from './discussion.service';
import { OffersModule } from '../offers/offers.module';
import { LockDiscussionGuard } from './guards/lock-discussion.guard';

@Module({
    controllers: [DiscussionController],
    providers: [DiscussionService, LockDiscussionGuard],
    imports: [MultiRfpModule, GatewaysModule, OffersModule]
})
export class DiscussionModule { }
