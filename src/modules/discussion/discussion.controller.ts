import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { CreateDiscussionObjectDTO } from './dto/create-discussion-entity.dto';
import { ApiBearerAuth, ApiConsumes, ApiHeader, ApiTags } from '@nestjs/swagger';
import { DiscussionService } from './discussion.service';
import { OptionalMessageQueryDTO } from './dto/optional-message-query.dto';
import { LockDiscussionGuard } from './guards/lock-discussion.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadValidator } from 'src/core/validators/upload.validator';
import { ActionResponse } from 'src/core/base/responses/action.response';
import { MessageResponse } from './dto/response/message.response';
import { plainToClass, plainToInstance } from 'class-transformer';
import { MessagesListResponse } from './dto/response/messages-list.response';
import { Roles } from '../authentication/guards/roles.decorator';
import { Role } from 'src/infrastructure/data/enums/role.enum';

@ApiBearerAuth()
@ApiHeader({
    name: 'Accept-Language',
    required: false,
    description: 'Language header: en, ar',
})
@ApiTags('Discussion')
@UseGuards(JwtAuthGuard, RolesGuard, LockDiscussionGuard)
@Controller('discussion')
export class DiscussionController {
    constructor(
        private readonly discussionService: DiscussionService,
    ) { }

    @Roles(Role.CLIENT, Role.PROVIDER)
    @Post(':multi_RFP_id/messages')
    @UseInterceptors(ClassSerializerInterceptor, FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    async createMessage(
        @Param("multi_RFP_id") multi_RFP_id: string,
        @Query() query: OptionalMessageQueryDTO,
        @Body() message: CreateDiscussionObjectDTO,
        @UploadedFile(new UploadValidator().build()) file: Express.Multer.File,
    ) {
        message.file = file;
        const createdMessage = await this.discussionService.createMessage(multi_RFP_id, query, message)
        const result = plainToInstance(MessageResponse, createdMessage, {
            excludeExtraneousValues: true,
        });
        return new ActionResponse<MessageResponse>(result);
    }

    @Get(':multi_RFP_id/messages/:offset/:limit')
    async getMessagesByChunk(
        @Param("multi_RFP_id") multi_RFP_id: string,
        @Query() query: OptionalMessageQueryDTO,
        @Param("offset") offset: number,
        @Param("limit") limit: number
    ) {
        const fetchedMessages = await this.discussionService.getItemsByChunk(multi_RFP_id, query, offset, limit);
        const result = plainToInstance(MessagesListResponse, fetchedMessages, {
            excludeExtraneousValues: true,
        });

        return new ActionResponse<MessagesListResponse>(result);
    }
}
