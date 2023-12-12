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
        return new ActionResponse(await this.discussionService.createMessage(multi_RFP_id, query, message));
    }

    @Get(':multi_RFP_id/messages/:offset/:limit')
    async getMessagesByChunk(
        @Param("multi_RFP_id") multi_RFP_id: string,
        @Query() query: OptionalMessageQueryDTO,
        @Param("offset") offset: number,
        @Param("limit") limit: number
    ) {
        return await this.discussionService.getItemsByChunk(multi_RFP_id, query, offset, limit);
    }
}
