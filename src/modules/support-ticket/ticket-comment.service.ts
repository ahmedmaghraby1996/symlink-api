import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BaseService } from 'src/core/base/service/service.base';
import { TicketComment } from 'src/infrastructure/entities/support-ticket/ticket-comment.entity';
import { FileService } from '../file/file.service';
import { UploadFileRequest } from '../file/dto/requests/upload-file.request';
import { SupportTicket } from 'src/infrastructure/entities/support-ticket/support-ticket.entity';
import { TicketAttachment } from 'src/infrastructure/entities/support-ticket/ticket-attachment.entity';
import { AddTicketCommentRequest } from './dto/request/add-ticket-comment.request';
import { SupportTicketGateway } from 'src/integration/gateways/support-ticket.gateway';
import { Role } from 'src/infrastructure/data/enums/role.enum';
import { PaginatedRequest } from 'src/core/base/requests/paginated.request';


@Injectable()
export class TicketCommentService extends BaseService<TicketComment> {
    constructor(
        @InjectRepository(TicketComment) private readonly ticketCommentRepository: Repository<TicketComment>,
        @InjectRepository(TicketAttachment) private readonly ticketAttachmentRepository: Repository<TicketAttachment>,
        @InjectRepository(SupportTicket) private readonly supportTicketRepository: Repository<SupportTicket>,
        @Inject(REQUEST) private readonly request: Request,
        @Inject(FileService) private _fileService: FileService,
        private readonly supportTicketGateway: SupportTicketGateway,
    ) {
        super(ticketCommentRepository);
    }

    async addComment(ticketId: string, { file, comment_text }: AddTicketCommentRequest): Promise<TicketComment> {
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

        const ticket = await this.supportTicketRepository.findOne({ where: { id: ticketId } })
        if (!ticket) throw new BadRequestException('Ticket not found');

        if (!this.currentUser.roles.includes(Role.ADMIN) && ticket.user_id !== this.currentUser.id)
            throw new UnauthorizedException('You are not allowed to add comment to this ticket')

        const savedComment = await this.ticketCommentRepository.create({
            comment_text,
            user: this.currentUser,
            ticket,
            attachment: attachedFile
        });

        this.supportTicketGateway.handleSendMessage({ supportTicket: ticket, ticketComment: savedComment, action: 'add_comment' });
        return await this.ticketCommentRepository.save(savedComment);
    }

    async getCommentsByChunk(ticketId: string, query: PaginatedRequest) {
        query.filters ??= [];
        query.includes ??= [];
        query.sortBy ??= [];

        const supportTicket = await this.supportTicketRepository.findOne({ where: { id: ticketId } })
        if (!supportTicket)
            throw new BadRequestException('Ticket not found');

        if (!this.currentUser.roles.includes(Role.ADMIN) && supportTicket.user_id !== this.currentUser.id) {
            throw new UnauthorizedException('You are not allowed to view this ticket');
        }

        query.filters.push(`ticket_id=${ticketId}`);
        query.includes.push('user');
        query.includes.push('attachment');
        query.sortBy.push('created_at=DESC');

        const count = await this.ticketCommentRepository.count({ where: { ticket_id: ticketId } });
        const comments = await this.findAll(query);
        return {
            comments,
            count
        }
    }

    get currentUser() {
        return this.request.user;
    }
}