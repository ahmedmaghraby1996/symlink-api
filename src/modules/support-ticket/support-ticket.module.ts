import { Module } from '@nestjs/common';
import { SupportTicketService } from './support-ticket.service';
import { SupportTicketController } from './support-ticket.controller';
import { FileService } from '../file/file.service';

@Module({
    controllers: [SupportTicketController],
    providers: [SupportTicketService, FileService],
})
export class SupportTicketModule {
}