import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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


@Injectable()
export class TicketCommentService extends BaseService<TicketComment> {
    constructor(
        @InjectRepository(TicketComment) private readonly ticketCommentRepository: Repository<TicketComment>,
        @InjectRepository(TicketAttachment) private readonly ticketAttachmentRepository: Repository<TicketAttachment>,
        @InjectRepository(SupportTicket) private readonly supportTicketRepository: Repository<SupportTicket>,
        @Inject(REQUEST) private readonly request: Request,
        @Inject(FileService) private _fileService: FileService,
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
                `support-tickets/${this.currentUser.id}`,
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

        const savedComment = await this.ticketCommentRepository.create({
            comment_text,
            user: this.currentUser,
            ticket,
            attachment: attachedFile
        });

        return await this.ticketCommentRepository.save(savedComment);
    }

    get currentUser() {
        return this.request.user;
    }
}