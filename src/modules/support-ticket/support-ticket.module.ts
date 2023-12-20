import { Module } from '@nestjs/common';
import { SupportTicketService } from './support-ticket.service';
import { SupportTicketController } from './support-ticket.controller';
import { FileService } from '../file/file.service';
import { TicketCommentService } from './ticket-comment.service';

@Module({
    controllers: [SupportTicketController],
    providers: [SupportTicketService, TicketCommentService, FileService],
})
export class SupportTicketModule {
}