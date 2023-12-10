import { Module } from '@nestjs/common';
import { DiscussionController } from './discussion.controller';
import { MultiRfpModule } from '../multi-rfp/multi-rfp.module';
import { GatewaysModule } from 'src/integration/gateways/gateways.module';
import { MessageService } from './message.service';
import { ReplyService } from './reply.service';

@Module({
    controllers: [DiscussionController],
    providers: [MessageService, ReplyService],
    imports: [MultiRfpModule, GatewaysModule]
})
export class DiscussionModule { }
