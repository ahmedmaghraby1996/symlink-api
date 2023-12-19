import { Inject, Injectable } from '@nestjs/common';
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
        const user = this.getCurrentUser();
        let attachedFile = null;
        if (file) {
            const uploadFileRequest = new UploadFileRequest();
            uploadFileRequest.file = file;
            const tempImage = await this._fileService.upload(
                uploadFileRequest,
                `support-tickets/${this.request.user.id}`,
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
            user,
            attachment: attachedFile
        });

        return await this.supportTicketRepository.save(savedTicket);
    }

    getCurrentUser() {
        return this.request.user;
    }
}