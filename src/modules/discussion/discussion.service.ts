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
import { MultiRFP } from 'src/infrastructure/entities/multi-rfp/multi-rfp.entity';
import { FileService } from '../file/file.service';
import { UploadFileRequest } from '../file/dto/requests/upload-file.request';
import { DiscussionAttachment } from 'src/infrastructure/entities/discussions/discussion-attachment.entity';
import { plainToClass, plainToInstance } from 'class-transformer';
import { MessageResponse } from './dto/response/message.response';

@Injectable()
export class DiscussionService {
    constructor(
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
        @InjectRepository(Reply) private readonly replyRepository: Repository<Reply>,
        @InjectRepository(DiscussionAttachment) private readonly discussionAttachmentRepository: Repository<DiscussionAttachment>,
        @Inject(REQUEST) private readonly request: Request,
        private readonly multiRfpService: MultiRfpService,
        private readonly discussionGateway: DiscussionGateway,
        @Inject(FileService) private _fileService: FileService,
    ) { }

    async createMessage(multi_rfp_id: string,
        { message_id }: OptionalMessageQueryDTO,
        { body_text, is_anynmous, file }: CreateDiscussionObjectDTO
    ) {
        const user = this.getCurrentUser();
        const multiRFP = await this.findMultiRFPOrFail(multi_rfp_id);
        let attachedFile = null;
        if (file) {
            const uploadFileRequest = new UploadFileRequest();
            uploadFileRequest.file = file;
            const tempImage = await this._fileService.upload(
                uploadFileRequest,
                `discussion`,
            );

            const createAttachedFile = await this.discussionAttachmentRepository.create({
                file_url: tempImage,
                file_name: file.originalname,
                file_type: file.mimetype,
            })
            attachedFile = await this.discussionAttachmentRepository.save(createAttachedFile);
        }

        if (message_id) {
            const existingEntity = await this.findEntityByIdOrFail(message_id);
            const newReply = await this.createAndSaveReply(
                { body_text, is_anynmous, attachment: attachedFile },
                user,
                existingEntity
            );
            await this.notifyAction(multiRFP, newReply);
            await this.updateRepliesCount(existingEntity)
            return newReply;
        } else {
            const newMessage = await this.createAndSaveNewMessage({ body_text, is_anynmous, attachment: attachedFile }, user, multiRFP);
            await this.notifyAction(multiRFP, newMessage);
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

    private async createAndSaveNewMessage(message: { body_text: string, is_anynmous: boolean, attachment: DiscussionAttachment }, user: any, multiRFP: any) {
        const newMessage = await this.messageRepository.create({
            body_text: message.body_text,
            attachment: message.attachment,
            user: user,
            multi_RFP: multiRFP,
            is_anynmous: message.is_anynmous
        });

        const savedMessage = await this.messageRepository.save(newMessage);

        const responseMessage = plainToInstance(MessageResponse, savedMessage, {
            excludeExtraneousValues: true,
        });

        return responseMessage;
    }

    private async createAndSaveReply(reply: { body_text: string, is_anynmous: boolean, attachment: DiscussionAttachment }, user: User, parentEntity: Message | Reply): Promise<MessageResponse> {
        const newReply = parentEntity instanceof Message
            ? await this.replyRepository.create({ body_text: reply.body_text, is_anynmous: reply.is_anynmous, user, message: parentEntity, attachment: reply.attachment })
            : await this.replyRepository.create({ body_text: reply.body_text, is_anynmous: reply.is_anynmous, user, parent_reply: parentEntity, attachment: reply.attachment });

        const savedReply = await this.replyRepository.save(newReply);

        const responseReply = plainToInstance(MessageResponse, savedReply, {
            excludeExtraneousValues: true,
        });

        return responseReply;
    }

    private async fetchMessagesByChunk(multi_rfp_id: string, offset: number, limit: number) {
        const [messages, total] = await this.messageRepository.findAndCount({
            where: { multi_rfp_id: multi_rfp_id },
            relations: ['user', 'attachment'],
            order: { created_at: 'DESC' },
            skip: offset * limit,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);
        const currentPage = offset;

        for (let message of messages) {
            if (message.is_anynmous && message.user_id !== this.getCurrentUser().id) {
                delete message.user;
                delete message.user_id;
            }
        }

        return {
            messages,
            totalPages,
            currentPage,
        };
    }

    private async fetchRepliesByChunk(message_id: string, offset: number, limit: number) {
        const [replies, total] = await this.replyRepository.createQueryBuilder('reply')
            .leftJoinAndSelect('reply.user', 'user')
            .leftJoinAndSelect('reply.attachment', 'attachment')
            .where('reply.message_id = :message_id OR reply.parent_reply_id = :message_id', { message_id })
            .orderBy('reply.created_at', 'DESC')
            .skip(offset * limit)
            .take(limit)
            .getManyAndCount();

        for (let reply of replies) {
            if (reply.is_anynmous && reply.user_id !== this.getCurrentUser().id) {
                delete reply.user;
                delete reply.user_id;
            }
        }

        const totalPages = Math.ceil(total / limit);
        const currentPage = offset;

        return {
            replies,
            totalPages,
            currentPage,
        };
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

    private async notifyAction(multi_RFP: MultiRFP, entity: MessageResponse) {
        const entity_type = entity.message_id || entity.parent_reply_id ? 'Reply' : 'Message';
        await this.discussionGateway.handleSendMessage({
            multi_RFP,
            action: 'CREATED',
            entity_type,
            entity
        });
    }
}