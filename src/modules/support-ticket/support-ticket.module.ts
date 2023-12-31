import { Module } from '@nestjs/common';
import { SupportTicketService } from './support-ticket.service';
import { SupportTicketController } from './support-ticket.controller';
import { FileService } from '../file/file.service';
import { TicketCommentService } from './ticket-comment.service';
import { GatewaysModule } from 'src/integration/gateways/gateways.module';

@Module({
    controllers: [SupportTicketController],
    providers: [SupportTicketService, TicketCommentService, FileService],
    imports: [GatewaysModule]
})
export class SupportTicketModule {
}