import { Module } from '@nestjs/common';
import { DiscussionController } from './discussion.controller';
import { MultiRfpModule } from '../multi-rfp/multi-rfp.module';
import { GatewaysModule } from 'src/integration/gateways/gateways.module';
import { DiscussionService } from './discussion.service';

@Module({
    controllers: [DiscussionController],
    providers: [DiscussionService],
    imports: [MultiRfpModule, GatewaysModule]
})
export class DiscussionModule { }
