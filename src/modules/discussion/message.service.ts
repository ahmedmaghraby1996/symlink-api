import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/infrastructure/entities/discussions/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDTO } from './dto/create-message.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
// import { DiscussionService } from './discussion.service';
import { DiscussionGateway } from 'src/integration/gateways/discussion.gateway';
import { MultiRfpService } from '../multi-rfp/multi-rfp.service';
import { Reply } from 'src/infrastructure/entities/discussions/reply.entity';
import { CreateReplyDTO } from './dto/create-reply.dto';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @Inject(REQUEST) private readonly request: Request,
        private readonly multiRfpService: MultiRfpService
    ) { }

    async createMessage(multi_rfp_id: string, message: CreateMessageDTO) {
        const multiRFP = await this.multiRfpService.findOne(multi_rfp_id);
        if (!multiRFP) {
            throw new NotFoundException('Multi RFP not found');
        }

        const user = this.request.user;
        const newMessage = this.messageRepository.create({
            message_content: message.message_content,
            user: user,
            multi_RFP: multiRFP,
        });
        return await this.messageRepository.save(newMessage);
    }

    async getMessagesByChunk(multi_rfp_id: string, offset: number, limit: number) {
        const multiRFP = await this.multiRfpService.findOne(multi_rfp_id);
        if (!multiRFP) {
            throw new NotFoundException('Multi RFP not found');
        }

        return await this.messageRepository.find({
            where: { multi_rfp_id: multi_rfp_id },
            relations: ['user'],
            order: { created_at: 'DESC' },
            skip: offset,
            take: limit,
        });
    }

    async findMessageWithId(message_id: string) {
        return await this.messageRepository.findOne({ where: { id: message_id } });
    }

    async updateMessageRepliesCount(messageId: string, increment: number = 1) {
        await this.messageRepository
            .createQueryBuilder()
            .update(Message)
            .set({ replies_count: () => `replies_count + ${increment}` })
            .where('id = :messageId', { messageId })
            .execute();
    }
}