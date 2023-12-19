import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket } from 'src/infrastructure/entities/support-ticket/support-ticket.entity';

@Injectable()
export class SupportTicketService {
    constructor(
        @InjectRepository(SupportTicket) private readonly supportTicketRepository: Repository<SupportTicket>,
    ) { }
}