import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { CreateMessageDTO } from './dto/create-message.dto';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { CreateReplyDTO } from './dto/create-reply.dto';
import { ReplyService } from './reply.service';

@ApiBearerAuth()
@ApiHeader({
    name: 'Accept-Language',
    required: false,
    description: 'Language header: en, ar',
})
@ApiTags('Discussion')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('discussion')
export class DiscussionController {
    constructor(
        private readonly messageService: MessageService,
        private readonly replyService: ReplyService
    ) { }

    @Post(':multi_RFP_id/messages')
    async createMessage(@Param("multi_RFP_id") multi_RFP_id: string, @Body() message: CreateMessageDTO) {
        return await this.messageService.createMessage(multi_RFP_id, message);
    }

    @Post(':multi_RFP_id/messages/:message_id')
    async createReplyMessage(
        @Param("multi_RFP_id") multi_RFP_id: string,
        @Param("message_id") message_id: string,
        @Body() reply: CreateReplyDTO
    ) {
        return await this.replyService.createReplyMessage(multi_RFP_id, message_id, reply);
    }

    @Get(':multi_RFP_id/messages/:offset/:limit')
    async getMessagesByChunk(
        @Param("multi_RFP_id") multi_RFP_id: string,
        @Param("offset") offset: number,
        @Param("limit") limit: number
    ) {
        return await this.messageService.getMessagesByChunk(multi_RFP_id, offset, limit);
    }

    @Post(':multi_RFP_id/messages/:reply_id/replies')
    async createReplyReplyMessage(
        @Param("multi_RFP_id") multi_RFP_id: string,
        @Param("reply_id") reply_id: string,
        @Body() message: CreateReplyDTO
    ) {
        return await this.replyService.createReplyReplyMessage(multi_RFP_id, reply_id, message);
    }

    @Get(':multi_RFP_id/messages/:identifier_id/replies/:offset/:limit')
    async getRepliesByChunk(
        @Param("identifier_id") identifierId: string,
        @Param("offset") offset: number,
        @Param("limit") limit: number
    ) {
        return await this.replyService.getRepliesByChunk(identifierId, offset, limit);
    }
}
