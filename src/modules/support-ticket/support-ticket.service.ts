import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportTicket } from 'src/infrastructure/entities/support-ticket/support-ticket.entity';
import { BaseService } from 'src/core/base/service/service.base';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateTicketRequest } from './dto/request/create-ticket.request';
import { UploadFileRequest } from '../file/dto/requests/upload-file.request';
import { FileService } from '../file/file.service';
import { TicketAttachment } from 'src/infrastructure/entities/support-ticket/ticket-attachment.entity';
import { PaginatedRequest } from 'src/core/base/requests/paginated.request';
import { SupportTicketStatus } from 'src/infrastructure/data/enums/support-ticket-status.enum';
import { Role } from 'src/infrastructure/data/enums/role.enum';


@Injectable()
export class SupportTicketService extends BaseService<SupportTicket> {
    constructor(
        @InjectRepository(SupportTicket) private readonly supportTicketRepository: Repository<SupportTicket>,
        @InjectRepository(TicketAttachment) private readonly ticketAttachmentRepository: Repository<TicketAttachment>,
        @Inject(REQUEST) private readonly request: Request,
        @Inject(FileService) private _fileService: FileService,

    ) {
        super(supportTicketRepository);
    }

    async createTicket({ subject, description, file }: CreateTicketRequest) {

        let attachedFile = null;
        if (file) {
            const uploadFileRequest = new UploadFileRequest();
            uploadFileRequest.file = file;
            const tempImage = await this._fileService.upload(
                uploadFileRequest,
                `support-tickets`,
            );

            const createAttachedFile = this.ticketAttachmentRepository.create({
                file_url: tempImage,
                file_name: file.originalname,
                file_type: file.mimetype,
            })
            attachedFile = await this.ticketAttachmentRepository.save(createAttachedFile);
        }

        const savedTicket = await this.supportTicketRepository.create({
            subject,
            description,
            user: this.currentUser,
            attachment: attachedFile
        });

        return await this.supportTicketRepository.save(savedTicket);
    }

    async getTickets(options?: PaginatedRequest) {
        if (!options.filters) {
            options.filters = [];
        } else if (typeof options.filters === 'string') {
            options.filters = [options.filters];
        }

        const isAdmin = this.currentUser.roles.includes(Role.ADMIN)
        if (!isAdmin) {
            options.filters.push(`user_id=${this.currentUser.id}`);
        }

        const tickets = await this.findAll(options);

        let count: number;
        if (isAdmin) {
            count = await this.supportTicketRepository.count();
        } else {
            count = await this.supportTicketRepository.count({ where: { user_id: this.currentUser.id } });
        }

        return { tickets, count };
    }

    async chnageTicketStatus(ticketId: string, status: SupportTicketStatus) {
        const ticket = await this.supportTicketRepository.findOne({ where: { id: ticketId } });
        if (!ticket) throw new BadRequestException('Ticket not found');

        ticket.status = status;
        return await this.supportTicketRepository.save(ticket);
    }

    async reActiveCounter(ticketId: string) {
        const ticket = await this.supportTicketRepository.findOne({ where: { id: ticketId } });
        if (!ticket) throw new BadRequestException('Ticket not found');

        ticket.is_counter_active = true;
        ticket.new_messages_count = 0;
        return await this.supportTicketRepository.save(ticket);
    }

    get currentUser() {
        return this.request.user;
    }
}