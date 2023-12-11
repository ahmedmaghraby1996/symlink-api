import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/infrastructure/entities/discussions/message.entity';
import { Repository } from 'typeorm';
import { CreateDiscussionObjectDTO } from './dto/create-discussion-entity.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
// import { DiscussionService } from './discussion.service';
import { DiscussionGateway } from 'src/integration/gateways/discussion.gateway';
import { MultiRfpService } from '../multi-rfp/multi-rfp.service';
import { Reply } from 'src/infrastructure/entities/discussions/reply.entity';
import { OptionalMessageQueryDTO } from './dto/optional-message-query.dto';
import { User } from 'src/infrastructure/entities/user/user.entity';

@Injectable()
export class DiscussionService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
        @Inject(REQUEST) private readonly request: Request,
        @InjectRepository(Reply)
        private replyRepository: Repository<Reply>,
        private readonly multiRfpService: MultiRfpService,
        private readonly discussionGateway: DiscussionGateway,
    ) { }

    async createMessage(multi_rfp_id: string, { message_id }: OptionalMessageQueryDTO, message: CreateDiscussionObjectDTO) {
        const user = this.getCurrentUser();
        const multiRFP = await this.findMultiRFPOrFail(multi_rfp_id);
        if (message_id) {
            const existingEntity = await this.findEntityByIdOrFail(message_id);
            const newReply = await this.createAndSaveReply(message, user, existingEntity);
            this.notifyAction(multi_rfp_id, newReply);
            this.updateRepliesCount(existingEntity)
            return newReply;
        } else {
            const newMessage = await this.createAndSaveNewMessage(message, user, multiRFP);
            this.notifyAction(multi_rfp_id, newMessage);
            return newMessage;
        }
    }

    async getItemsByChunk(multi_rfp_id: string, { message_id }: OptionalMessageQueryDTO, offset: number, limit: number) {
        if (message_id) {
            return await this.fetchRepliesByChunk(message_id, offset, limit);
        } else {
            return await this.fetchMessagesByChunk(multi_rfp_id, offset, limit);
        }
    }

    getCurrentUser(): User {
        return this.request.user;
    }

    private async createAndSaveNewMessage(message: CreateDiscussionObjectDTO, user: any, multiRFP: any) {
        const newMessage = this.messageRepository.create({
            body_text: message.body_text,
            user: user,
            multi_RFP: multiRFP,
        });
        return await this.messageRepository.save(newMessage);
    }

    private async createAndSaveReply(reply: CreateDiscussionObjectDTO, user: User, parentEntity: Message | Reply): Promise<Reply> {
        const newReply = parentEntity instanceof Message
            ? this.replyRepository.create({ body_text: reply.body_text, user, message: parentEntity })
            : this.replyRepository.create({ body_text: reply.body_text, user, parent_reply: parentEntity });

        return await this.replyRepository.save(newReply);
    }

    private async fetchMessagesByChunk(multi_rfp_id: string, offset: number, limit: number) {
        return await this.messageRepository.find({
            where: { multi_rfp_id: multi_rfp_id },
            relations: ['user'],
            order: { created_at: 'DESC' },
            skip: offset,
            take: limit,
        });
    }

    private async fetchRepliesByChunk(message_id: string, offset: number, limit: number) {
        return this.replyRepository.createQueryBuilder('reply')
            .where('reply.message_id = :message_id OR reply.parent_reply_id = :message_id', { message_id })
            .orderBy('reply.created_at', 'DESC')
            .take(limit)
            .skip(offset)
            .getMany();
    }

    private async findEntityByIdOrFail(entityId: string): Promise<Message | Reply> {
        const message = await this.messageRepository.findOne({ where: { id: entityId } });
        if (message) {
            return message;
        }

        const reply = await this.replyRepository.findOne({ where: { id: entityId } });
        if (reply) {
            return reply;
        }

        throw new NotFoundException('Message not found');
    }

    async findMultiRFPOrFail(multi_rfp_id: string) {
        const multiRFP = await this.multiRfpService.findOne(multi_rfp_id);
        if (!multiRFP) {
            throw new NotFoundException('Multi RFP not found');
        }
        return multiRFP;
    }

    private async updateRepliesCount(entity: Message | Reply) {
        entity.replies_count += 1;
        await entity.save();
    }

    private notifyAction(rfp_id: string, entity: Message | Reply) {
        this.discussionGateway.handleSendMessage({
            rfp_id, action: 'CREATED',
            entity_type: entity instanceof Message ? 'Message' : 'Reply',
            entity
        });
    }
}