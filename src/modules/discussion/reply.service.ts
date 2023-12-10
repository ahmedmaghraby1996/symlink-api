import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
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

        const savedReply = await this.replyRepository.save(newReply);
        await this.messsageService.updateMessageRepliesCount(message_id);
        return savedReply;
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

        const saveReply = await this.replyRepository.save(newReply);
        await this.updateNestedRepliesCount(reply_id);
        return saveReply;
    }

    async getRepliesByChunk(identifierId: string, offset: number, limit: number) {
        return this.replyRepository.createQueryBuilder('reply')
            .where('reply.message_id = :identifierId OR reply.parent_reply_id = :identifierId', { identifierId })
            .orderBy('reply.created_at', 'DESC')
            .take(limit)
            .skip(offset)
            .getMany();
    }

    async findReplyWithId(reply_id: string) {
        return await this.replyRepository.findOne({ where: { id: reply_id } });
    }

    async updateNestedRepliesCount(replyId: string, increment: number = 1) {
        await this.replyRepository
            .createQueryBuilder()
            .update(Reply)
            .set({ replies_count: () => `replies_count + ${increment}` })
            .where('id = :replyId', { replyId })
            .execute();
    }
}