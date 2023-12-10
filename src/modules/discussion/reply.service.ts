import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { MultiRfpService } from '../multi-rfp/multi-rfp.service';
import { Reply } from 'src/infrastructure/entities/discussions/reply.entity';
import { CreateReplyDTO } from './dto/create-reply.dto';
import { MessageService } from './message.service';

@Injectable()
export class ReplyService {
    constructor(
        @InjectRepository(Reply)
        private replyRepository: Repository<Reply>,
        @Inject(REQUEST) private readonly request: Request,
        private readonly messsageService: MessageService,
        private readonly multiRfpService: MultiRfpService
    ) { }

    async createReplyMessage(multi_RFP_id: string, message_id: string, reply: CreateReplyDTO) {
        const multiRFP = await this.multiRfpService.findOne(multi_RFP_id);
        if (!multiRFP) {
            throw new NotFoundException('Multi RFP not found');
        }

        const message = await this.messsageService.findMessageWithId(message_id);
        if (!message) {
            throw new NotFoundException('Message not found');
        }

        const user = this.request.user;
        const newReply = this.replyRepository.create({
            reply_content: reply.reply_content,
            user: user,
            message: message,
        });

        return await this.replyRepository.save(newReply);
    }

    async createReplyReplyMessage(multi_RFP_id: string, reply_id: string, reply: CreateReplyDTO) {
        const multiRFP = await this.multiRfpService.findOne(multi_RFP_id);
        if (!multiRFP) {
            throw new NotFoundException('Multi RFP not found');
        }

        const parentReply = await this.findReplyWithId(reply_id);
        if (!parentReply) {
            throw new NotFoundException('Reply not found');
        }

        const user = this.request.user;
        const newReply = this.replyRepository.create({
            reply_content: reply.reply_content,
            user: user,
            parent_reply: parentReply,
        });

        return await this.replyRepository.save(newReply);
    }

    async getRepliesByChunk(messageId: string, offset: number, limit: number) {
        const message = await this.messsageService.findMessageWithId(messageId);
        if (!message) {
            throw new NotFoundException('Message not found');
        }

        return await this.replyRepository.find({
            where: { message_id: messageId },
            order: { created_at: 'DESC' }, 
            take: limit,
            skip: offset,
            relations: ['replies'],
        });
    }

    async findReplyWithId(reply_id: string) {
        return await this.replyRepository.findOne({ where: { id: reply_id } });
    }
}